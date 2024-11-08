/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

import { PhotoIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { FileUploader } from "react-drag-drop-files";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeViewer from "@/components/code-viewer";
import { AnimatePresence, motion } from "framer-motion";
import ShimmerButton from "@/components/ui/shimmerbutton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingDots from "@/components/loading-dots";
import { readStream } from "@/lib/utils";

export default function UploadComponent() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "uploaded" | "creating" | "created"
  >("initial");
  const [model, setModel] = useState("gemini-1.5-pro");
  const [generatedCode, setGeneratedCode] = useState("");
  const [shadcn, setShadcn] = useState(true);
  const [buildingMessage, setBuildingMessage] = useState("Reading the image...");

  const loading = status === "creating";

  const loadingMessages = [
    "Analyzing the image...",
    "Identifying UI components...",
    "Generating React components...",
    "Applying Tailwind styles...",
    "Building your app...",
    "Almost there..."
  ];

  useEffect(() => {
    if (status === "creating") {
      let messageIndex = 0;
      const interval = setInterval(() => {
        setBuildingMessage(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const handleFileChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      setStatus("uploading");
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.url);
      setStatus("uploaded");
    } catch (error) {
      console.error('Upload error:', error);
      setStatus("initial");
    }
  };

  async function createApp() {
    setStatus("creating");
    setGeneratedCode("");
    setBuildingMessage(loadingMessages[0]);

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
      });

      if (!res.ok) throw new Error(res.statusText);
      if (!res.body) throw new Error("No response body");

      for await (const chunk of readStream(res.body)) {
        setGeneratedCode((prev) => prev + chunk);
      }

      setStatus("created");
    } catch (error) {
      console.error("Generation error:", error);
      setStatus("uploaded");
    }
  }

  function handleSampleImage() {
    setImageUrl(
      "https://napkinsdev.s3.us-east-1.amazonaws.com/next-s3-uploads/be191fc8-149b-43eb-b434-baf883986c2c/appointment-booking.png"
    );
    setStatus("uploaded");
  }

  return (
    <div className="flex justify-center mt-5 mx-10 gap-5 sm:flex-row flex-col grow bg-gray-900">
        <div className="w-full max-w-xs gap-4 flex flex-col mx-auto">
        {imageUrl ? (
          <div className="relative mt-2">
            <div className="rounded-xl">
              <img
                alt="Screenshot"
                src={imageUrl}
                className="w-full group object-cover relative"
              />
            </div>
            <button 
              className="absolute size-10 text-gray-100 bg-gray-800 hover:text-gray-300 rounded-full -top-3 z-10 -right-3"
              onClick={() => {
                setImageUrl("");
                setStatus("initial");
              }}
            >
              <XCircleIcon />
            </button>
          </div>
        ) : (
          <>
            <FileUploader
              handleChange={handleFileChange}
              name="file"
              label="Upload or drop an image here"
              types={["png", "jpg", "jpeg"]}
              required={true}
              multiple={false}
              hoverTitle="Drop here"
            >
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 cursor-pointer bg-gray-800">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-500"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-300">
                    <label
                      htmlFor="file-upload"
                      className="relative rounded-md bg-gray-800 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-gray-200"
                    >
                      <div>Upload a screenshot</div>
                      <p className="font-normal text-gray-400 text-xs mt-1">
                        or drag and drop
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </FileUploader>
            <div className="text-center">
              <button
                className="font-medium text-blue-500 text-sm underline decoration-transparent hover:decoration-blue-400 decoration-2 underline-offset-4 transition hover:text-blue-400"
                onClick={handleSampleImage}
              >
                Need an example image? Try ours.
              </button>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 text-white">
          <label className="whitespace-nowrap">AI Model:</label>
          <Select value={model} onValueChange={setModel} defaultValue={model}>
            <SelectTrigger className="bg-gray-800 text-white border-gray-700">
              <img src="/meta.svg" alt="Meta" className="size-5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="gemini-1.5-pro">
                Gemini 1.5 Pro
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ShimmerButton
                  className="shadow-2xl disabled:cursor-not-allowed w-full relative disabled:opacity-50 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600"
                  onClick={createApp}
                  disabled={
                    status === "initial" ||
                    status === "uploading" ||
                    status === "creating"
                  }
                >
                  <span
                    className={`${
                      loading ? "opacity-0" : "opacity-100"
                    } whitespace-pre-wrap text-center font-semibold leading-none tracking-tight text-white`}
                  >
                    Generate app
                  </span>

                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <LoadingDots color="#fff" style="medium" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </TooltipTrigger>

            {status === "initial" && (
              <TooltipContent className="bg-gray-800 text-white">
                <p>Please upload an image first</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      {status === "initial" ||
      status === "uploading" ||
      status === "uploaded" ? (
        <div className="flex-1 w-full flex-col flex justify-center items-center text-center mx-auto">
          <div className="max-w-xl text-center">
            <div className="flex gap-4 justify-center mb-6">
              <img src="/before.png" alt="Before" className="w-48 h-48 object-contain" />
              <img src="/after.png" alt="After" className="w-48 h-48 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-balance tracking-tight text-white">
              Transform Your Design Vision into Reality
            </h1>
            <div className="max-w-md text-center mx-auto">
              <p className="text-lg text-gray-400 mt-4 text-center">
                Simply upload your design mockup and watch as we transform it into
                a fully functional React application with Tailwind styling.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 w-full h-[80vh] overflow-x-hidden">
          <div className="isolate h-full">
            <CodeViewer code={generatedCode} showEditor />
          </div>

          <AnimatePresence>
            {status === "creating" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.5
                }}
                className="absolute inset-x-0 bottom-0 top-1/2 flex flex-col gap-8 items-center justify-center rounded-xl backdrop-blur-2xl bg-black/60 border border-white/10 md:inset-y-0 md:left-1/2 md:right-0"
              >
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 rounded-full border-4 border-purple-500/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 w-20 h-20 rounded-full border-4 border-blue-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>

                <motion.div
                  className="space-y-3 text-center px-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.p 
                    className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={buildingMessage}
                  >
                    {buildingMessage}
                  </motion.p>
                  <p className="text-gray-400 text-sm">Please wait while we process your design</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    
    </div>
  );
}
