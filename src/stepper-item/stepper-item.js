import css from './stepper-item.css';
import html from './stepper-item.html';
import { generateHTMLelementInnerHTML } from '../utils';


export class CwcStepperItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._style;
    this._status = '';
    this._isLast = false;
    this.shadowRoot.innerHTML = generateHTMLelementInnerHTML(css, html);
    this._setIsLast();
  }

  static get observedAttributes() {
    return ['is-last'];
  };

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'is-last') {
      this._setIsLast();
    }
  }
  

  setStatus(status, stepNumber) {
    const wrapper = this.shadowRoot.querySelector('.step');
    if (wrapper) {
      if (!wrapper.classList.contains(status)) {
        if (status === 'done') {
          wrapper.querySelector('.step-bullet').innerHTML = ''
        } else {
          wrapper.querySelector('.step-bullet').innerHTML = stepNumber;
        }
        wrapper.className = '';
        wrapper.classList.add('step');
        wrapper.classList.add(status);
        if (this._isLast) {
          wrapper.classList.add('is-last');
        }
        this._status = status;
      }
    }
  }

  get status() {
    return this._status;
  }

  _setIsLast() {
    this._isLast = this.hasAttribute('is-last') ? true : false;
    const wrapper = this.shadowRoot.querySelector('.step');
    if (this._isLast) {
      if (!wrapper.classList.contains('is-last')) {
        wrapper.classList.add('is-last');
      }
    } else {
      if (wrapper.classList.contains('is-last')) {
        wrapper.classList.remove('is-last');
      }
    }
  }

}
