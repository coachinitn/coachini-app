"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Users, Star, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { H1 } from "@/design-system/ui/base/Text"
import { Button } from "@/design-system/ui/base/button"
import { OptimizedAvatar } from "@/design-system/ui/components/optimized-avatar"
import { StarRating } from "@/design-system/ui/components/star-rating"
import { TabNavigation, type Tab } from "@/design-system/ui/components/tabs-deprecated/deprecated-tab-navigation"
import { TestimonialCarousel } from "@/design-system/ui/components/testimonials/testimonial-carousel"

import Link from "next/link"
import { cn } from "@/core/utils/cn"
import { ThemeGoals } from "@/app/[locale]/dashboard/_themes/theme-goals"
import { SkillsRating } from "@/app/[locale]/dashboard/_themes/skills-rating"

interface Coach {
  id: string
  name: string
  title: string
  avatar: string
}

interface Testimonial {
  id: string
  text: string
  author: string
  company: string
  avatar: string
}

interface ComparisonProgram {
  id: string
  title: string
  image: string
  description: string
  keyDifferences: string[]
  isBookmarked: boolean
}

export default function ThemeDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations("pages.dashboard")
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("about")
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([])
  const [isBookmarked, setIsBookmarked] = useState(true)

  // Sample theme data (would be fetched based on id in a real app)
  const theme = {
    id: params.id,
    title: "Team management / Cohesion",
    category: "Team management",
    description:
      "The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded. Embark on a journey of transformation with our comprehensive team management program that fuels growth, harmony, and productivity.",
    longDescription:
      "This comprehensive program is designed to transform your team dynamics and boost overall performance. Through a series of carefully structured sessions, participants will learn practical tools for effective communication, conflict resolution, and collaborative decision-making.\n\nThe program addresses common challenges in team environments and provides actionable strategies that can be immediately implemented in your workplace. With a focus on both individual development and group dynamics, this theme creates lasting positive change in how your team operates.",
    image: "/placeholder.svg?height=400&width=800",
    bookmarked: true,
    rating: 4.8,
    reviewCount: 124,
    duration: "12 weeks",
    sessionsCount: 8,
    participants: 25,
    coachName: "Alex Johnson",
    coachAvatar: "/placeholder.svg?height=64&width=64",
    coachBio: "Alex is a certified executive coach with over 15 years of experience in team development and leadership training.",
    objectives: [
      "Improve team communication and reduce conflicts",
      "Develop a shared vision and alignment on team goals",
      "Build trust and psychological safety within the team",
      "Enhance decision-making processes and collaboration",
      "Increase team resilience and adaptability to change",
      "Foster a culture of continuous improvement and feedback",
    ],
    testimonials: [
      {
        id: "1",
        text: "This program completely transformed our team dynamics. We've seen a significant improvement in how we communicate and collaborate.",
        author: "Sarah Williams",
        company: "Marketing Director, TechCorp",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      {
        id: "2",
        text: "The practical tools we gained from this program have helped us navigate complex challenges with much greater ease.",
        author: "Michael Chen",
        company: "Team Lead, InnovateCo",
        avatar: "/placeholder.svg?height=48&width=48",
      },
    ],
    skills: [
      { name: "Public speaking", rating: 4 },
      { name: "Problem solving", rating: 2 },
      { name: "Active listening", rating: 4 },
      { name: "Resourcefulness", rating: 3 },
    ],
    goals: [
      {
        title: "Team Management",
        description: "Learn effective techniques for managing diverse teams and fostering collaboration"
      },
      {
        title: "Communication",
        description: "Develop clear communication channels and strategies for effective team interaction"
      },
      {
        title: "Conflict Resolution",
        description: "Master methods to address and resolve conflicts constructively within the team"
      },
      {
        title: "Performance Improvement",
        description: "Implement systems for continuous improvement and performance enhancement"
      }
    ]
  }

  // Sample coaches data
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

  const testimonials = [
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
  
  // Similar programs data
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

  const handleBackClick = () => {
    router.back()
  }

  const toggleCoach = (id: string) => {
    setSelectedCoaches((prev) => 
      prev.includes(id) ? prev.filter((coachId) => coachId !== id) : [...prev, id]
    )
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    console.log(`Toggle bookmark for theme ${theme.id}`)
  }

  const handlePurchase = () => {
    console.log(`Purchase theme ${theme.id}`)
  }

  function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
      <div className="p-4 rounded-lg bg-gray-50">
        <p className="mb-4 italic">"{testimonial.text}"</p>
        <div className="flex items-center gap-3">
          <OptimizedAvatar src={testimonial.avatar} alt={testimonial.author} size={48} />
          <div>
            <div className="font-medium">{testimonial.author}</div>
            <div className="text-sm text-gray-600">{testimonial.company}</div>
          </div>
        </div>
      </div>
    )
  }

  const aboutTab: Tab = {
    id: "about",
    label: "About the theme",
    content: (
      <div className="space-y-8">
        <div className="flex items-center mb-2 text-blue-600">
          <span className="font-medium">25+ users</span>
          <span> requested this theme</span>
        </div>

        <div className="mb-2 text-blue-600">
          <span className="font-medium">
            Select the duration, location and your coaches to be able to add this theme *
          </span>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-blue-600">About the theme</h3>
          <p className="text-gray-700 whitespace-pre-line">{theme.longDescription}</p>
        </div>

        <ThemeGoals goals={theme.goals} />

        <div className="grid grid-cols-1 gap-6 p-4 rounded-lg md:grid-cols-3 bg-gray-50">
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-500">DURATION</h4>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{theme.duration}</span>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-500">SESSIONS</h4>
            <span className="font-medium">{theme.sessionsCount} sessions</span>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-500">CATEGORY</h4>
            <span className="font-medium">{theme.category}</span>
          </div>
        </div>

        <SkillsRating skills={theme.skills} />
      </div>
    ),
  }

  const coachesTab: Tab = {
    id: "coaches",
    label: "Select your coaches",
    content: (
      <div>
        <h2 className="mb-6 text-xl font-semibold text-center">
          Select your <span className="text-yellow-500">coaches</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {coaches.map((coach) => {
            const isSelected = selectedCoaches.includes(coach.id)
            return (
              <div
                key={coach.id}
                className={cn(
                  "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group",
                  isSelected ? "ring-2 ring-blue-500" : ""
                )}
                onClick={() => toggleCoach(coach.id)}
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
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ),
  }

  const testimonialsTab: Tab = {
    id: "testimonials",
    label: "What our happy users say",
    content: <TestimonialCarousel testimonials={testimonials} autoScroll={true} autoScrollInterval={5000} />
  }

  const comparisonTab: Tab = {
    id: "comparison",
    label: "Similar programs",
    content: (
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
                      className={program.isBookmarked ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"}
                      onClick={() => console.log(`Toggle bookmark for program ${program.id}`)}
                    >
                      {program.isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5 fill-current" />
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
    ),
  }

  const tabs = [aboutTab, coachesTab, testimonialsTab, comparisonTab];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-gray-500">
          <Link href="/dashboard/themes" className="flex items-center hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Link>
          <div className="text-sm">
            <span className="text-gray-400">Pages / </span>
            <span className="text-gray-400">Themes / </span>
            <span className="text-gray-600">{theme.title}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold">{theme.title}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={isBookmarked ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"}
              onClick={toggleBookmark}
            >
              {isBookmarked ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
            </Button>
            <Button 
              variant="default" 
              className="bg-blue-600"
              disabled={activeTab === "coaches" && selectedCoaches.length === 0}
              onClick={handlePurchase}
            >
              {activeTab === "coaches" && selectedCoaches.length === 0 
                ? "Select coaches to add" 
                : "Add"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-12 overflow-hidden bg-white rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-8 py-4 text-base font-medium relative",
                  activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>

      <div className="pt-6 pb-12 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-6 text-gray-600 md:justify-start">
          <div className="flex items-center">
            <span>+216 28 28 52 52</span>
          </div>
          <div className="flex items-center">
            <span>+216 96 28 19 91</span>
          </div>
          <div className="flex items-center">
            <span>Contact@coachini.net</span>
          </div>
          <div className="flex items-center">
            <span>Novation City - Technopole de Sousse</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 mt-6 md:flex-row">
          <div className="flex gap-4">
            <Link href="#" className="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
            <Link href="#" className="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
            <Link href="#" className="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500 md:text-right">
            <span className="block md:inline-block md:mr-4">Terms And Conditions</span>
            <span className="block md:inline-block md:mr-4">Accessibility</span>
            <span className="block md:inline-block md:mr-4">Privacy & Policy</span>
            <span className="block md:inline-block md:mr-4">Coachini Website</span>
            <span className="block md:inline-block">©2024 - Coachini | All Right Reserved</span>
          </div>
        </div>
      </div>
    </div>
  )
} 