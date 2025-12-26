"use client"

interface Skill {
  name: string
  rating: number
}

interface SkillsRatingProps {
  skills: Skill[]
}

export function SkillsRating({ skills }: SkillsRatingProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-blue-600">Skills rating</h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.rating}/5</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${(skill.rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 