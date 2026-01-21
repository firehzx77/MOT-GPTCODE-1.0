import { Scenario, Industry, Persona } from '@/lib/types';

export const industries: Array<{ id: Industry; name: string; desc: string; icon: string; colorClass: string }> = [
  { id: 'retail', name: '零售服务', desc: '退换货、物流延迟及会员积分纠纷。', icon: 'shopping_cart', colorClass: 'bg-blue-100 text-blue-600' },
  { id: 'bank', name: '金融银行业', desc: '理财咨询、转账失败或账户异常提醒。', icon: 'account_balance', colorClass: 'bg-emerald-100 text-emerald-600' },
  { id: 'telecom', name: '电信通讯', desc: '资费账单争议、网络覆盖及宽带报修。', icon: 'router', colorClass: 'bg-purple-100 text-purple-600' },
  { id: 'hotel', name: '酒店旅游', desc: '预订冲突、客房质量及加急服务响应。', icon: 'home_repair_service', colorClass: 'bg-orange-100 text-orange-600' },
  { id: 'logistics', name: '物流货运', desc: '延误、丢损、清关与可追踪进度沟通。', icon: 'local_shipping', colorClass: 'bg-cyan-100 text-cyan-600' }
];

export const personas: Array<{ id: Persona; name: string; difficulty: Scenario['difficulty']; desc: string; tags: string[] }> = [
  { id: 'senior_angry', name: '愤怒的高龄客户', difficulty: 'high', desc: '固执、情绪化。对数字技术感到挫败，需要极大的耐心和同理心。', tags: ['传统保守', '极度焦虑'] },
  { id: 'business_savvy', name: '精明的商务人士', difficulty: 'mid', desc: '逻辑清晰，极度关注时间成本和解决方案的有效性，反感场面话。', tags: ['效率优先', '结果导向'] },
  { id: 'tech_young', name: '科技达人青年', difficulty: 'low', desc: '熟悉流程，善于用社交媒体发声，希望获得个性化待遇。', tags: ['快速反馈', '网络敏感'] }
];

