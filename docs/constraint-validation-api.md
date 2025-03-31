# 制約検証API（Constraint Validation API）を Web Componentsに取り込む

- [制約検証](https://developer.mozilla.org/ja/docs/Web/HTML/Constraint_validation)
- [制約検証API](https://developer.mozilla.org/ja/docs/Learn_web_development/Extensions/Forms/Form_validation#制約検証_api)


ブラウザでの制約検証API（Constraint Validation API）は、特定の入力要素でのみ完全に実装されています。主に以下のHTML要素で利用できます：

- `<input>` タイプ：text、password、email、url、search、tel、number、date、range、color、checkbox、radio など
- `<output>`
- `<select>`
- `<textarea>`
- `<button>`
- `<fieldset>`

これらの要素は `ValidityState` インターフェースを実装しており、`validity` プロパティを通じて様々な検証状態（valueMissing、typeMismatch、patternMismatch など）にアクセスできます。

カスタム要素や標準外の要素では、制約検証APIを直接利用することはできませんが、以下の方法で同様の機能を実現できます：

1. カスタム要素内部に標準の入力要素を含め、それに対して制約検証APIを適用
2. カスタムバリデーションロジックを実装し、ValidityState インターフェースの動作を模倣
3. Web Componentsで `ElementInternals` と `setValidity()` メソッドを使用

例えば、Web Components を使用する場合：

```javascript
class CustomInput extends HTMLElement {
  static formAssociated = true;
  #internals;
  
  constructor() {
    super();
    this.#internals = this.attachInternals();
    // シャドウDOMなどの設定
  }
  
  // カスタムバリデーション
  validate() {
    const value = this.value;
    if (!value) {
      this.#internals.setValidity({valueMissing: true}, '値を入力してください', null);
      return false;
    }
    // 他のバリデーションルール
    
    // バリデーション成功
    this.#internals.setValidity({});
    return true;
  }
}

customElements.define('custom-input', CustomInput);
```

