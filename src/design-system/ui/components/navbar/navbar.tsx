// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Menu, X } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { OptimizedAvatar } from "@/design-system/ui/molecules/optimized-avatar"
// import { useChatContext } from "@/design-system/ui/layouts/chat-layout"
// import { NotificationsPanel } from "@/components/notifications/notifications-panel"
// import { InfoIcon, SearchIcon } from "@/design-system/icons/layout"
// import { ChatButton } from "./ChatButton"


// const NavContent = ({ 
//   searchValue, 
//   setSearchValue, 
//   isMobile 
// }: {
//   searchValue: string;
//   setSearchValue: (value: string) => void;
//   isMobile: boolean;
// }) => {
//   return (
//     <>
//       <div className={`relative ${isMobile ? "w-full" : "w-[214px]"} h-[41px]`}>
//         <div className="absolute inset-y-0 left-0 flex items-center pl-4">
//           <SearchIcon 
//             width={20} 
//             height={20} 
//             className="text-muted-foreground"
//           />
//         </div>
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="w-full h-full py-3 pl-12 pr-4 bg-muted dark:bg-muted rounded-[10px] border-none text-muted-foreground dark:text-muted-foreground placeholder-muted-foreground dark:placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
//         />
//       </div>

//       <div className={`flex items-center ${isMobile ? "w-full justify-between mt-2" : "ml-4"} space-x-4`}>
//         <NotificationsPanel />

//         <button className="p-2 transition-colors rounded-full hover:bg-muted dark:hover:bg-muted">
//           <InfoIcon 
//             width={24} 
//             height={24} 
//             className="text-muted-foreground"
//           />
//         </button>

//         <OptimizedAvatar
//           src="/placeholder.svg?height=42&width=42"
//           alt="User"
//           size={42}
//           className="border-2 rounded-full border-card"
//         />
//       </div>
//     </>
//   );
// };

// const DesktopNavbar = ({ 
//   searchValue, 
//   setSearchValue,
//   hasNewMessages,
//   toggleChat
// }: {
//   searchValue: string;
//   setSearchValue: (value: string) => void;
//   hasNewMessages: boolean;
//   toggleChat: () => void;
// }) => {
//   return (
//     <div className="top-0 right-0 z-20 flex items-center gap-4 p-4  bg-card dark:bg-card shadow-lg rounded-[10px]">
//       <NavContent searchValue={searchValue} setSearchValue={setSearchValue} isMobile={false} />
//       <ChatButton hasNewMessages={hasNewMessages} toggleChat={toggleChat} className="ml-2" />
//     </div>
//   );
// };

// const MobileNavbar = ({ 
//   searchValue, 
//   setSearchValue,
//   mobileMenuOpen, 
//   setMobileMenuOpen,
//   hasNewMessages,
//   toggleChat
// }: {
//   searchValue: string;
//   setSearchValue: (value: string) => void;
//   mobileMenuOpen: boolean;
//   setMobileMenuOpen: (value: boolean) => void;
//   hasNewMessages: boolean;
//   toggleChat: () => void;
// }) => {
//   return (
//     <>
//       <div className="relative flex items-center space-x-4">
//         <button 
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="z-30 p-2 bg-primary rounded-[10px] text-primary-foreground"
//           aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
//         >
//           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div 
//               className="z-20 fixed top-0 left-0 right-0 bg-card dark:bg-card py-4 px-6 shadow-lg rounded-[10px] flex flex-col items-start gap-4 mt-16"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               <NavContent searchValue={searchValue} setSearchValue={setSearchValue} isMobile={true} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <ChatButton 
//         hasNewMessages={hasNewMessages} 
//         toggleChat={toggleChat} 
//         className="fixed z-10 bottom-4 right-4" 
//       />
//     </>
//   );
// };

// export function Navbar() {
//   const [searchValue, setSearchValue] = useState("")
//   const { toggleChat, hasNewMessages } = useChatContext()
//   const [isMobile, setIsMobile] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768)
//       if (window.innerWidth >= 768) {
//         setMobileMenuOpen(false)
//       }
//     }
    
//     checkScreenSize()
//     window.addEventListener('resize', checkScreenSize)
//     return () => window.removeEventListener('resize', checkScreenSize)
//   }, [])

//   return isMobile ? (
//     <MobileNavbar 
//       searchValue={searchValue}
//       setSearchValue={setSearchValue}
//       mobileMenuOpen={mobileMenuOpen}
//       setMobileMenuOpen={setMobileMenuOpen}
//       hasNewMessages={hasNewMessages}
//       toggleChat={toggleChat}
//     />
//   ) : (
//     <DesktopNavbar 
//       searchValue={searchValue}
//       setSearchValue={setSearchValue}
//       hasNewMessages={hasNewMessages}
//       toggleChat={toggleChat}
//     />
//   );
// } 