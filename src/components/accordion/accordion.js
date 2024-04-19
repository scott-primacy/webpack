// Import Dependencies
import BadgerAccordion from "badger-accordion";
import "./_accordion.scss";

// https://www.github.com/stuartjnelson/badger-accordion
export default function () {
   // Creating a new instance of the accordion
   const accordionDomNode = document.querySelector(".accordion");
   new BadgerAccordion(accordionDomNode, {
      headerClass: ".accordion-header",
      panelClass: ".accordion-panel",
      panelInnerClass: ".accordion-panel-inner",
      initializedClass: "accordion-initialized",
      hiddenClass: "is-hidden",
      headerDataAttr: "data-accordion-header-id"
   });
}
