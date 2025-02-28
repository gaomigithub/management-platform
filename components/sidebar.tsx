import Link from "next/link"
import { History, FileText } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <History className="mr-2" />
              Detection History
            </Link>
          </li>
          <li>
            <Link href="/sensitive-content" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <FileText className="mr-2" />
              Sensitive Content
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

