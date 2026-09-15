# ADR-0004: 開発基盤の選定

## Context

ビルドツール・状態管理・テストを決めます。

Phase2でアカウント機能・API・DB保存が必要になる見込みがあり、今のプロジェクトはまだ何も実装していないので、切り替えコストが低いうちに方針を決めます。

## Decision

- ビルドツール: Next.js
- 状態管理: Zustand
- テスト: Vitest + React Testing Library。Playwrightは後回し

## Alternatives Considered

- ビルドツール
    - Vite
        - MVP単体ならこちらの方がシンプルだが、Phase2でAPI/DBが必要になる見込みがあり、後から切り替えるより今のうちに決める方が手戻りが少ないのでなし
- 状態管理
    - useState/Context
        - Canvasエディタは位置・拡大率・回転・選択状態など関係し合う状態が多く、Contextだと再レンダリングやProviderの取り回しが面倒になりやすいのでなし
- テスト
    - Playwright（E2E）を最初から入れる
        - MVPの規模だとオーバーヘッドが大きいので後回し

## Consequences

- MVPの機能自体はサーバーを使わないので、Next.jsを選んでもMVPの間はクライアントコンポーネント中心の実装になる
- Next.jsのコンポーネントはデフォルトでServer Component。Canvas等ブラウザ専用の機能を使うファイルには`"use client"`が必要
- Phase2のバックエンド（DB・認証）をNext.jsのAPI Routes経由にするか、Supabase等を直接呼ぶかは別途決める
