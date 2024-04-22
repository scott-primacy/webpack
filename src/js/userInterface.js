// Import Dependencies
import "intersection-observer";
import lozad from "lozad";
import objectFitImages from "object-fit-images";
import $ from "jquery";
import {debounce} from "debounce";
// import "slick-carousel";

export default function () {
   // Smooth Scroll
   function initSmoothScroll() {
      let anchorLink = $(".anchor-link");

      if (anchorLink.length > 0) {
         anchorLink.on("click", function (event) {
            event.preventDefault();

            let offset = $($(this).attr("href")).offset().top - 100;
            let $offsetTarget = $($(this).attr("href"));

            $("html, body").animate({scrollTop: offset}, 500, function () {
               $offsetTarget.attr("tabindex", -1).focus();
            });
         });
      }
   }

   // Init Lazy Loading and Options
   function initLazyLoad() {
      let lazyImage = lozad(".lazyload", {
         // ratio of how much of the element is within viewport
         // * REDUCE THRESHOLD FOR LARGER MODULES *
         threshold: 0.4,

         loaded: function (el) {
            // Custom class added to a loaded element
            el.classList.add("loaded");
         }
      });

      let toggleClass = lozad("[data-toggle-class]");
      lazyImage.observe();
      toggleClass.observe();
   }

   // Object Fit
   objectFitImages(".object-fit");

   // Accordions
   function initAccordion() {
      // For Accordion - start
      $(".wpsm_panel-group").attr("role", "tablist").attr("aria-multiselectable", "false");

      $(".wpsm_panel-heading").attr("role", "tab");

      $(".wpsm_panel-heading a").attr("aria-expanded", "false").attr("role", "button").addClass("inactive");

      $(".wpsm_panel-heading a").each(function () {
         $(this).attr("aria-controls", $(this).parents(".wpsm_panel-heading").next().attr("id"));

         $(this).find(".ac_open_cl_icon").removeClass("fa fa-plus");

         if ($(this).hasClass("collapsed")) {
            //do nothing
         } else {
            $(this).addClass("collapsed");
         }
      });

      $(".wpsm_panel-collapse").attr("role", "tabpanel").attr("aria-expanded", "false");

      $(".wpsm_panel-heading").click(function () {
         $(".wpsm_panel-collapse").not($(this).next(".wpsm_panel-collapse")).removeClass("show");
      });

      $(".wpsm_panel-title a").click(function () {
         $(".wpsm_panel-title a").not($(this)).removeClass("active").addClass("inactive");
         $(this).removeClass("inactive").addClass("active");
      });

      // For Accordion - end
   }

   function initClientSlider() {
      if ($(".n2-section-smartslider ").length > 0) {
         $(".n2-section-smartslider .modal").each(function () {
            $("body").append($(this));
         });
      }
   }

   const FOCUSABLE_ELEMENT_SELECTORS =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]'; // eslint-disable-line
   const KEY_CODE_MAP = {
      TAB: 9
   };

   /**
    * A stateless keyboard utility to -
    * - Trap focus,
    * - Focus the correct Element
    * @param config {
    *   el: HTMLElement. The Parent element, within which the focus should be trapped
    *   focusElement: <Optional> HTMLElement. If Not provided, focus is put to the first focusable element
    * }
    * @return {Function} Function. The cleanup function. To undo everything done for handling A11Y
    */
   function trapFocus(config) {
      if (!config) {
         throw new Error("Could not initialize focus-trapping - Config Missing");
      }
      const el = config.el,
         escCallback = config.escCallback,
         focusElement = config.focusElement;

      if (!el) {
         throw new Error("Could not initialize focus-trapping - Element Missing");
      }
      if (escCallback && !(escCallback instanceof Function)) {
         throw new Error("Could not initialize focus-trapping - `config.escCallback` is not a function");
      }

      const focusableElements = el.querySelectorAll(FOCUSABLE_ELEMENT_SELECTORS);
      let keyboardHandler;

      //There can be containers without any focusable element
      if (focusableElements.length > 0) {
         const firstFocusableEl = focusableElements[0],
            lastFocusableEl = focusableElements[focusableElements.length - 1],
            elementToFocus = focusElement ? focusElement : firstFocusableEl;

         setTimeout(() => {
            elementToFocus.focus();
         }, 500);

         keyboardHandler = function keyboardHandler(e) {
            if (e.keyCode === KEY_CODE_MAP.TAB) {
               //Rotate Focus
               if (e.shiftKey && document.activeElement === firstFocusableEl) {
                  e.preventDefault();
                  lastFocusableEl.focus();
               } else if (!e.shiftKey && document.activeElement === lastFocusableEl) {
                  e.preventDefault();
                  firstFocusableEl.focus();
               }
            }
         };
         el.addEventListener("keydown", keyboardHandler);
      }

      //The cleanup function. Put future cleanup tasks inside this.
      return function cleanUp() {
         if (keyboardHandler) {
            el.removeEventListener("keydown", keyboardHandler);
         }
      };
   }

   // Init Functions
   initLazyLoad();
   initSmoothScroll();
   initAccordion();
   initClientSlider();

   // enable this to log out each item that receives focus
   // $(FOCUSABLE_ELEMENT_SELECTORS).on("focus", function (ev) {
   //     console.log(ev.target);
   // });

   let activeElementBeforeModal;
   let removeFocusTrap;
   $("#leadershipModal-01")
      .on("show.bs.modal", function () {
         // console.log("grabbing last focused element");
         activeElementBeforeModal = document.activeElement;
      })
      .on("shown.bs.modal", function () {
         // console.log("trapping focus");
         let closeButton = $("#leadershipModal-01").find(".btn-close-wrapper").eq(0);
         removeFocusTrap = trapFocus({el: $(this)[0], focusElement: closeButton});
      })
      .on("hidden.bs.modal", function () {
         // console.log("destrop focus trap");
         if (typeof removeFocusTrap === "function") {
            removeFocusTrap();
         }
         // console.log("moving focus back to orig");
         activeElementBeforeModal.focus();
      });

   $("#nav-toggle")
      .on("show.bs.collapse", function () {
         $("body").addClass("mobile-active");
         $("body").addClass("no-scroll");
      })
      .on("hide.bs.collapse", function () {
         $("body").removeClass("mobile-active");
         $("body").removeClass("no-scroll");
      });

   // jQuery
   $(document).ready(function () {
      $(document).on("hide.bs.modal", ".modal", () => {
         console.log("stop playing");
         if ($(this).find("iframe").length > 0) {
            $(this)
               .find("iframe")[0]
               .contentWindow.postMessage('{"event":"command","func":"' + "stopVideo" + '","args":""}', "*"); // eslint-disable-line
            // ref https://codepen.io/digitalredpanther/pen/dyXbVLz
         }
         if (typeof removeFocusTrap === "function") {
            removeFocusTrap();
         }
      });

      // Collapse Global Search
      var inputSearchGlobal = document.getElementById("inputSearchGlobal");
      $("#collapseSearchGlobal").on("shown.bs.collapse", function () {
         inputSearchGlobal.focus();
      });

      $(".search-global-button").on("click", function (ev) {
         var searchVal = $("#inputSearchGlobal").val();
         if (!searchVal) {
            ev.preventDefault();
            return false;
         }
      });

      $(".modal--video")
         .on("shown.bs.modal", function () {
            let closeButton = $(this).find(".modal-dismiss-button").eq(0);
            closeButton = closeButton ? closeButton : $(this).find(".btn-close-wrapper").eq(0);
            removeFocusTrap = trapFocus({el: $(this)[0], focusElement: closeButton});
         })
         .on("hide.bs.modal", function () {
            if (typeof removeFocusTrap === "function") {
               removeFocusTrap();
            }
         });
      $(".modal")
         .not(".modal--video")
         .on("shown.bs.modal", function () {
            let closeButton = $(this).find(".btn-close-wrapper").eq(0);
            removeFocusTrap = trapFocus({el: $(this)[0], focusElement: closeButton});
         })
         .on("hide.bs.modal", function () {
            if (typeof removeFocusTrap === "function") {
               removeFocusTrap();
            }
         });
   });

   // Mobile Detection
   // function mobileDetection() {
   //     if (window.innerWidth > 992) {
   //         $("body").removeClass("mobile-active");
   //         $("body").removeClass("no-scroll");
   //         $("#nav-toggle").collapse("hide");
   //     } else {
   //         // $("#nav-toggle").collapse("hidden");
   //         // $("body").addClass("mobile-active");
   //         // $("body").addClass("no-scroll");
   //     }
   // }

   // Scroll to Top
   // window.onscroll = function () {
   //     let scrolled = window.pageYOffset || document.documentElement.scrollTop,
   //         topBtn = document.getElementById("backTop");
   //     if (scrolled > 300) {
   //         topBtn.classList.add("visible");
   //     } else {
   //         topBtn.classList.remove("visible");
   //     }
   // };

   // Debounce
   // window.onresize = debounce(mobileDetection, 300);

   function calculateTallestHeightOfHeadingsInColumns() {
      document.querySelectorAll(".column-module").forEach(function (colGroup) {
         const columns = colGroup.querySelectorAll(".module-two-column-heading");
         let tallestPx = 0;
         columns.forEach(function (col) {
            col.style.height = "";
            let testHeight = col.offsetHeight;
            if (testHeight > tallestPx) {
               tallestPx = testHeight;
               // console.log(tallestPx);
            }
         });
         columns.forEach(function (col) {
            col.style.height = tallestPx + "px";
         });
      });
   }

   calculateTallestHeightOfHeadingsInColumns();
   // TODO: fix debounce__ "WEBPACK_IMPORTED_MODULE_4" __.debounce is not a function
   //window.onresize = debounce(calculateTallestHeightOfHeadingsInColumns, 300);

   function calculateTallestHeightOfVerticalTabPanes() {
      if (window.innerWidth > 992) {
         document.querySelectorAll(".tab--vertical").forEach(function (tabGroup) {
            const tabPanes = tabGroup.querySelectorAll(".tab-pane");
            let tallestPx = 0;
            tabPanes.forEach(function (tab) {
               tab.style.height = "";
               tab.style.display = "block"; // need to un-hide to measure...
               let testHeight = tab.offsetHeight;
               if (testHeight > tallestPx) {
                  tallestPx = testHeight;
                  console.log(tallestPx);
               }
               tab.style.display = ""; // re-hide
            });
            tabPanes.forEach(function (tab) {
               tab.style.height = tallestPx + "px";
            });
         });
      } else {
         document.querySelectorAll(".tab--vertical .tab-pane").forEach(function (tab) {
            tab.style.height = "";
         });
      }
   }

   calculateTallestHeightOfVerticalTabPanes();
   // TODO: fix debounce__ "WEBPACK_IMPORTED_MODULE_4" __.debounce is not a function
   //window.onresize = debounce(calculateTallestHeightOfVerticalTabPanes, 300);
}
