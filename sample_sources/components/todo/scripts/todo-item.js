const template = document.createElement('template');
template.innerHTML = `
  <li class="item">
    <input type="checkbox">
    <label></label>
    <button class="destory">x</button>
  </li>
`;

class TodoItemElement extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._text = '';
    this._checked = false;
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));
    this.$item = this._root.querySelector('.item');
    this.$text = this._root.querySelector('label');
    this.$removeButton = this._root.querySelector('.destory');
    this.$checkbox = this._root.querySelector('input');
    this.$removeButton.addEventListener('click', (e) => {
      console.log('removeButton click', e);
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('onRemove', { detail: this.index }));
    });
    this.$checkbox.addEventListener('click', (e) => {
      console.log('checkbox click', e);
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('onToggle', { detail: this.index }));
    });
    this._render();
  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._text = newValue;
  }

  _render() {
    if (!this.$item) return;
    this.$text.textContent = this._text;
    if (this._checked) {
      this.$item.classList.add('completed');
      this.$checkbox.setAttribute('checked', '');
    } else {
      this.$item.classList.remove('completed');
      this.$checkbox.removeAttribute('checked');
    }
  }

  set index(value) {
    this._index = value;
  }

  get index() {
    return this._index;
  }

  set checked(value) {
    this._checked = Boolean(value);
  }

  get checked() {
    return this.hasAttribute('checked');
  }
}

window.customElements.define('todo-item', TodoItemElement);