export const scenarios: Scenario[] = [
  // Retail
  {
    id: 'retail_business_lostpackage',
    title: '订单显示已签收但未收到（补发/退款）',
    industry: 'retail',
    persona: 'business_savvy',
    difficulty: 'mid',
    customerName: '莎拉·詹金斯',
    customerIntro: '精明的商务人士（效率优先、结果导向）',
    background: ['订单 #88219 - 高优先级', '物流显示已送达，但客户未收到', '客户已连续 3 次致电投诉'],
    constraints: ['不得承诺无法兑现的时效', '流程合规：需要核验收件信息/签收证明', '补偿要“合理+可解释”'],
    initialCustomerMessage: '我已经等了两个多星期了。单号显示已送达，但我什么都没收到。这是我第三次打电话询问这件事了。',
    hiddenExpectationsHints: ['客户真正担心：影响出差/工作安排', '客户要“看见诚意”：明确行动+可追踪', '客户需要明确的时间点与兜底'],
    potentialSurprises: ['提供“优先升级处理”并承诺关键节点短信/邮件同步', '赠送加急运费差额（公司内部成本）', '提供一次“专属客服”回访确认到货']
  },
  // Logistics
  {
    id: 'logistics_business_delay',
    title: '国际货运延误（赶工期/停线风险）',
    industry: 'logistics',
    persona: 'business_savvy',
    difficulty: 'mid',
    customerName: '张总',
    customerIntro: '精明的商务人士（效率优先、结果导向）',
    background: ['运单 #LZ-23019 - 海运转空运评估中', '港口拥堵导致预计到港延后 3 天', '客户工厂有排产窗口，可能出现停线损失'],
    constraints: ['不得承诺无法兑现的清关/到货时效', '信息必须可核验（节点/截图/单据）', '必须提供“兜底路径”（替代线路/分批/加急）'],
    initialCustomerMessage: '你们这票货又延误了三天？我排产窗口就这几天，晚了我直接停线。你给我一个能落地的解决方案。',
    hiddenExpectationsHints: ['客户最担心：停线损失和对内解释', '成功标准：给到明确节点与到货窗口、并有兜底', '希望支持：替代线路/分批方案 + 每日可追踪回报'],
    potentialSurprises: ['给客户一个“每日固定时间进度回报”并主动发送节点截图', '提供一页式“进度看板”（无需额外成本）', '优先协调到港后快速提货/预约仓位（内部协同）']
  },
  {
    id: 'logistics_senior_damage',
    title: '货物破损理赔（流程复杂，客户焦虑）',
    industry: 'logistics',
    persona: 'senior_angry',
    difficulty: 'high',
    customerName: '周老板',
    customerIntro: '愤怒的高龄客户（传统保守、极度焦虑）',
    background: ['到货外箱破损，部分货物受潮', '客户第一次遇到理赔，不熟悉材料', '客户担心“推来推去、赔不了”'],
    constraints: ['先安抚再讲流程，避免术语', '必须给到人工兜底：代整理材料/上门取证预约', '承诺边界要清晰：哪些可赔、时限、关键节点'],
    initialCustomerMessage: '我货都破成这样了，你们还让我填一堆表？我就问一句：到底赔不赔？你别让我来回折腾！',
    hiddenExpectationsHints: ['客户担心：钱赔不回来、时间拖很久', '成功标准：今天就确认责任路径和材料清单', '希望支持：有人一步步带着办，最好少跑一趟'],
    potentialSurprises: ['帮客户把“材料清单”做成一张图并发到微信/短信', '预约一次上门取证时间（内部协调）', '在可行范围内先启动“预赔付申请”提升信任']
  },
  {
    id: 'logistics_tech_tracking',
    title: '轨迹停滞/疑似丢件（要证据与可追踪）',
    industry: 'logistics',
    persona: 'tech_young',
    difficulty: 'low',
    customerName: 'Kiki',
    customerIntro: '科技达人青年（快速反馈、网络敏感）',
    background: ['跨境小包轨迹 48 小时未更新', '客户是电商卖家，担心差评和平台罚分', '客户要求立刻给“证据链”和解决时限'],
    constraints: ['解释必须透明可核验', '给出下一次回报时间点', '提供兜底：补发/改派/赔付路径说明'],
    initialCustomerMessage: '轨迹两天没动了，你们是不是丢件？我店铺要被差评了。你给我证据和明确时限。',
    hiddenExpectationsHints: ['客户担心：差评/罚分与平台申诉材料', '成功标准：给到可截图的查询/工单进度与处理时限', '希望支持：补发/改派的兜底 + 主动同步'],
    potentialSurprises: ['给客户一份“平台申诉材料模板”（低成本）', '设置关键节点自动回报（短信/邮件）', '提供一次“优先查件工单”并告知回报时点']
  },
  {
    id: 'retail_senior_refund',
    title: '老人不会线上操作退货（需要耐心引导）',
    industry: 'retail',
    persona: 'senior_angry',
    difficulty: 'high',
    customerName: '刘阿姨',
    customerIntro: '愤怒的高龄客户（传统保守、极度焦虑）',
    background: ['购买的商品尺寸不合适', '不会在 App 里发起退货', '子女不在身边，情绪焦虑'],
    constraints: ['不得让客户重复做无意义操作', '用词避免专业术语', '必须提供“线下/人工”兜底通道'],
    initialCustomerMessage: '你们这个退货怎么弄？我点来点去都不对！我年纪大了弄不懂，你们别让我再折腾了！',
    hiddenExpectationsHints: ['客户要的是“被照顾”的感觉', '担心钱退不回来', '担心步骤复杂又出错'],
    potentialSurprises: ['主动发一张“图文一步步指引”到短信', '提供人工代操作：客服帮客户创建退货单', '预约快递上门取件并提前提醒']
  },
  {
    id: 'retail_tech_points',
    title: '积分未到账/会员权益争议（社媒敏感）',
    industry: 'retail',
    persona: 'tech_young',
    difficulty: 'low',
    customerName: '陈宇',
    customerIntro: '科技达人青年（快速反馈、网络敏感）',
    background: ['参加会员活动下单', '积分延迟到账', '客户在社媒发过吐槽'],
    constraints: ['解释要透明可核验', '给出明确到账时间', '避免刺激对方社媒扩散'],
    initialCustomerMessage: '我活动下单的积分怎么还没到？你们规则写得一堆，但兑现不了我就直接发帖了。',
    hiddenExpectationsHints: ['客户要“确定性”：什么时候到', '要“被重视”：不是模板回复', '要“额外小惊喜”来消气'],
    potentialSurprises: ['补发积分并赠送一次“优先客服通道”', '提供活动规则截图+订单校验路径', '给一张小额免邮券（低成本）']
  },
  // Bank
  {
    id: 'bank_business_transfer',
    title: '大额转账失败（时间敏感）',
    industry: 'bank',
    persona: 'business_savvy',
    difficulty: 'mid',
    customerName: '王经理',
    customerIntro: '精明的商务人士（效率优先、结果导向）',
    background: ['对公转账失败', '客户需要在 2 小时内完成付款', '客户担心违约/影响合作'],
    constraints: ['合规：身份/授权核验必须完成', '不能指导绕过风控', '必须给出替代路径（兜底）'],
    initialCustomerMessage: '我这笔对公转账一直失败，马上要到付款截止时间了。你们到底能不能解决？',
    hiddenExpectationsHints: ['最担心：付款逾期造成损失', '成功标准：在截止前完成可追踪付款', '希望支持：替代渠道/加急处理'],
    potentialSurprises: ['提供“并行兜底”：柜面/企业网银/电话授权路径', '承诺关键节点回拨确认', '提供风控原因的“可理解解释”']
  },
  {
    id: 'bank_senior_card',
    title: '老人银行卡被锁（害怕被骗）',
    industry: 'bank',
    persona: 'senior_angry',
    difficulty: 'high',
    customerName: '赵叔',
    customerIntro: '愤怒的高龄客户（传统保守、极度焦虑）',
    background: ['连续输错密码导致锁卡', '近期听说电信诈骗', '担心钱不安全'],
    constraints: ['安全合规优先', '语言要安抚+明确', '给出线下兜底及安全提醒'],
    initialCustomerMessage: '我卡怎么用不了？是不是被人盗了？你们银行到底安不安全！',
    hiddenExpectationsHints: ['担心资产安全', '成功标准：确认资金安全+尽快恢复可用', '希望支持：有人指导他去哪里办、带什么材料'],
    potentialSurprises: ['主动做一次“账户安全体检”解释', '给一张“防诈骗小卡片”短信版', '预约网点绿色通道减少排队']
  },
  {
    id: 'bank_tech_chargeback',
    title: '年轻用户投诉扣费（要透明证据）',
    industry: 'bank',
    persona: 'tech_young',
    difficulty: 'low',
    customerName: '林然',
    customerIntro: '科技达人青年（快速反馈、网络敏感）',
    background: ['信用卡出现一笔看不懂的扣费', '客户在App里找不到明细', '客户要求立刻处理'],
    constraints: ['隐私安全/身份核验', '解释要可视化', '提供争议处理流程与时限'],
    initialCustomerMessage: '我这笔扣费是什么鬼？你们明细都不给看？不解释清楚我就投诉。',
    hiddenExpectationsHints: ['担心被盗刷', '成功标准：给到可核验明细/证据', '希望支持：冻结/争议流程一步到位'],
    potentialSurprises: ['一键冻结+临时提升监控', '发电子版“争议处理进度卡”', '提醒开启消费通知']
  },
  // Telecom
  {
    id: 'telecom_business_outage',
    title: '宽带故障影响远程会议（加急抢修）',
    industry: 'telecom',
    persona: 'business_savvy',
    difficulty: 'mid',
    customerName: '周总',
    customerIntro: '精明的商务人士（效率优先、结果导向）',
    background: ['宽带突然中断', '客户 1 小时后有重要视频会议', '客户已重启设备多次无效'],
    constraints: ['不能保证一定上门时效', '必须提供兜底：流量/备用方案', '需要明确排障步骤与时间节点'],
    initialCustomerMessage: '我家网断了，我一小时后有会议。你们如果修不好，我就要换运营商。',
    hiddenExpectationsHints: ['最担心：会议失败造成损失', '成功标准：会议期间网络稳定', '希望支持：备用网络/加急上门'],
    potentialSurprises: ['临时赠送流量包作为会议兜底', '工程师优先派单并实时定位进度', '会议结束后回访确认']
  },
  {
    id: 'telecom_senior_bill',
    title: '老人账单看不懂（误以为乱扣费）',
    industry: 'telecom',
    persona: 'senior_angry',
    difficulty: 'high',
    customerName: '孙阿伯',
    customerIntro: '愤怒的高龄客户（传统保守、极度焦虑）',
    background: ['本月账单比平时高', '客户看不懂套餐', '怀疑被乱扣费'],
    constraints: ['解释要用“生活语言”', '需要给到可视化/简化账单', '提供改套餐/退订的兜底'],
    initialCustomerMessage: '你们这个月怎么扣这么多钱？我根本没用那么多！是不是坑人？',
    hiddenExpectationsHints: ['担心被占便宜', '成功标准：看懂为什么多、怎么避免', '希望支持：帮他改到更合适的套餐'],
    potentialSurprises: ['主动生成“简版账单摘要”', '建议开通用量提醒', '下月自动减免一次功能费']
  },
  {
    id: 'telecom_tech_speed',
    title: '网速不达标（要数据证据）',
    industry: 'telecom',
    persona: 'tech_young',
    difficulty: 'low',
    customerName: 'Kiki',
    customerIntro: '科技达人青年（快速反馈、网络敏感）',
    background: ['客户测速结果偏低', '怀疑运营商虚标', '客户熟悉路由器/测速工具'],
    constraints: ['给出可操作排障路径', '避免甩锅', '提供检测与兜底处理'],
    initialCustomerMessage: '我测出来只有一半速度。你们不是承诺千兆吗？给我个说法。',
    hiddenExpectationsHints: ['要“证据链”：为什么慢', '成功标准：速度恢复或补偿', '希望支持：工程师上门/远程优化'],
    potentialSurprises: ['免费上门检测一次', '赠送一次路由器远程优化服务', '提供测速报告截图保存']
  },
  // Hotel
  {
    id: 'hotel_business_overbook',
    title: '到店发现超售（必须兜底）',
    industry: 'hotel',
    persona: 'business_savvy',
    difficulty: 'mid',
    customerName: '林女士',
    customerIntro: '精明的商务人士（效率优先、结果导向）',
    background: ['客户凌晨到店', '酒店系统显示超售', '客户第二天要参加会议'],
    constraints: ['必须给出同级或升级替代', '不能承诺没有的房型', '行动要快+明确'],
    initialCustomerMessage: '我都预付了，你现在说没房？我明早要开会，你们怎么处理？',
    hiddenExpectationsHints: ['担心影响会议', '成功标准：今晚立即入住且不折腾', '希望支持：交通/手续简化'],
    potentialSurprises: ['安排同级以上附近酒店并承担差价', '提供快速入住+延迟退房', '赠送早餐券/会议打印服务']
  },
  {
    id: 'hotel_senior_noise',
    title: '老人投诉房间吵（需要安抚+解决）',
    industry: 'hotel',
    persona: 'senior_angry',
    difficulty: 'high',
    customerName: '周奶奶',
    customerIntro: '愤怒的高龄客户（传统保守、极度焦虑）',
    background: ['房间靠近电梯/街边', '客户睡眠浅', '客户已忍了半晚'],
    constraints: ['先共情再解决', '给兜底：换房/安静房型/耳塞', '保证沟通礼貌清晰'],
    initialCustomerMessage: '吵得我根本睡不着！你们这算什么酒店？',
    hiddenExpectationsHints: ['担心整夜睡不着身体不舒服', '成功标准：立刻安静下来并能休息', '希望支持：不用她来回折腾'],
    potentialSurprises: ['立刻升级安静房型并派人协助搬行李', '提供热牛奶/助眠小礼包', '第二天延迟退房']
  },
  {
    id: 'hotel_tech_refund',
    title: '年轻旅客取消政策争议（规则透明）',
    industry: 'hotel',
    persona: 'tech_young',
    difficulty: 'low',
    customerName: 'Leo',
    customerIntro: '科技达人青年（快速反馈、网络敏感）',
    background: ['客户因航班取消要退订', '平台显示不可退', '客户准备去社媒曝光'],
    constraints: ['规则解释要清晰', '提供替代：改期/券/部分退', '给出“最大努力”的边界'],
    initialCustomerMessage: '你们这个不可退太离谱了，我航班都取消了。不给退我就直接曝光。',
    hiddenExpectationsHints: ['要公平感', '成功标准：至少有可接受的补偿方案', '希望支持：改期/转让/券兜底'],
    potentialSurprises: ['提供一次免费改期', '赠送房型升级券（淡季）', '提供航班取消证明提交流程']
  }
];

export function findScenario(industry: Industry, persona: Persona): Scenario {
  const match = scenarios.find(s => s.industry === industry && s.persona === persona) || scenarios[0];
  return match;
}

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id);
}
