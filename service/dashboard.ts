import { IDailyDataItem, IJudgmentDistributionItem, ITagDistributionItem } from "@/types/dashboard";
import { demoHttp } from ".";

/**
 * 数据总览
 */
export function getOverview() {
    return demoHttp.get<IDailyDataItem[]>(`/getDailyData`);
}

/** 
 * 每日邮件研判数据
 */
export function getDailyData() {
    return demoHttp.get<IDailyDataItem[]>(`/getDailyData`);
}

/** 
 * 标签分布
 */
export function getTagDistribution() {
    return demoHttp.get<ITagDistributionItem[]>(`/getTagDistribution`);
}

/** 
 * 标签分布
 */
export function getJudgmentDistribution() {
    return demoHttp.get<IJudgmentDistributionItem[]>(`/getJudgmentDistribution`);
}