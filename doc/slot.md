# Slot
`<slot>` は Web Components 内で親要素からコンテンツを受け取るための要素です。
`<slot>` は `Web Components`（カスタム要素）内の`Shadow DOM` に対して、親要素（ライト DOM）からコンテンツを挿入するための仕組みです。
スロット（Slot）を使うことで、コンポーネントの中に動的な内容を受け入れることが可能になり、再利用性の高いカスタム要素 を作ることができます。

## `<slot>` の主な特徴

- カスタム要素の内部（シャドウ DOM）に外部からコンテンツを挿入できる
- スロットにはデフォルトのコンテンツを設定できる
- 複数のスロット（名前付きスロット）を定義できる
- CSS ::slotted() 疑似クラスを使ってスロットのスタイルを適用できる

## 単純なスロット

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <custom-card>
    <p>これはスロットに挿入されるテキストです。</p>
  </custom-card>

  <script>
    class CustomCard extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
          <style>
            div {
              border: 2px solid #333;
              padding: 10px;
              border-radius: 5px;
            }
          </style>
          <div>
            <h3>カスタムカード</h3>
            <slot></slot>
          </div>
        `;
      }
    }

    customElements.define("custom-card", CustomCard);
  </script>
</body>
</html>
```
- slot の位置に `<p>これはスロットに挿入されるテキストです。</p>` が挿入される。
- `<slot>` を指定しないと、親要素の内容がカスタム要素に反映されない。

## デフォルトコンテンツ（スロットに何も入れられなかった場合のフォールバック）

デフォルトのコンテンツを設定できるので、スロットが空でも適切な表示が可能

```html
<custom-card></custom-card>

<script>
  class CustomCard extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" }); 

      shadow.innerHTML = `
        <style>
          div {
            border: 2px solid #333;
            padding: 10px;
            border-radius: 5px;
          }
        </style>
        <div>
          <h3>カスタムカード</h3>
          <slot>デフォルトのコンテンツ</slot>
        </div>
      `;
    }
  }

  customElements.define("custom-card", CustomCard);
</script>
```
- `custom-card` 内に何も入れないと、「デフォルトのコンテンツ」 が表示される。
- slot の中に親要素からコンテンツが提供された場合、デフォルトのコンテンツは置き換えられる。


## 名前付きスロット
複数のスロットを使用する場合、`name` 属性を指定することで スロットごとに異なる内容を挿入できます。

```html
<custom-card>
  <h2 slot="title">カスタムタイトル</h2>
  <p slot="content">これはコンテンツスロットの内容です。</p>
</custom-card>

<script>
  class CustomCard extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });

      shadow.innerHTML = `
        <style>
          .card {
            border: 2px solid #333;
            padding: 10px;
            border-radius: 5px;
          }
        </style>
        <div class="card">
          <header><slot name="title">デフォルトタイトル</slot></header>
          <section><slot name="content">デフォルトコンテンツ</slot></section>
        </div>
      `;
    }
  }

  customElements.define("custom-card", CustomCard);
</script>
```

- slot="title" の `<h2>` は `<slot name="title">` に入る。
- slot="content" の `<p>` は `<slot name="content">` に入る。
- 親要素がスロットに何も入れなかった場合、デフォルトの内容が使われる。

## スロットのスタイル適用（::slotted() 疑似クラス）
名前付きスロットを使うと、複数の場所に異なるコンテンツを配置できます。

通常、Shadow DOM 内の CSS はスロットの内容には適用されない。
`::slotted()` 疑似クラスを使うと、スロットの内容に CSS を適用できる。

```html
<custom-card>
  <h2 slot="title">カスタムタイトル</h2>
</custom-card>

<script>
  class CustomCard extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });

      shadow.innerHTML = `
        <style>
          ::slotted(h2) {
            color: blue;
            font-size: 20px;
          }
        </style>
        <div>
          <slot name="title">デフォルトタイトル</slot>
        </div>
      `;
    }
  }

  customElements.define("custom-card", CustomCard);
</script>
```

- `::slotted(h2)` を使うと、スロット内の `<h2>` に青色が適用される。
- 通常の `h2 { color: blue; } `ではスロットの内容には適用されない。

## `<slot>` の利点

- Web Components 内で柔軟なカスタマイズを可能にする
- カプセル化されたコンポーネントを作りつつ、外部からのコンテンツ変更を許容
- ::slotted() を使ってスロットの内容にスタイルを適用できる
- デフォルトのコンテンツを設定できるので、スロットが空でも問題ない

## 制約

- スロット内の要素はシャドウ DOM 内の CSS の影響を受けない（::slotted() が必要）
- スロットに JavaScript で直接値を入れることはできない（親要素を変更する必要がある）
- スロットの再配置はできない（動的にスロットを変更するには slot 属性を変更する必要がある）

