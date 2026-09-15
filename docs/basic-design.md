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
type EditorState = {
  template: Template
  placedImage: PlacedImage | null
  status: 'idle' | 'processing' | 'ready' | 'exporting'
  setTemplate: (t: Template) => void
  setPlacedImage: (img: PlacedImage) => void
  updateTransform: (patch: Partial<Pick<PlacedImage, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation'>>) => void
}
```

## コンポーネント・ファイル構成

```
app/
  page.tsx              画面全体、ステップの出し分け
components/
  TemplateSelector.tsx  テンプレート選択（2種類＋カスタムサイズ入力）
  ImageUploader.tsx     画像アップロード
  CanvasEditor.tsx      react-konvaのStage/Layer、Transformer
  ExportButton.tsx      PDF書き出しボタン
lib/
  imageProcessing.ts    ノイズ除去・影除去・高画質化（ADR-0001の純粋関数群）
  pdfExport.ts          pixelRatio計算・jsPDF埋め込み（ADR-0002）
store/
  useEditorStore.ts     Zustandストア
types/
  index.ts              Template, PlacedImage
```

- `lib/`配下は純粋関数中心にして、単体テストの対象にする
- 画面遷移は`page.tsx`1枚の中でステップ管理する想定（テンプレート選択→アップロード→編集→書き出し）。URLを分けたければ`app/create/`のようにフォルダを切ればよい
