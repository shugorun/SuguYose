# ADR-0003: 自由配置UIの実装方式

## Context

メッセージ画像をテンプレート上で自由に移動・拡大縮小・回転できるようにする必要があります（要件定義書3.1）。

画像に縁が付いて、四隅をつかんで拡大縮小・回転、縁の中をドラッグして移動するUIを作成します。

## Decision

- react-konva（Konva.jsのReact版）を使う
- 選択中の画像に`Konva.Transformer`を付ける

`Konva.Transformer`で、四隅のハンドルと回転ハンドルを自動で出して、拡大縮小・回転の計算ができます。移動は`draggable`です。

## Alternatives Considered

- Fabric.js
    - react-konvaの方がReactと相性が良いのでなし
- DOM＋CSS transform＋interact.js等
    - ハンドルの当たり判定や回転の計算を自前で組む必要があり、難易度が高いのでなし
- 素のCanvas API
    - ハンドル描画から当たり判定、回転計算まで全部自前になるのでなし

## Consequences

- react-konvaという新しい依存と、Canvas内の図形という考え方を覚える必要がある
- PDF書き出しはKonvaの機能だけで完結する（ADR-0002）
- 配置情報（位置・拡大率・回転角度）は、Konvaの図形が持つx, y, scaleX, scaleY, rotationを、そのままアプリのデータモデルに対応させる
