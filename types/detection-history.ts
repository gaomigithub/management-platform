export type Email = {
    id: string
    sender: string
    recipient: string
    subject: string
    tags: string[]
    date: string
    status: "未研判" | "研判中" | "研判完成"
    humanLabel: "未确认" | "已确认" | "误判"
    humanLabelReason?: string
  }