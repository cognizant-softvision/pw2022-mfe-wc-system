import css from "./multiselect-item.css";
import html from "./multiselect-item.html";

import { createTemplateForWebComponent } from "../utils.js";

const cwcMultiselectItemTemplate = createTemplateForWebComponent({ html, css });

export class CwcMultiselectItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      cwcMultiselectItemTemplate.content.cloneNode(true)
    );
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("input")
      .addEventListener("change", (event) => {
        this.shadowRoot.querySelector("cwc-checkbox-icon")._setChecked(event.target.checked)
        
        const change = new Event("change", {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(change);
      });
  }

  _getName() {
    return this.getAttribute('name');
  }

  _isChecked() {
    return this.shadowRoot.querySelector("input").checked;
  }

  static get observedAttributes() { return ['nightmode'] }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'nightmode') {
      if (newValue !== null && newValue !== undefined) {
        this.shadowRoot.querySelector("label").classList.add('nightmode')
      } else {
        this.shadowRoot.querySelector("label").classList.remove('nightmode')
      }
    }
  }
}
