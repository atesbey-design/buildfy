'use client'

import { useEffect, useState } from "react"
import { PhotoIcon, XCircleIcon } from "@heroicons/react/20/solid"
import { FileUploader } from "react-drag-drop-files"
import { Sparkles } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CodeViewer from "@/components/code-viewer"
import { AnimatePresence, motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { readStream } from "@/lib/utils"

export default function UploadComponent() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<
    "initial" | "uploading" | "uploaded" | "creating" | "created"
  >("initial")
  const [model, setModel] = useState("gemini-1.5-pro")
  const [generatedCode, setGeneratedCode] = useState("")
  const [shadcn, setShadcn] = useState(true)
  const [buildingMessage, setBuildingMessage] = useState("Reading the image...")

  const loading = status === "creating"

  const loadingMessages = [
    "Analyzing the image...",
    "Identifying UI components...", 
    "Generating React components...",
    "Applying Tailwind styles...",
    "Building your app...",
    "Almost there..."
  ]

  useEffect(() => {
    if (status === "creating") {
      let messageIndex = 0
      const interval = setInterval(() => {
        setBuildingMessage(loadingMessages[messageIndex])
        messageIndex = (messageIndex + 1) % loadingMessages.length
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [status])

  const handleFileChange = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      setStatus("uploading")
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setImageUrl(data.url)
      setStatus("uploaded")
    } catch (error) {
      console.error('Upload error:', error)
      setStatus("initial")
    }
  }

  async function createApp() {
    setStatus("creating")
    setGeneratedCode("")
    setBuildingMessage(loadingMessages[0])

    try {
      const res = await fetch("/api/generateCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          shadcn,
          imageUrl,
        }),
      })

      if (!res.ok) throw new Error(res.statusText)
      if (!res.body) throw new Error("No response body")

      for await (const chunk of readStream(res.body)) {
        setGeneratedCode((prev) => prev + chunk)
      }

      setStatus("created")
    } catch (error) {
      console.error("Generation error:", error)
      setStatus("uploaded")
    }
  }

  function handleSampleImage() {
    setImageUrl(
      "https://napkinsdev.s3.us-east-1.amazonaws.com/next-s3-uploads/be191fc8-149b-43eb-b434-baf883986c2c/appointment-booking.png"
    )
    setStatus("uploaded")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-800 p-4 sm:p-8">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#f0f9ff,transparent)]" />
        <div className="absolute inset-0 bg-[length:50px_50px] bg-grid-blue-100/30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:gap-8">
          <div className="space-y-4 sm:space-y-6">
            {imageUrl ? (
              <div className="relative mt-2">
                <div className="rounded-xl overflow-hidden max-h-[300px] sm:max-h-[400px] shadow-lg">
                  <img
                    alt="Screenshot"
                    src={imageUrl}
                    className="w-full h-full object-contain"
                  />
                </div>
                <button 
                  className="absolute size-8 text-gray-600 bg-white hover:text-gray-800 rounded-full -top-2 z-10 -right-2 flex items-center justify-center shadow-md transition-all hover:shadow-lg"
                  onClick={() => {
                    setImageUrl(undefined)
                    setStatus("initial")
                  }}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <FileUploader
                handleChange={handleFileChange}
                name="file"
                types={["png", "jpg", "jpeg"]}
                multiple={false}
              >
                <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-blue-200 px-4 sm:px-6 py-8 sm:py-10 cursor-pointer bg-white/80 backdrop-blur-sm transition-colors hover:bg-blue-50/80 shadow-sm">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-400"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Upload a screenshot</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </FileUploader>
            )}

            {!imageUrl && (
              <div className="text-center">
                <button
                  className="font-medium text-blue-600 text-sm underline decoration-transparent hover:decoration-blue-600 decoration-2 underline-offset-4 transition hover:text-blue-500"
                  onClick={handleSampleImage}
                >
                  Need an example image? Try ours.
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-gray-800">
              <label className="whitespace-nowrap font-medium">AI Model:</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-full sm:w-auto bg-white text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50">
                  <img src="/meta.svg" alt="Meta" className="size-5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800 border-gray-200">
                  <SelectItem value="gemini-1.5-pro">
                    Gemini 1.5 Pro
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy ${(status === "initial" || status === "uploading" || status === "creating") ? "hidden" : ""}`}></div>
                    <button
                      onClick={createApp}
                      disabled={status === "initial" || status === "uploading" || status === "creating"}
                      className="relative flex items-center justify-center gap-2 rounded-full bg-white px-4 sm:px-6 py-3 w-full text-gray-800 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      )}
                      Generate app
                    </button>
                  </div>
                </TooltipTrigger>

                {status === "initial" && (
                  <TooltipContent className="bg-white text-gray-800 border-gray-200 shadow-md">
                    <p>Please upload an image first</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-1">
            {status === "initial" || status === "uploading" || status === "uploaded" ? (
              <div className="flex flex-col justify-center items-center text-center h-full py-8">
                <div className="max-w-xl px-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <img src="/before.png" alt="Before" className="w-full sm:w-48 h-auto sm:h-48 object-contain rounded-lg border border-gray-200 shadow-md" />
                    <img src="/after.png" alt="After" className="w-full sm:w-48 h-auto sm:h-48 object-contain rounded-lg border border-gray-200 shadow-md" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 mb-4">
                    Transform Your Design Vision into Reality
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600">
                    Simply upload your design mockup and watch as we transform it into
                    a fully functional React application with Tailwind styling.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative h-[60vh] sm:h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-lg">
                <CodeViewer code={generatedCode} showEditor />

                <AnimatePresence>
                  {status === "creating" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex flex-col gap-6 sm:gap-8 items-center justify-center rounded-lg backdrop-blur-xl bg-white/95 border border-gray-200 p-4"
                    >
                      <div className="relative">
                        <motion.div
                          className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-4 border-indigo-200"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 1]
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 w-16 sm:w-20 h-16 sm:h-20 rounded-full border-4 border-blue-500 border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </div>

                      <motion.div
                        className="space-y-3 text-center px-4 sm:px-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.p 
                          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          key={buildingMessage}
                        >
                          {buildingMessage}
                        </motion.p>
                        <p className="text-gray-600 text-xs sm:text-sm">Please wait while we process your design</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}