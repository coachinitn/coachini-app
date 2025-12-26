"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/design-system/ui/base/button"
import { DataTable } from "@/design-system/ui/components/data-table/data-table"
import { ProgressBar } from "@/design-system/ui/components/metrics/progress-bar"
import { StarRating } from "@/design-system/ui/components/star-rating"
import { AvatarGroup } from "@/design-system/ui/components/avatar-group"
import { Card, CardContent } from "@/design-system/ui/base/card"

interface Member {
  id: string
  avatar: string
}

interface Session {
  id: string
  title: string
  date: string
  completed: boolean
}

interface ProgramData {
  id: string
  name: string
  members: Member[]
  startDate: string
  completion: {
    current: number
    total: number
  }
  attendance: number
  satisfaction: number
  description?: string
  sessions?: Session[]
}

export function PurchasedTab() {
  // Sample data for purchased themes
  const purchasedThemes: ProgramData[] = [
    {
      id: "1",
      name: "Programme leadership",
      members: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "4", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "5", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "6", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      startDate: "14/06/21",
      completion: { current: 6, total: 10 },
      attendance: 90,
      satisfaction: 4,
      description: "Leadership development program focused on team management and strategic thinking.",
      sessions: [
        { id: "1", title: "Introduction to Leadership", date: "14/06/21", completed: true },
        { id: "2", title: "Strategic Planning", date: "21/06/21", completed: true },
        { id: "3", title: "Team Building", date: "28/06/21", completed: true },
        { id: "4", title: "Conflict Resolution", date: "05/07/21", completed: true },
        { id: "5", title: "Performance Management", date: "12/07/21", completed: true },
        { id: "6", title: "Effective Communication", date: "19/07/21", completed: true },
        { id: "7", title: "Decision Making", date: "26/07/21", completed: false },
        { id: "8", title: "Change Management", date: "02/08/21", completed: false },
        { id: "9", title: "Coaching Skills", date: "09/08/21", completed: false },
        { id: "10", title: "Leadership Capstone", date: "16/08/21", completed: false },
      ],
    },
    {
      id: "2",
      name: "Stratégie de marque employeur",
      members: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "4", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "5", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      startDate: "14/06/21",
      completion: { current: 4, total: 8 },
      attendance: 85,
      satisfaction: 4.5,
      description: "A program focusing on employer branding strategies and talent acquisition.",
      sessions: [
        { id: "1", title: "Brand Identity", date: "14/06/21", completed: true },
        { id: "2", title: "Talent Attraction", date: "21/06/21", completed: true },
        { id: "3", title: "Employee Experience", date: "28/06/21", completed: true },
        { id: "4", title: "Digital Presence", date: "05/07/21", completed: true },
        { id: "5", title: "Employer Value Proposition", date: "12/07/21", completed: false },
        { id: "6", title: "Recruitment Marketing", date: "19/07/21", completed: false },
        { id: "7", title: "Measuring Success", date: "26/07/21", completed: false },
        { id: "8", title: "Future Trends", date: "02/08/21", completed: false },
      ],
    },
    {
      id: "3",
      name: "Gestion / Cohésion d'équipe",
      members: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      startDate: "21/06/21",
      completion: { current: 3, total: 6 },
      attendance: 92,
      satisfaction: 4.2,
      description: "Team management and cohesion building for improved collaboration and performance.",
      sessions: [
        { id: "1", title: "Team Dynamics", date: "21/06/21", completed: true },
        { id: "2", title: "Communication Techniques", date: "28/06/21", completed: true },
        { id: "3", title: "Conflict Resolution", date: "05/07/21", completed: true },
        { id: "4", title: "Building Trust", date: "12/07/21", completed: false },
        { id: "5", title: "Team Activities", date: "19/07/21", completed: false },
        { id: "6", title: "Continuous Improvement", date: "26/07/21", completed: false },
      ],
    },
    {
      id: "4",
      name: "Gestion du temps et productivité",
      members: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      startDate: "30/06/21",
      completion: { current: 2, total: 5 },
      attendance: 88,
      satisfaction: 3.8,
      description: "Time management and productivity enhancement strategies for professionals.",
      sessions: [
        { id: "1", title: "Productivity Principles", date: "30/06/21", completed: true },
        { id: "2", title: "Time Blocking", date: "07/07/21", completed: true },
        { id: "3", title: "Priority Management", date: "14/07/21", completed: false },
        { id: "4", title: "Digital Tools", date: "21/07/21", completed: false },
        { id: "5", title: "Work-Life Balance", date: "28/07/21", completed: false },
      ],
    }
  ]

  const columns = [
    {
      accessorKey: "name",
      header: "PROGRAMMES",
      cell: ({ row }: { row: { original: ProgramData } }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "members",
      header: "MEMBERS",
      cell: ({ row }: { row: { original: ProgramData } }) => <AvatarGroup members={row.original.members} />,
    },
    {
      accessorKey: "startDate",
      header: "START DATE",
      cell: ({ row }: { row: { original: ProgramData } }) => row.original.startDate,
    },
    {
      accessorKey: "completion",
      header: "COMPLETION",
      cell: ({ row }: { row: { original: ProgramData } }) => {
        const { current, total } = row.original.completion
        const percentage = (current / total) * 100
        return (
          <div className="w-32">
            <ProgressBar
              value={percentage}
              showPercentage={true}
              size="md"
              label={`${current}/${total} sessions`}
            />
          </div>
        )
      },
    },
    {
      accessorKey: "attendance",
      header: "ATTENDANCE",
      cell: ({ row }: { row: { original: ProgramData } }) => <span className="font-medium">{row.original.attendance}%</span>,
    },
    {
      accessorKey: "satisfaction",
      header: "SATISFACTION",
      cell: ({ row }: { row: { original: ProgramData } }) => <StarRating rating={row.original.satisfaction} />,
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </Button>
      ),
    },
  ]

  // Custom expandable content for each row
  const renderExpandedContent = (row: ProgramData) => {
    if (!row.sessions) return null

    return (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">{row.name} - Sessions</h3>
        <p className="text-gray-600">{row.description}</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {row.sessions.map((session: Session) => (
            <Card key={session.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-500">{session.date}</p>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${session.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        Track your learning journey: View all your active coaching programs and monitor progress.
      </p>

      <DataTable
        columns={columns}
        data={purchasedThemes}
        showPagination={true}
        expandable={true}
        renderExpandedContent={renderExpandedContent}
      />
    </div>
  )
} 