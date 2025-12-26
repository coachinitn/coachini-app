"use client"

import { NavHeader } from "../../../../../design-system/ui"


export default function NavbarDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NavHeader 
        breadcrumb="Dashboard / Demo"
        title="Navbar Demo"
      />
      
      <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Demo Content</h2>
        <p className="mb-4">
          This page demonstrates the Navbar component with fixed scrolling behavior.
          Scroll down to see how the navbar sticks to the top of the page.
        </p>
        
        {/* Create some dummy content for scrolling */}
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        ))}
      </div>
    </div>
  )
} 