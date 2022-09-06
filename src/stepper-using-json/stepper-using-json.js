import css from './stepper-using-json.css';
import html from './stepper-using-json.html';

import { createTemplateForWebComponent } from '../utils';

const cwcStepperJsonTemplate = createTemplateForWebComponent({ html, css });

export class CwcStepperJson extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._steps = [];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(cwcStepperJsonTemplate.content.cloneNode(true));
    this._current = this.hasAttribute('current') ? +this.getAttribute('current') : 1;
    this._setSteps();
  }

  static get observedAttributes() {
    return ['current', 'steps'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'current') {
      const newCurrent = +newValue;
      if (!isNaN(newCurrent)) {
        this._current = newCurrent;
        this._updateSteps();
      }
    }

    if (name === 'steps') {
      this._setSteps();
    }
  }

  /**
   * Get the data for buildiing the steps
   */
  _getStepsData() {
    const stepsData = this.hasAttribute('steps') ? this.getAttribute('steps') : '';
    try {
      this._steps = stepsData ? JSON.parse(stepsData): [];
    } catch (e) {
      console.error('Invalid Options', e);
    }
  }

  /**
   * Build steps
   * @return {Array <Element>} An array of cwc-stepper-item elements
   */
  _buildSteps() {
    this._getStepsData();
    if (this._steps.length > 0) {
      return this._steps.map(step => {
        const stepItem = document.createElement('cwc-stepper-item');
        stepItem.innerHTML = step.description;
        return stepItem;
      });
    }
    return [];
  }

  /**
   * Set steps for the stepper
   */
  _setSteps() {
    const index = this._current - 1;
    const steps = this._buildSteps();
    const wrapper = this.shadowRoot.querySelector('div');
    
    if (wrapper) {
      wrapper.innerHTML = '';
      if (steps.length > 0) {
        steps.forEach((step, i) => {
          this._setStepStatus(index, i, step);
          if (steps.length - 1 === i) {
            if (!step.hasAttribute('is-last')) {
              step.setAttribute('is-last', '');
            }
          } else {
            if (step.hasAttribute('is-last')) {
              step.removeAttribute('is-last');
            }
          }
          wrapper.appendChild(step);
        });
      }
    }

  }

  /**
   * Update the steps in the stepper
   */
  _updateSteps() {
    const steps = this.shadowRoot.querySelectorAll('cwc-stepper-item');
    const index = this._current -1;
    if (steps.length > 0) {
      steps.forEach((step, i) => {
        this._setStepStatus(index, i, step);
      })
    }
  }

  /**
   * Set step's status
   * @param {Number}  currentIndex  Index of the active step
   * @param {Number}  stepIndex     Step number
   * @param {Number}  step          Step to be updated 
   */
  _setStepStatus(currentIndex, stepIndex, step) {
    if (currentIndex === stepIndex) {
      step.setStatus('active', stepIndex + 1);
    } else if (currentIndex > stepIndex) {
      step.setStatus('done', stepIndex + 1);
    } else {
      step.setStatus('inactive', stepIndex + 1);
    }
  }
}