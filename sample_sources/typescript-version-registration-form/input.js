"use strict";
const template = document.createElement("template");
template.innerHTML = /* html */ `
<style>
  label {
    display: block;
  }
  input {
    width: 100%;
    box-sizing: border-box;
    min-width: 200px;
    padding: 1rem;
    border-radius: 3px;
    border: 1px solid lightgray;
  }
  span {
    font-size: 0.6rem;
    display: none;
  }
  :host([validation='invalid']) span {
    display: block;
    color:red;
  }
  :host([validation='invalid']) input {
    border-color: red;
  }
  :host([validation='valid']) span {
    display: block;
    color: green;
  }
  :host([validation='vaild'] input) {
    border-color: green;
  }
</style>
<label></label>
<input>
<span>Message</span>
`;
class Input extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    get help() {
        return this.getAttribute("help");
    }
    set help(help) {
        if (help)
            this.setAttribute("help", help);
    }
    get validation() {
        return this.getAttribute("validation");
    }
    set validation(validation) {
        if (validation)
            this.setAttribute("validation", validation);
    }
    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const label = this.shadowRoot.querySelector('label');
        label.textContent = this.getAttribute('label') ?? '';
        this.span = this.shadowRoot.querySelector('span');
        this.span.textContent = this.getAttribute('help') ?? '';
        const input = this.shadowRoot.querySelector('input');
        input.type = this.getAttribute('type') ?? 'text';
        input.addEventListener('input', (event) => {
            event.stopPropagation();
            const target = event.target;
            input.dispatchEvent(new CustomEvent('app-input', {
                bubbles: true,
                composed: true,
                detail: target.value,
            }));
        });
    }
    static get observedAttributes() {
        return ['help'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'help') {
            this.span.textContent = newValue ?? '';
        }
    }
}
customElements.define('app-input', Input);
