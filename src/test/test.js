import css from "./test.css";
import html from "./test.html";

import { createTemplateForWebComponent } from "../utils.js"

const cwcTestTemplate = createTemplateForWebComponent({ html, css })

export class CwcTest extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(cwcTestTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["color"];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "color") {
      this.shadowRoot.querySelector('.cwc-test-p').style.color = newValue
    }
  }
}
