# Custom Elements

独自のDOM要素を定義するためのJavaScript APIです。Custom Elementsで新たに定義したDOMはメソッドやプロパティの追加ができます。

任意の振る舞いを持ったHTML要素を定義できるようにする仕様で、定義した要素を<hoge-element>のようにHTMLドキュメントに記述するだけで再利用できます。

```js
class HogeElement extends HTMLElement {
	counstructor(){
		super();
	}
}

customElements.define('hoge-element', HogeElement);
```


## カスタム要素の種類

カスタム要素は２種類あり、HTMLElement を拡張するクラス（自立型要素の場合）また、はカスタマイズするインターフェイス（カスタム組み込み要素の場合）として実装されます。

|種類|説明|
|---|---|
|カスタム組み込み要素（Custom built-ikn element）|標準のHTML要素（HTMLImageElementやHTMLParagraphElementなど）を継承したカスタム要素。標準要素に対して拡張を行います。（標準要素に`is`属性指定し、その値をカスタム要素を指定し利用します。）|
|自律型カスタム要素（Autonomous coustom element）| HTML要素の既定クラスであるHTMLElementを継承します。一から動作実装を行います。|

### カスタム組み込み要素実装例

```js
class WordCount extends HTMLParagraphElement {
  constructor() {
    super();
  }
  // 要素の機能をここに書く
}
```

### 自律型カスタム要素実装例

```js
class PopupInfo extends HTMLElement {
  constructor() {
    super();
  }
  // 要素の機能をここに書く
}
```

## カスタム要素のライブサイクルコールバック
カスタム要素にはライフサイクルが存在し、それらをコールバック関数でフックすることで振る舞いを制御します。

|コールバック関数|説明|
|---|---|
|`constructor()`|カスタム要素が作成された時、または更新された時に呼び出される。|
|`connectedCallback()`|カスタム要素がHTMLドキュメントに追加された時に呼び出される。|
|`disconectedCallback()`|カスタム要素がHTMLドキュメントから削除された時に呼び出される。|
|`attributeChangeCallback()`|カスタム要素の属性が変更、追加、削除、または置換された時に呼び出される。`observedAttributes`というゲッターメソッドで監視したい属性名を配列で指定します。|
|`adoptedCallback()`|カスタム要素が新しいHTMLドキュメントに追加された時に呼び出される|


```js
// 要素のためのクラスを作成
class HogeElement extends HTMLElement {
  // `attibuteChagedCallback()`コールバックで取得するための、値変更監視対象の属性名の配列を定義
	static get observedAttributes() {
		return ['foo'];
	}
  // 要素の属性の取り出し
	get foo() {
		return this.getAttribute('foo');
	}
  // 要素の属性値の設定
	set foo(value) {
		this.setAttribute('foo', value);
	}
  // 要素が作成される時に実行される
  counstructor(){
		super(); // コンストラクターでは、常に super を最初に呼び出す
		console.log('<hoge-element> is created');
	}
  // 要素がDOMに追加される度に実行される
	conectedCallback(){
		console.log('カスタム要素<hoge-element>がページに追加されました');
	}
  // 要素がDOMから削除されたときに実行される
	dsiconnectedCallback(){
		console.log('カスタム要素<hoge-element>がページから削除されました。');
	}
  // 対象となる属性の値が変更されたときに実行される
	attibuteChagedCallback(attributeName, oldValue, newValue) {
    console.log(`属性 ${attributeName} が変更されました。`);
		if (attributeName === 'foo') {
			console.log(`属性 ${attributeName} が ${oldValue} から $ ${newValue}に、変更されました。`);
		}
	}
 // 要素が別のページに移動された時に実行される
	adoptedCallback() {
    console.log("カスタム要素<foo-element> が新しいページへ移動されました。");
	}

}

customElements.define('hoge-element', HogeElement);
console.log(fooElement.foo);

```

## カスタム要素の登録
上記サンプルでは、以下`define()`にて、カスタム要素を登録し、ページで利用できるようにしています。

```js
customElements.define('hoge-element', HogeElement);
```

### [`define()`](https://developer.mozilla.org/ja/docs/Web/API/CustomElementRegistry/define)

`define()` メソッドは、以下の引数を取ります。

#### 引数
|引数名|説明|
|---|---|
|`name`|HTMLタグとして利用する要素名。`<要素名>`のように利用します。[小文字とハイフン](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)にて定義。|
|`constrcutor`|カスタム要素のコンストラクター関数|
|`optons`|カスタム組み込み要素のみ指定し、拡張する組み込み要素の名前を指定する文字列です。|

#### カスタム組み込み要素の登録例
```js
customElements.define("word-count", WordCount, { extends: "p" });
```

#### 自律型カスタム要素の登録例
```js
customElements.define("hoge-element", PopupInfo);
```

