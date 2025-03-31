# HTML Template
`<template>` 要素は、レンダリングされない HTML のテンプレートを定義するためのタグ です。
ブラウザがページを読み込むときに、`<template>` 内の内容は 無効化 され、JavaScript で動的に複製・挿入する ことで活用できます。
`<template>` は非表示の HTML コンテンツを定義する要素 で、document.createElement() より直感的に UI を作成できます。

`<template>` を活用すると、シンプルかつメンテナブルな Web コンポーネント を作りやすくなる！ 🚀
## `<template>` の特徴

- ページロード時には描画されない（非表示）
- avaScript で cloneNode(true) して使用可能
- スクリプトやスタイルは document.createElement() よりも直感的に定義できる
- Shadow DOM や Web Components と組み合わせると便利

## テンプレートを HTML に定義し、JavaScript で利用

`<template>` の中身は `template.content.cloneNode(true)` を使ってクローンすることで、通常の DOM に挿入できます。

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <!-- 定義されたテンプレート（画面には表示されない） -->
  <template id="my-template">
    <div class="card">
      <h3>テンプレートのタイトル</h3>
      <p>この要素はテンプレート内にあります。</p>
    </div>
  </template>

  <div id="container"></div>

  <script>
    // テンプレート要素を取得
    const template = document.getElementById("my-template");

    // テンプレートの内容をクローン
    const clone = template.content.cloneNode(true);

    // 任意の場所に挿入
    document.getElementById("container").appendChild(clone);
  </script>
</body>
</html>
```


## 繰り返し使う要素のテンプレート
`<template>` の主な用途として、繰り返し使う要素を作成するために利用する。

### ループで `<template>` の内容を複製し、リストアイテムを生成。
```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <template id="list-item-template">
    <li class="item">アイテム</li>
  </template>

  <ul id="list"></ul>

  <script>
    const template = document.getElementById("list-item-template");
    const list = document.getElementById("list");

    for (let i = 1; i <= 5; i++) {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".item").textContent = `アイテム ${i}`;
      list.appendChild(clone);
    }
  </script>
</body>
</html>
```


## Shadow DOMと組み合わせる
Web Components（カスタム要素）や Shadow DOM と組み合わせると強力です。

### `<template>` を Web Components のシャドウ DOM 内に複製し、再利用可能なカスタム要素を作成

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <custom-card></custom-card>

  <template id="card-template">
    <style>
      .card {
        padding: 10px;
        border: 1px solid #333;
        border-radius: 5px;
      }
    </style>
    <div class="card">
      <h3>カードタイトル</h3>
      <p>これはシャドウ DOM に追加されるカードです。</p>
    </div>
  </template>

  <script>
    class CustomCard extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const template = document.getElementById("card-template").content.cloneNode(true);
        shadow.appendChild(template);
      }
    }

    customElements.define("custom-card", CustomCard);
  </script>
</body>
</html>
```

## 動的なデータバインディング（API との組み合わせ）

### API から取得したデータを動的に `<template>` にバインドしてレンダリングする例

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <template id="user-template">
    <div class="user">
      <h4 class="name"></h4>
      <p class="email"></p>
    </div>
  </template>

  <div id="users"></div>

  <script>
    const users = [
      { name: "田中 太郎", email: "tanaka@example.com" },
      { name: "佐藤 花子", email: "sato@example.com" }
    ];

    const template = document.getElementById("user-template");
    const usersContainer = document.getElementById("users");

    users.forEach(user => {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".name").textContent = user.name;
      clone.querySelector(".email").textContent = user.email;
      usersContainer.appendChild(clone);
    });
  </script>
</body>
</html>
```

## `<template>` の利点

- 不要な DOM の描画を防げる（初期ロード時に不要な HTML を描画せず、JavaScript で制御）
- コードの再利用性が高い（繰り返し利用する UI コンポーネントに適用可能）
- Web Components や Shadow DOM と相性が良い（カプセル化された UI の構築に最適）

## 制約

- `<template>` 内のスクリプトは実行されない
- 直接 DOM に追加しても描画されない（JavaScript で操作する必要がある）
- ブラウザの対応は比較的良いが、古い IE では非対応（要 Polyfill）

