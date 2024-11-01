"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ChevronRight, Lock, Timer, Calendar, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Features from './features'

export default function Home() {
  const [showFeatures, setShowFeatures] = useState(false)
  const scrollRef = useRef(null)
  const { scrollY } = useScroll()
  const [scrollResistance, setScrollResistance] = useState(0)

  // Smooth scroll with resistance
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    mass: 1 + scrollResistance
  })

  // Increase resistance as user scrolls
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollResistance(Math.min(latest / 1000, 2))
    })
  }, [scrollY])

  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  }

  useEffect(() => {
    const audio = new Audio('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sound_effect_1%20(1)-XyxJBPe98a7iOVTFASuC3hho5ZzLgy.mp3')
    audio.play().catch(error => {
      console.error('Audio playback failed:', error)
    })

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const features = [
    {
      icon: Lock,
      title: "Smart Site Blocking",
      description: "Block distracting websites with custom schedules and patterns"
    },
    {
      icon: Timer,
      title: "Focus Timer",
      description: "Customizable Pomodoro timer with break reminders"
    },
    {
      icon: Calendar,
      title: "Habit Tracking",
      description: "Build and maintain productive habits with streak tracking"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Detailed insights into your focus patterns and productivity"
    }
  ]

  if (showFeatures) {
    return <Features />
  }

  return (
    <motion.div
      ref={scrollRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#1a2f1a]"
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, rgba(103, 58, 183, 0.1) 25%, rgba(38, 87, 40, 0.1) 50%, rgba(26, 47, 26, 0) 100%)',
        backgroundSize: '200% 200%',
        y: smoothY
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#673AB7]">
          Welcome to FocusForge
        </h1>
        <p className="text-xl mb-12 text-[#A5D6A7] max-w-md mx-auto">
          Forge your focus with military precision and cosmic creativity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-[#2a3f2a]/50 p-6 rounded-xl backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/40 transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 mb-4 text-[#4CAF50]" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-[#A5D6A7]">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={() => setShowFeatures(true)}
          size="lg"
          className="bg-gradient-to-r from-[#4CAF50] to-[#673AB7] text-white hover:from-[#45a049] hover:to-[#5e35b1] transition-all duration-300 transform hover:scale-105 shadow-lg rounded-full px-8 py-3"
        >
          Explore Features
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>

        <motion.div
          className="mt-8 text-[#A5D6A7] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Scroll down to experience our adaptive scroll resistance technology
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2f1a]/20 via-[#4CAF50]/20 to-[#673AB7]/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-32"
        initial={{ y: '100%' }}
        animate={{ y: ['100%', '0%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'loop' }}
        style={{
          background: 'linear-gradient(to right, rgba(76, 175, 80, 0.1), rgba(103, 58, 183, 0.1))',
          clipPath: 'url(#wave)',
        }}
      />

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <defs>
          <clipPath id="wave">
            <path
              d="M0,0 C240,80 480,120 720,120 C960,120 1200,80 1440,0 L1440,120 L0,120 Z"
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
    </motion.div>
  )
}