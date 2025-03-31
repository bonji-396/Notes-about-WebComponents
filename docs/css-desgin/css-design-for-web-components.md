# Web ComponentsでのCSS設計

Web Componentsは 標準的なカプセル化機能（特にCustom Elements + Shadow DOM）を持っているため、従来のCSS設計手法とはアプローチが異なります。

Web Components利用に基づいたCSS設計戦略が必要です。

## Web Components における CSS 設計の特徴

|特徴|説明|
|---|---|
|スコープの分離|Shadow DOM によって CSS が自動的に閉じたスコープになる|
|グローバル CSS|の影響を受けない	ページ全体の CSS と干渉しない（逆に共有も難しい）|
|再利用コンポーネントの単位設計が重要|コンポーネント単体で完結する設計が求められる|
|スタイルの共有が課題になる|多数のコンポーネントに同じスタイルを適用するのが難しい|


## Web Components 向けCSS設計の戦略

### 1. カプセル化の徹底（閉じたスタイル設計）
Web Componentsの最大の強みはシャドウDOMによるスタイルのカプセル化です。
- `Shadow DOM` によるCSSカプセル化を前提とし、スタイルはすべて `ShadowRoot` に内包させる。
- 外部のセレクタや `!important` に依存せず、自己完結した設計を行う。

```ts
class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: sans-serif;
      }
      .button {
        background: blue;
        color: white;
      }
    `;
    
    const button = document.createElement('button');
    container.className = 'button';
    container.textContent = 'Click';
    
    shadow.appendChild(style);
    shadow.appendChild(button);
  }
}

customElements.define('my-component', MyComponent);
```

#### メリット
- グローバルCSSからの影響を受けない
- コンポーネント内のスタイルが外部に漏れない
- 命名の衝突を気にする必要がない


### 2. CSS Variables（CSS Custom Properties）による外部からのスタイリング(テーマ性の提供)

コンポーネントの見た目をカスタマイズ可能にしつつ、内部構造を隠蔽します。

- `Shadow DOM` によって継承される唯一のCSSメカニズムが --var（カスタムプロパティ）
- コンポーネントの外からデザイン変更を許容する柔軟性が生まれる

```ts
const style = document.createElement('style');
style.textContent = `
  :host {
    --primary-color: blue;
    --padding: 16px;
    display: block;
  }
  
  .container {
    background-color: var(--primary-color);
    padding: var(--padding);
    color: white;
  }
`;
```
```html
<my-component style="--primary-color: red; --padding: 24px;"></my-component>
```

### 3. :host と :host-context の使い分け
- `:host`：コンポーネント自身にスタイルを適用
- `:host-context()`：親のクラスに応じたスタイル切り替え（テーマ切り替え等に便利）

```css
const style = document.createElement('style');
style.textContent = `
  :host {
    /* デフォルトのスタイル */
    --component-bg: white;
    --component-color: black;
  }
  
  :host-context(.dark-theme) {
    /* ダークテーマのスタイル */
    --component-bg: #333;
    --component-color: white;
  }
  
  .container {
    background-color: var(--component-bg);
    color: var(--component-color);
    padding: 16px;
  }
`;
```

### 4. パーツベース設計（Parts-Based Design）
`::part()` は、Web Components（Custom Elements）内部の要素に、外部からスタイルを当てるための例外的な仕組みです。
シャドウDOM内の要素を`::part()`疑似要素でスタイリングできるようにします。

```ts
const template = document.createElement('template');
template.innerHTML = `
  <style>
    .button {
      background: var(--button-bg, blue);
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
    }
  </style>
  <button part="button" class="button">
    <slot></slot>
  </button>
`;

class MyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('my-button', MyButton);
```

#### 外部から特定のパーツのみスタイリング
```css
my-button::part(button) {
  background-color: purple;
  font-weight: bold;
}
```


### 5. ユーティリティ/共通スタイルの共有手段の確保

Shadow DOM によりグローバルなクラスやCSSフレームワークが使えないため、以下のような共有手段を活用：
- 外部の CSS モジュールを JavaScript 経由で読み込む
- 共通の CSSStyleSheet を作って再利用（adoptedStyleSheets）
- ライブラリ：Lit、Shoelace、FAST などを活用

```ts
const commonStyles = new CSSStyleSheet();
commonStyles.replaceSync(`
  .text-bold { font-weight: bold; }
`);

shadowRoot.adoptedStyleSheets = [commonStyles];
```


### 6. 命名規則：BEMは不要 or コンポーネントスコープ前提の命名
- Shadow DOM によってスコープが保証されるため、BEMほど厳格な命名は不要
- ただし、再利用性を考えるなら以下のような簡易命名は有効：

```ts
.title {}
.title--primary {}
.title__icon {}
```

- より適切なのは、意味的かつ役割に基づいた命名（Atomic/BEMなどの混合でもOK）


## 最適なCSS設計の選択ポイント

|ポイント|説明|
|---|---|
|コンポーネントの再利用度|広く再利用されるコンポーネントならカスタマイズ性を高める|
|チーム規模|大きなチームでは命名規則を厳格にする|
|既存プロジェクトとの統合|既存のCSS設計方針との整合性を考慮|
|パフォーマンス要件|スタイルの複雑さと読み込み速度のバランス|
|ブラウザサポート|一部の機能（例：::part()）は新しいブラウザのみ対応|


## CSS設計と Web Components の組み合わせの注意点

|課題|解決策|
|---|---|
|スタイルの共有が難しい|CSS Variables, adoptedStyleSheets, カスタムテーマパターン|
|ダークモードや親要素のテーマ反映|:host-context() を使う|
|既存の CSS フレームワークと共存しにくい|CSS をShadowにコピーする or Light DOMとの組み合わせを検討|
|アニメーションやモーダル等、親に影響を与える必要がある|Light DOMの使用、slotの活用、position: fixedの考慮|


## Web Components向けCSS設計の指針

|観点|設計方針|
|---|---|
|カプセル化|Shadow DOMで完結させる。グローバルCSSは使わない|
|柔軟性|CSS変数（カスタムプロパティ）で親からの上書き許容|
|再利用性|adoptedStyleSheetsや外部読み込みで共通スタイルを活用|
|スケーラビリティ|:host/:host-contextの活用、意味的な命名ルール|
|拡張性|カスタムイベントとCSS変数でスタイルとロジックを分離|

