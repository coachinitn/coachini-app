"use client"

import React, { ReactNode } from "react"

import { motion } from "framer-motion"
import { DashboardSidebar, NavHeader } from "@/design-system/ui/components"

interface AppLayoutProps {
  children: ReactNode
  title?: string
  breadcrumb?: string
}

export function AppLayout({ children, title = "Dashboard", breadcrumb = "Pages" }: AppLayoutProps) {
  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.05
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - sticky positioned to stay visible during scrolling */}
      <DashboardSidebar />
      
      {/* Main content area with animation */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="p-8">
          <NavHeader breadcrumb={breadcrumb} title={title} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </motion.div>
    </div>
  )
} 