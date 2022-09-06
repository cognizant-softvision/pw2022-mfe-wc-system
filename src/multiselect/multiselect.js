/**
    Usage:

        <cwc-levels currentlevel="0"></cwc-levels>

        querySelector("cwc-levels").setAttribute("levels", JSON.stringify([
          { tooltip: "Tooltip for level 1" },
          { tooltip: "Tooltip for level 2" },
          { tooltip: "Tooltip for level 3" },
          { tooltip: "Tooltip for level 4" },
          { tooltip: "Tooltip for level 5" },
        ]))
      
    OR

        <cwc-levels></cwc-levels>

        querySelector("cwc-levels")._setLevels([
          { tooltip: "Tooltip for level 1" },
          { tooltip: "Tooltip for level 2" },
          { tooltip: "Tooltip for level 3" },
          { tooltip: "Tooltip for level 4" },
          { tooltip: "Tooltip for level 5" },
        ])

        querySelector("cwc-levels")._setCurrentLevel(1)
        querySelector("cwc-levels")._setCurrentLevel(2)
        querySelector("cwc-levels")._setCurrentLevel(3)
        querySelector("cwc-levels")._setCurrentLevel(4)
*/

import css from "./multiselect.css";
import html from "./multiselect.html";

import { createTemplateForWebComponent } from "../utils.js";

const cwcMultiselectTemplate = createTemplateForWebComponent({ html, css });

export class CwcMultiselect extends HTMLElement {
  constructor() {
    super();

    this._expanded = false;
    this._state = {};

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(cwcMultiselectTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector(".multiselect-toggle-dropdown")
      .addEventListener("click", () => this._toggleDropdown());

    this.shadowRoot
      .querySelector("#overlay")
      .addEventListener("click", () => this._toggleDropdown());

    this.shadowRoot
      .querySelector("#options-slot")
      .addEventListener("slotchange", (event) => {
        for (const optionElement of event.target.assignedElements()) {
          optionElement.addEventListener('change', (event) => {
            event.stopPropagation()

            this._updateSelectionText()

            this._updateState(optionElement._getName(), optionElement._isChecked())
          })
        }
      })
  }

  _toggleDropdown() {
    const overlay = this.shadowRoot.getElementById("overlay");
    const checkboxes = this.shadowRoot.getElementById("checkboxes");
    if (!this._expanded) {
      overlay.style.display = "block";
      checkboxes.style.display = "block";
      this._expanded = true;
    } else {
      overlay.style.display = "none";
      checkboxes.style.display = "none";
      this._expanded = false;
    }
  }

  _updateSelectionText() {
    const options = this.shadowRoot.querySelector("#options-slot")
      ? this.shadowRoot.querySelector("#options-slot").assignedElements()
      : [...this.shadowRoot.querySelector("#checkboxes").children]
      
    const checkedOptions = options.filter(option => option._isChecked())
    
    const selectionTextElement = this.shadowRoot.querySelector("#selection-text")
    if (checkedOptions.length === 0) {
      selectionTextElement.innerHTML = "Select..."
    } else {
      selectionTextElement.innerHTML = checkedOptions.map(option => option.innerHTML).join(", ")
    }
  }

  static get observedAttributes() { return ['options', 'required', 'disabled', 'nightmode'] }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "options") {
      this._buildChildrenFromJsonString(newValue)
    }
    
    if (attributeName === 'required') {
      if (newValue !== null && newValue !== undefined) {
        this.shadowRoot.querySelector(".multiselect").classList.add('required')
      } else {
        this.shadowRoot.querySelector(".multiselect").classList.remove('required')
      }
    }
    
    if (attributeName === 'disabled') {
      if (newValue !== null && newValue !== undefined) {
        this.shadowRoot.querySelector(".multiselect").classList.add('disabled')
        this.shadowRoot.querySelector(".multiselect-toggle-dropdown").setAttribute('disabled', "true")
      } else {
        this.shadowRoot.querySelector(".multiselect").classList.remove('disabled')
        this.shadowRoot.querySelector(".multiselect-toggle-dropdown").removeAttribute("disabled")
      }
    }
    
    if (attributeName === 'nightmode') {
      if (newValue !== null && newValue !== undefined) {
        this.shadowRoot.querySelector(".multiselect").classList.add('nightmode')
      } else {
        this.shadowRoot.querySelector(".multiselect").classList.remove('nightmode')
      }
    }
  }

  /**
   * Can be called directly, or by setting the HTML attribute `options`.
   * @param {string} optionsAsJsonString See _buildChildrenFromJsonObject for the JSON shape
   */
  _buildChildrenFromJsonString(optionsAsJsonString) {
    let options = [];
    try {
      options = optionsAsJsonString ? JSON.parse(optionsAsJsonString) : [];
    } catch (e) {
      console.error("Invalid options", e);
    }
    this._buildChildrenFromJsonObject(options);
  }
  
  /**
   * Can be called directly, or by setting the HTML attribute `options`, except that this method allow callbacks on each children.
   * (functions are not available in JSON strings.)
   * @param {{ name: string; label: string; onChange?: ({ itemElement}) => void }[]} optionDefinitions 
   */
  _buildChildrenFromJsonObject(optionDefinitions) {
    const checkboxes = this.shadowRoot.querySelector("#checkboxes");
    for (const child of checkboxes.children) {
      checkboxes.removeChild(child)
    }

    optionDefinitions.forEach((optionDefinition) => {
      const itemElement = document.createElement("cwc-multiselect-item");
      itemElement.setAttribute("name", optionDefinition.name);
      itemElement.innerHTML = optionDefinition.label;
      checkboxes.appendChild(itemElement);

      itemElement.addEventListener("change", (event) => {
        event.stopPropagation();
        
        this._updateSelectionText();

        // parent event
        this._updateState(itemElement._getName(), itemElement._isChecked());

        // children events
        if (optionDefinition.onChange) {
          optionDefinition.onChange({ itemElement })
        }
      });
    });
  }
  
  _updateState(itemName, newValue) {
    this._state = {
      ...this._state,
      [itemName]: newValue,
    };

    const change = new Event("change", {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(change);
  }
}
