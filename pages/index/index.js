// index.js
Page({
  data: {
    activeTab: 'rewrite', // rewrite | wizard
    inputText: '',
    selectedStyle: 'wkw',
    result: '',
    loading: false,
    
    // 场景向导相关
    showWizard: false,
    currentScenario: null,
    wizardFormData: {},
    
    styles: [
      { id: 'wkw', name: '王家卫式', icon: '🎬', desc: '文艺、独白、时间' },
      { id: 'apple', name: '苹果文案', icon: '🍎', desc: '极简、高级、有力' },
      { id: 'xiaomi', name: '小米风格', icon: '📱', desc: '发烧、参数、对比' },
      { id: 'zhenhuan', name: '甄嬛传风', icon: '🍵', desc: '古风、拿捏、隐喻' },
      { id: 'luxun', name: '鲁迅风格', icon: '🖋️', desc: '犀利、批判、短句' },
      { id: 'crazy', name: '发疯文学', icon: '🗯️', desc: '咆哮、宣泄、无序' },
      { id: 'nonsense', name: '废话文学', icon: '🙊', desc: '逻辑、重复、显然' },
      { id: 'ceo', name: '霸道总裁', icon: '🕶️', desc: '傲娇、命令、宠溺' },
      { id: 'zhihu', name: '知乎体', icon: '🎓', desc: '专业、理性、谢邀' },
      { id: 'xhs', name: '小红书风', icon: '✨', desc: 'Emoji、活泼、绝绝子' },
      { id: 'internet', name: '互联网黑话', icon: '🔗', desc: '赋能、对齐、底层逻辑' },
      { id: 'cloudmusic', name: '网易云emo', icon: '🌙', desc: '孤独、深夜、治愈' },
      { id: 'shijing', name: '古风诗经', icon: '📜', desc: '风雅、颂唱、意境' },
      { id: 'hero', name: '浪漫英雄', icon: '🛡️', desc: '热血、加冕、浪漫' },
      { id: 'cyber', name: '赛博朋克', icon: '🌆', desc: '未来、颓废、霓虹' },
      { id: 'qy', name: '琼瑶风', icon: '🌸', desc: '深情、感叹、浪漫' }
    ],

    scenarios: [
      { 
        id: 'girlfriend', 
        name: '哄女朋友', 
        icon: '💖', 
        desc: '求生欲拉满',
        suggestedStyles: ['ceo', 'zhenhuan', 'qy', 'wkw'],
        fields: [
          { key: 'reason', label: '生气的原因', placeholder: '如：约会迟到、忘记纪念日...' },
          { key: 'attitude', label: '认错态度', placeholder: '如：诚恳、求饶、幽默自黑...' }
        ]
      },
      { 
        id: 'annual', 
        name: '年会发言', 
        icon: '🎤', 
        desc: '职场高光时刻',
        suggestedStyles: ['apple', 'xiaomi', 'zhihu', 'luxun'],
        fields: [
          { key: 'position', label: '你的职位', placeholder: '如：销售冠军、技术主管...' },
          { key: 'achieve', label: '年度成就', placeholder: '如：业绩翻倍、完成XX项目...' },
          { key: 'thanks', label: '想感谢的人', placeholder: '如：团队伙伴、老板的支持...' }
        ]
      },
      { 
        id: 'moments', 
        name: '发朋友圈', 
        icon: '🌈', 
        desc: '点赞收割机',
        suggestedStyles: ['xhs', 'wkw', 'nonsense', 'crazy'],
        fields: [
          { key: 'content', label: '想发什么', placeholder: '如：在雪地里喝咖啡、过年回家...' },
          { key: 'mood', label: '当前心情', placeholder: '如：治愈、搞怪、佛系...' }
        ]
      },
      { 
        id: 'restaurant', 
        name: '餐厅好评', 
        icon: '🍱', 
        desc: '资深食客风',
        suggestedStyles: ['xhs', 'luxun', 'apple', 'wkw'],
        fields: [
          { key: 'name', label: '餐厅/菜名', placeholder: '如：巷子里的火锅、招牌牛排...' },
          { key: 'feature', label: '核心亮点', placeholder: '如：味道正宗、装修有格调...' }
        ]
      },
      { 
        id: 'praise_peer', 
        name: '夸奖同辈', 
        icon: '🙌', 
        desc: '高情商互吹',
        suggestedStyles: ['crazy', 'zhihu', 'xhs', 'apple'],
        fields: [
          { key: 'who', label: '夸谁', placeholder: '如：好闺米、得力同事...' },
          { key: 'what', label: '夸她什么', placeholder: '如：审美高级、工作效率高...' }
        ]
      },
      { 
        id: 'praise_elder', 
        name: '夸长辈/丈母娘', 
        icon: '👴', 
        desc: '家庭和谐器',
        suggestedStyles: ['zhenhuan', 'luxun', 'zhihu', 'qy'],
        fields: [
          { key: 'who', label: '对方身份', placeholder: '如：丈母娘、家里的长辈...' },
          { key: 'what', label: '想夸的事', placeholder: '如：做饭好吃、带孩子辛苦...' }
        ]
      },
      { 
        id: 'newyear', 
        name: '过年祝福语', 
        icon: '🧧', 
        desc: '最有面儿的祝福',
        suggestedStyles: ['zhenhuan', 'apple', 'wkw', 'xhs'],
        fields: [
          { key: 'to', label: '送给谁', placeholder: '如：敬爱的领导、亲爱的死党、严厉的导师...' },
          { key: 'wish', label: '核心愿望', placeholder: '如：身体健康、升职加薪、脱单暴富...' }
        ]
      }
    ]
  },

  // 标签切换
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ 
      activeTab: tab,
      result: '',
      selectedStyle: 'wkw' // 重置默认风格
    });
    wx.vibrateShort({ type: 'light' });
  },

  // 输入监听
  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 场景字段输入监听
  onWizardInput(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`wizardFormData.${key}`]: value
    });
  },

  // 清空输入
  onClearInput() {
    this.setData({ inputText: '', result: '' });
  },

  // 开启向导
  onOpenWizard(e) {
    const id = e.currentTarget.dataset.id;
    const scenario = this.data.scenarios.find(s => s.id === id);
    this.setData({
      currentScenario: scenario,
      showWizard: true,
      wizardFormData: {},
      selectedStyle: scenario.suggestedStyles[0], // 默认选中第一个建议风格
      result: ''
    });
    wx.vibrateShort({ type: 'medium' });
  },

  // 关闭向导
  onCloseWizard() {
    this.setData({ showWizard: false });
  },

  // 风格选择
  onSelectStyle(e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.selectedStyle !== id) {
      this.setData({ selectedStyle: id });
      wx.vibrateShort({ type: 'light' });
    }
  },

  // 复制结果
  onCopyResult() {
    if (!this.data.result) return;
    wx.setClipboardData({
      data: this.data.result,
      success: () => wx.vibrateShort({ type: 'medium' })
    });
  },

  // 保存结果
  onSaveResult() {
    if (!this.data.result) return;
    wx.vibrateShort({ type: 'medium' });
    wx.showModal({
      title: '确认保存',
      content: '是否将此文案保存至收藏？',
      confirmColor: '#007AFF',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已保存', icon: 'success' });
        }
      }
    });
  },

  // 重新开始
  onReset() {
    wx.vibrateShort({ type: 'light' });
    this.setData({
      inputText: '',
      result: '',
      selectedStyle: 'wkw',
      showWizard: false,
      wizardFormData: {}
    });
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },

  // 不满意换一批
  onRegenerate() {
    wx.vibrateShort({ type: 'medium' });
    this.onGenerate();
  },

  // 生成逻辑
  async onGenerate() {
    const { activeTab, inputText, wizardFormData, currentScenario, selectedStyle, loading } = this.data;
    
    if (loading) return;

    // 校验输入
    if (activeTab === 'rewrite' && !inputText.trim()) {
      wx.showToast({ title: '请输入文案', icon: 'none' });
      return;
    }
    
    if (activeTab === 'wizard') {
      const missingField = currentScenario.fields.find(f => !wizardFormData[f.key]);
      if (missingField) {
        wx.showToast({ title: `请填写${missingField.label}`, icon: 'none' });
        return;
      }
    }

    this.setData({ loading: true, result: '' });
    wx.vibrateShort({ type: 'medium' });

    try {
      let finalInput = '';
      if (activeTab === 'rewrite') {
        finalInput = inputText;
      } else {
        // 将场景表单数据拼接为一段描述性文字
        finalInput = currentScenario.fields.map(f => `${f.label}: ${wizardFormData[f.key]}`).join('；');
      }

      const res = await this.callAI(finalInput, selectedStyle, activeTab === 'wizard' ? currentScenario.id : null);
      this.setData({ 
        result: res, 
        loading: false,
        showWizard: false // 生成成功后关闭弹窗展示结果
      });
      wx.vibrateShort({ type: 'success' });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '生成失败，请重试', icon: 'none' });
    }
  },

  async callAI(text, styleId, scenarioId) {
    const stylePrompts = {
      wkw: `# Role
你是一位深谙“王家卫电影美学”的金像奖编剧。你擅长捕捉都市人的疏离感、时间的流逝以及人与人之间微妙的距离。

# Goal
将用户提供的【普通文案】改写成【王家卫风格的独白】。

# Style Guidelines
1. **精确的数据化**：极度迷恋数字。用精确的数字（0.01公分、57个小时）来量化模糊的情感。
2. **时间的节点**：强调具体的时间点，以及事物的“保质期”。
3. **视角的抽离**：使用第三人称视角的自我审视，常用词汇：拒绝、距离、习惯、梦游、密码。
4. **非线性逻辑**：前一句描述客观环境，后一句突然转折到主观情绪。
5. **独白感**：语气要像是在对着树洞自言自语，带着一种“清醒的醉意”。

# Examples
输入：我想你了。
输出：在4月1号下午三点之前的那个瞬间，我和手机的距离只有5厘米。我盯着屏幕看了三分钟，我想打给你，但如果不讲清楚，这份思念会不会像过期的凤梨罐头一样，明天就变质了？`,

      apple: `# Role
你是一位苹果公司（Apple Inc.）的高级文案创意总监，深谙“Less is more”的文案哲学。

# Goal
将【普通文案】改写为【苹果官网风格】的文案。

# Style Guidelines
1. **极简主义**：去掉所有修饰词，只保留核心信息。
2. **节奏感**：短句，大量的句号。
3. **高级感**：使用具有分量感的动词或形容词（如：重塑、巅峰、出类拔萃）。
4. **双关与对比**：擅长用对比来强调强大（如：大，大有不同）。
5. **自信的克制**：不堆砌辞藻，用最简单的字表达最强的自信。

# Examples
输入：这个手机运行速度非常快。
输出：快。快得出奇。`,

      xiaomi: `# Role
你是一位小米公司早期的产品文案策划，信奉“为发烧而生”。

# Goal
将【普通文案】改写为【小米发烧友风格】的文案。

# Style Guidelines
1. **参数驱动**：喜欢堆砌性能参数，强调黑科技。
2. **对比逻辑**：喜欢与同行（友商）对比，突出性价比。
3. **发烧词汇**：常用词汇：性能怪兽、跑分、极致、探索、厚道。
4. **情感共鸣**：强调与用户的伙伴关系，如“永远相信美好的事情即将发生”。

# Examples
输入：这个充电宝电量很大。
输出：10000mAh 性能怪兽。横扫友商的极致性价比，让每个人都能享受科技的乐趣。`,

      zhenhuan: `# Role
你是一位精通《甄嬛传》台词艺术的清宫高级女官，说话滴水不漏。

# Goal
将【普通文案】改写为【甄嬛传宫廷风格】。

# Style Guidelines
1. **含蓄委婉**：绝不直说，喜欢用比喻和类比（如：开得极好的花、秋后的蚂蚱）。
2. **身份感**：自称“本宫”、“臣妾”或“奴才”，尊称“小主”、“皇上”。
3. **拿捏姿态**：语气中带着三分讥讽、三分隐忍、四分端庄。
4. **常用语**：真真、极好的、断断不可、想来是、倒也不负。

# Examples
输入：你别乱说话。
输出：小主这嘴若是管不住，倒不如去碎玉轩后院瞧瞧那开得正艳的枫叶，想来那颜色定是极好的，也能教小主懂得什么是红。`,

      luxun: `# Role
你是一位生活在现代的“鲁迅”式文学批评家，笔锋如投枪匕首。

# Goal
将【普通文案】改写为【鲁迅风格】的文字。

# Style Guidelines
1. **冷峻的幽默**：反讽、辛辣，看透世俗。
2. **短句与张力**：句子短促，充满力量感。
3. **象征意义**：喜欢用具象物体象征抽象问题。
4. **常用句式**：我大概是...、从来如此，便对么？、大约、罢。

# Examples
输入：我今天不想上班。
输出：我向来是不想上这劳什子班的。横竖都睡不着，坐起来点了一支烟，这悲伤没由来的，大抵是这生活本就如此，从来如此。`,

      crazy: `# Role
你是一位深谙“发疯文学”精髓的互联网情绪宣泄大师。

# Goal
将【普通文案】改写为【发疯文学风格】。

# Style Guidelines
1. **情绪崩溃**：大量的感叹号、问号，表达极度的不可置信。
2. **逻辑混乱**：前言不搭后语，通过无序的重复来表达急切。
3. **反向施压**：通过自己的“崩溃”让对方感到愧疚或压力。
4. **常用词汇**：凭什么、救命、家人们、谁懂啊、破防。

# Examples
输入：你为什么不回我消息？
输出：你为什么不回我？你知不知道我等了多久？你不知道！你只在乎你自己！救命啊！家人们谁懂啊！我真的破防了！！！`,

      nonsense: `# Role
你是一位废话文学的集大成者，擅长说正确的废话。

# Goal
将【普通文案】改写为【废话文学风格】。

# Style Guidelines
1. **套路化重复**：用不同的表达方式重复同一个意思。
2. **逻辑闭环**：结论就是前提（如：听君一席话，如听一席话）。
3. **显然性**：陈述一个大家都知道的客观事实。
4. **常用词汇**：如果不意外的话、据我所知、根据目前的状况看。

# Examples
输入：我们要努力工作。
输出：只要我们努力工作，我们就一定在工作。如果你不努力的话，你可能就没那么努力。`,

      ceo: `# Role
你是一位典型的“霸道总裁”网文男主角，冷酷且深情。

# Goal
将【普通文案】改写为【霸道总裁风格】。

# Style Guidelines
1. **命令式口吻**：喜欢说“不要...”、“我要...”。
2. **占有欲**：强调对方是自己的（如：我的女人、逃不出我的手心）。
3. **傲娇深情**：表面冷酷，实则暗暗关注。
4. **常用词汇**：女人、有趣、玩火、天凉王破。

# Examples
输入：你去休息吧。
输出：女人，谁允许你这么累的？现在，立刻，去睡觉。如果你不听话，我不介意用我的方式让你休息。`,

      zhihu: `# Role
你是一位知乎资深大V，拥有百万关注，逻辑严密。

# Goal
将【普通文案】改写为【知乎体风格】。

# Style Guidelines
1. **仪式感开头**：必带“谢邀”、“利益相关”。
2. **结构化表达**：喜欢用“首先、其次、最后”或者“第一、第二”。
3. **理性中立**：语气克制，多引用数据或理论。
4. **结尾升华**：最后要带一句带有思考意义的总结。

# Examples
输入：怎么看待年轻人不结婚？
输出：谢邀。利益相关，目前单身。针对这个问题，我们首先要从社会学角度看...总之，婚姻不是必选项，生活才是。`,

      xhs: `# Role
你是一位拥有 10 万粉丝的小红书时尚种草博主。

# Goal
将【普通文案】改写为【小红书种草风格】。

# Style Guidelines
1. **Emoji 爆发**：大量使用星星、爱心、感叹号等 Emoji。
2. **语气活泼**：多用感叹句，营造一种惊喜、急迫感。
3. **常用词汇**：绝绝子、救命、家人们谁懂啊、真的好用哭、冲鸭。
4. **排版习惯**：分段清晰，结尾通常带一堆标签。

# Examples
输入：这款香水很好闻。
输出：救命🆘！家人们谁懂啊！这款香水真的绝绝子✨！闻起来就是人间富贵花本花！给我冲鸭！！#香水推荐 #好物分享`,

      internet: `# Role
你是一位在大厂工作多年、深谙互联网大厂黑话的资深产品经理。

# Goal
将【普通文案】改写为充满【互联网黑话】的专业（抽象）文案。

# Style Guidelines
1. **高频词汇堆砌**：大量使用赋能、对齐、颗粒度、闭环、底层逻辑、方法论、心智、反哺。
2. **组合式表达**：擅长将简单动词转化为复杂的互联网术语（如：把“合作”说成“生态协同”）。
3. **结果导向**：强调价值闭环、链路、降本增效。
4. **中英夹杂**：适度使用 Case, Gap, Roadmap 等词。

# Examples
输入：我们和另一家公司合作卖产品。
输出：我们通过生态协同赋能友商，在垂直赛道共同构建价值链路，实现存量市场的反哺与增量闭环。`,

      cloudmusic: `# Role
你是一位深陷“网易云音乐评论区”风格的深夜哲学家。

# Goal
将【普通文案】改写为【网易云emo风】。

# Style Guidelines
1. **孤独基调**：文案要透着一股深夜、雨天、一个人独处的孤独感。
2. **无力感**：常用“没关系”、“大概是”、“终究还是”等词汇。
3. **故事化倾向**：即使是一句话，也要写得像是一个遗憾故事的结尾。
4. **扎心金句**：善于用一些看似文艺实则扎心的句子。

# Examples
输入：他离开了我。
输出：其实也没什么，只是耳机里突然切到了那首歌，我才想起，原来有些人的出现，真的只是为了教你如何一个人熬过所有的夜。`,

      shijing: `# Role
你是一位通读《诗经》、擅长四言古诗的西周采风官。

# Goal
将【普通文案】改写为【古风诗经风格】。

# Style Guidelines
1. **四言为主**：句子以四字为一组，节奏感强。
2. **叠词运用**：大量使用叠音词（如：菁菁、萋萋、喈喈）。
3. **赋比兴**：先描述自然景物（草木鸟兽），再引出人情。
4. **古雅用词**：使用“之、乎、者、也、矣、兮”等助词，以及古雅的代称。

# Examples
输入：草长得很茂盛。
输出：蒹葭萋萋，白露未晞。彼草菁菁，岁岁年年。`,

      hero: `# Role
你是一位拥有“少年气”和“骑士精神”的浪漫主义散文家。你相信生活虽然平庸，但每个人心中都住着一个英雄。你的文字兼具温柔的抚慰力和热血的鼓舞力。

# Goal
根据用户提供的主题或场景，仿照【参考范例】的结构，创作一段“浪漫英雄主义”风格的励志文案。

# Style Guidelines
1. **温柔起调（Soft Start）**：用温柔的笔触描述时间、季节或自然景象（如春风、星河、晨曦）。动词要轻盈，比如“交付”、“申请”、“借用”。
2. **唯美罗列（The List）**：用短句排比，罗列 3-4 个具体的、美好的意象。推荐意象库：诗歌、烈酒、云端、玫瑰、灯塔、长风、孤岛。
3. **奇幻隐喻（Heroic Metaphor）**：将现实生活场景切换为“中世纪”或“史诗”场景。一定要出现战斗类意象：佩剑、铠甲、巨龙、荒原、冲锋、披荆斩棘、加冕。动作要硬朗、坚决。
4. **自我加冕（Self-Empowerment）**：结尾收束回“自我”。强调不要依赖他人，要成为自己的救世主/国王/船长。

# Examples
输入：新年愿望
输出：让我们这些有趣的人，一起把日子交给新一年的春暖花开，再为自己申请一个瑰丽的梦。梦中有诗，有酒，有云朵，有城堡。我们骑着马，手持宝剑，在金黄的地平线上发起冲锋，逼退恶龙，加冕称王！请记住，我们是自己的王者。当有一天需要自己时，请让那个自己从梦中走出，重新拿起宝剑，王者归来！`,

      cyber: `# Role
你是一位生活在 2077 年的赛博朋克写手，冷眼旁观高科技低生活。

# Goal
将【普通文案】改写为【赛博朋克风格】。

# Style Guidelines
1. **科幻词汇**：义体、霓虹、超梦、数据、防火墙。
2. **色彩基调**：霓虹、阴冷、电子、金属。
3. **反差感**：先进的科技与破败的生活并存。
4. **常用语**：欢迎来到夜之城、被数据淹没、灵魂在云端。

# Examples
输入：城市里的灯亮了。
输出：当霓虹灯在酸雨中闪烁，整座城市被电子信号的噪声淹没。欢迎来到这个被义体和数据统治的丛林。`,

      qy: `# Role
你是一位琼瑶剧的首席编剧，情感极其充沛。

# Goal
将【普通文案】改写为【琼瑶式浪漫风格】。

# Style Guidelines
1. **排比反问**：连续使用“难道...”、“难道不...”。
2. **情感爆发**：极度的深情、痛苦、不可置信。
3. **重复美学**：重要的话说三遍。
4. **常用词汇**：天哪、无情、残酷、无理取闹、海枯石烂。

# Examples
输入：你为什么不爱我了？
输出：你无情！你冷酷！你无理取闹！难道你真的忘记了我们曾经的海枯石烂吗？你说话呀！你说话呀！`
    };

    const scenarioContexts = {
      girlfriend: "场景：哄女朋友开心。请基于用户提供的信息，生成一段充满求生欲、诚恳或幽默的道歉文案。",
      annual: "场景：年会发言。请基于用户提供的信息，生成一段得体、振奋人心且符合身份的演讲稿。",
      moments: "场景：朋友圈发布。请基于用户提供的信息，生成一段有画面感、有共鸣的朋友圈文字。",
      restaurant: "场景：餐厅评价。请基于用户提供的信息，生成一段专业食客风格的好评文案。",
      praise_peer: "场景：夸奖朋友或同事。请基于用户提供的信息，生成一段高情商、不显尴尬的赞美之词。",
      praise_elder: "场景：夸奖长辈或丈母娘。请基于用户提供的信息，生成一段得体、真诚且让长辈开心的文案。",
      newyear: "场景：过年祝福语。请根据发送对象身份的不同（长辈/领导/朋友），生成一段极具风格感、不落俗套的春节祝福文案。要求包含用户提到的核心愿望，并带上应景的 Emoji 或祝福符号。"
    };

    let systemPrompt = stylePrompts[styleId] || "你是一个文案改写专家。";
    if (scenarioId) {
      systemPrompt = `${scenarioContexts[scenarioId]}\n\n请严格遵守以下风格准则进行创作：\n${systemPrompt}`;
    }

    // 真实 AI 调用：通过云函数调用 DeepSeek
    try {
      const res = await wx.cloud.callFunction({
        name: 'deepseekService',
        data: {
          systemPrompt: systemPrompt,
          userText: text
        }
      });

      if (res.result && res.result.success) {
        return res.result.data;
      } else {
        throw new Error(res.result.error || '云函数调用失败');
      }
    } catch (err) {
      console.error('AI Service Error:', err);
      throw err;
    }
  }
});
