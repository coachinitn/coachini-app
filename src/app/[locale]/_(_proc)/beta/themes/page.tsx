"use client"

import { useState } from "react"
import { Filter, ShoppingCart, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/core/utils/cn"
import { NotificationsPanel } from "../../../../../design-system/ui/components/notifications/notifications-panel"

interface ThemeData {
  id: string
  category: string
  title: string
  description: string
  bookmarked: boolean
  requestCount?: number
  requestLabel?: string
  users: { id: string; avatar: string }[]
  image?: string
}

interface TabProps {
  id: string
  label: string
  isActive: boolean
  onClick: () => void
}

function TabButton({ id, label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 font-medium text-sm rounded-md",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  )
}

function ContentCard({ theme, onBookmark, onViewDetails, onAddToProgram, showProgramButton }: {
  theme: ThemeData
  onBookmark: () => void
  onViewDetails: () => void
  onAddToProgram: () => void
  showProgramButton: boolean
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {theme.image && (
        <div className="h-48 w-full bg-gray-100">
          <img src={theme.image} alt={theme.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">{theme.category}</div>
          <button onClick={onBookmark}>
            {theme.bookmarked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            )}
          </button>
        </div>
        <h3 className="text-lg font-medium mt-2">{theme.title}</h3>
        <p className="text-gray-600 mt-2 text-sm flex-1">{theme.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex -space-x-2">
            {theme.users.map((user) => (
              <img
                key={user.id}
                src={user.avatar || "/placeholder.svg"}
                alt="User"
                className="h-8 w-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-full px-4 py-1 text-sm font-medium"
              onClick={onViewDetails}
            >
              View Details
            </button>
            {showProgramButton && (
              <button
                className="text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-full p-2"
                onClick={onAddToProgram}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThemesPage() {
  const { locale } = useParams()
  const [activeTab, setActiveTab] = useState("available")
  const [isProgramBuilderVisible, setIsProgramBuilderVisible] = useState(false)
  const [programItems, setProgramItems] = useState<{ id: string; name: string }[]>([])

  // Sample data for themes
  const themesData: ThemeData[] = [
    {
      id: "1",
      category: "Team management / Cohesion",
      title: "Team management / Cohesion",
      description:
        "The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded.",
      bookmarked: true,
      requestCount: 12,
      requestLabel: "Requested this theme",
      users: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: "2",
      category: "Employer brand strategy",
      title: "Employer brand strategy",
      description:
        "The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded.",
      bookmarked: true,
      requestCount: 12,
      requestLabel: "Requested this theme",
      users: [{ id: "1", avatar: "/placeholder.svg?height=32&width=32" }],
    },
    {
      id: "3",
      category: "Effective communication",
      title: "Effective communication",
      description: "Serenity and zen at work: Yes, it's possible!",
      bookmarked: true,
      requestCount: 12,
      requestLabel: "Requested this theme",
      users: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "4",
      category: "Team management",
      title: "Team management",
      description: "Serenity and zen at work: Yes, it's possible!",
      bookmarked: false,
      requestCount: 12,
      requestLabel: "Requested this theme",
      users: [
        { id: "1", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  const handleBookmarkToggle = (id: string) => {
    console.log(`Toggle bookmark for theme ${id}`)
  }

  const handleViewDetails = (id: string) => {
    console.log(`View details for theme ${id}`)
    // Use Next.js router to navigate
    window.location.href = `/${locale}/themes/${id}`
  }

  const handleAddToProgram = (theme: ThemeData) => {
    // Check if the theme is already in the program
    if (!programItems.some((item) => item.id === theme.id)) {
      setProgramItems([...programItems, { id: theme.id, name: theme.title }])
    }

    // Open the program builder if it's not already open
    if (!isProgramBuilderVisible) {
      setIsProgramBuilderVisible(true)
    }
  }

  const handleRemoveFromProgram = (id: string) => {
    setProgramItems(programItems.filter((item) => item.id !== id))
  }

  const handleBuildProgram = () => {
    console.log("Building program with items:", programItems)
    // Here you would implement the logic to create the program
    alert(`Program created with ${programItems.length} themes!`)
    setProgramItems([])
    setIsProgramBuilderVisible(false)
  }

  // Function to determine if we should show the program builder toggle
  const shouldShowProgramBuilderToggle = activeTab !== "registered"

  const renderThemesList = (themes: ThemeData[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {themes.map((theme) => (
        <ContentCard
          key={theme.id}
          theme={theme}
          onBookmark={() => handleBookmarkToggle(theme.id)}
          onViewDetails={() => handleViewDetails(theme.id)}
          onAddToProgram={() => handleAddToProgram(theme)}
          showProgramButton={shouldShowProgramBuilderToggle}
        />
      ))}
    </div>
  )

  const savedThemes = themesData.filter(theme => theme.bookmarked)

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Themes</h1>
          <div className="flex items-center gap-2">
            {shouldShowProgramBuilderToggle && (
              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium",
                  programItems.length > 0 
                    ? "bg-blue-50 text-blue-600 border border-blue-200" 
                    : "text-gray-600 border border-gray-200"
                )}
                onClick={() => setIsProgramBuilderVisible(!isProgramBuilderVisible)}
              >
                <ShoppingCart className="h-4 w-4" />
                Program Builder
                {programItems.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {programItems.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex space-x-2 mb-6">
            <TabButton 
              id="available" 
              label="Available" 
              isActive={activeTab === "available"} 
              onClick={() => setActiveTab("available")}
            />
            <TabButton 
              id="registered" 
              label="Purchased" 
              isActive={activeTab === "registered"} 
              onClick={() => setActiveTab("registered")}
            />
            <TabButton 
              id="saved" 
              label="Saved" 
              isActive={activeTab === "saved"} 
              onClick={() => setActiveTab("saved")}
            />
          </div>

          {activeTab === "available" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">Find the perfect fit: Browse our curated selection of coaching solutions.</p>
                <button className="text-gray-500 p-2 hover:bg-gray-50 rounded-md">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
              {renderThemesList(themesData)}
            </div>
          )}

          {activeTab === "registered" && (
            <div className="space-y-6">
              <p className="text-gray-700">Your purchased themes and programs.</p>
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                You haven't purchased any themes yet.
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">Your saved themes for future reference.</p>
                <button className="text-gray-500 p-2 hover:bg-gray-50 rounded-md">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
              {savedThemes.length > 0 ? (
                renderThemesList(savedThemes)
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  No saved themes yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Program Builder Panel */}
        {isProgramBuilderVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium">Program Builder</h3>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsProgramBuilderVisible(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {programItems.length > 0 ? (
                <>
                  <div className="grid gap-2 mb-4 max-h-60 overflow-y-auto">
                    {programItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <span className="font-medium">{item.name}</span>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveFromProgram(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={handleBuildProgram}
                    >
                      Build Program ({programItems.length})
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  <p>Add themes to your program by clicking the cart icon on theme cards.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 