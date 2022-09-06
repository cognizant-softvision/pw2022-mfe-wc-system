import { CwcLogin } from "./login/login";


/* *************** GOOGLE SSO DEPENDENCIES ***************** */
// For getting google script, this is ONE possible approach. Migh as well add it to host HTML or load it dynamically somehow (fetch/systemJS)
// const head = document.querySelector('head');
// const gsiScript = document.createElement('script');
// gsiScript.src = 'https://accounts.google.com/gsi/client';


// window.addEventListener('load', () => {
//   head.appendChild(gsiScript);
// });

// gsiScript.addEventListener('load', function () {
//   customElements.define('cwc-login', CwcLogin);
// });

/* ********************************************************** */


// window.customElements.define('cwc-login',CwcLogin)

// const CustomLogin = document.createElement('cwc-login')

// export default 'cwc-login';
// export default CustomLogin;

const init = () => new Promise((resolve) => {
  const head = document.querySelector('head');
  const gsiScript = document.createElement('script');
  gsiScript.src = 'https://accounts.google.com/gsi/client';
  
  
  // window.addEventListener('load', () => {
    head.appendChild(gsiScript);
  // });
  
  gsiScript.addEventListener('load', function () {
    customElements.define('cwc-login', CwcLogin);
    resolve('cwc-login')
  });
})

export default init()
