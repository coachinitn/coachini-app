"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Linkedin, Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import LoginPage  from "@/design-system/features/common/login"

export default function LoginPag1e() {
  const router = useRouter()
  const { locale } = useParams()
  return <LoginPage /> 
} 