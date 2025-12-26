import { Users, Calendar, Star } from "lucide-react"
import { cn } from "@/core/utils/cn"
import { StarRating } from "@/design-system/ui/components/star-rating"

interface TeamMetricsProps {
  employeeCount: number
  onlineCount: number
  attendanceRate: number
  attendanceChange: number
  satisfactionRating: number
  satisfactionPercentage: number
}

export function TeamMetrics({
  employeeCount,
  onlineCount,
  attendanceRate,
  attendanceChange,
  satisfactionRating,
  satisfactionPercentage,
}: TeamMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
      <div className="flex items-center p-4 rounded-lg bg-blue-50">
        <div className="p-3 mr-4 bg-white rounded-full">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <div className="text-gray-500">Linked employees</div>
          <div className="text-2xl font-bold">{employeeCount} Employees</div>
          <div className="text-green-500">{onlineCount} online</div>
        </div>
      </div>

      <div className="flex items-center p-4 rounded-lg bg-green-50">
        <div className="p-3 mr-4 bg-white rounded-full">
          <Calendar className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <div className="text-gray-500">Attendancy rate</div>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
          <div className={cn(attendanceChange > 0 ? "text-green-500" : "text-red-500")}>
            {attendanceChange > 0 ? "+" : ""}
            {attendanceChange}% since 04/04/24
          </div>
        </div>
      </div>

      <div className="flex items-center p-4 rounded-lg bg-yellow-50">
        <div className="p-3 mr-4 bg-white rounded-full">
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <div className="text-gray-500">Satisfaction rating</div>
          <div className="text-2xl font-bold">{satisfactionRating}/5</div>
          <div className="text-gray-500">{satisfactionPercentage}% rated</div>
          <StarRating rating={satisfactionRating} size="sm" />
        </div>
      </div>
    </div>
  )
} 