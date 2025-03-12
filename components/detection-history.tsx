"use client"

import { EmailModal } from "@/components/email-modal"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Email } from "@/types/detection-history"
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "john@example.com",
    recipient: "alice@example.com",
    subject: "重要更新",
    tags: ["跨境邮件", "敏感内容"],
    date: "2023-05-10 09:15",
    status: "研判完成",
    humanLabel: "已确认",
  },
  {
    id: "2",
    sender: "bob@example.com",
    recipient: "charlie@example.com",
    subject: "项目进展报告",
    tags: ["正常"],
    date: "2023-05-10 10:30",
    status: "研判完成",
    humanLabel: "误判",
    humanLabelReason: "正常业务沟通邮件",
  },
  {
    id: "3",
    sender: "eve@example.com",
    recipient: "dave@example.com",
    subject: "点击这里！",
    tags: ["钓鱼邮件", "跨境邮件"],
    date: "2023-05-10 11:45",
    status: "研判中",
    humanLabel: "未确认",
  },
  {
    id: "4",
    sender: "alice@example.com",
    recipient: "bob@example.com",
    subject: "周会会议纪要",
    tags: ["正常"],
    date: "2023-05-10 13:20",
    status: "未研判",
    humanLabel: "未确认",
  },
  {
    id: "5",
    sender: "charlie@example.com",
    recipient: "dave@example.com",
    subject: "紧急：安全漏洞",
    tags: ["敏感内容", "钓鱼邮件"],
    date: "2023-05-10 14:55",
    status: "研判完成",
    humanLabel: "已确认",
  },
]

const tagColors: Record<string, string> = {
  跨境邮件: "bg-orange-200 text-orange-800",
  敏感内容: "bg-red-200 text-red-800",
  钓鱼邮件: "bg-purple-200 text-purple-800",
  正常: "bg-green-200 text-green-800",
}

const statusColors: Record<string, string> = {
  未研判: "text-gray-500",
  研判中: "text-yellow-500",
  研判完成: "text-green-500",
}

const humanLabelIcons: Record<string, any> = {
  未确认: HelpCircle,
  已确认: CheckCircle2,
  误判: AlertCircle,
}

type FilterForm = {
  sender: string
  recipient: string
  subject: string
  tag: string
  startDate: string
  endDate: string
  status: string
  humanLabel: string
}

type LabelForm = {
  label: "已确认" | "误判"
  reason?: string
}

export function DetectionHistory() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [filteredEmails, setFilteredEmails] = useState(mockEmails)
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false)
  const [labelingEmail, setLabelingEmail] = useState<Email | null>(null)

  const { register, handleSubmit, control, watch, reset } = useForm<LabelForm>({
    defaultValues: {
      label: "已确认",
    },
  })

  const onSubmit = (data: FilterForm) => {

    const filtered = mockEmails.filter((email) => {
      return (
        (!data.sender || email.sender.includes(data.sender)) &&
        (!data.recipient || email.recipient.includes(data.recipient)) &&
        (!data.subject || email.subject.includes(data.subject)) &&
        (!data.tag || data.tag === 'all' || email.tags.includes(data.tag)) &&
        (!data.startDate || new Date(email.date) >= new Date(data.startDate)) &&
        (!data.endDate || new Date(email.date) <= new Date(data.endDate)) &&
        (!data.status || data.status === 'all' || email.status === data.status) &&
        (!data.humanLabel || data.humanLabel === 'all' || email.humanLabel === data.humanLabel)
      )
    })
    setFilteredEmails(filtered)
    setCurrentPage(1)
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
  }

  const closeModal = () => {
    setSelectedEmail(null)
  }

  const openLabelDialog = (email: Email) => {
    setLabelingEmail(email)
    setIsLabelDialogOpen(true)
    // 重置表单
    reset({
      label: "已确认",
      reason: "",
    })
  }

  const handleLabelSave = (data: LabelForm) => {
    if (labelingEmail) {
      const updatedEmails = filteredEmails.map((email) => {
        if (email.id === labelingEmail.id) {
          return {
            ...email,
            humanLabel: data.label,
            humanLabelReason: data.label === "误判" ? data.reason : undefined,
            status: "研判完成",
          }
        }
        return email
      })
      setFilteredEmails(updatedEmails)
      setIsLabelDialogOpen(false)
      setLabelingEmail(null)
    }
  }

  const totalPages = Math.ceil(filteredEmails.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentEmails = filteredEmails.slice(startIndex, endIndex)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-4 mb-4">
        <Input {...register("sender")} placeholder="发件人" />
        <Input {...register("recipient")} placeholder="收件人" />
        <Input {...register("subject")} placeholder="主题" />
        <Controller
          name="tag"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="选择标签" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部标签</SelectItem>
                <SelectItem value="正常">正常</SelectItem>
                <SelectItem value="跨境邮件">跨境邮件</SelectItem>
                <SelectItem value="敏感内容">敏感内容</SelectItem>
                <SelectItem value="钓鱼邮件">钓鱼邮件</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="未研判">未研判</SelectItem>
                <SelectItem value="研判中">研判中</SelectItem>
                <SelectItem value="研判完成">研判完成</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="humanLabel"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="选择人工标注" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部标注</SelectItem>
                <SelectItem value="未确认">未确认</SelectItem>
                <SelectItem value="已确认">已确认</SelectItem>
                <SelectItem value="误判">误判</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Input {...register("startDate")} type="date" placeholder="开始日期" />
        <Input {...register("endDate")} type="date" placeholder="结束日期" />
        <Button type="submit">筛选</Button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number.parseInt(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择每页显示数量" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">每页 10 条</SelectItem>
            <SelectItem value="20">每页 20 条</SelectItem>
            <SelectItem value="50">每页 50 条</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>发件人</TableHead>
            <TableHead>收件人</TableHead>
            <TableHead>主题</TableHead>
            <TableHead>标签</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>人工标注</TableHead>
            <TableHead>日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEmails.map((email) => {
            const LabelIcon = humanLabelIcons[email.humanLabel]
            return (
              <TableRow key={email.id}>
                <TableCell className="cursor-pointer" onClick={() => handleEmailClick(email)}>
                  {email.sender}
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => handleEmailClick(email)}>
                  {email.recipient}
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => handleEmailClick(email)}>
                  {email.subject}
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => handleEmailClick(email)}>
                  {email.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-block px-2 py-1 rounded-full text-xs mr-1 ${tagColors[tag] || ""}`}
                    >
                      {tag}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  <span className={`flex items-center ${statusColors[email.status]}`}>{email.status}</span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <LabelIcon className="h-4 w-4" />
                    {email.humanLabel}
                  </span>
                </TableCell>
                <TableCell>{email.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => openLabelDialog(email)}>
                    标注
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div>
          显示 {startIndex + 1} - {Math.min(endIndex, filteredEmails.length)} 条，共 {filteredEmails.length} 条
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedEmail && <EmailModal email={selectedEmail} onClose={closeModal} />}

      <Dialog
        open={isLabelDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset()
          }
          setIsLabelDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>人工标注</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleLabelSave)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">标注结果</label>
              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择标注结果" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="已确认">已确认</SelectItem>
                      <SelectItem value="误判">误判</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {watch("label") === "误判" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  误判原因<span className="text-red-500">*</span>
                </label>
                <Textarea
                  {...register("reason", {
                    required: watch("label") === "误判" ? "请输入误判原因" : false,
                  })}
                  placeholder="请输入误判原因"
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsLabelDialogOpen(false)
                  reset()
                }}
              >
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

