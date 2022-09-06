import css from "./login.css";
import html from "./login.html";

import { createTemplateForWebComponent } from "../utils.js";

const LoginTemplate = createTemplateForWebComponent({ html, css });

export class CwcLogin extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'description', 'prompt'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(LoginTemplate.content.cloneNode(true));

    // Shadow DOM Elements
    this.loginButton = this.shadowRoot.getElementById('signInButton');
    this.userInput = this.shadowRoot.getElementById('userInput');
    this.titleText = this.shadowRoot.getElementById('titleText');
    this.descriptionText = this.shadowRoot.getElementById('descriptionText');
    this.textPrompt = this.shadowRoot.getElementById('textPrompt');

    this.emitLogInBind = this.emitLogIn.bind(this)
  }
  async emitLogIn() {
    const { value } = this.userInput;
    const valueTrimmed = value.trim();
    if(!valueTrimmed) {
      return;
    }
    console.log(
      "%cstart request...",
      "background: yellow; font-weight: bold; color: black"
    );
    console.log(valueTrimmed)
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          // "ey0234kbn3kadasdasdsdasd12ho2x2da (MOCKED in WebComponent Login)"
          this.valueTrimmed
        );
      }, 500);
    });
    this.loginSuccess(valueTrimmed)

    console.log(
      `%cToken response:  ===>  ${response}`,
      "background: yellowgreen; font-weight: bold; color: black"
    );
  }

  attributeChangedCallback(name, old, newVal) {
    // Invoked when one of the custom element's attributes is added, removed, or changed.
    if (name === 'title') {
      this.titleText.innerText = newVal;
    }
    if (name === 'description') {
      this.descriptionText.innerText = newVal;
    }
    if (name === 'prompt') {
      this.textPrompt.innerText = newVal;
    }
  }

  // can handl
  loginSuccess(user) {
    this.dispatchEvent(
      new CustomEvent('success', {
        detail: {
          user,
        },
      })
    );
  }
  emitError(error) {
    this.dispatchEvent(
      new CustomEvent('failure', {
        detail: {
          error,
        },
      })
    );
  }
  connectedCallback() {
    // Invoked when the custom element is first connected to the document's DOM.
    this.loginButton.addEventListener("click", this.emitLogInBind);
    // this.appendChild(this.loginBtnGSI)
  }
  disconnectedCallback() {
    // Invoked when the custom element is disconnected from the document's DOM.
    this.loginButton.removeEventListener("click", this.emitLogInBind);
  }

  adoptedCallback() {
    // Invoked when the custom element is moved to a new document.
  }
}

