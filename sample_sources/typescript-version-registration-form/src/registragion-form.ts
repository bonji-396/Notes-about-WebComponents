import "./input.js";
import "./button.js";
import "./card.js";

type State = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string
}
const formTemplate = document.createElement("template");
formTemplate.innerHTML = /* html */ `
<style>
  app-button {
    text-align: end;
  }
</style>
<app-card>
  <h3 slot="card-header">Sign Up</h3>
  <app-input slot="card-body" label="Username"></app-input>
  <app-input slot="card-body" label="Email"></app-input>
  <app-input slot="card-body" label="Password" type="password"></app-input>
  <app-input slot="card-body" label="Password Repeat" type="password"></app-input>
  <app-button slot="card-body">登録</app-button>
</app-card>
`;

class RegistrationForm extends HTMLElement {
  private state!: State;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordRepeat: ""
    };
  }

  connectedCallback() {
    this.shadowRoot!.appendChild(formTemplate.content.cloneNode(true));
    
    const appInputs = this.shadowRoot!.querySelectorAll("app-input");
    const button: Button | null = this.shadowRoot!.querySelector("app-button");
    const [
      usernameInput,
      emailInput,
      passwordInput,
      passwordRepeatInput,
    ] = Array.from(appInputs) as [
      InstanceType<typeof Input>,
      InstanceType<typeof Input>,
      InstanceType<typeof Input>,
      InstanceType<typeof Input>,
    ];;

    usernameInput.addEventListener("app-input", (event) => {
      this.state.username = (event as CustomEvent<string>).detail;
      usernameInput.validation = "none";
    });
    emailInput.addEventListener("app-input", (event) => {
      this.state.email = (event as CustomEvent<string>).detail;
    });
    passwordInput.addEventListener("app-input", (event) => {
      this.state.password = (event as CustomEvent<string>).detail;
      if (this.state.password !== this.state.passwordRepeat) {
        passwordRepeatInput.help = "Password Mismatch";
        passwordRepeatInput.validation = "invalid";
      } else {
        passwordRepeatInput.help = "Passwords are matching";
        passwordRepeatInput.validation = "valid";
      }
    });
    passwordRepeatInput.addEventListener("app-input", (event) => {
      this.state.passwordRepeat = (event as CustomEvent<string>).detail;
      if (this.state.password !== this.state.passwordRepeat) {
        passwordRepeatInput.help = "Password Mismatch";
        passwordRepeatInput.validation = "invalid";
      } else {
        passwordRepeatInput.help = "Passwords are matching";
        passwordRepeatInput.validation = "valid";
      }
    });
    this.addEventListener("click-app-button", (event) => {
      button!.inprogress = true;
      // ダミー処理
      setTimeout(() => {
        usernameInput.validation = "invalid";
        usernameInput.help = "Name must be unique";
        emailInput.validation = "invalid";
        emailInput.help = "Cannot be null";
        button!.inprogress = false;
      }, 2000);
    });
  }
}

customElements.define("app-form", RegistrationForm);
