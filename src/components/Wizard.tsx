"use client"

import { useEditorStore } from "@/store/useEditorStore"
import TemplateStep from "./steps/TemplateStep"
import InstructionStep from '@/components/steps/InstructionStep'


export default function Wizard() {
  const { step, goBack } = useEditorStore()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-2 w-1/6 bg-blue-500" />
      <div className="flex flex-1 items-center justify-center">
        {step === 'template' && <TemplateStep />}
        {step === 'instruction' && <InstructionStep />}
      </div>
      <button onClick={goBack} className="fixed bottom-4 left-4 rounded bg-gray-200 px-4 py-2">
        戻る
      </button>
    </div>
  )
}