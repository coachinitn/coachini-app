"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Quote, Pause, Play } from "lucide-react"
import { Button } from "@/design-system/ui/base/button"
import { cn } from "@/core/utils"

interface Testimonial {
  id: string
  quote: string
  author: string
  title?: string
  date?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  className?: string
  autoScroll?: boolean
  autoScrollInterval?: number
}

export function TestimonialCarousel({
  testimonials,
  className,
  autoScroll = true,
  autoScrollInterval = 5000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const goToPrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating) return
    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)

    // Pause auto-scroll while dragging
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStartX
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Determine if we should navigate based on drag distance
    const threshold = slideWidth * 0.2 // 20% of slide width

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    setDragOffset(0)

    // Resume auto-scroll if not paused
    if (autoScroll && !isPaused) {
      startAutoScroll()
    }
  }

  const startAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
    }

    autoScrollTimerRef.current = setInterval(() => {
      if (!isAnimating && !isDragging) {
        goToNext()
      }
    }, autoScrollInterval)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentIndex])

  useEffect(() => {
    if (carouselRef.current) {
      const updateWidth = () => {
        setSlideWidth(carouselRef.current?.clientWidth || 0)
      }

      updateWidth()
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }
  }, [])

  // Handle auto-scrolling
  useEffect(() => {
    if (autoScroll && !isPaused && !isDragging) {
      startAutoScroll()
    } else if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [autoScroll, isPaused, isDragging])

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="flex-1 text-2xl font-semibold text-center">
          What our <span className="text-yellow-500">happy</span> users say
        </h2>
        {autoScroll && (
          <Button variant="ghost" size="sm" onClick={togglePause} className="text-gray-500 hover:text-blue-500">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        )}
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div
          ref={carouselRef}
          className="overflow-hidden bg-white rounded-lg shadow-sm"
          style={{ minHeight: "250px" }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragOffset : 0}px))`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-full p-8">
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-blue-400">
                    <Quote className="w-10 h-10 rotate-180" />
                  </div>
                  <p className="mb-6 text-center text-gray-700">{testimonial.quote}</p>
                  <div className="text-center">
                    <p className="font-semibold">{testimonial.author}</p>
                    {testimonial.title && <p className="text-sm text-gray-500">{testimonial.title}</p>}
                    {testimonial.date && <p className="mt-1 text-xs text-gray-400">{testimonial.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-md top-1/2"
          onClick={goToPrevious}
          disabled={isAnimating}
        >
          <ChevronLeft className="w-5 h-5 text-blue-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 w-10 h-10 translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-md top-1/2"
          onClick={goToNext}
          disabled={isAnimating}
        >
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index === currentIndex ? "bg-blue-500 w-4" : "bg-gray-300",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
