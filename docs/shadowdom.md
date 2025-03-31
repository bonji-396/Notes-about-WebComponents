# Shadow DOM

Shadow DOM とは、Web Components の一部として提供される技術で、DOMのカプセル化を実現するための仕組みです。
通常の DOM とは独立した 「シャドウツリー（shadow tree）」 を作成し、外部の CSS や JavaScript の影響を受けずにコンポーネントを構築できます。

```js
const div = document.querySelector('div');
const shadowRoot = div.attachShadow({
  mode: 'open',
});
const p = document.createElement('p');
p.textContent = 'Shadow DOM World!';
shadowRoot.appendChild(p);
```

## Shadow DOM の主な特徴
1. スタイルと構造のカプセル化
   - 外部の CSS が影響しない。
   - 内部の DOM 構造が外部スクリプトから直接操作されない。
2. 独立した DOM ツリー
   - 通常の DOM の一部として存在するが、shadowRoot によって分離される。
3. スコープ付きの CSS
   - シャドウ DOM 内のスタイルは外部に影響を与えず、外部のスタイルの影響も受けない。

## Shadow DOM　における用語

- `Shadow Host`: Shadow DOM が取り付けられた、通常の DOM ノード
- `Shadow Tree`: Shadow DOM の中にある DOM ツリー
- `Shadow Boundary`: Shadow DOM と通常の DOM の境界
- `Shadow Root`: Shadow DOM のルートノード

## Shadow DOM　が継承できる属性
シャドウツリーと `<slot>` 要素は、シャドウホストから `dir` および `lang` 属性を継承しています。


## Shadow DOM の作成

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <div id="host"></div>

  <script>
    // シャドウ DOM を作成
    const hostElement = document.getElementById("host");
    const shadowRoot = hostElement.attachShadow({ mode: "open" });

    // シャドウ DOM 内に要素を追加
    shadowRoot.innerHTML = `
      <style>
        p {
          color: red;
          font-weight: bold;
        }
      </style>
      <p>シャドウ DOM 内の要素</p>
    `;
  </script>
</body>
</html>
```


## attachShadow() の mode オプションの設定

`attachShadow()` の mode オプションには `"open"` と `"closed"` の2種類があります。
`attachShadow({ mode })` を使って作成 し、`mode` に `"open"` や `"closed"` を指定します。

|mode|説明|
|---|---|
|`"open"`|`element.shadowRoot` でシャドウ DOM にアクセスできる|
|`"closed"`|`shadowRoot` にアクセスできない (null を返す)|

### 例
```js
const el = document.createElement("div");

// open モード（外部からアクセス可能）
const shadowOpen = el.attachShadow({ mode: "open" });
console.log(el.shadowRoot); // ShadowRoot オブジェクト

// closed モード（外部からアクセス不可）
const shadowClosed = el.attachShadow({ mode: "closed" });
console.log(el.shadowRoot); // null
```
closed モードは、カプセル化をさらに強化したい場合に使用する。

## Shadow DOM 内部の要素を取得
Shadow DOM は、外部の CSS やスクリプトの影響を受けない（逆に、外部スタイルを適用しづらい）。

### attachShadow({ mode: "open" }) を使って hostElement にシャドウ DOM を作成。
```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <div id="host"></div>

  <script>
    const host = document.getElementById("host");
    const shadowRoot = host.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `<p id="message">シャドウ DOM 内の要素</p>`;

    // シャドウ DOM 内の要素を取得
    console.log(shadowRoot.querySelector("#message").textContent); // "シャドウ DOM 内の要素"

    // 通常の DOM からはアクセスできない
    console.log(document.querySelector("#message")); // null
  </script>
</body>
</html>
```
通常の `document.querySelector()` ではシャドウ DOM 内の要素は取得できない。


## Shadow DOM とスロット（Slot）

Shadow DOM では、スロット (<slot>) を使うことで、親要素からコンテンツを受け取る ことができます。

スロットの基本
```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <custom-element>
    <p slot="title">スロットで受け取るタイトル</p>
    <p>スロットなしのコンテンツ</p>
  </custom-element>

  <script>
    class CustomElement extends HTMLElement {
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `
          <style>
            ::slotted(p) {
              color: blue;
            }
          </style>
          <h2><slot name="title"></slot></h2>
          <slot></slot>
        `;
      }
    }

    customElements.define("custom-element", CustomElement);
  </script>
</body>
</html>
```
`slot="title"` を指定すると、対応する `<slot name="title">` の位置に要素が挿入される。
`::slotted(p)` でスロット経由の要素のスタイルを変更できる。


## Shadow DOM と Custom Element
Web Components（カスタム要素）と組み合わせて使うのが一般的です。


### Shadow DOM を利用した、Web Componentの作成
```js
class FilledCircle extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    // Create a shadow root
    // The custom element itself is the shadow host
    const shadow = this.attachShadow({ mode: "open" });

    // create the internal implementation
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "50");
    circle.setAttribute("fill", this.getAttribute("color"));
    svg.appendChild(circle);

    shadow.appendChild(svg);
  }
}

customElements.define("filled-circle", FilledCircle);
```

### Shadow DOM を使った、Web Componentの利用

```html
<filled-circle color="blue"></filled-circle>
```

シャドウ DOM を活用すれば、安全で再利用可能なコンポーネントを作成 できる！ 
## シャドウ DOM の利点

- スタイルのカプセル化
- 外部スクリプトの影響を受けにくい
- 再利用可能な Web コンポーネントの構築が容易

## シャドウ DOM の制約

- 外部の CSS を適用できない（例：global.css のスタイルは影響しない）
- 開発者ツールで確認しづらい場合がある（特に mode: "closed" の場合）
- SEO に不利（シャドウ DOM のコンテンツは検索エンジンに認識されない場合がある）

