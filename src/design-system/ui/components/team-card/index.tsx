"use client"

import { ContentCard } from "@/design-system/ui/components/content-card"

interface TeamMember {
  id: string
  avatar: string
}

interface TeamCardProps {
  name: string
  program: string
  employeeCount: number
  members?: TeamMember[]
  onViewDetails?: () => void
}

export function TeamCard({ name, program, employeeCount, members, onViewDetails }: TeamCardProps) {
  return (
    <ContentCard
      title={name}
      fields={[
        { label: "Assigned program", value: program },
        { label: "Number of employees", value: employeeCount },
      ]}
      members={members}
      onViewDetails={onViewDetails}
      actionLabel="View Details"
    />
  )
} 