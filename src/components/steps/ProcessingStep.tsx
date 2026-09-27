"use client"

import { useEffect, useState } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import { medianFilter, enhanceContrast, adaptiveThreshold } from '@/lib/imageProcessing'
import type { PixelData } from "@/lib/imageProcessing"

export default function ProcessingStep() {
    const [isProcessing, setIsProcessing] = useState(true)
    const {uploadedImageUrl, processedImageUrl, setProcessedImageUrl, goNext} = useEditorStore()

    useEffect(() => {
        if (!uploadedImageUrl) return

        async function process() {
            const img = new Image()
            img.src = uploadedImageUrl as string
            await img.decode()

            const maxDimension = 2000
            const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))

            const canvas = document.createElement('canvas')
            canvas.width = Math.round(img.width * scale)
            canvas.height = Math.round(img.height * scale)
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            let pixels: PixelData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            pixels = medianFilter(pixels)
            pixels = enhanceContrast(pixels, 1.5)
            pixels = adaptiveThreshold(pixels, 15)

            ctx.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0)
            setProcessedImageUrl(canvas.toDataURL('image/png'))
            setIsProcessing(false)
        }

        process()
    }, [uploadedImageUrl, setProcessedImageUrl])

    if (isProcessing) return <p>画像を処理しています．．．</p>

    return (
        <div>
            {processedImageUrl && <img src={processedImageUrl} alt="result" className="max-w-xs" />}
            <button onClick={goNext} className="rounded bg-blue-500 px-4 py-2 text-white">
                次へ
            </button>
        </div>
    )
}