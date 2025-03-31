# CSS設計
Webサイトやアプリケーションのスタイリングをより体系的に、保守性や再利用性を高めるためを目的として、スタイルシートを「構造的・再利用可能・保守しやすく」管理するための設計思想・設計技法の総称です。

単なるスタイル記述ではなく、チーム開発やスケーラビリティに耐えうるCSSを書くためのルールを定めます。
規模の大きなプロジェクトでも一貫性を保ち、コードの肥大化やスタイルの競合を防ぐために用います。


## CSS設計目的
- 保守性の向上を目的とし、長期運用でも破綻しない
- 再利用性の確保を目的とし、同じ見た目を何度も書かない
- UIが予測可能な振る舞いを行い、変更が他所に影響しないこと
- チームでの共通理解:  
誰が書いても同じルール
- スケーラブルな拡張性:  
画面数・機能が増えても壊れない
- レンダリングパフォーマンスを最適化
- CSSの複雑さとスコープ問題を管理する

## CSS設計が目指すゴール

> - [Philip Walton: CSS Architecture](https://philipwalton.com/articles/css-architecture/)
> - [Erdem Besler: CSS Architecture Goals](https://erdembesler.medium.com/css-architecture-9dc6be77e70f)


- Predictable: 予想が可能であること
   - セレクタがどのような影響を及ぼすか予測できること
   - スタイルが適用される範囲が明確であること
- Reusable: 再利用可能であること
   - コンポーネントが異なるコンテキストでも同じように機能すること
   - スタイルを再利用できるモジュール化されたコードベース
- Maintainable: 保守可能であること
   - コードを変更しても予期せぬ副作用が最小限であること
   - 新しい機能追加や変更が容易であること
- Scalable: 拡張が可能であること
   - プロジェクトの成長に合わせてCSSが適切に拡張できること
   - 大規模なコードベースでも管理しやすいこと
- Collaborative: 協業し易いこと
   - 複数の開発者が同時に作業しやすい構造
   - 命名規則やパターンの一貫性

## CSS設計のポイント

1. 命名規則の一貫性
クラス名に意味と規則性を持たせる（例：btn--primary）
   - 理解しやすく、一貫した命名パターンを採用する
   - 名前から機能や役割が推測できるようにする

2. 単一責任の原則
構造（HTML）と見た目（CSS）を分離しつつ、CSS内部でも責務を分類
   - 各スタイルルールは一つの役割に集中すべき
   - 複数の役割を持つスタイルは分割する

3. モジュール化
   - 独立したコンポーネントとして設計する
   - 依存関係を最小限に抑える

4. 再利用性の意識
変数化、ミックスイン、ユーティリティの活用

5. カスケーディングの制御
できるだけ階層を浅く、影響範囲を明確に
   - セレクタの詳細度（specificity）を適切に管理する
   - 過度に複雑なセレクタを避ける

5. ファイル構成
   - 論理的なファイル分割とフォルダ構造
   - インポート順序の明確化

6. ドキュメント化
   - スタイルガイドやコードコメントの充実
   - チーム内での知識共有

## 主なCSS設計手法

### BEM（Block Element Modifier）
BEMはロシアのYandexが開発した命名規則
命名で意味が明確になり、CSSの依存関係が減る。

1. `Block`: 独立したコンポーネント（例：.header）
2. `Element`: ブロックに属する部品（例：.header__logo）
3. `Modifier`: ブロックやエレメントのバリエーション（例：.header--fixed）

```css
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

#### メリット

- セレクタの詳細度が低く保たれる
- コンポーネントの関係性が明確
- クラス名から構造が理解しやすい

#### デメリット

- クラス名が長くなりがち
- ネストが深い構造では扱いにくい場合がある

#### 例

##### HTML

```html
<div class="card card--featured">
  <h2 class="card__title">タイトル</h2>
</div>
```
##### CSS
```css
.card { ... }
.card--featured { ... }
.card__title { ... }
```

### OOCSS (Object Oriented CSS)
Nicole Sullivanが提唱したオブジェクト指向のアプローチをとる設計手法

- 構造と見た目の分離: レイアウトと装飾を分ける
- コンテナとコンテンツの分離: 場所に依存しないスタイリング

#### メリット
- 再利用性に優れる
- スタイルの重複を防ぐ
- ファイルサイズの削減
- メンテナンス性の向上

#### デメリット
- 複数のクラスを組み合わせる必要がある
- HTMLが少し冗長になることがある

#### 例

##### CSS

```css
/* 構造 */
.btn {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 3px;
}

/* 見た目 */
.btn-primary {
  background: blue;
  color: white;
}
```

### SMACSS (Scalable and Modular Architecture for CSS)
Jonathan Snookが開発した、CSSを5つのカテゴリに分類するアプローチの設計手法

1. `Base`: デフォルトスタイル（リセットやノーマライズ）
2. `Layout`: 主要なレイアウト要素
3. `Module`: 再利用可能なモジュール
4. `State`: 状態を表すスタイル
5. `Theme`: テーマによる見た目の変更


#### メリット

- 論理的なカテゴリ分けで管理しやすい
- スケーラビリティが高い
- 命名規則がシンプル

#### デメリット

- カテゴリの境界が曖昧になることがある
- 導入にはある程度の学習コストがかかる

#### 例
```css
/* Base */
body, p, h1 { margin: 0; padding: 0; }

/* Layout */
.l-header { width: 100%; }

/* Module */
.nav { list-style: none; }

/* State */
.is-active { font-weight: bold; }

/* Theme */
.theme-dark .nav { background: #333; }
```

### その他の手法・思想

|手法・思想名|概要|
|---|---|
|Atomic CSS / Utility First|Tailwind CSS に代表される。1つのクラス = 1つの役割。例：text-lg p-4|
|ITCSS（Inverted Triangle CSS）|重要度に応じて階層的に構成。Base → Objects → Components → Utilities|
|SCSS/BEM Hybrid|BEMの命名 + SCSSのネストで見通し良く書く|
|CSS-in-JS|コンポーネント単位でCSSを記述（Styled Components、Emotionなど）|
