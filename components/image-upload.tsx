"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ImageIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface ImageUploadProps {
  requestId?: string
  maxFiles?: number
  onUpload?: (urls: string[]) => void
  existingImages?: string[]
}

export function ImageUpload({ requestId, maxFiles = 5, onUpload, existingImages = [] }: ImageUploadProps) {
  const { language } = useLanguage()
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const validFiles: File[] = []
      const errors: string[] = []

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: ${language === "ar" ? "نوع الملف غير مدعوم" : "Unsupported file type"}`)
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: ${language === "ar" ? "حجم الملف كبير جداً" : "File too large"}`)
          return
        }
        if (validFiles.length + images.length < maxFiles) {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        setUploadError(errors.join(", "))
        setTimeout(() => setUploadError(null), 5000)
      }

      if (validFiles.length > 0) {
        setImages((prev) => [...prev, ...validFiles])
        setUploadError(null)
      }
    },
    [images.length, maxFiles, language],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles],
  )

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeUploadedImage = (index: number) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async () => {
    if (images.length === 0) return

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    const uploadPromises = images.map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      if (requestId) formData.append("requestId", requestId)
      formData.append("imageType", "request")

      const response = await fetch("/api/maintenance/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const result = await response.json()
      return result.url
    })

    try {
      const urls = await Promise.all(uploadPromises)
      setUploadedUrls((prev) => [...prev, ...urls])
      setImages([])
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
      onUpload?.(urls)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(
        error instanceof Error ? error.message : language === "ar" ? "فشل في رفع الصور" : "Failed to upload images",
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{uploadError}</span>
        </motion.div>
      )}

      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
        >
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{language === "ar" ? "تم رفع الصور بنجاح!" : "Images uploaded successfully!"}</span>
        </motion.div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-yellow-400 bg-yellow-50" : "border-gray-300 hover:border-gray-400"
        } ${images.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          id="image-upload"
          disabled={images.length >= maxFiles}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${images.length >= maxFiles ? "cursor-not-allowed" : ""}`}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {images.length >= maxFiles
              ? language === "ar"
                ? "تم الوصول للحد الأقصى من الصور"
                : "Maximum number of images reached"
              : language === "ar"
                ? "اسحب الصور هنا أو انقر للاختيار"
                : "Drag images here or click to select"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {language === "ar"
              ? `حد أقصى ${maxFiles} صور، كل صورة أقل من 5 ميجابايت`
              : `Max ${maxFiles} images, each under 5MB`}
          </p>
        </label>
      </div>

      {/* Preview Images */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{language === "ar" ? "الصور المحددة" : "Selected Images"}</h4>
              <Button
                onClick={uploadImages}
                disabled={uploading || images.length === 0}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading
                  ? language === "ar"
                    ? "جاري الرفع..."
                    : "Uploading..."
                  : language === "ar"
                    ? "رفع"
                    : "Upload"}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Images */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {language === "ar" ? "الصور المرفوعة" : "Uploaded Images"}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {uploadedUrls.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeUploadedImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
