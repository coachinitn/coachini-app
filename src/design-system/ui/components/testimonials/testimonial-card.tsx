import { Quote } from "lucide-react"
import { Card, CardContent } from "@/design-system/ui/base/card"
import { cn } from "@/core/utils"

interface TestimonialCardProps {
  quote: string
  author: string
  title?: string
  date?: string
  className?: string
}

export function TestimonialCard({ quote, author, title, date, className }: TestimonialCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="mb-4 text-yellow-500">
          <Quote className="h-8 w-8" />
        </div>
        <blockquote className="text-gray-700 mb-6">{quote}</blockquote>
        <div className="flex flex-col">
          <span className="font-semibold">{author}</span>
          {title && <span className="text-gray-500 text-sm">{title}</span>}
          {date && <span className="text-gray-400 text-xs mt-1">{date}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
