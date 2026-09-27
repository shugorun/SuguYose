"use client"

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useEditorStore } from '@/store/useEditorStore'

export default function uploadStep() {
    const [error, setError] = useState<string | null>(null)
    const { uploadedImageUrl, setUploadedImageUrl, goNext } = useEditorStore()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            setError('JPEGまたはPNG画像を選択してください')
            return
        }
        setError(null)
        setUploadedImageUrl(URL.createObjectURL(file))
    }

    return (
        <div>
            <input type="file" accept="image/jpeg, image/png" onChange={handleChange} />
            {error && <p className='text-red-500'>{error}</p>}
            {uploadedImageUrl && <img src={uploadedImageUrl} alt="プレビュー" className='max-w-xs' />}
            <button onClick={goNext} disabled={uploadedImageUrl === null} className='rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50'>
                次へ
            </button>
        </div>
    )
}

