const template = document.createElement('template');

template.innerHTML = `
  <style>
    p {
      font-weight: bold;
      color: #f0f;
    },
    
  </style>
  <p>This is a coustom element!</p>
`;

class MinimumElement extends HTMLElement {
  // 要素の作成または、アップグレード時に呼び出される。
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    console.log('カスタム要素の作成または、アップグレードされました。');
  }
  connectedCallback() {
    console.log('カスタム要素がページに追加されました。');
  }

  disconnectedCallback() {
    console.log('カスタム要素がページから除去されました。');
  }

  adoptedCallback() {
    console.log('カスタム要素が新しいページへ移動されました。');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`属性 ${name} が変更されました。`);
  }
}

customElements.define('minimum-el', MinimumElement);
