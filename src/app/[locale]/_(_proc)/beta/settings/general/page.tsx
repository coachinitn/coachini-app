"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Calendar } from "lucide-react"
import { NotificationsPanel } from "../../../../../../design-system/ui/components/notifications/notifications-panel"

export default function GeneralSettingsPage() {
  const { locale } = useParams()
  const [isAvailable, setIsAvailable] = useState(true)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Coachini</h1>
          <div className="flex items-center space-x-4">
            <NotificationsPanel />
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">Finalize Your Account Setup</h1>
          <h2 className="text-3xl font-bold text-gray-900">General Settings</h2>
        </div>

        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <div className="relative w-full h-4 mb-8 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 -mt-2 -ml-1 text-white bg-blue-600 rounded-full">
              1
            </div>
            <div className="absolute top-0 flex items-center justify-center w-8 h-8 -mt-2 -ml-4 text-blue-600 bg-blue-200 border-2 border-blue-600 rounded-full left-1/2">
              2
            </div>
          </div>
        </div>

        <div className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <h3 className="mb-6 text-lg font-medium text-gray-600">Company Settings</h3>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-500">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-500">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-500">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                id="location"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select location</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-500">
                Spoken Language <span className="text-red-500">*</span>
              </label>
              <select
                id="language"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="german">German</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="coaching-format" className="block mb-2 text-sm font-medium text-gray-500">
                Preferred Coaching Format <span className="text-red-500">*</span>
              </label>
              <select
                id="coaching-format"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select format</option>
                <option value="one-on-one">One-on-One</option>
                <option value="group">Group</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label htmlFor="coaching-type" className="block mb-2 text-sm font-medium text-gray-500">
                Preferred Type of Coaching <span className="text-red-500">*</span>
              </label>
              <select
                id="coaching-type"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Select type</option>
                <option value="career">Career</option>
                <option value="life">Life</option>
                <option value="executive">Executive</option>
                <option value="business">Business</option>
                <option value="health">Health & Wellness</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="availability" className="block mb-2 text-sm font-medium text-gray-500">
                Availability <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="availability"
                  type="text"
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg"
                  placeholder="Select availability"
                />
                <Calendar className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
              </div>
            </div>
          </div>

          <div className="flex items-center mb-6 space-x-2">
            <input
              type="checkbox"
              id="available"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-blue-600 rounded"
            />
            <label htmlFor="available" className="text-sm text-gray-700">
              I am available for new clients
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href={`/${locale}/profile/basics`}>
            <button
              className="flex items-center px-8 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 