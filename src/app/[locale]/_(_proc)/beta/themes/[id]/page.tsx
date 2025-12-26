"use client"

import { useState } from "react"
import { ArrowLeft, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/core/utils/cn"
import { NotificationsPanel } from "../../../../../../design-system/ui/components/notifications/notifications-panel"

interface Coach {
  id: string
  name: string
  title: string
  avatar: string
}

interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
  date: string
}

interface ComparisonProgram {
  id: string
  title: string
  image: string
  description: string
  keyDifferences: string[]
  isBookmarked: boolean
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="mb-4">
        <svg
          className="w-8 h-8 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
      </div>
      <blockquote className="mb-4 text-gray-700">{testimonial.quote}</blockquote>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{testimonial.author}</p>
          <p className="text-sm text-gray-500">{testimonial.title}</p>
        </div>
        <p className="text-sm text-gray-400">{testimonial.date}</p>
      </div>
    </div>
  )
}

function TabButton({ id, label, isActive, onClick }: {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
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

export default function ThemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { locale, id } = useParams()
  const [activeTab, setActiveTab] = useState("about")
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)

  const toggleCoach = (id: string) => {
    setSelectedCoaches((prev) =>
      prev.includes(id) ? prev.filter((coachId) => coachId !== id) : [...prev, id]
    )
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const coaches: Coach[] = [
    {
      id: "1",
      name: "Anna Christie",
      title: "ICF Coach",
      avatar: "/placeholder.svg?height=160&width=300",
    },
    {
      id: "2",
      name: "Irene Edler",
      title: "ICF Coach",
      avatar: "/placeholder.svg?height=160&width=300",
    },
    {
      id: "3",
      name: "Arthur Doyl",
      title: "ICF Coach",
      avatar: "/placeholder.svg?height=160&width=300",
    },
    {
      id: "4",
      name: "John Watson",
      title: "ICF Coach",
      avatar: "/placeholder.svg?height=160&width=300",
    },
  ]

  const testimonials: Testimonial[] = [
    {
      id: "1",
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      author: "Lorem ipsum dolor",
      title: "XCOMPANY CEO",
      date: "Mars 2023",
    },
    {
      id: "2",
      quote:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      author: "Jane Smith",
      title: "Marketing Director",
      date: "April 2023",
    },
    {
      id: "3",
      quote:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
      author: "John Doe",
      title: "HR Manager",
      date: "May 2023",
    },
  ]

  const comparisonPrograms: ComparisonProgram[] = [
    {
      id: "1",
      title: "Program title number 1",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Serenity and zen at work: Yes, it's possible serenity and zen at work. Yes, it's possible serenity and zen at work. Yes, it's possible!",
      keyDifferences: ["key difference 1", "key difference 2", "key difference 3", "key difference 4"],
      isBookmarked: true,
    },
    {
      id: "2",
      title: "Program title number 2",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Serenity and zen at work: Yes, it's possible serenity and zen at work. Yes, it's possible serenity and zen at work. Yes, it's possible!",
      keyDifferences: ["key difference 1", "key difference 2", "key difference 3", "key difference 4"],
      isBookmarked: false,
    },
  ]

  const skills = [
    { name: "Public speaking", rating: 4 },
    { name: "Problem solving", rating: 2 },
    { name: "Active listening", rating: 4 },
    { name: "Resourcefulness", rating: 3 },
  ]

  const themeGoals = ["Become a good communicator", "Goal 2", "Goal 3", "Goal 4"]
  const themeTitle = "Effective Communication";
  const themeCategory = "Team Communication";

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container px-4 py-8 mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href={`/${locale}/themes`}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to themes
          </Link>
          <div className="text-gray-400">
            <ChevronRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm text-gray-500">{themeCategory}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="mb-2 text-2xl font-bold">{themeTitle}</h1>
                  <div className="text-sm text-gray-500">{themeCategory}</div>
                </div>
                <button
                  onClick={toggleBookmark}
                  className={cn(
                    "p-2 rounded-full",
                    isBookmarked ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-6 h-6" />
                  ) : (
                    <Bookmark className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="mb-6">
                <img
                  src="/placeholder.svg?height=400&width=800"
                  alt={themeTitle}
                  className="object-cover w-full h-64 rounded-lg"
                />
              </div>

              <div className="flex pb-4 mb-6 space-x-2 border-b border-gray-100">
                <TabButton
                  id="about"
                  label="About the theme"
                  isActive={activeTab === "about"}
                  onClick={() => setActiveTab("about")}
                />
                <TabButton
                  id="coaches"
                  label="Select your coaches"
                  isActive={activeTab === "coaches"}
                  onClick={() => setActiveTab("coaches")}
                />
                <TabButton
                  id="testimonials"
                  label="What our happy users say"
                  isActive={activeTab === "testimonials"}
                  onClick={() => setActiveTab("testimonials")}
                />
                <TabButton
                  id="comparison"
                  label="Similar programs"
                  isActive={activeTab === "comparison"}
                  onClick={() => setActiveTab("comparison")}
                />
              </div>

              {activeTab === "about" && (
                <div className="space-y-8">
                  <div className="mb-2 text-blue-600">
                    <span className="font-medium">
                      You must select the duration, location, and your coaches to be able to add this theme *
                    </span>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold text-blue-600">About the theme</h3>
                    <p className="mb-4 text-gray-700">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, felis ac congue
                      hendrerit, lorem risus fermentum arcu, id gravida justo sagittis nec mattis. Integer vitae tortor id risus
                      malesuada suscipit. Proin in sollicitudin lectus, in viverra lorem. Sed euismod turpis eu justo tincidunt,
                      in tempor elit auctor. Integer vehicula, magna vel commodo tincidunt, purus dolor ultricies sapien, ut
                      fermentum risus tortor id lorem. Praesent quis vestibulum magna. Mauris suscipit odio et mi suscipit, in
                      interdum ex tristique.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold text-blue-600">Goals</h3>
                    <ul className="space-y-2">
                      {themeGoals.map((goal, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></div>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold text-blue-600">Metadata</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-medium">3 hours</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-medium">Remote</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-medium">1-10</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <div>
                          <div className="text-sm text-gray-500">Schedule</div>
                          <div className="font-medium">Flexible</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold text-blue-600">Skills</h3>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div key={skill.name} className="flex flex-col">
                          <div className="flex justify-between mb-1">
                            <span>{skill.name}</span>
                            <span>{skill.rating}/5</span>
                          </div>
                          <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(skill.rating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "coaches" && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold text-center">
                    Select your <span className="text-yellow-500">coaches</span>
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {coaches.map((coach) => {
                      const isSelected = selectedCoaches.includes(coach.id)
                      return (
                        <Link key={coach.id} href={`/${locale}/coaches/${coach.id}`}>
                          <div
                            className={cn(
                              "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group",
                              isSelected ? "ring-2 ring-blue-500" : ""
                            )}
                            onClick={(e) => {
                              e.preventDefault() // Prevent navigation when selecting
                              toggleCoach(coach.id)
                            }}
                          >
                            <div className="relative h-48 bg-gray-200">
                              <img
                                src={coach.avatar || "/placeholder.svg"}
                                alt={coach.name}
                                className="object-cover w-full h-full"
                              />
                              {isSelected && (
                                <div className="absolute z-10 p-1 text-white bg-blue-500 rounded-full top-2 right-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                              <div className="absolute inset-0 transition-opacity bg-black opacity-0 bg-opacity-20 group-hover:opacity-100" />
                            </div>
                            <div className="p-4 bg-white">
                              <h3 className="text-lg font-semibold">{coach.name}</h3>
                              <p className="text-sm text-gray-500">{coach.title}</p>
                            </div>
                            <div className="absolute text-gray-400 transition-colors right-2 bottom-2 group-hover:text-blue-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <h2 className="mb-6 text-xl font-semibold text-center">
                    What our <span className="text-yellow-500">users</span> say
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {testimonials.map((testimonial) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "comparison" && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold text-center">
                    Similar <span className="text-yellow-500">programs</span>
                  </h2>
                  <div className="space-y-6">
                    {comparisonPrograms.map((program) => (
                      <div key={program.id} className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row">
                          <div className="h-48 bg-gray-100 md:w-1/3">
                            <img src={program.image} alt={program.title} className="object-cover w-full h-full" />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-semibold">{program.title}</h3>
                              <button
                                className={program.isBookmarked ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}
                              >
                                {program.isBookmarked ? (
                                  <BookmarkCheck className="w-5 h-5" />
                                ) : (
                                  <Bookmark className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                            <p className="mt-2 mb-4 text-gray-600">{program.description}</p>
                            <div>
                              <h4 className="mb-2 text-sm font-medium text-gray-500">Key differences</h4>
                              <ul className="space-y-1">
                                {program.keyDifferences.map((diff, index) => (
                                  <li key={index} className="flex items-center text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                                    <span>{diff}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sticky p-6 bg-white shadow-sm rounded-xl top-4">
              <h2 className="mb-4 text-lg font-semibold">Take this program</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Selected Coaches:</span>
                  <span className="font-medium">{selectedCoaches.length} selected</span>
                </div>

                {selectedCoaches.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCoaches.map((coachId) => {
                      const coach = coaches.find(c => c.id === coachId)
                      if (!coach) return null
                      return (
                        <div key={coachId} className="flex items-center gap-2 py-1 pl-1 pr-2 bg-gray-100 rounded-full">
                          <img
                            src={coach.avatar}
                            alt={coach.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm">{coach.name}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Select coaches from the "Coaches" tab</div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <button
                    className={cn(
                      "w-full py-2 rounded-md font-medium",
                      selectedCoaches.length > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    )}
                    disabled={selectedCoaches.length === 0}
                  >
                    Book This Program
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}