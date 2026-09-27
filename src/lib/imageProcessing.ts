import { imageConfigDefault } from "next/dist/shared/lib/image-config"

export type PixelData = {
    data: Uint8ClampedArray
    width: number
    height: number
}

export function enhanceContrast(image: PixelData, factor: number): PixelData {
    const output = new Uint8ClampedArray(image.data.length)

    for (let i=0; i<image.data.length; i+=4) {
        output[i] = (image.data[i] - 128) * factor + 128
        output[i+1] = (image.data[i+1] - 128) * factor + 128
        output[i+2] = (image.data[i+2] -128) * factor + 128
        output[i+3] = image.data[i+3]
    }

    return { data: output, width: image.width, height: image.height }
}

export function median(values: number[]): number {
    const sorted = values.slice().sort((a,b) => a-b)
    return sorted[Math.floor(sorted.length / 2)]
}

export function medianFilter(image: PixelData, radius: number = 1): PixelData {
    const { data, width, height } = image
    const output = new Uint8ClampedArray(data.length)

    for (let y=0; y<height; y++) {
        for (let x=0; x<width; x++) {
            const rValues: number[] = []
            const gValues: number[] = []
            const bValues: number[] = []

            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = Math.min(width-1, Math.max(0, x + dx))
                    const ny = Math.min(width-1, Math.max(0, y + dy))
                    const i = (ny + width + nx) * 4
                    rValues.push(data[i])
                    gValues.push(data[i+1])
                    bValues.push(data[i+2])
                }
            }

            const i = (y * width + x) * 4
            output[i] = median(rValues)
            output[i+1] = median(gValues)
            output[i+2] = median(bValues)
            output[i+3] = data[i+3]
        }
    }

    return { data: output, width, height}
}

export function adaptiveThreshold(image: PixelData, radius: number = 5, bias: number = 10): PixelData {
    const { data, width, height } = image
    const output = new Uint8ClampedArray(data.length)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0
            let count = 0

            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = Math.min(width - 1, Math.max(0, x + dx))
                    const ny = Math.min(width - 1, Math.max(0, y + dy))
                    const i = (ny * width + nx) * 4
                    sum += (data[i] + data[i+1] + data[i+2]) / 3
                    count++
                }
            }

            const localAverage = sum / count
            const i = (y * width + x) * 4
            const brightness = (data[i] + data[i+1] + data[i+2]) / 3
            const isInk = brightness < localAverage - bias

            output[i] = data[i]
            output[i+1] = data[i+1]
            output[i+2] = data[i+2]
            output[i+3] = isInk ? 255 : 0
        }
    }

    return { data: output, width, height}
}