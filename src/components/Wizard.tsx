import type { ReactNode } from "react";


export default function Wizard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-2 w-1/6 bg-blue-500" />
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <button className="fixed bottom-4 left-4 rounded bg-gray-200 px-4 py-2">戻る</button>
    </div>
  )
}