import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileIcon, FileTextIcon, ImageIcon, PaperclipIcon } from "lucide-react"

type Email = {
  id: string
  sender: string
  recipient: string
  subject: string
  tags: string[]
  date: string
  content?: string
  attachments?: { name: string; type: string }[]
}

type EmailModalProps = {
  email: Email
  onClose: () => void
}

const tagColors: Record<string, string> = {
  跨境邮件: "bg-orange-200 text-orange-800",
  敏感内容: "bg-red-200 text-red-800",
  钓鱼邮件: "bg-purple-200 text-purple-800",
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileIcon className="w-6 h-6" />
    case "doc":
    case "docx":
      return <FileTextIcon className="w-6 h-6" />
    case "jpg":
    case "png":
      return <ImageIcon className="w-6 h-6" />
    default:
      return <PaperclipIcon className="w-6 h-6" />
  }
}

export function EmailModal({ email, onClose }: EmailModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{email.subject}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">发件人</p>
            <p className="font-medium">{email.sender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">收件人</p>
            <p className="font-medium">{email.recipient}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">日期</p>
            <p className="font-medium">{email.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">标签</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {email.tags.map((tag) => (
                <span key={tag} className={`inline-block px-2 py-1 rounded-full text-xs ${tagColors[tag] || ""}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">内容:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{email.content || "这里将显示邮件内容。"}</p>
        </div>
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">附件:</h3>
            <div className="grid grid-cols-2 gap-4">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center p-2 border rounded">
                  {getFileIcon(attachment.type)}
                  <span className="ml-2 text-sm">{attachment.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button onClick={onClose} className="mt-6">
          关闭
        </Button>
      </DialogContent>
    </Dialog>
  )
}

