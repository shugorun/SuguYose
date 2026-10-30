"use client"

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '@/store/useEditorStore'

const STAGE_SIZE = 400

export default function PlacementStep() {
    const { processedImageUrl } = useEditorStore()
    const [image, setImage ] = useState<HTMLImageElement | null>(null)
    const shapeRef = useRef<Konva.Image>(null)
    const transformerRef = useRef<Konva.Transformer>(null)

    useEffect(() => {
        if (!processedImageUrl) return
        const img = new Image()
        img.src = processedImageUrl
        img.onload = () => setImage(img)
    }, [processedImageUrl])

    useEffect(() => {
        if (shapeRef.current && transformerRef.current) {
            transformerRef.current.nodes([shapeRef.current])
        }
    }, [image])

    if (!image) return <p>読み込んでいます...</p>

    const fitScale = Math.min(STAGE_SIZE / image.width, STAGE_SIZE / image.height) * 0.8
    const x = (STAGE_SIZE - image.width * fitScale) / 2
    const y = (STAGE_SIZE - image.height * fitScale) / 2

    return (
        <Stage width={STAGE_SIZE} height={STAGE_SIZE} style={{ border: '1px solid #ccc '}}>
            <Layer>
                <KonvaImage ref={shapeRef} image={image} x={x} y={y} scaleX={fitScale} scaleY={fitScale} draggable />
                <Transformer ref={transformerRef} />
            </Layer>
        </Stage>
    )
}