## カスタム要素の使用例
カスタム要素を定義し登録したら、以下のようなコードで使用できるようになります。
### カスタム組み込み要素

```html
<p is="word-count"></p>
```

### 自律型カスタム要素

```html
<hoge-element>
  <!-- 要素の中身 -->
</hoge-element>

```

## 属性の変更への応答
カスタム要素が属性値の変更に対応するよう、以下のメンバーを追加し対応します。

- `observedAttributes`: 静的プロパティで、変更通知が必要な属性名の配列を定義します。
- `attributeChangedCallback(): `observedAttributes`プロパティのリストされた属性が追加、修正、削除、置換される度に呼び出されるコールバックメソッド。  
以下の3つの引数が渡されます。
   - 変更された属性名
   - 属性の古い値
   - 属性の新しい値

```js
// 要素のためのクラスを作成
class MyCustomElement extends HTMLElement {
  static observedAttributes = ["size"];

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`属性 ${name} が ${oldValue} から $ ${newValue}に、変更されました。`);
  }
}

customElements.define("my-custom-element", MyCustomElement);

```

> [!NOTE]
> 以下のように、要素の HTML 宣言に監視される属性が含まれている場合は、DOM が解釈された時点で `attributeChangedCallback()` が呼び出されます。
> 
> `<my-custom-element size="100"></my-custom-element>`


## `CustomElementRegistry`インターフェイス
`CustomElementRegistry` インターフェイスは、カスタム要素の登録と、登録された要素を照会するためのメソッドを提供します。  
`window.customElements` プロパティから利用します。

|メソッド|役割|使うタイミング|
|---|---|---|
|`define()`|カスタム要素を登録する|カスタム要素を初めて定義するとき|
|`get()`|カスタム要素のクラスを取得する|既に定義されているか確認したいとき|
|`whenDefined()`|カスタム要素の定義を待つ|カスタム要素の定義が遅れる可能性があるとき|
|`upgrade()`|既存の要素をカスタム要素にする|すでに DOM にある要素をカスタム要素として適用するとき|

## カスタム要素が定義済みかどうかをチェックする

### [`get()`](https://developer.mozilla.org/ja/docs/Web/API/CustomElementRegistry/get)

`CustomElementRegistry.get()` は、すでに登録されているカスタム要素のコンストラクタを取得 するメソッドです。

1. カスタム要素が定義済みかどうかをチェック
   - customElements.get("my-element") が undefined であれば、まだカスタム要素が定義されていないと分かる。
2. 登録済みのカスタム要素のクラスを取得して再利用
   - すでに定義されたカスタム要素のコンストラクタを取得し、新しいインスタンスを作成したり、プロトタイプを調査することが可能。


`customElements.get()` は、すでに登録されているカスタム要素のクラスを取得するメソッド。
- カスタム要素が 定義済みかどうかを確認する
- 既にあるカスタム要素の コンストラクタを取得する
- 二重登録を防ぐ のに役立つ

### 使用例ケース1: カスタム要素の定義チェック

```js
if (customElements.get("my-element")) {
  console.log("my-element は定義済みです");
} else {
  console.log("my-element は未定義です");
}
```
get() を使うことで、カスタム要素が 定義されているかどうかを確認 できる。

### 使用例ケース2: 定義済みのカスタム要素のコンストラクタを取得
```js
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "<p>カスタム要素です！</p>";
  }
}

customElements.define("my-element", MyElement);

// 定義済みのカスタム要素のクラスを取得
const MyElementClass = customElements.get("my-element");

if (MyElementClass) {
  console.log(MyElementClass === MyElement); // true
  const instance = new MyElementClass();
  document.body.appendChild(instance);
}
```

これにより、登録済みのカスタム要素のクラスを取得し、新しいインスタンスを作成できる。

### 使用例ケース3: 動的にカスタム要素を登録
```js
if (!customElements.get("dynamic-element")) {
  class DynamicElement extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = "<p>動的に登録された要素！</p>";
    }
  }
  customElements.define("dynamic-element", DynamicElement);
}

