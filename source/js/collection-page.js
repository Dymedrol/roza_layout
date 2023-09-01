export const initCollectionPage = () => {
    var productWall = $('#special-product-wall');
    var menu =  $('.special-product-controls__menu');
    var productWallItems = productWall.find('.special-product-wall__item');
    var cartArray = [];

    var changeProductInWishlist = function(productPath, item) {
        wishlistArray = JSON.parse(localStorage.getItem("wishlist"));

        if (!wishlistArray) {
            wishlistArray = [];
        }

        var updateWishlist = function (wishlistArray, item) {
            localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
            $('.js-header-wishlist').html(wishlistArray.length)
            item.toggleClass('special-product-wall__item-buttons-wishlist__in-wishlist');
        }

        if (jQuery.inArray(productPath, wishlistArray) >= 0) {
            var wishlistArray = wishlistArray.filter(function(elem){
               return elem != productPath;
            });
            updateWishlist(wishlistArray, item);
        } else {
            wishlistArray.push(productPath);
            updateWishlist(wishlistArray, item);
        }

    }

    if ($('.special-product-wall-designers').length) {
      return
    }

    if (!productWall.length) {
        return
    }

    fetch(window.Shopify.routes.root + 'cart.js', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(result => {
        var items = result.items;

        for (var i = 0; i < items.length; i++) {
            cartArray.push(items[i].id)
        }

        productWallItems.each(function() {
            var item = $(this);
            var itemID = item.attr('data-product-id');
            itemID = parseInt(itemID);

            if (jQuery.inArray(itemID, cartArray) >= 0) {
                item.find('.bag-empty-item').addClass('hidden');
                item.find('.bag-full-item').removeClass('hidden');
            }
        })

    })
    .catch((error) => {
      console.error('Error:', error);
    });

    productWallItems.each(function() {
        var item = $(this);
        var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
        if (!wishlistArray) {
          wishlistArray = [];
        }
        var url = item.attr('href');

        if (jQuery.inArray(url, wishlistArray) >= 0) {
            item.addClass('special-product-wall__item-buttons-wishlist__in-wishlist');
        }
    });

    productWall.click(function(e) {
        var target = $(e.target);

        if (target.closest('.js-product-add-to-bag').length) {
            e.preventDefault()
            var item =  target.closest('.special-product-wall__item');
            var url =  item.attr('href');
            var id = item.attr('data-product-id');
            id = parseInt(id, 10);

            let formData = {
             'items': [{
              'id': id,
              'quantity': 1
              }]
            };

            fetch(window.Shopify.routes.root + 'cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.status === 200) {
                    var count = $('#header-cart-count').text();
                    count =  parseInt(count, 10) + 1;
                    $('#header-cart-count').text(count);
                    if (count > 0) {
                        $('#header-cart-count-mobile').text(': ' + count);
                    } else {
                        $('#header-cart-count-mobile').text('');
                    }
                    $('.bag-full').removeClass('hidden');
                    $('.bag-empty').addClass('hidden');

                    item.find('.bag-empty-item').addClass('hidden');
                    item.find('.bag-full-item').removeClass('hidden');

                    var stickyBtn = $('.special-sticky-btn');
                    if (stickyBtn.length) {
                      if (count == 0) {
                        stickyBtn.addClass('hidden');
                      } else if (count == 1) {
                        stickyBtn.removeClass('hidden');
                        stickyBtn.text('1 item in your bag');
                      } else if (count > 1) {
                          stickyBtn.removeClass('hidden');
                          var text = count + ' items in your bag';
                          console.log(text)
                          stickyBtn.text(text);
                      }
                    }
                }

              return response.json();
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }

        if (target.closest('.js-product-add-to-wishlist').length) {
            e.preventDefault()

            var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
            if (!wishlistArray) {
                wishlistArray = [];
            }

            var item =  target.closest('.special-product-wall__item');
            var url =  item.attr('href');

            changeProductInWishlist(url, item);
        }
    });

    var isEmpty = function () {
      var total = productWall.find('.special-product-wall__item').length;

      if (!total) {
        var emptyHtml = '<div class="special-product-wall__item special-product-wall__item_empty">'
        emptyHtml+= '<p>no items</p>'
        emptyHtml+= "</div>"
        productWall.find('.special-product-wall__item').remove();
        productWall.prepend(emptyHtml);
      }
    }

    var loadingBlock = productWall.find('.special-product-wall__loading');
    var filters = '';
    var selectedDesigner = '';
    var selectedColors = '';
    var sectionId = productWall.attr('data-section-id');
    var isLoading = false;
    var isLast = false;
    var page = 2;

    var menuCategories = menu.find('.special-product-controls__menu-categories');
    var menuCategoriesItems = menuCategories.find('.special-product-controls__menu-categories-item');
    var menuColors = menu.find('.special-product-controls__menu-colors');
    var menuColorsItems = menuCategories.find('.special-product-controls__menu-colors-item');
    var applyButton = $('.special-product-controls__menu-apply');
    var categoriesFilterSelected = 0;
    var colorFilterSelected = 0;
    var originalPath = window.location.pathname + '/';

    var changeButtonText = function() {
      var count = categoriesFilterSelected + colorFilterSelected;
      var text = '';

      switch (count) {
        case 0:
          text = 'Apply No Filters';
          applyButton.removeClass('special-product-controls__menu-apply_active');
          break;
        case 1:
          text = 'Apply Filter';
          applyButton.addClass('special-product-controls__menu-apply_active');
          break;
        case 2:
          text = 'Apply 2 Filters';
          applyButton.addClass('special-product-controls__menu-apply_active');
          break;
      }

      applyButton.text(text);
    }

    $(window).scroll(function () {
       if ($(window).scrollTop() >= $(document).height() - $(window).height() - 200) {

        if (isLoading || isLast) {
          return
        }

        isLoading = true;
        loadingBlock.removeClass('hidden');

        var parameters = '';

        if (selectedDesigner) {
          parameters = '/' + selectedDesigner;

          if (selectedColors) {
            parameters = parameters + '+';
          }
        }

        if (selectedColors) {
          parameters = parameters + selectedColors;
        }

        var url = originalPath;

        fetch(url + parameters +  "?sections=" + sectionId + '&page=' + page)
          .then(response => response.json())
          .then(responce => {
            page++;
            var html = responce[Object.keys(responce)[0]];
            var lastItem = productWall.find('.special-product-wall__item').last()
            html = $.parseHTML(html);
            html = $(html)

            var items = $(html).find('.special-product-wall__item');
            if (!items.length) {
              isLast = true;
            }

            lastItem.after(items);
            isLoading = false;


            var productWallItems = productWall.find('.special-product-wall__item');
            productWallItems.each(function() {
            var item = $(this);
            var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
            if (!wishlistArray) {
              wishlistArray = [];
            }
            var url = item.attr('href');

            if (jQuery.inArray(url, wishlistArray) >= 0) {
                item.addClass('special-product-wall__item-buttons-wishlist__in-wishlist');
            }

            var itemID = item.attr('data-product-id');
            itemID = parseInt(itemID);

            if (jQuery.inArray(itemID, cartArray) >= 0) {
                item.find('.bag-empty-item').addClass('hidden');
                item.find('.bag-full-item').removeClass('hidden');
            }
        });
            loadingBlock.addClass('hidden');

            var total = productWall.find('.special-product-wall__item').length;

            isEmpty();

          })
          .catch((e) => {
            console.error(e);
          })


       }
    });

    menuCategories.click(function(e) {
      var selectedItem = $(e.target);

      var checkActiveItems = function() {
        categoriesFilterSelected = 0;
        if (menuCategories.find('.special-product-controls__menu-categories-item_active').length) {
          categoriesFilterSelected = 1;
        }
        changeButtonText();
      }

      if (!selectedItem.hasClass('special-product-controls__menu-categories-item')) {
        return
      }

      if (selectedItem.hasClass('special-product-controls__menu-categories-item_active')) {
        selectedDesigner = '';
        selectedItem.removeClass('special-product-controls__menu-categories-item_active');
        checkActiveItems();
        return
      }


      selectedDesigner = selectedItem.attr('data-tag');
      menuCategoriesItems.removeClass('special-product-controls__menu-categories-item_active');
      selectedItem.addClass('special-product-controls__menu-categories-item_active');

      checkActiveItems();

    });


    menuColors.click(function(e) {
      var selectedItem = $(e.target);

      if (!selectedItem.hasClass('special-product-controls__menu-colors-item')) {
        return
      }

      if (selectedItem.hasClass('special-product-controls__menu-colors-item-color_active')) {
        selectedItem.removeClass('special-product-controls__menu-colors-item-color_active');
      } else {
        selectedItem.addClass('special-product-controls__menu-colors-item-color_active');
      }

      var selectedColorItems = menuColors.find('.special-product-controls__menu-colors-item-color_active');
      selectedColors = '';

      selectedColorItems.each(function(index) {
        if (index == 0) {
          selectedColors = selectedColors + $(this).attr('data-color');
        } else {
          selectedColors = selectedColors + '+' + $(this).attr('data-color');
        }
      });

      colorFilterSelected = 0;
      if (menuColors.find('.special-product-controls__menu-colors-item-color_active').length) {
        colorFilterSelected = 1;
      }
      changeButtonText();

    });

    applyButton.click(function() {
      menu.toggle('slide');
      $('body').removeClass('no-scroll');

      var parameters = '';

      if (selectedDesigner) {
        parameters = '/' + selectedDesigner;

        if (selectedColors) {
          parameters = parameters + '+';
        }
      }

      if (selectedColors) {
        parameters = parameters + selectedColors;
      }

      page = 1;
      var url = originalPath + parameters + "?sections=" + sectionId + '&page=' + page + '/';

      fetch(url)
      .then(response => response.json())
      .then(responce => {
        page = 2;
        var html = responce[Object.keys(responce)[0]];
        html = $.parseHTML(html);
        html = $(html)

        var items = $(html).find('.special-product-wall__item');
        if (!items.length) {
          isLast = true;
        }

        productWall.find('.special-product-wall__item').remove();
        productWall.prepend(items);

        var productWallItems = productWall.find('.special-product-wall__item');

        productWallItems.each(function() {
            var item = $(this);
            var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
            if (!wishlistArray) {
              wishlistArray = [];
            }
            var url = item.attr('href');

            if (jQuery.inArray(url, wishlistArray) >= 0) {
                item.addClass('special-product-wall__item-buttons-wishlist__in-wishlist');
            }
        });

        var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
        if (!wishlistArray) {
          wishlistArray = [];
        }

        if (jQuery.inArray(url, wishlistArray) >= 0) {
            item.addClass('special-product-wall__item-buttons-wishlist__in-wishlist');
        }
        isLoading = false;
        isLast = false;
        loadingBlock.addClass('hidden');

        isEmpty();

      })
      .catch((e) => {
        console.error(e);
      })
    });

}

