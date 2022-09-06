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

import css from "./levels.css";
import html from "./levels.html";

import { createTemplateForWebComponent } from "../utils.js";

import levelsBulletInactive from "../../public/assets/levels-bullet-inactive.svg";
import levelsBulletActive from "../../public/assets/levels-bullet-active.svg";
import levelsBulletCompleted from "../../public/assets/levels-bullet-completed.svg";

const cwcLevelsTemplate = createTemplateForWebComponent({ html, css });

export class CwcLevels extends HTMLElement {
  constructor() {
    super();

    this._levels = [];
    this._currentLevel = 0;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(cwcLevelsTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["levels", "currentlevel"];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "levels") {
      if (newValue) {
        try {
          const levelsParsed = JSON.parse(newValue);
          this._setLevels(levelsParsed);
        } catch (error) {
          console.error("levels attribute is not a JSON list");
          this._setLevels([]);
        }
      } else {
        this._setLevels([]);
      }
    }

    if (attributeName === "currentlevel") {
      this._setCurrentLevel(Number.parseInt(newValue));
    }
  }

  /**
    querySelector("cwc-levels")._setLevels([
      { tooltip: "Tooltip for level 1" },
      { tooltip: "Tooltip for level 2" },
      { tooltip: "Tooltip for level 3" },
      { tooltip: "Tooltip for level 4" },
      { tooltip: "Tooltip for level 5" },
    ])
   */
  _setLevels(levels) {
    this._levels = levels;

    const bulletsContainer =
      this.shadowRoot.querySelector(".bullets-container");
    bulletsContainer.innerHTML = "";

    for (const level of levels) {
      // TODO: redo this as an HTML file
      const newBullet = document.createElement("div");
      newBullet.classList.add("bullet");
      newBullet.innerHTML = `
        <img class="bullet-img-for-inactive" src="${levelsBulletInactive}" alt="Level inactive"/>
        <img class="bullet-img-for-active" src="${levelsBulletActive}" alt="Level active"/>
        <img class="bullet-img-for-completed" src="${levelsBulletCompleted}" alt="Level completed"/>
      `;
      newBullet.setAttribute("data-tooltip", level.tooltip);
      bulletsContainer.append(newBullet);
    }

    this._setCurrentLevel(this._currentLevel);
  }

  _setCurrentLevel(currentLevel) {
    this._currentLevel = currentLevel;

    const progressBar = this.shadowRoot.querySelector(".progress-bar");
    const bullets = this.shadowRoot.querySelectorAll(".bullet");

    progressBar.style.width = `${
      (100 / Math.max(1, this._levels.length - 1)) * currentLevel
    }%`;

    bullets.forEach((bullet, bulletIndex) => {
      bullet.classList.remove("bullet-completed");
      bullet.classList.remove("bullet-active");
      bullet.classList.remove("bullet-inactive");

      if (bulletIndex < currentLevel) {
        bullet.classList.add("bullet-completed");
      } else if (bulletIndex === currentLevel) {
        bullet.classList.add("bullet-active");
      } else {
        bullet.classList.add("bullet-inactive");
      }
    });
  }
}
