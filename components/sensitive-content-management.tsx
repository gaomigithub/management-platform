"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

type SensitiveContent = {
  id: string
  content: string
  type: "关键词" | "句子"
}

const initialSensitiveContent: SensitiveContent[] = [
  { id: "1", content: "机密", type: "关键词" },
  { id: "2", content: "请勿分享此信息", type: "句子" },
  // 添加更多初始敏感内容
]

export function SensitiveContentManagement() {
  const [sensitiveContent, setSensitiveContent] = useState<SensitiveContent[]>(initialSensitiveContent)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newContent, setNewContent] = useState("")
  const [newType, setNewType] = useState<"关键词" | "句子">("关键词")
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAdd = () => {
    if (newContent.trim()) {
      const newItem: SensitiveContent = {
        id: Date.now().toString(),
        content: newContent.trim(),
        type: newType,
      }
      setSensitiveContent([...sensitiveContent, newItem])
      setNewContent("")
      setNewType("关键词")
      setIsDialogOpen(false)
    }
  }

  const handleEdit = (id: string) => {
    const itemToEdit = sensitiveContent.find((item) => item.id === id)
    if (itemToEdit) {
      setNewContent(itemToEdit.content)
      setNewType(itemToEdit.type)
      setEditingId(id)
      setIsDialogOpen(true)
    }
  }

  const handleUpdate = () => {
    if (editingId && newContent.trim()) {
      setSensitiveContent(
        sensitiveContent.map((item) =>
          item.id === editingId ? { ...item, content: newContent.trim(), type: newType } : item,
        ),
      )
      setNewContent("")
      setNewType("关键词")
      setEditingId(null)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    setSensitiveContent(sensitiveContent.filter((item) => item.id !== id))
  }

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        添加新内容
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>内容</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensitiveContent.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.content}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)} className="mr-2">
                  编辑
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editingId ? "编辑" : "添加"}敏感内容</DialogTitle>
          </DialogHeader>
          <Input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="输入关键词或句子"
            className="mb-4"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as "关键词" | "句子")}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="关键词">关键词</option>
            <option value="句子">句子</option>
          </select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={editingId ? handleUpdate : handleAdd}>{editingId ? "更新" : "添加"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

