import html from './flipcard.html';
import css from './flipcard.css';

import { generateHTMLelementInnerHTML } from "../utils";

export class CwcFlipCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open'});
    this.shadowRoot.innerHTML = generateHTMLelementInnerHTML( css, html );
  }
}