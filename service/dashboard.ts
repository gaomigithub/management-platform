import { IDailyDataItem, IJudgmentDistributionItem, IOverview, ITagDistributionItem } from "@/types/dashboard";
import { demoHttp } from ".";

/**
 * 数据总览
 */
export function getOverview() {
    return demoHttp.get<IOverview>(`/getOverview`);
}

/** 
 * 每日邮件研判数据
 */
export function getDailyData() {
    return demoHttp.get<IDailyDataItem[]>(`/phishing-api-daily-data`);
}

/** 
 * 标签分布
 */
export function getTagDistribution() {
    return demoHttp.get<ITagDistributionItem[]>(`/phishing-api-tag-distribution`);
}

/** 
 * 研判结果分布
 */
export function getJudgmentDistribution() {
    return demoHttp.get<IJudgmentDistributionItem[]>(`/phishing-api-judgment-distribution`);
}