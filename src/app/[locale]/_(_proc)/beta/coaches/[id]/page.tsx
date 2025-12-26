"use client"

import { ArrowLeft, MapPin, Star, Linkedin, Facebook, Instagram, Youtube, Mail, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/core/utils/cn"
import { NotificationsPanel } from "../../../../../../design-system/ui/components/notifications/notifications-panel"

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  date: string;
}

interface Coach {
  id: string;
  name: string;
  title: string;
  location: string;
  availability: string;
  avatar: string;
  about: string[];
  stats: {
    themes: number;
    coachees: number;
  };
  skills: {
    name: string;
    rating: number;
  }[];
  experience: {
    id: string;
    title: string;
    description: string;
  }[];
  certifications: {
    id: string;
    title: string;
    description: string;
  }[];
  philosophy: {
    title: string;
    description: string;
    focus: string;
  };
  models: { id: string; name: string }[];
  tools: { id: string; name: string }[];
  testimonials: Testimonial[];
  contact: {
    phone1: string;
    phone2: string;
    email: string;
    address: string;
  };
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

export default function CoachProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { locale, id } = useParams()

  // Sample coach data
  const coach: Coach = {
    id: id as string,
    name: "Adela Parkson",
    title: "People & Culture TL",
    location: "Sousse, Tunisia",
    availability: "Mon/ Tue/ Wed",
    avatar: "/placeholder.svg?height=200&width=200",
    about: [
      "Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
      "Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
      "Office ipsum you must be muted. Email manager dive masking that's.",
    ],
    stats: {
      themes: 6,
      coachees: 50,
    },
    skills: [
      { name: "Public speaking", rating: 4 },
      { name: "Problem solving", rating: 2 },
      { name: "Active listening", rating: 4 },
      { name: "Resourcefulness", rating: 3 },
    ],
    experience: [
      {
        id: "1",
        title: "Experience number 1",
        description: "Office ipsum you must be muted. Email manager dive masking that's.",
      },
      {
        id: "2",
        title: "Experience number 2",
        description: "Office ipsum you must be muted. Email manager dive masking that's.",
      },
      {
        id: "3",
        title: "Experience number 3",
        description: "Office ipsum you must be muted. Email manager dive masking that's.",
      },
    ],
    certifications: [
      {
        id: "1",
        title: "Certification number 1",
        description: "Office ipsum you must be muted. Email manager dive",
      },
      {
        id: "2",
        title: "Certification number 2",
        description: "Office ipsum you must be muted. Email manager dive",
      },
      {
        id: "3",
        title: "Certification number 3",
        description: "Office ipsum you must be muted. Email manager dive",
      },
    ],
    philosophy: {
      title: "Empowerment and Self-Discovery",
      description:
        "I believe that every individual has the potential to unlock their own greatness. My coaching is centered around empowering clients to discover their strengths, values, and purpose, leading to authentic and sustainable growth.",
      focus: "Encourages self-awareness, confidence, and personal responsibility.",
    },
    models: [
      { id: "1", name: "Cognitive-behavioral techniques" },
      { id: "2", name: "GROW model" },
    ],
    tools: [
      { id: "1", name: "MBTI" },
      { id: "2", name: "360-degree feedback" },
      { id: "3", name: "DISC assessment" },
    ],
    testimonials: [
      {
        id: "1",
        quote:
          "Working with Adela has been transformative for my leadership skills. Her coaching helped me navigate complex team dynamics and develop a more authentic leadership style.",
        author: "Sarah Johnson",
        title: "Marketing Director, TechCorp",
        date: "March 2023",
      },
      {
        id: "2",
        quote:
          "Adela's approach to coaching is both practical and insightful. She helped me identify blind spots in my communication style that were holding me back from advancing in my career.",
        author: "Michael Chen",
        title: "Senior Project Manager",
        date: "January 2023",
      },
      {
        id: "3",
        quote:
          "I was skeptical about coaching at first, but Adela quickly put me at ease. Her methods are evidence-based and tailored to individual needs. The results speak for themselves.",
        author: "Fatima Al-Zahra",
        title: "HR Director, Global Solutions",
        date: "November 2022",
      },
    ],
    contact: {
      phone1: "+216 28 28 52 52",
      phone2: "+216 96 28 19 91",
      email: "Contact@coachini.net",
      address: "Novation City - Technopole de Sousse",
    },
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

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
        </div>

        <h1 className="mb-6 text-2xl font-semibold">Coach's profile</h1>

        {/* Profile header */}
        <div className="relative mb-16">
          {/* Banner with gradient background */}
          <div className="relative h-32 overflow-hidden rounded-lg md:h-36 bg-gradient-to-r from-blue-900 to-indigo-800">
            {/* Wave-like decoration on the right side */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-30">
              <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path
                  d="M409,116.5C431.5,158.5,454,200.5,441,227.5C428,254.5,379.5,266.5,357,297.5C334.5,328.5,338,378.5,315.5,403.5C293,428.5,244.5,428.5,196,428.5C147.5,428.5,99,428.5,76.5,403.5C54,378.5,57.5,328.5,35,297.5C12.5,266.5,-36,254.5,-49,227.5C-62,200.5,-39.5,158.5,-17,116.5C5.5,74.5,28,32.5,76.5,16C125,0,199.5,8.5,248,8.5C296.5,8.5,319,32.5,341.5,49C364,65.5,386.5,74.5,409,116.5Z"
                  fill="#fff"
                />
              </svg>
            </div>

            {/* Coach info */}
            <div className="absolute text-white left-36 md:left-44 bottom-4">
              <h1 className="text-xl font-bold md:text-2xl">{coach.name}</h1>
              <p className="text-base md:text-lg">{coach.title}</p>
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{coach.location}</span>
              </div>
              <div className="mt-1 text-sm">
                <span>Availability: {coach.availability}</span>
              </div>
            </div>
          </div>

          {/* Profile picture overlapping the banner */}
          <div className="absolute border-4 border-white rounded-full -bottom-12 left-6">
            <div className="w-24 h-24 overflow-hidden rounded-full md:h-28 md:w-28">
              <img src={coach.avatar} alt={coach.name} className="object-cover w-full h-full" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6">
            {/* About me section */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">About me</h2>
              <div className="space-y-4 text-gray-700">
                {coach.about.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Skills section */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">Skills</h2>
              <div className="space-y-4">
                {coach.skills.map((skill) => (
                  <div key={skill.name} className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-700">{skill.name}</span>
                      {renderStars(skill.rating)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{ width: `${(skill.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact section */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p>{coach.contact.phone1}</p>
                    <p>{coach.contact.phone2}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3 text-gray-500" />
                  <p>{coach.contact.email}</p>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="flex-shrink-0 w-5 h-5 mr-3 text-gray-500" />
                  <p>{coach.contact.address}</p>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-gray-500" />
                  <p>Available: {coach.availability}</p>
                </div>
              </div>
              <div className="flex mt-6 space-x-3">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right content (middle + right columns) */}
          <div className="space-y-6 md:col-span-2">
            {/* Stats section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center p-6 bg-white rounded-lg shadow-sm">
                <div className="mr-4 text-blue-500">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-4xl font-bold text-blue-600">{coach.stats.themes}</span>
                  <span className="ml-2 text-xl text-gray-500">Themes</span>
                </div>
              </div>

              <div className="flex items-center p-6 bg-white rounded-lg shadow-sm">
                <div className="mr-4 text-blue-500">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-4xl font-bold text-blue-600">{coach.stats.coachees}</span>
                  <span className="ml-2 text-xl text-gray-500">Coachees</span>
                </div>
              </div>
            </div>

            {/* Coaching philosophy */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">Coaching Philosophy</h2>
              <h3 className="mb-2 text-lg font-medium text-blue-600">{coach.philosophy.title}</h3>
              <p className="mb-4 text-gray-700">{coach.philosophy.description}</p>
              <div className="p-4 rounded-md bg-blue-50">
                <p className="text-blue-700"><strong>Focus:</strong> {coach.philosophy.focus}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">Experience</h2>
              <div className="space-y-4">
                {coach.experience.map((exp) => (
                  <div key={exp.id} className="pl-4 border-l-2 border-blue-500">
                    <h3 className="font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">Certifications</h2>
              <div className="grid grid-cols-1 gap-4">
                {coach.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium text-gray-900">{cert.title}</h3>
                    <p className="text-sm text-gray-700">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coaching models and tools */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b-2 border-yellow-400 w-fit">Coaching Approach</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-medium text-gray-900">Models & Frameworks</h3>
                  <ul className="space-y-2">
                    {coach.models.map((model) => (
                      <li key={model.id} className="flex items-center">
                        <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{model.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 font-medium text-gray-900">Tools & Assessments</h3>
                  <ul className="space-y-2">
                    {coach.tools.map((tool) => (
                      <li key={tool.id} className="flex items-center">
                        <div className="w-2 h-2 mr-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">{tool.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="pb-2 mb-6 text-lg font-semibold border-b-2 border-yellow-400 w-fit">What clients say</h2>
              <div className="space-y-6">
                {coach.testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 text-center text-white bg-blue-600 rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Ready to start coaching with {coach.name}?</h2>
              <p className="mb-6">Book a session now and take the first step towards achieving your goals.</p>
              <button className="px-6 py-2 font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50">
                Schedule a Session
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}