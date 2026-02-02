// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  const { systemPrompt, userText } = event;
  
  // 从云函数环境变量中获取 API Key (建议在腾讯云控制台配置)
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; 

  if (!DEEPSEEK_API_KEY) {
    return {
      success: false,
      error: '请在云开发控制台配置 DEEPSEEK_API_KEY 环境变量'
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
      timeout: 60000 // 设置 60s 超时
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
    console.error('DeepSeek API Error:', error);
    let errorMsg = error.message;
    if (error.response && error.response.data) {
      errorMsg = JSON.stringify(error.response.data);
    }
    return {
      success: false,
      error: errorMsg
    };
  }
};
