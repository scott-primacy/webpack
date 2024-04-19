import $ from "jquery";
import "slick-carousel";

import "./_carousel.scss";

export default () => {
   // initialize carousel library here
   $(".slick-carousel").slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      responsive: [
         {
            breakpoint: 768,
            settings: {
               centerMode: false
            }
         }
      ]
   });
};
