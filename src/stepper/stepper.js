import css from './stepper.css';
import html from './stepper.html';

import { generateHTMLelementInnerHTML } from "../utils";


export class CwcStepper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._current;
    this._slot;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = generateHTMLelementInnerHTML(css, html);
    this._current = this.hasAttribute('current') ? +this.getAttribute('current') : 1;
    this._slot = this.shadowRoot.querySelector('slot');
    this._slot.addEventListener('slotchange', this._onSlotChange.bind(this));
  }

  static get observedAttributes() {
    return ['current'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'current') {
      const newCurrent = +newValue;
      if (!isNaN(newCurrent)) {
        this._current = newCurrent;
        this._setSteps();
      }
    }
  }

  /**
   * Get the active step of the stepper
   * @return {number} The number of the active step of the stepper; Returns -1 if there is not an active step
  */
  _getActiveStepIndex() {
    return this._getSteps().findIndex(step => {
      return step.status === 'active';
    });
  }

  /**
   * Get the current steps in the stepper
   * @return {Element[]} An array with the elements in the steps; Returns an empty array if it's empty
   */
  _getSteps() {
    if (this._slot) {
      const steps = this._slot.assignedElements();
      if (steps.length > 0) {
        return steps;
      }
    }
    return [];
  }

  /**
   * Set the steps status in the stepper 
  */
  _setSteps() {
    const index = this._current -1;
    const steps = this._getSteps();
    steps.forEach((step, i) => {
      if (index === i) {
        step.setStatus('active', i + 1);
      } else if (index > i) {
        step.setStatus('done', i + 1);
      } else {
        step.setStatus('inactive', i + 1);
      }

      if (steps.length - 1 === i) {
        if (!step.hasAttribute('is-last')) {
          step.setAttribute('is-last', '');
        }
      } else {
        if (step.hasAttribute('is-last')) {
          step.removeAttribute('is-last');
        }
      }
    });
  }

  _onSlotChange() {
    this._setSteps();
  }

}