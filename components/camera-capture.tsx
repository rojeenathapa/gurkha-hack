"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, RotateCcw, Download, X, AlertCircle, Smartphone, Monitor, RefreshCw } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment")
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(isMobileDevice)
      console.log('Device detected:', isMobileDevice ? 'Mobile' : 'Desktop')
    }
    checkMobile()
  }, [])

  // Get available camera devices
  const getAvailableDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setAvailableDevices(videoDevices)
      console.log('Available video devices:', videoDevices.map(d => ({ id: d.deviceId, label: d.label })))
      return videoDevices
    } catch (err) {
      console.log('Could not enumerate devices:', err)
      return []
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setError("")
      setIsLoading(true)
      
      // Add timeout to prevent getting stuck
      const timeoutId = setTimeout(() => {
        console.log('Camera initialization timeout')
        setIsLoading(false)
        setError("Camera initialization timed out. Please try again.")
      }, 10000) // 10 second timeout
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        clearTimeout(timeoutId)
        throw new Error("Camera is not supported in this browser")
      }

      // Check if we're on HTTPS (required for camera access)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        clearTimeout(timeoutId)
        throw new Error("Camera access requires HTTPS or localhost")
      }

      // Get available devices first
      const devices = await getAvailableDevices()
      
      // Stop any existing stream
      if (stream) {
        stopCamera()
      }

      // Define camera constraints based on device type
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: isMobile ? 1280 : 1920 },
          height: { ideal: isMobile ? 720 : 1080 },
          frameRate: { ideal: 30 },
          // Add stability constraints to prevent flickering
          aspectRatio: { ideal: 16/9 },
          resizeMode: 'none'
        },
        audio: false,
      }

      console.log('Starting camera with constraints:', constraints)

      // Request camera access
      console.log('Requesting camera access...')
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Camera access granted, stream received:', mediaStream)
      
      if (videoRef.current) {
        console.log('Setting up video element...')
        // Set video properties before setting srcObject
        videoRef.current.autoplay = true
        videoRef.current.playsInline = true
        videoRef.current.muted = true
        
        // Set the stream
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        
        // Wait for video to be ready
        console.log('Waiting for video to be ready...')
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
        }
        
        console.log('Video is playing, setting camera state...')
        clearTimeout(timeoutId)
        setIsCameraOn(true)
        setIsLoading(false)
        console.log('Camera started successfully')
      } else {
        console.error('Video ref is null')
        clearTimeout(timeoutId)
        setError("Video element not found")
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Camera access error:", err)
      clearTimeout(timeoutId)
      setIsLoading(false)
      
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera permissions in your browser and try again.")
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.")
      } else if (err.name === "NotSupportedError") {
        setError("Camera is not supported in this browser.")
      } else if (err.message.includes("HTTPS")) {
        setError("Camera access requires HTTPS. Please use a secure connection.")
      } else if (err.name === "OverconstrainedError") {
        // Try with more relaxed constraints
        console.log('Trying with relaxed constraints...')
        try {
          const relaxedStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacing },
            audio: false
          })
          if (videoRef.current) {
            videoRef.current.srcObject = relaxedStream
            setStream(relaxedStream)
            setIsCameraOn(true)
            setIsLoading(false)
            console.log('Camera started with relaxed constraints')
            return
          }
        } catch (relaxedErr) {
          console.error('Relaxed constraints also failed:', relaxedErr)
        }
        setError("Camera constraints not supported. Please try a different device or browser.")
      } else {
        setError(`Unable to access camera: ${err.message || "Unknown error"}`)
      }
    }
  }, [cameraFacing, isMobile, getAvailableDevices])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
      setStream(null)
      setIsCameraOn(false)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const switchCamera = useCallback(async () => {
    if (isMobile && availableDevices.length > 1) {
      setCameraFacing(prev => prev === "user" ? "environment" : "user")
      // Restart camera with new facing mode
      await startCamera()
    }
  }, [isMobile, availableDevices.length])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && isCameraOn) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob with high quality
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a file from the blob
            const file = new File([blob], `captured-${Date.now()}.jpg`, {
              type: "image/jpeg",
            })
            
            // Convert to data URL for preview
            const reader = new FileReader()
            reader.onload = (e) => {
              setCapturedImage(e.target?.result as string)
            }
            reader.readAsDataURL(blob)
          }
        }, "image/jpeg", 0.9)
      } else {
        setError("Camera not ready. Please wait a moment and try again.")
      }
    } else {
      setError("Camera is not ready. Please wait for it to initialize.")
    }
  }, [isCameraOn])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setError("")
    if (!isCameraOn) {
      startCamera()
    }
  }, [isCameraOn, startCamera])

  const usePhoto = useCallback(() => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `captured-${Date.now()}.jpg`, {
            type: "image/jpeg",
          })
          onCapture(file)
          stopCamera()
        }
      }, "image/jpeg", 0.9)
    }
  }, [capturedImage, onCapture, stopCamera])

  const handleClose = useCallback(() => {
    stopCamera()
    onClose()
  }, [stopCamera, onClose])

  // Start camera when component mounts
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            Take Photo
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
            
            {/* Helpful instructions for common issues */}
            {error.includes("permissions") && (
              <div className="mt-3 p-2 bg-slate-800/50 rounded border border-slate-700">
                <p className="text-xs text-slate-300 mb-2">To fix camera permissions:</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Look for a camera icon in your browser's address bar</li>
                  <li>• Click it and select "Allow" for camera access</li>
                  <li>• Refresh the page and try again</li>
                </ul>
              </div>
            )}
            
            <div className="flex gap-2 mt-3">
              <Button
                onClick={startCamera}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Camera
              </Button>
              
              {/* Fallback to file upload */}
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      onCapture(file)
                    }
                  }
                  input.click()
                }}
              >
                Upload Instead
              </Button>
            </div>
          </div>
        )}

        {!capturedImage ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
                style={{ 
                  transform: cameraFacing === "user" ? 'scaleX(-1)' : 'none',
                  filter: cameraFacing === "user" ? 'none' : 'none'
                }}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                    <p>Starting camera...</p>
                  </div>
                </div>
              )}
              {!isLoading && !isCameraOn && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center text-slate-400">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera not ready</p>
                  </div>
                </div>
              )}
              
              {/* Camera status indicator */}
              {isCameraOn && (
                <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              )}

              {/* Device info */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 rounded text-xs text-slate-300">
                {isMobile ? 'Mobile' : 'Desktop'} • {cameraFacing === 'user' ? 'Front' : 'Back'}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                disabled={!isCameraOn || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isLoading ? "Starting..." : "Capture Photo"}
              </Button>
              
              {/* Switch camera button (only show on mobile with multiple cameras) */}
              {isMobile && availableDevices.length > 1 && (
                <Button
                  onClick={switchCamera}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Camera test info */}
            {isCameraOn && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 text-center">
                  Camera is working! You should see your camera feed above. Click "Capture Photo" to take a picture.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={usePhoto}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Use Photo
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}
