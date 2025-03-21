const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = /* html */ `
<style>
  .card {
    border-radius: 5px;
    border: 1px solid var(--line-color, #0066CC);
  }
  .card-header {
    padding: 0.5rem;
    font-size: 1.2rem;
    text-align: center;
    background-color: var(--element-bg-color, #0066CC);
    color: white;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid var(--line-color, #0066CC);
  }
  .card-body{
    padding: 0.5rem;
  }
</style>
<div class="card">
  <div class="card-header">
    <slot name="card-header">Card Header</slot>
  </div>
  <div class="card-body">
    <slot name="card-body">Card Body</slot>
  </div>
</div>
`;

class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.shadowRoot.appendChild(cardTemplate.content.cloneNode(true));
  }
}

customElements.define("app-card", Card);
