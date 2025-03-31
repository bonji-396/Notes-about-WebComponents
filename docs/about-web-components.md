# Web Componentsとは

アプリケーション内でよく使うコンポーネントを再利用するため、独自に要素（HTMLタグ）定義し利用する技術です。
また、この定義したHTMLとCSS及びJavaScriptを、DOMスコープ内にカプセル化した状態で利用できるので、独立性が保たれ再利用性が高くなります。


https://www.webcomponents.org/

Web コンポーネントは、Web プラットフォーム API のセットであり、Web ページや Web アプリで使用する新しいカスタム、再利用可能なカプセル化された HTML タグを作成できます。カスタム コンポーネントとウィジェットは、Web コンポーネント標準に基づいて構築され、最新のブラウザーで動作し、HTML で動作する JavaScript ライブラリまたはフレームワークで使用できます。

Web コンポーネントは、既存の Web 標準に基づいています。現在、Web コンポーネントをサポートする機能が HTML および DOM 仕様に追加されており、Web 開発者はカプセル化されたスタイルとカスタム動作を備えた新しい要素で HTML を簡単に拡張できます。

## 構成技術
ウェブコンポーネントは、以下の3つの主要な技術からなり、それらを組み合わせて多目的なカスタム要素を作成します。
|要素|説明|
|---|---|
|[Custom Elements](custom-elements.md)|任意の振る舞いを持つ独自のHTMLで、独自のDOM要素を定義するためのJavaScript APIです。Custom Elementsで新たに定義したDOMはメソッドやプロパティの追加ができます。|
|[Shadow DOM](shadowdom.md)|DOMに独立したDOMツリーを定義し、スコープを実現します。<br>カプセル化した（ローカルスコープを設定した）スタイルとマークアップを定義する仕様です。通常の小要素とは分離されたスコープが設定されたDOMツリーである、Shadowツリーよ呼び出し利用します。<br>Shadowツリーのスタイルには外部のDOM要素には適用されず、また外部のスタイルがShadowツリー内部のDOM要素に適用れることもありません。Custom Elementと組み合わせることで、再利用性の高いコンポーネントを作成することができます。|
|[Template](html-template.md)と[slot](slot.md)|[HTML Template](html-template.md)は、DOMのテンプレートとして宣言し、、このテンプレートはページ読み込み時には使用されず、JavaScriptを利用してインスタンス化されドキュメントに挿入されます。<br> [HTML slot](slot.md) ウェブコンポーネント内で別な DOM ツリーを構築し、一緒に表示することができる独自のマークアップを入れることができるプレイスホルダーです。|


## 実装するの流れ

Web Componentを実装する基本的な流れは以下に挙げている通りです。

1. templete要素で、UIの部品を作る
2. HTMLElements を継承した Custom Elementを作る
3. Custom Elementに、Shadow Rootを定義し、これにtemplateをcloneNodeで append する
4. このCustom Elementにメソッドや、カスタムイベントを設定し、変化した場合のレンダリング方法を記述する
5. CSSもShadowRoot内に定義する。
6. <slot>など利用して、他の要素を入れ込むような仕組みも作る
7. window.customElements に、この作ったCustom Elementをdefine()し、登録する。