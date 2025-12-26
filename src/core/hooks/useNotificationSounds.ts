'use client'

import { useCallback } from 'react'
import { BackendNotification, NotificationPriority } from '@/core/realtime/types'

// For now, we'll use Web Audio API for simple beep sounds
// These can be replaced with actual MP3 files later using use-sound
const createBeepSound = (frequency: number, duration: number = 200) => {
  // This creates a simple beep sound using Web Audio API
  return () => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration / 1000)
      } catch (error) {
        console.warn('Could not play notification sound:', error)
      }
    }
  }
}

export function useNotificationSounds() {
  // Create different beep sounds for different notification types
  const playNormal = createBeepSound(800, 150)      // Gentle mid-tone beep
  const playAction = createBeepSound(1000, 200)     // Higher, slightly longer beep
  const playCritical = createBeepSound(1200, 300)   // High, urgent beep
  const playSuccess = createBeepSound(600, 250)     // Lower, pleasant tone

  // Determine which sound to play based on notification metadata
  const playNotificationSound = useCallback((notification: BackendNotification) => {
    try {
      // Check if sounds are enabled (could be a user preference)
      const soundsEnabled = localStorage.getItem('notificationSounds') !== 'false'
      if (!soundsEnabled) return

      // Check metadata for sound preferences
      const soundConfig = notification.metadata?.soundConfig
      const actionConfig = notification.metadata?.actionConfig
      
      // If metadata explicitly disables sound
      if (soundConfig?.enabled === false) {
        console.log('🔇 Sound disabled by notification metadata')
        return
      }
      
      // Custom sound from metadata
      if (soundConfig?.customSound) {
        console.log('🔊 Playing custom sound:', soundConfig.customSound)
        // Could implement custom sound loading here
        return
      }

      // Determine sound based on notification properties
      let soundToPlay: (() => void) | null = null
      let soundType = 'normal'

      // Priority-based sound selection
      if (notification.priority === NotificationPriority.CRITICAL) {
        soundToPlay = playCritical
        soundType = 'critical'
      }
      // Action notifications get special sound
      else if (notification.isActionNotification || actionConfig?.actionType) {
        soundToPlay = playAction
        soundType = 'action'
      }
      // Success/completion sounds
      else if (notification.actionCompleted || (notification.category === 'system' && notification.title.toLowerCase().includes('success'))) {
        soundToPlay = playSuccess
        soundType = 'success'
      }
      // Default normal notification sound
      else {
        soundToPlay = playNormal
        soundType = 'normal'
      }

      if (soundToPlay) {
        console.log(`🔊 Playing ${soundType} notification sound for:`, notification.title)
        soundToPlay()
      }

    } catch (error) {
      console.error('❌ Error playing notification sound:', error)
    }
  }, [playNormal, playAction, playCritical, playSuccess])

  // Play sound for mark all as read
  const playMarkAllReadSound = useCallback(() => {
    try {
      const soundsEnabled = localStorage.getItem('notificationSounds') !== 'false'
      if (soundsEnabled) {
        console.log('🔊 Playing mark all read sound')
        playSuccess()
      }
    } catch (error) {
      console.error('❌ Error playing mark all read sound:', error)
    }
  }, [playSuccess])

  // Toggle sound preferences
  const toggleSounds = useCallback(() => {
    const currentSetting = localStorage.getItem('notificationSounds') !== 'false'
    const newSetting = !currentSetting
    localStorage.setItem('notificationSounds', String(newSetting))
    console.log(`🔊 Notification sounds ${newSetting ? 'enabled' : 'disabled'}`)
    return newSetting
  }, [])

  // Get current sound preference
  const getSoundsEnabled = useCallback(() => {
    return localStorage.getItem('notificationSounds') !== 'false'
  }, [])

  return {
    playNotificationSound,
    playMarkAllReadSound,
    toggleSounds,
    getSoundsEnabled,
    // Individual sound players for manual use
    playNormal,
    playAction,
    playCritical,
    playSuccess,
  }
}
