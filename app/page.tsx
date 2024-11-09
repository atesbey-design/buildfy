'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Github, Twitter, Upload, Sparkles, ChevronDown, Zap, Code, Cpu, Star, Heart, Rocket, ArrowRight, Globe, Shield, Users, MessageSquare, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInView } from "react-intersection-observer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Generate apps in seconds with our optimized AI engine", color: "text-yellow-500" },
  { icon: Code, title: "Clean Code", description: "Get production-ready React components with modern best practices", color: "text-blue-500" },
  { icon: Cpu, title: "AI Powered", description: "Leveraging cutting-edge AI models for intelligent code generation", color: "text-purple-500" },
  { icon: Star, title: "Premium Quality", description: "Enterprise-grade code that scales with your needs", color: "text-pink-500" },
  { icon: Heart, title: "User-Centric", description: "Designed with developers in mind for the best experience", color: "text-red-500" },
  { icon: Rocket, title: "Future-Ready", description: "Stay ahead with next-gen web development tools", color: "text-green-500" },
  { icon: Globe, title: "Cross-Platform", description: "Build once, deploy everywhere with universal compatibility", color: "text-indigo-500" },
  { icon: Shield, title: "Secure by Default", description: "Enterprise-level security built into every component", color: "text-slate-500" },
  { icon: Users, title: "Team Collaboration", description: "Built for teams with real-time collaboration features", color: "text-orange-500" },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Developer", 
    company: "TechCorp",
    image: "https://i.pravatar.cc/100?img=1",
    content: "Buildfy has revolutionized our development workflow. What used to take days now takes hours."
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLabs", 
    image: "https://i.pravatar.cc/100?img=2",
    content: "The AI-powered code generation is incredibly accurate and saves us countless hours."
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Lead",
    company: "DesignMaster",
    image: "https://i.pravatar.cc/100?img=3", 
    content: "The quality of generated components is outstanding. It's like having an extra developer on the team."
  }
]

const demoImage = "/demo.png"
const demoCode = `
import React from 'react';
import { motion } from 'framer-motion';

export default function DemoComponent() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Demo
      </h2>
      <p className="text-gray-600 mb-6">
        This is a demo component generated from your design.
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          Get Started
        </button>
        <button className="px-6 py-2 border border-gray-300 rounded-lg">
          Learn More
        </button>
      </div>
    </motion.div>
  );
}`

