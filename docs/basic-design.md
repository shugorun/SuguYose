# 基本設計

## データモデル

```ts
type Template =
  | { kind: 'preset'; id: string; name: string; widthMm: number; heightMm: number }
  | { kind: 'custom'; widthMm: number; heightMm: number }

type PlacedImage = {
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
```

- `Template`はプリセットかカスタムかで持つ値が変わるので、`kind`で区別する判別可能なユニオン型にした。プリセットは`id`で2種類を区別、カスタムは直接mm値を持つ
- `PlacedImage`はKonvaの図形が持つプロパティ（x, y, scaleX, scaleY, rotation）をそのまま採用（ADR-0003）。`baseWidth/baseHeight`は元画像のpxサイズで、`scaleX/scaleY`と掛け合わせて実際の表示サイズを出す
- MVPは1画像なので配列ではなく単体で持つ。Phase2で複数画像をまとめる時に配列へ拡張する想定

## Zustandストア

```ts
type Step = 'template' | 'instruction' | 'upload' | 'processing' | 'placement' | 'export'

const STEPS: Step[] = ['template', 'instruction', 'upload', 'processing', 'placement', 'export']

type EditorState = {
  step: Step
  template: Template
  placedImage: PlacedImage | null
  status: 'idle' | 'processing' | 'ready' | 'exporting'
  goNext: () => void
  goBack: () => void
  setTemplate: (t: Template) => void
  setPlacedImage: (img: PlacedImage) => void
  updateTransform: (patch: Partial<Pick<PlacedImage, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation'>>) => void
}
```

- `STEPS`の並び順がそのままウィザードの進行順。`goNext`/`goBack`は現在の`step`を配列内で前後させるだけ
- 進捗バーは`STEPS.indexOf(step)`で位置を出せる

## コンポーネント・ファイル構成

```
app/
  page.tsx              Wizardをレンダリングするだけ
components/
  Wizard.tsx            進捗バー・戻るボタン・現在stepの出し分け（外枠）
  steps/
    TemplateStep.tsx     1. テンプレート選択（2種類＋カスタムサイズ入力）
    InstructionStep.tsx  2. 書き方インストラクション（例・文字数目安）
    UploadStep.tsx       3. 画像アップロード/撮影
    ProcessingStep.tsx   4. 画像透過処理（進捗表示）
    PlacementStep.tsx    5. react-konvaでの配置
    ExportStep.tsx       6. PDF出力
lib/
  imageProcessing.ts    ノイズ除去・影除去・高画質化（ADR-0001の純粋関数群）
  pdfExport.ts          pixelRatio計算・jsPDF埋め込み（ADR-0002）
store/
  useEditorStore.ts     Zustandストア
types/
  index.ts              Template, PlacedImage
```

- `lib/`配下は純粋関数中心にして、単体テストの対象にする
- `Wizard.tsx`が`step`を見て`steps/`配下の該当コンポーネントを出し分ける
- PlacementStepでの配置は、テンプレートの範囲内に収まるよう制限する（Konvaの`dragBoundFunc`で拘束する想定、ADR-0003）
