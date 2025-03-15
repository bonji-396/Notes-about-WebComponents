const template = document.createElement('template');
template.innerHTML = `
  <section>
    <todo-input></todo-input>
    <ul id="list-container"></ul>
  </section>
`;

class MyTodoElement extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._list = [
      { text: 'my todo 1', checked: false },
      { text: 'my todo 2', checked: true },
    ];
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));
    this.$input = this._root.querySelector('todo-input');
    this.$listContainer = this._root.querySelector('#list-container');
    this.$input.addEventListener('onSubmit', this.addItem.bind(this));
    this._render();
  }

  _render() {
    if (!this.$listContainer) return;
    this.$listContainer.innerHTML = '';
    this._list.forEach((item, index) => {
      let $item = document.createElement('todo-item');
      $item.index = index;
      $item.checked = item.checked;
      $item.setAttribute('text', item.text);
      $item.addEventListener('onRemove', this.removeItem.bind(this));
      $item.addEventListener('onToggle', this.toggleItem.bind(this));
      this.$listContainer.appendChild($item);
    });
  }

  addItem(e) {
    this._list.push({ text: e.detail });
    this._render();
  }

  removeItem(e) {
    this._list.splice(e.detail, 1);
    this._render();
  }

  toggleItem(e) {
    console.log('toggleItem()', e);
    const item = this._list[e.detail];
    this._list[e.detail] = Object.assign({}, item, {
      checked: !item.checked,
    });
    this._render();
  }
}

window.customElements.define('my-todo', MyTodoElement);
