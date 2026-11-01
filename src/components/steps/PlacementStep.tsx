'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '@/store/useEditorStore'
import { clampToRange } from '@/lib/geometry'
import type { PlacedImage } from '@/types'

const STAGE_SIZE = 400

export default function PlacementStep() {
  const { processedImageUrl, placedImage, setPlacedImage } = useEditorStore()
  const [image, setImage] = useState<HTMLImageElement | null>(null)
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

  if (!processedImageUrl) return
  if (!image) return <p>読み込んでいます...</p>

  const fitScale =
    Math.min(STAGE_SIZE / image.width, STAGE_SIZE / image.height) * 0.8

  const currentPlacedImage: PlacedImage = placedImage ?? {
    id: crypto.randomUUID(),
    imageUrl: processedImageUrl,
    baseWidth: image.width,
    baseHeight: image.height,
    x: (STAGE_SIZE - image.width * fitScale) / 2,
    y: (STAGE_SIZE - image.height * fitScale) / 2,
    scaleX: fitScale,
    scaleY: fitScale,
    rotation: 0
  }

  return (
    <Stage
      width={STAGE_SIZE}
      height={STAGE_SIZE}
      style={{ border: '1px solid #ccc ' }}
    >
      <Layer>
        <KonvaImage
          ref={shapeRef}
          image={image}
          x={currentPlacedImage.x}
          y={currentPlacedImage.y}
          scaleX={currentPlacedImage.scaleX}
          scaleY={currentPlacedImage.scaleY}
          rotation={currentPlacedImage.rotation}
          draggable
          dragBoundFunc={(pos) => ({
            x: clampToRange(pos.x, 0, STAGE_SIZE - image.width * currentPlacedImage.scaleX),
            y: clampToRange(pos.y, 0, STAGE_SIZE - image.height * currentPlacedImage.scaleY),
          })}
          onDragEnd={(e) => {
            const dragPlacedStatus: PlacedImage = {...currentPlacedImage, x: e.target.x(), y: e.target.y()}
            setPlacedImage(dragPlacedStatus)
          }}
          onTransformEnd={(e) => {
            const transformPlacedStatus: PlacedImage = {...currentPlacedImage, x: e.target.x(), y: e.target.y(), scaleX: e.target.scaleX(), scaleY: e.target.scaleY(), rotation: e.target.rotation()}
            setPlacedImage(transformPlacedStatus)
          }}
        />
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  )
}
