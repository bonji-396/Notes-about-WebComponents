# TypeScript で Web Components（カスタム要素）を作成・利用する方法

TypeScript で Web Components（カスタム要素）を作成・利用する方法

TypeScript を使って Web Components（カスタム要素）を作成・利用する方法を詳しく解説します。
Web Components は ネイティブのカプセル化されたコンポーネント を作るための仕組みで、TypeScript を使うと型安全かつ保守性の高いコードを記述できます。


## TypeScript でカスタム要素を作成

基本的なカスタム要素

TypeScript でも、HTMLElement を継承してクラスを作成し、customElements.define() で登録します。

### TypeScript の基本構造

```ts
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid black;
        }
      </style>
      <p>これはカスタム要素です。</p>
    `;
  }
}

// カスタム要素を登録
customElements.define("my-element", MyElement);
```

- attachShadow({ mode: "open" }) を使ってシャドウ DOM を作成し、要素をカプセル化。
- customElements.define("my-element", MyElement); で要素を定義。

### HTML で利用
```html
<my-element></my-element>
```


## TypeScript で observedAttributes を利用（属性の監視）

カスタム要素は observedAttributes を使って属性の変更を監視 できます。

### 属性を監視するカスタム要素

```ts
class MyElement extends HTMLElement {
  static observedAttributes = ["color"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid black;
          background-color: white;
        }
      </style>
      <p>カスタム要素</p>
    `;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === "color" && this.shadowRoot) {
      this.shadowRoot.host.style.backgroundColor = newValue ?? "white";
    }
  }
}
// カスタム要素を登録
customElements.define("my-element", MyElement);
```

### HTML での使用

```html
<my-element color="lightblue"></my-element>
```
color 属性を変更すると、背景色が動的に変化。


## スロット（`<slot>`）を使ってコンテンツを受け取る

カスタム要素内で <slot> を利用すると、外部のコンテンツを挿入できます。

### <slot> を使ったカスタム要素
```ts
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid black;
          padding: 10px;
        }
        ::slotted(p) {
          color: blue;
        }
      </style>
      <h3>カスタム要素</h3>
      <slot></slot>
    `;
  }
}

customElements.define("my-element", MyElement);
```

### HTML での使用
```htlm
<my-element>
  <p>スロットに挿入される内容</p>
</my-element>
```

`::slotted(p)` を使うと、スロット経由で挿入された要素のスタイルを変更可能。


## 名前付きスロット（`<slot name="">`）

複数のスロットを使用すると、異なるコンテンツを柔軟に配置できます。

### 名前付きスロットのカスタム要素
```ts
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>
        .box {
          padding: 10px;
          border: 1px solid black;
        }
      </style>
      <div class="box">
        <h3><slot name="title">デフォルトタイトル</slot></h3>
        <p><slot name="content">デフォルトコンテンツ</slot></p>
      </div>
    `;
  }
}

customElements.define("my-element", MyElement);
```

### HTML での使用

```html
<my-element>
  <h2 slot="title">カスタムタイトル</h2>
  <p slot="content">カスタムコンテンツ</p>
</my-element>
```

スロット名を指定しないとデフォルトの内容が表示される。


## TypeScript でカスタムイベントを発行

カスタム要素から イベントを発行（dispatchEvent） し、外部から検知できるようにする。

### ボタンクリックでイベントを発行

```ts
class MyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <button>クリック</button>
    `;
    this.shadowRoot?.querySelector("button")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("my-click", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("my-button", MyButton);
```

### HTML + JavaScript でイベントをリッスン

```html
<my-button></my-button>

<script>
  document.querySelector("my-button")?.addEventListener("my-click", () => {
    alert("ボタンがクリックされました！");
  });
</script>
```

- カスタムイベント my-click を発行し、外部で受け取れるようにする。
- bubbles: true で親要素にもイベントを伝播できる。


## TypeScript + Vite で Web Components を開発

Vite を使うと、TypeScript で Web Components を簡単に開発できます。

### Vite プロジェクトを作成

```bash
npm create vite@latest my-web-component --template vanilla-ts
cd my-web-component
npm install
```

### src/my-element.ts
```ts
export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>
        :host { display: block; border: 1px solid black; padding: 10px; }
      </style>
      <p>Vite で作成した Web Component</p>
    `;
  }
}

customElements.define("my-element", MyElement);
```

### index.html
```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <my-element></my-element>
  <script type="module" src="/src/my-element.ts"></script>
</body>
</html>
```

### Vite で開発サーバーを起動

```bash
npm run dev
```
- モジュールとして Web Components を作成し、簡単に利用できる。
