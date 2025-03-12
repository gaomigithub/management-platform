import { Email } from "@/types/detection-history";
import { demoHttp } from ".";

/**
 * 数据总览
 */
export function getHistory() {
    return demoHttp.get<Email[]>(`/getOverview`);
}