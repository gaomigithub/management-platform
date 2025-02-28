// 数据总览
export interface IOverview {
  efficiency: number;
  total: number;
  average: number;
}

// 每日邮件研判数据
export interface IDailyDataItem {
  date: string;
  total: number;
  phishing: number; // 钓鱼邮件
  sensitive: number; // 敏感内容
  crossBorder: number; // 跨境邮件
}

// 标签分布
export interface ITagDistributionItem {
  name: string; // "跨境邮件"
  value: number;
}

// 研判结果分布
export interface IJudgmentDistributionItem {
  name: string; // "研判正确"
  value: number;
  color: string;
}
