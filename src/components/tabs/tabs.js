import Tab from "bootstrap/js/dist/tab";

export default () => {
   // add options / events here

   // init bootstrap tab
   [].forEach.call(document.querySelectorAll("[data-bs-toggle='tab']"), (el) => {
      console.log("tab");
      new Tab(el);
   });

};