export default function Component() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>("/demo.png")
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    setUploadedImage(demoImage)
    setShowDemo(true)
  }, [])

  useEffect(() => {
    if (showDemo) {
      const timer = setTimeout(() => {
        setIsLoading(true)
        setTimeout(() => {
          setGeneratedCode(demoCode)
          setIsLoading(false)
        }, 2000)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showDemo])

  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()  
    setIsDragging(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setShowDemo(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGeneratedCode(demoCode)
    setIsLoading(false)
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 text-gray-900">
      {/* Enhanced Animated background with particles */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(56,189,248,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[length:50px_50px] bg-grid-gray-200/50 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.1), transparent)",
              "radial-gradient(circle at 0% 100%, rgba(99,102,241,0.1), transparent)",
              "radial-gradient(circle at 100% 0%, rgba(236,72,153,0.1), transparent)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {/* Floating particles */}
        {typeof window !== 'undefined' && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sky-500/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500">
              Design to Code Magic
            </h1>
          </motion.div>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Transform your designs into production-ready React components instantly with our AI-powered platform.
            <span className="block mt-2 text-base sm:text-lg text-gray-500">
              No coding experience required - just upload your design and let AI do the magic!
            </span>
          </motion.p>
          
          <motion.div 
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => window.location.href = '/buildfy'}
              >
                Start Creating Now
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full border-2 hover:bg-gray-50/80 hover:border-indigo-500/50 flex items-center justify-center gap-3 backdrop-blur-sm transition-all duration-300 group"
                onClick={toggleVideo}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-indigo-500 group-hover:text-indigo-600"
                >
                  {isPlaying ? 
                    <Pause className="h-5 w-5 drop-shadow-md" /> : 
                    <Play className="h-5 w-5 drop-shadow-md" />
                  }
                </motion.div>
                <span className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent group-hover:opacity-80">
                  Watch Demo
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Demo Video Section */}
          <motion.div 
            className="mt-16 sm:mt-24 relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <video
              ref={videoRef}
              className="w-full rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)]"
              poster="/hero.svg"
              onClick={toggleVideo}
              muted
            >
              <source src="/demo.mov" type="video/mp4"  />
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleVideo}
              >
                <motion.div
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="h-8 w-8 text-purple-600" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring" }}>
              <Badge variant="secondary" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-md">
                ⚡️ 10x Faster Development
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring" }}>
              <Badge variant="secondary" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-md">
                🛡️ Enterprise Ready
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring" }}>
              <Badge variant="secondary" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-md">
                🌟 4.9/5 Rating (2000+ Reviews)
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring" }}>
              <Badge variant="secondary" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-md">
                🔒 100% Secure & Private
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Upload Section */}
          <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
            <Card
              className={`relative overflow-hidden border-2 ${
                isDragging ? "border-sky-500 scale-[1.02]" : "border-gray-200"
              } bg-white/90 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl rounded-2xl`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <motion.div 
                className="p-6 sm:p-12 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center min-h-[300px] sm:min-h-[400px]"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {uploadedImage ? (
                  <motion.img 
                    src={uploadedImage} 
                    alt="Uploaded design" 
                    className="max-w-full max-h-[200px] sm:max-h-[300px] object-contain rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                ) : (
                  <motion.div
                    className="flex flex-col items-center gap-4 sm:gap-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="rounded-full bg-sky-100 p-4 sm:p-6"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(56,189,248,0.4)",
                          "0 0 0 20px rgba(56,189,248,0)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-sky-500" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                        Drag & Drop Your Design
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600">
                        Support for Figma, Sketch, or any image format
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </Card>

            <div className="space-y-4">
              <Select defaultValue="gemini">
                <SelectTrigger className="w-full bg-white/90 backdrop-blur-xl border-2 border-gray-200 text-gray-900 h-12 sm:h-14 text-base sm:text-lg rounded-xl">
                  <SelectValue placeholder="Select AI Model" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-2 border-gray-200 text-gray-900">
                  <SelectItem value="gemini">
                    <div className="flex items-center gap-2">
                      <img src="/gemini.png" alt="Gemini" className="w-4 h-4" />
                      Gemini 1.5 Pro
                    </div>
                  </SelectItem>
                  <SelectItem value="gemini-pro">
                    <div className="flex items-center gap-2">
                      <img src="/meta.svg" alt="Meta Llama" className="w-4 h-4" />
                      Meta Llama 3.1
                    </div>
                  </SelectItem>
                  <SelectItem value="gpt4">GPT-4</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !uploadedImage}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold relative overflow-hidden group bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 hover:from-sky-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    {isLoading ? "Generating..." : "Generate App"}
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {generatedCode ? (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 border-gray-200 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-2 sm:mb-0">
                      Generated Code
                    </h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          📋 Copy
                        </motion.div>
                      </Button>
                      <Button size="sm" variant="outline">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          ⬇️ Download
                        </motion.div>
                      </Button>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <pre className="bg-gray-50 p-4 sm:p-6 rounded-xl text-xs sm:text-sm overflow-x-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-xl"
                >
                  <Tabs defaultValue="how-it-works" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
                      <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                    </TabsList>
                    <TabsContent value="how-it-works">
                      <motion.div 
                        className="grid grid-cols-1 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {[
                          {
                            icon: "🎨",
                            title: "Upload Design",
                            description: "Drag & drop your design file"
                          },
                          {
                            icon: "🤖",
                            title: "AI Processing",
                            description: "Our AI analyzes your design"
                          },
                          {
                            icon: "⚡",
                            title: "Code Generation",
                            description: "Get production-ready code"
                          },
                          {
                            icon: "🚀",
                            title: "Deploy",
                            description: "Use the code in your project"
                          }
                        ].map((step, index) => (
                          <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl hover:scale-105 transition-transform duration-300"
                          >
                            <div className="text-2xl">{step.icon}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{step.title}</h4>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                    <TabsContent value="features">
                      <motion.div 
                        className="grid grid-cols-2 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {[
                          {
                            icon: "🎨",
                            title: "Design Recognition",
                            color: "bg-pink-100"
                          },
                          {
                            icon: "⚡",
                            title: "Real-time Preview",
                            color: "bg-yellow-100"
                          },
                          {
                            icon: "📱",
                            title: "Responsive",
                            color: "bg-green-100"
                          },
                          {
                            icon: "🔄",
                            title: "Version Control",
                            color: "bg-blue-100"
                          }
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`${feature.color} p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300`}
                          >
                            <div className="text-2xl mb-2">{feature.icon}</div>
                            <div className="font-semibold">{feature.title}</div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.section 
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-12 sm:py-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Why Choose Buildfy?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className={`bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  activeFeature === index ? 'ring-2 ring-sky-500' : ''
                }`}
              >
                <feature.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${feature.color} mb-4 sm:mb-6`} />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="py-12 sm:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-xl"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 italic">{testimonial.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 opacity-90">Get the latest updates and exclusive offers directly in your inbox.</p>
            <div className="flex max-w-md mx-auto gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-indigo-500 hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 border-t border-gray-200 py-12 text-gray-600 bg-white/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Button variant="link">Features</Button></li>
                <li><Button variant="link">Pricing</Button></li>
                <li><Button variant="link">Documentation</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Button variant="link">About</Button></li>
                <li><Button variant="link">Blog</Button></li>
                <li><Button variant="link">Careers</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Button variant="link">Community</Button></li>
                <li><Button variant="link">Help Center</Button></li>
                <li><Button variant="link">Partners</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Button variant="link">Privacy Policy</Button></li>
                <li><Button variant="link">Terms of Service</Button></li>
                <li><Button variant="link">Cookie Policy</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
            <motion.p 
              className="text-sm mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              © 2024 Buildfy. All rights reserved.
            </motion.p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </Button>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <Github className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
