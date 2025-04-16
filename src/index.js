import "./style.css";
import "./setup.css";
import generateSetupForm from "./setup-form-generator.js";

(function init() {
  function loadContent(functionGenerator) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(functionGenerator());
  }

  loadContent(generateSetupForm);
})();
