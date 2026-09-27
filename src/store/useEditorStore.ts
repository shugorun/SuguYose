import { create } from 'zustand'
import { Template} from '@/types'

export type Step = 'template' | 'instruction' | 'upload' | 'processing' | 'placement' | 'export'

const STEPS: Step[] = ['template', 'instruction', 'upload', 'processing', 'placement', 'export']

type EditorState = {
    step: Step
    template: Template | null
    setTemplate: (t:Template) => void

    uploadedImageUrl: string | null
    setUploadedImageUrl: (url: string) => void

    processedImageUrl: string | null
    setProcessedImageUrl: (url: string) => void

    goNext: () => void
    goBack: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
    step: 'template',
    template: null,
    setTemplate: (t) => set({ template: t }),

    uploadedImageUrl: 'null',
    setUploadedImageUrl: (url) => set({ uploadedImageUrl: url }),

    processedImageUrl: 'null',
    setProcessedImageUrl: (url) => set({ processedImageUrl: url }),

    goNext: () => {
        const index = STEPS.indexOf(get().step)
        if (index < STEPS.length - 1) set({ step: STEPS[index+1]})
    },
    goBack: () => {
        const index = STEPS.indexOf(get().step)
        if (index > 0) set({ step: STEPS[index - 1]})
    },
}))