'use client';

import React from 'react';
import { Star, Users, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data for the coach profile
const coachData = {
  name: "Adela Parkson",
  title: "People & Culture II",
  location: "Paris, France",
  avatar: "/api/placeholder/80/80",
  stats: {
    themes: 6,
    coachees: 50
  },
  about: [
    "Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Office ipsum you must be muted. Email"
  ],
  corePhilosophy: {
    title: "Empowerment and Self-Discovery",
    description: "I believe that every individual has the potential to unlock their own greatness. My coaching is centered around empowering clients to discover their strengths, values, and purpose, leading to authentic and sustainable growth.",
    focus: "Encourages self-awareness, confidence, and personal responsibility."
  },
  keySkills: [
    { name: "Public speaking", rating: 4 },
    { name: "Problem solving", rating: 2 },
    { name: "Active listening", rating: 4 },
    { name: "Resourcefulness", rating: 3 }
  ],
  professionalExperience: [
    "Experience number 1 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Experience number 2 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Experience number 3 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Experience number 4 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Experience number 5 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running."
  ],
  certifications: [
    "Certification number 1 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Certification number 2 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Certification number 3 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Certification number 4 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running.",
    "Certification number 5 - Office ipsum you must be muted. Email manager dive masking that's. Team meat management big technologically creep high. Seems web running."
  ],
  coachingModels: [
    "Cognitive-behavioral techniques",
    "GROW model"
  ],
  toolsAndAssessments: [
    "MBTI",
    "360-degree feedback",
    "DISC assessment"
  ],
  testimonial: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Lorem ipsum dolor, COMPANY CEO",
    year: "Mars 2024"
  }
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({ rating, maxRating = 4 }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <Star
          key={index}
          size={18}
          className={`${
            index < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ 
  icon, 
  value, 
  label 
}) => {
  return (
    <div className="bg-[#FCFBF7] rounded-[10px] shadow-[0px_18px_40px_0px_rgba(112,144,176,0.12)] p-4 flex items-center gap-3 min-w-[284px]">
      <div className="w-[50px] h-[50px] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#094BA4] text-[40px] font-semibold leading-8">
          {value}
        </span>
        <span className="text-[#84A5D2] text-lg leading-5">
          {label}
        </span>
      </div>
    </div>
  );
};

// Section Card Component
const SectionCard: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  className?: string;
}> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-[#FCFBF7] rounded-[10px] shadow-[0px_18px_40px_0px_rgba(112,144,176,0.12)] p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-[#094BA4] font-medium leading-normal mb-2">
          {title}
        </h3>
        <div className="w-[40px] h-0 border-b-2 border-[#ECB800]" />
      </div>
      {children}
    </div>
  );
};

// Tag Component
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="inline-flex items-center gap-2 py-2 px-5 bg-[#FCFBF7] border border-[#84A5D2] rounded-[25px] shadow-[0px_18px_40px_0px_rgba(112,144,176,0.1)]">
      <span className="text-[#598FDA] text-sm font-semibold leading-5">
        {children}
      </span>
    </div>
  );
};

export default function CoachProfileAdminPOV() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/beta" className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Beta</span>
          </Link>
          
          <button className="flex items-center gap-2 py-3 px-6 bg-[#FCFBF7] border-2 border-[#84A5D2] rounded-[50px] shadow-[0px_5px_15px_0px_rgba(37,44,97,0.15),0px_2px_4px_0px_rgba(136,144,194,0.2)]">
            <span className="text-[#84A5D2] text-xl font-medium">Contact</span>
          </button>
        </div>

        {/* Coach Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            <img 
              src={coachData.avatar} 
              alt={coachData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-1">{coachData.name}</h1>
            <p className="text-blue-200 mb-1">{coachData.title}</p>
            <p className="text-blue-300 text-sm">{coachData.location}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-8">
          <StatsCard 
            icon={<BookOpen className="text-blue-500" size={24} />}
            value={coachData.stats.themes}
            label="Themes"
          />
          <StatsCard 
            icon={<Users className="text-blue-500" size={24} />}
            value={coachData.stats.coachees}
            label="Coachees"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* About Me */}
        <SectionCard title="About me" className="xl:col-span-1">
          <div className="space-y-4">
            {coachData.about.map((paragraph, index) => (
              <p key={index} className="text-[#334155] leading-normal text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </SectionCard>

        {/* Core Philosophy */}
        <SectionCard title="Core philosophy" className="xl:col-span-1">
          <div className="space-y-4">
            <h4 className="text-[#64748B] font-semibold">{coachData.corePhilosophy.title}</h4>
            <p className="text-[#64748B] leading-normal text-sm">
              {coachData.corePhilosophy.description}
            </p>
            <p className="text-[#334155] leading-normal text-sm">
              <span className="font-semibold">Focus:</span> {coachData.corePhilosophy.focus}
            </p>
          </div>
        </SectionCard>

        {/* Key Skills */}
        <SectionCard title="Key skills" className="xl:col-span-1">
          <div className="space-y-4">
            {coachData.keySkills.map((skill, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">{skill.name}</span>
                <StarRating rating={skill.rating} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Professional Experience */}
        <SectionCard title="Professional experience" className="xl:col-span-1">
          <div className="space-y-3">
            {coachData.professionalExperience.map((experience, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-[#64748B] text-sm leading-relaxed">{experience}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Certifications */}
        <SectionCard title="Certifications and credentials" className="xl:col-span-1">
          <div className="space-y-3">
            {coachData.certifications.map((certification, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-[#64748B] text-sm leading-relaxed">{certification}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Coaching Models */}
        <SectionCard title="Coaching models and frameworks" className="xl:col-span-2">
          <div className="flex flex-wrap gap-4">
            {coachData.coachingModels.map((model, index) => (
              <Tag key={index}>{model}</Tag>
            ))}
          </div>
        </SectionCard>

        {/* Tools and Assessments */}
        <SectionCard title="Tools and assessments" className="xl:col-span-2">
          <div className="flex flex-wrap gap-4">
            {coachData.toolsAndAssessments.map((tool, index) => (
              <Tag key={index}>{tool}</Tag>
            ))}
          </div>
        </SectionCard>

        {/* Methodology Section */}
        <div className="xl:col-span-3 text-center py-12">
          <h2 className="text-3xl font-semibold leading-[35px] tracking-[1.2px] mb-8">
            <span className="text-[#094BA4]">Explore my </span>
            <span className="text-[#ECB800]">methodology</span>
            <br />
            <span className="text-[#094BA4]">for the </span>
            <span className="text-[#ECB800]">best </span>
            <span className="text-[#094BA4]">experience</span>
          </h2>
        </div>

        {/* Testimonial Section */}
        <div className="xl:col-span-3 text-center py-12">
          <h2 className="text-3xl font-semibold leading-[35px] tracking-[1.2px] mb-12">
            <span className="text-[#094BA4]">Personal </span>
            <span className="text-[#ECB800]">growth</span>
            <br />
            <span className="text-[#094BA4]">in my coachees </span>
            <span className="text-[#ECB800]">words</span>
          </h2>

          <div className="max-w-2xl mx-auto bg-[#FCFBF7] rounded-[10px] shadow-[0px_18px_40px_0px_rgba(112,144,176,0.12)] p-8">
            <div className="text-6xl text-[#094BA4] mb-4">"</div>
            <p className="text-[#334155] leading-relaxed mb-6 italic">
              {coachData.testimonial.text}
            </p>
            <div className="text-[#64748B] font-medium">
              {coachData.testimonial.author}
            </div>
            <div className="text-[#84A5D2] text-sm mt-1">
              {coachData.testimonial.year}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
