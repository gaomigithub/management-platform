"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

type Strategy = {
  id: string
  name: string
  type: "关键词" | "关键句"
  content: string
  status: "启用" | "禁用"
}

const initialStrategies: Strategy[] = [
  {
    id: "1",
    name: "敏感词过滤-机密",
    type: "关键词",
    content: "机密,绝密,内部文件,严禁外传",
    status: "启用"
  },
  {
    id: "2",
    name: "敏感句识别-泄密警告",
    type: "关键句",
    content: "本文件包含公司机密信息，请勿外传",
    status: "启用"
  }   
]

export function SensitiveContentStrategy() {
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null)
  const [newStrategy, setNewStrategy] = useState<Partial<Strategy>>({
    name: "",
    type: "关键词",
    content: "",
    status: "启用",
  })

  const handleAdd = () => {
    setEditingStrategy(null)
    setNewStrategy({
      name: "",
      type: "关键词",
      content: "",
      status: "启用",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy)
    setNewStrategy({ ...strategy })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingStrategy) {
      setStrategies(
        strategies.map((s) => (s.id === editingStrategy.id ? ({ ...newStrategy, id: s.id } as Strategy) : s)),
      )
    } else {
      setStrategies([...strategies, { ...newStrategy, id: Date.now().toString() } as Strategy])
    }
    setIsDialogOpen(false)
    setNewStrategy({
      name: "",
      type: "关键词",
      content: "",
      status: "启用",
    })
  }

  const handleDelete = (id: string) => {
    setStrategies(strategies.filter((s) => s.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setStrategies(strategies.map((s) => (s.id === id ? { ...s, status: s.status === "启用" ? "禁用" : "启用" } : s)))
  }

  return (
    <div>
      <Button onClick={handleAdd} className="mb-4">
        添加新策略
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>策略名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {strategies.map((strategy) => (
            <TableRow key={strategy.id}>
              <TableCell>{strategy.name}</TableCell>
              <TableCell>{strategy.type}</TableCell>
              <TableCell className="max-w-md truncate">{strategy.content}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    strategy.status === "启用" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {strategy.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(strategy)} className="mr-2">
                  编辑
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleStatus(strategy.id)} className="mr-2">
                  {strategy.status === "启用" ? "禁用" : "启用"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(strategy.id)}>
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStrategy ? "编辑策略" : "添加新策略"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                策略名称
              </label>
              <Input
                id="name"
                value={newStrategy.name}
                onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                类型
              </label>
              <Select
                value={newStrategy.type}
                onValueChange={(value) => setNewStrategy({ ...newStrategy, type: value as Strategy["type"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="关键词">关键词</SelectItem>
                  <SelectItem value="关键句">关键句</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="content" className="text-right">
                内容
              </label>
              <Input
                id="content"
                value={newStrategy.content}
                onChange={(e) => setNewStrategy({ ...newStrategy, content: e.target.value })}
                className="col-span-3"
                placeholder={newStrategy.type === "关键词" ? "多个关键词用逗号分隔" : "请输入完整的关键句"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                状态
              </label>
              <Select
                value={newStrategy.status}
                onValueChange={(value) => setNewStrategy({ ...newStrategy, status: value as Strategy["status"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="启用">启用</SelectItem>
                  <SelectItem value="禁用">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

