// Import Component dependencies
import initAccordionComponent from "../components/accordion/accordion";
import initSupportsComponent from "../components/vendor/supports-polyfill";
import initTabComponent from "../components/tabs/tabs";
import "bootstrap";
import iconFont from "../components/icon-font/icon-font";
import carousel from "../components/carousel/carousel";

// Import Primacy dependencies
import initUserInterfaceComponent from "./userInterface";

// Set onLoad
window.addEventListener("load", onLoad);

export function onLoad() {

   // Init functions on Load
   initAccordionComponent();
   initSupportsComponent();
   initTabComponent();
   iconFont();
   carousel();
   initUserInterfaceComponent();
}
