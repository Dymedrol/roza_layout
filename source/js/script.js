// import { initWishList } from './wishlist';
// import { initCheckUpload } from './checkUpload';
// import { initProductPage } from './productPage';
// import { initCollectionPage } from './collection-page';
// import { initCart } from './cart';
// import { initMobileMenuAccordion } from './mobileMenuAccordion';
// import { initSearch } from './search';

// $(document).ready(function(){
//   initWishList();
//   // initCheckUpload();
//   initProductPage();
//   initCart();
//   initCollectionPage();
//   initMobileMenuAccordion();
//   initSearch();

//   var checkDummyItems = function () {
//     var items = $('.special-product-wall__item-dummy');

//     if (!items.length) {
//       return
//     }

//     items.each( function() {
//       if ($(this).height() > 20 ) {
//         $(this).removeClass('special-list__item-dummy_no-border');
//       } else {
//         $(this).addClass('special-list__item-dummy_no-border');
//       }
//     });
//   }

//   setInterval(checkDummyItems, 1000);


//   $(".special-categories-mobile").owlCarousel({
//     margin: 1,
//     loop: true,
//     autoWidth: true,
//   });

//   $('.special-list-mobile').owlCarousel({
//     margin: 1,
//     loop: true,
//     autoWidth: true,
//   });

//   $('.special-pdp-slider').slick({
//     slidesToShow: 1,
//     infinite: true,
//     swipeToSlide: true,
//   });

//   var menu =  $('.special-product-controls__menu');

//   $('#plus').click(function() {
//     $('.special-menu__mobile').show();
//     $('body').addClass('no-scroll');
//   });

//   $('.special-menu__mobile-close').click(function(){
//     $('.special-menu__mobile').hide();
//     $('body').removeClass('no-scroll');
//   });



//   $('.special-product-controls__filters').click(function() {
//     menu.animate({width:'toggle'},250);
//     $('body').toggleClass('no-scroll');
//   });

//   $('.special-product-controls__menu-close').click(function() {
//     menu.animate({width:'toggle'},250);
//     $('body').toggleClass('no-scroll');
//   });

//   var bagInner = $('.special-bag-warnings');

//   if (bagInner.length) {

//     var minHeight = $('#MainContent').height();
//     bagInner.css('min-height', minHeight);

//     $( window ).resize(function() {
//       minHeight = $('#MainContent').height();
//       bagInner.css('min-height', minHeight);
//     });

//   }



// })


