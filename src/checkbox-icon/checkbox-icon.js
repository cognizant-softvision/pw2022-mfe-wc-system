/*
    Usage:

        <checkbox-icon></checkbox-icon>
        <checkbox-icon checked></checkbox-icon>

    Or

        querySelector("checkbox-icon")._setChecked(false)
        querySelector("checkbox-icon")._setChecked(true)
*/


import css from "./checkbox-icon.css";
import html from "./checkbox-icon.html";

import { createTemplateForWebComponent } from "../utils.js";

const cwcCheckboxIconTemplate = createTemplateForWebComponent({ html, css });


export class CwcCheckboxIcon extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(cwcCheckboxIconTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["checked"];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "checked") {
      this._setChecked(newValue !== null && newValue !== undefined);
    }
  }

  _setChecked(isChecked) {
    if (isChecked) {
      this.shadowRoot
        .querySelector(".checkbox-icon-container")
        .classList.add("checked");
    } else {
      this.shadowRoot
        .querySelector(".checkbox-icon-container")
        .classList.remove("checked");
    }
  }
}
