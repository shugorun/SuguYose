"use client"

import { useEditorStore } from "@/store/useEditorStore"

export default function InstructionStep() {
    const { goNext } = useEditorStore()

    return (
        <div>
            <p>白紙にペンでメッセージを書いてください（目安：10字×6行くらいまで）</p>
            <button onClick={goNext} className="rounded bg-blue-500 px-4 py-2 text-white">
                次へ
            </button>
        </div>
    )
}