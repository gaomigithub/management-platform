import { SensitiveContentStrategy } from "@/components/sensitive-content-strategy"

export default function SensitiveContentStrategyPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">敏感内容识别策略管理</h1>
      <SensitiveContentStrategy />
    </div>
  )
}

