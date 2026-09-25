"use client"

import type { Template } from "@/types";
import { useEditorStore } from "@/store/useEditorStore";

type PresetTemplate = Extract<Template, { kind: "preset" }>;

const templates: PresetTemplate[] = [
  {
    kind: "preset",
    id: "simple",
    name: "シンプル",
    widthMm: 100,
    heightMm: 100,
  },
  {
    kind: "preset",
    id: "classic",
    name: "クラシック",
    widthMm: 100,
    heightMm: 100,
  },
];

export default function TemplateStep() {
  const { template, setTemplate } = useEditorStore()

  return (
    <div>
      {templates.map((t) => {
        const isSelected = template?.kind === "preset" && template.id === t.id;
        return (
          <div
            key={t.id}
            onClick={() => setTemplate(t)}
            className={
              isSelected
                ? "border-2 border-blue-500 p-4"
                : "border-2 border-gray-300 p-4"
            }
          >
            {t.name}
          </div>
        );
      })}
    </div>
  );
}