document.body.appendChild(new (customElements.get("dynamic-element"))());
```
既に定義されているかどうかをチェックして、未定義なら登録することで、二重登録を防ぐ ことができる。

## DOM に存在する要素に対して、後からカスタム要素として動作させたい

### [`upgrade()`](https://developer.mozilla.org/ja/docs/Web/API/CustomElementRegistry/upgrade)

`CustomElementRegistry.upgrade()` は、後から登録したカスタム要素を、既に DOM にある要素に適用するための手動アップグレードメソッド。特に、カスタム要素が未定義のまま DOM に挿入された後、定義を行うケースで有効。

1. 事前に定義されていないカスタム要素の後付け登録
   - カスタム要素 (customElements.define()) の登録前に、対象の要素がすでに DOM に存在している場合、その要素は通常の HTML 要素のままとなります。
   - upgrade() を使うと、カスタム要素として再適用できます。
2. カスタム要素の動的ロード
   - モジュールの遅延ロード (import() など) により、カスタム要素の定義が後から行われた場合に、その時点で DOM にある該当要素を手動でアップグレードする用途。
3. Shadow DOM やテンプレートからの復元
   - innerHTML などでカスタム要素を破棄 → 復元する場合、新たに作成したノードがカスタム要素として認識されないことがある。
   - upgrade() を使うと、これを回避できる。

### 使用例
カスタム要素を後から登録するケース

```html
<body>
  <my-element></my-element>
  <script>
    class MyElement extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = "<p>アップグレードされました！</p>";
      }
    }

    // まだカスタム要素として認識されていない
    console.log(document.querySelector("my-element") instanceof MyElement); // false

    // カスタム要素を登録
    customElements.define("my-element", MyElement);

    // すでにある <my-element> をアップグレード
    customElements.upgrade(document.querySelector("my-element"));

    console.log(document.querySelector("my-element") instanceof MyElement); // true
  </script>
</body>
```
customElements.upgrade() を使わないと、既にある <my-element> は MyElement のインスタンスにならない。

### innerHTML を使う場合の回避策
```html
<body>
  <div id="container"></div>

  <script>
    class MyElement extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = "<p>アップグレード済み！</p>";
      }
    }
    customElements.define("my-element", MyElement);

    // innerHTML で挿入（この時点では未アップグレード）
    document.getElementById("container").innerHTML = "<my-element></my-element>";

    // アップグレード処理
    customElements.upgrade(document.querySelector("my-element"));
  </script>
</body>
```
innerHTML を使うと、新たに挿入された <my-element> がすぐに MyElement として機能しない場合があるが、upgrade() を使えば即座に適用可能。

### 注意点
- upgrade() は 要素の connectedCallback() をトリガーしない。
- 手動で呼び出す必要がある（通常 customElements.define() で自動的に適用される）。
- 既にカスタム要素として適用済みの場合は効果がない。


## カスタム要素が定義されるのを待機する

### [`whenDefined()`](https://developer.mozilla.org/ja/docs/Web/API/CustomElementRegistry/whenDefined)

`CustomElementRegistry.whenDefined()` は、特定のカスタム要素が 定義（customElements.define()）されるまで待機 するためのメソッドです。

1. カスタム要素がまだ定義されていない場合の処理待機
   - 外部ライブラリや遅延ロード (`import()`) などで、カスタム要素の定義が 非同期に行われる場合 に活用できる。
2. 要素の準備が整ってから操作したい場合
   - `<my-element>` のクラスが未定義の状態で、スクリプトが実行されるとエラーや意図しない動作が発生することがある。
   - `whenDefined()`を使うと、定義されてから安全に処理を行う ことができる。

`customElements.whenDefined()` は カスタム要素が登録されるまで待機するためのメソッド。特に、非同期ロード や 定義が遅れるケース で活用できる。
- 非同期処理 (Promise を返す)。
- カスタム要素がすでに定義されている場合、即座に解決される。
- 未定義のカスタム要素が登録されるまで待機できる。

### 使用例ケース1: whenDefined() でカスタム要素の定義を待つ

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <my-element></my-element>

  <script>
    customElements.whenDefined("my-element").then(() => {
      console.log("my-element が定義されました！");
      document.querySelector("my-element").textContent = "アップグレード完了！";
    });

    // カスタム要素を遅延定義
    setTimeout(() => {
      class MyElement extends HTMLElement {}
      customElements.define("my-element", MyElement);
    }, 3000);
  </script>
</body>
</html>
```

`whenDefined()` を使うと、`<my-element>`の定義が 3秒後に行われても、スクリプトがエラーにならずに処理が実行 される。

### 使用例ケース2: 動的インポート (import()) を使ったカスタム要素のロード

```html
<!DOCTYPE html>
<html lang="ja">
<body>
  <my-element></my-element>

  <script>
    customElements.whenDefined("my-element").then(() => {
      console.log("my-element のカスタム要素が定義されました！");
    });

    // 動的にカスタム要素をロード
    import("./my-element.js");
  </script>
</body>
</html>
```
`my-element.js` が非同期でロードされ、定義が完了すると whenDefined() の then() が実行される。

### 使用例ケース3: await を使った処理待機

```js
async function waitForElement() {
  await customElements.whenDefined("my-element");
  console.log("my-element が定義されました！");
}
waitForElement();
```

`await` を使えば、カスタム要素の定義を待機してから次の処理を実行できる。


## 例: 自律カスタム要素
<popup-info> カスタム要素は、画像アイコンとテキスト文字列を属性として取り、アイコンにフォーカスすると、テキストをポップアップ情報ボックスに表示し、さらにコンテキスト内の情報を提供します。

