import { ElementType } from "react"

export type AnimationStyle = 'top-to-bottom' | 'center-outward' | 'bottom-to-top';

export interface SidebarItem {
  name: string
  href: string
  icon: ElementType | string
}

export interface DashboardSidebarProps {
  items?: SidebarItem[]
  className?: string
  animationStyle?: AnimationStyle
  children?: React.ReactNode
} 