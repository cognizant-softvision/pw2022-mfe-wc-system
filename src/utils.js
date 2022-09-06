/**
 * @param {{ html: string, css: string }} param0 
 * @returns A <template> element
 */
export function createTemplateForWebComponent({ html, css }) {
  const template = document.createElement("template");
  template.innerHTML = generateHTMLelementInnerHTML(css, html);
  return template;
}

/**
 * Get the inner html for a HTMLElement
 * @param {string} css   classes for the shadow root
 * @param {string} html     html for the shadow root
 * @param {string} html     formatted html with styles
 */
 export const generateHTMLelementInnerHTML = (css, html) => {
  return `
    <style>
      ${css}
    </style>

    ${html}
  `
};
