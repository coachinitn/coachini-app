"use client"

interface Goal {
  title: string
  description: string
}

interface ThemeGoalsProps {
  goals: Goal[]
}

export function ThemeGoals({ goals }: ThemeGoalsProps) {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-blue-600">Goals</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal, index) => (
          <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <h4 className="mb-2 font-medium">{goal.title}</h4>
            <p className="text-sm text-gray-600">{goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 