### PopupInfo というクラス
```js
// 要素のためのクラスを作成
class PopupInfo extends HTMLElement {
  constructor() {
    // コンストラクターでは super を常に最初に呼び出す
    super();
  }

  connectedCallback() {
    // シャドウルートを生成
    const shadow = this.attachShadow({ mode: "open" });

    // span 要素を生成
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    const info = document.createElement("span");
    info.setAttribute("class", "info");

    // 属性の中身を取得し、情報 span の中に入れる
    const text = this.getAttribute("data-text");
    info.textContent = text;

    // アイコンを挿入
    let imgUrl;
    if (this.hasAttribute("img")) {
      imgUrl = this.getAttribute("img");
    } else {
      imgUrl = "img/default.png";
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    icon.appendChild(img);

    // いくらかの CSS を生成してシャドウ DOM に適用
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

    .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

    // 生成要素をシャドウ DOM に結びつける
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}
```
### カスタム要素を CustomElementRegistry に登録
```js
customElements.define("popup-info", PopupInfo);

```

### カスタム要素の利用

```html
<popup-info
  img="img/alt.png"
  data-text="Your card validation code (CVC)
  is an extra security feature — it is the last 3 or 4 numbers on the
  back of your card."></popup-info>
```

### 外部スタイルの利用
上記の例では、`<style>` 要素を用いてシャドウ DOM にスタイルを適用したが、`<link>` 要素から外部スタイルシートを参照することが可能。

```js
// 要素のためのクラスを作成
class PopupInfo extends HTMLElement {
  constructor() {
    // コンストラクターでは super を常に最初に呼び出す
    super();
  }

  connectedCallback() {
    // シャドウルートを生成
    const shadow = this.attachShadow({ mode: "open" });

    // span 要素を生成
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    const info = document.createElement("span");
    info.setAttribute("class", "info");

    // 属性の中身を取得し、情報 span の中に入れる
    const text = this.getAttribute("data-text");
    info.textContent = text;

    // アイコンを挿入
    let imgUrl;
    if (this.hasAttribute("img")) {
      imgUrl = this.getAttribute("img");
    } else {
      imgUrl = "img/default.png";
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    icon.appendChild(img);

    // 外部スタイルシートをシャドウ DOM に適用
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "style.css");

    // 生成した要素をシャドウ DOM に結びつける
    shadow.appendChild(linkElem);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}

```

## 例: カスタム組み込み要素

### 組み込み要素のHTMLUListElementを利用した、ExpandingList というクラス
```js
// 要素のためのクラスを作成
class ExpandingList extends HTMLUListElement {
  constructor() {
    // コンストラクターでは super を常に最初に呼び出す
    // super() の返値はこの要素への参照
    self = super();
  }

  connectedCallback() {
    // このカスタム ul 要素の子である ul および li 要素を取得する
    // li 要素は、その中に ul がある場合、コンテナーとして機能する
    const uls = Array.from(self.querySelectorAll("ul"));
    const lis = Array.from(self.querySelectorAll("li"));
    // すべての子の ul を隠す
    // これらのリストは、ユーザーが上位レベルのコンテナーをクリックしたときに表示される
    uls.forEach((ul) => {
      ul.style.display = "none";
    });

    // ul内のli要素をそれぞれ見ていく
    lis.forEach((li) => {
      // この li に ul が子要素としてある場合、クリックハンドラーを追加する
      if (li.querySelectorAll("ul").length > 0) {
        // スタイル設定で使用できる属性を追加し、
        // 開く・閉じるアイコンを表示させる
        li.setAttribute("class", "closed");

        // li 要素のテキストを新しい span 要素で囲むことで、
        // span にスタイルやイベントハンドラーを割り当てることができる
        const childText = li.childNodes[0];
        const newSpan = document.createElement("span");

        // li から span にテキストをコピーし、カーソルスタイルを設定
        newSpan.textContent = childText.textContent;
        newSpan.style.cursor = "pointer";

        // この span にクリックハンドラーを追加
        newSpan.addEventListener("click", (e) => {
          // span 要素の次兄弟要素は ul であるはず
          const nextul = e.target.nextElementSibling;

          // 表示状態を切り替え、ul の class 属性を更新
          if (nextul.style.display == "block") {
            nextul.style.display = "none";
            nextul.parentNode.setAttribute("class", "closed");
          } else {
            nextul.style.display = "block";
            nextul.parentNode.setAttribute("class", "open");
          }
        });
        // span を追加し、li から裸のテキストノードを除去
        childText.parentNode.insertBefore(newSpan, childText);
        childText.parentNode.removeChild(childText);
      }
    });
  }
}
```

## ライフサイクルコールバック
`connectedCallback()`