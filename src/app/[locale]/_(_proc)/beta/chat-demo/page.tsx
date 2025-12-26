"use client"

import { useState } from "react"
import { Button } from "@/design-system/ui/base/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage, ChatPanel, Conversation } from "@/design-system/ui"

export default function ChatDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: {
        id: "user-1",
        name: "You",
        avatar: "/placeholder.svg",
      },
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Simulate response after a short delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: {
          id: "coach-1",
          name: "Coachini",
          avatar: "/placeholder.svg",
          isBot: true
        },
        content: "Thank you for your message. How can I help you further?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Chat Component Demo</h1>
      
      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close Chat" : "Open Chat"}
        </Button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="border border-gray-200 rounded-xl shadow-lg overflow-hidden" 
            style={{ height: "600px" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ChatPanel 
              conversations={conversations}
              messages={messages}
              onSendMessage={handleSendMessage}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 