"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Upload, Info } from "lucide-react"
import { NotificationsPanel } from "../../../../../../design-system/ui/components/notifications/notifications-panel"

export default function ProfileBasicsPage() {
  const { locale } = useParams()
  const [blurb, setBlurb] = useState("")

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <h1 className="text-2xl font-bold">Coachini</h1>
          <div className="flex items-center space-x-4">
            <NotificationsPanel />
            <div className="w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl px-4 py-8 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">Complete Your Profile Setup</h1>
          <h2 className="text-3xl font-bold text-gray-900">Profile Basics</h2>
        </div>

        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <div className="relative w-full h-4 mb-8 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-600 rounded-full"></div>
            <div className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 -mt-2 -ml-1 text-white bg-blue-600 rounded-full">
              ✓
            </div>
            <div className="absolute top-0 flex items-center justify-center w-8 h-8 -mt-2 -ml-4 text-white bg-blue-600 rounded-full left-1/2">
              2
            </div>
          </div>
        </div>

        <div className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <h3 className="mb-2 text-lg font-medium text-gray-600">Upload a photo</h3>
          <p className="mb-8 text-sm text-gray-500">
            Your photo will be visible to your connected clients on our platform.
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative flex items-center justify-center w-32 h-32 bg-gray-100 border-2 border-blue-200 rounded-full">
              <Upload className="w-8 h-8 text-blue-300" />
              <div className="absolute bottom-0 right-0 p-2 bg-blue-100 rounded-full">
                <Upload className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>

          <p className="mb-4 text-sm text-gray-600">
            Fill the next sections to help potential clients get to know a little about you.
          </p>

          <div className="mb-6">
            <label htmlFor="blurb" className="block mb-2 text-sm font-medium text-gray-600">
              Blurb
            </label>
            <textarea
              id="blurb"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write a short description about yourself..."
            />
          </div>

          <div className="flex items-start p-4 border border-blue-100 rounded-lg bg-blue-50">
            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              This is just a glimpse of your profile that is visible to connected clients. If you'd like to stand out
              from other coaches, make sure to complete the rest of your profile!
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="flex items-center px-8 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back
          </button>
          <Link href={`/${locale}/dashboard`}>
            <button
              className="flex items-center px-8 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Submit
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 