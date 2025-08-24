"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react"
import CameraCapture from "./camera-capture"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
}

export default function ImageUpload({ onImageSelect, selectedFile, onClear }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [onImageSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleCameraCapture = useCallback((file: File) => {
    handleFileSelect(file)
    setShowCamera(false)
  }, [handleFileSelect])

  const handleClear = useCallback(() => {
    onClear()
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onClear])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const openCamera = useCallback(() => {
    setShowCamera(true)
  }, [])

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-500/50 bg-blue-500/5"
              : "border-slate-700 hover:border-blue-500/50 bg-slate-800/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-400 hover:underline">Click to upload</span>
                    <span className="text-sm text-slate-400"> or drag and drop</span>
                  </Label>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-px h-12 bg-slate-600" />
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={openCamera}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Use Camera
                  </Button>
                  <p className="text-xs text-slate-500">Take a photo</p>
                </div>
              </div>
            </div>
          </div>
          
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                onClick={handleClear}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-slate-600"
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={openFileDialog}
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Different Image
            </Button>
            <Button
              onClick={openCamera}
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take New Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
