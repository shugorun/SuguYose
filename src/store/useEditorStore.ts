import { create } from 'zustand'
import type { Template } from '@/types'

type EditorState = {
    template: Template | null
    setTemplate: (t: Template) => void
}

export const useEditorStore = create<EditorState>((set) => ({
    template: null,
    setTemplate: (t) => set({ template: t})
}))