// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { systemPrompt, userText } = event;
  const { OPENID } = cloud.getWXContext();
  
  // 1. 内容安全检查
  try {
    const checkRes = await cloud.openapi.security.msgSecCheck({
      content: userText,
      version: 2,
      scene: 2,
      openid: OPENID
    });

    if (checkRes.result.suggest !== 'pass') {
      return {
        success: false,
        error: 'CONTENT_UNSAFE',
        message: '内容包含敏感信息，请修改后重试'
      };
    }
  } catch (error) {
    console.error('安全检查失败:', error);
    // 如果是权限问题或接口调用失败，建议记录日志，视情况决定是否放行
    // 这里选择放行，避免因接口故障导致无法使用，但实际发布建议严格拦截
  }

  // 2. 每日次数限制检查
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const usageId = `${OPENID}_${dateStr}`;

  try {
    let usageRecord;
    try {
      const res = await db.collection('user_usage').doc(usageId).get();
      usageRecord = res.data;
    } catch (e) {
      // 记录不存在，初始化
      await db.collection('user_usage').add({
        data: {
          _id: usageId,
          openid: OPENID,
          date: dateStr,
          count: 0
        }
      });
      usageRecord = { count: 0 };
    }

    if (usageRecord.count >= 3) {
      return {
        success: false,
        error: 'LIMIT_EXCEEDED',
        message: '今日构思次数已达上限'
      };
    }

    // 预扣费/次数（在 AI 调用前增加次数，防止刷接口）
    await db.collection('user_usage').doc(usageId).update({
      data: { count: _.inc(1) }
    });

  } catch (error) {
    console.error('次数校验失败:', error);
    return {
      success: false,
      error: 'DATABASE_ERROR',
      message: '系统繁忙，请稍后再试'
    };
  }

  // 3. 调用 AI 服务 (DeepSeek)
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; 
  if (!DEEPSEEK_API_KEY) {
    return {
      success: false,
      error: 'CONFIG_ERROR',
      message: '请在云开发控制台配置 DEEPSEEK_API_KEY 环境变量'
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.deepseek.com/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      data: {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `请将以下文案按照上述风格准则进行改写：\n\n【${userText}】` }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      },
      timeout: 60000 
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return {
        success: true,
        data: response.data.choices[0].message.content
      };
    } else {
      throw new Error('API 返回数据格式异常');
    }
  } catch (error) {
    // 如果 AI 调用失败，可以考虑把扣掉的次数补回来，或者就此记录
    console.error('DeepSeek API Error:', error);
    return {
      success: false,
      error: 'AI_ERROR',
      message: '构思失败，请稍后再试'
    };
  }
};
