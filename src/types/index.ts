export type Template = 
    | {kind: 'preset'; id: string; name: string; widthMm: number; heightMm: number }
    | {kind: 'custom'; widthMm: number; heightMm: number }

export type PlacedImage = {
    id: string
    imageUrl: string
    baseWidth: number
    baseHeight: number
    x: number
    y: number
    scaleX: number
    scaleY: number
    rotation: number
}