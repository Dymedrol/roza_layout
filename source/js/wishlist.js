export const initWishList = () => {
    var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
    var wishlistBlock = $('#wishlist');

    if (!wishlistArray) {
        wishlistArray = [];
    }

    for (var i = 0; i < wishlistArray.length; i++) {
        var product = wishlistArray[i]
        jQuery.getJSON(wishlistArray[i] +'.js', function(product) {

        }).fail(function(error) {
            if (error.status == 404) {
                var array = wishlistArray.filter(function(elem){
                   return elem != product;
                });
                localStorage.setItem("wishlist", JSON.stringify(array));
                $('.js-header-wishlist').html(array.length);
                if (wishlistArray.length) {
                    var text = ': ' + wishlistArray.length;
                    $('.js-header-wishlist-mobile').html(text);
                } else {
                    $('.js-header-wishlist-mobile').html('');
                }

            }
        });
    }

    // console.log(wishlistArray);

    $('.js-header-wishlist').html(wishlistArray.length)

    if (wishlistArray.length) {
        var text = ': ' + wishlistArray.length;
        $('.js-header-wishlist-mobile').html(text);
    } else {
        $('.js-header-wishlist-mobile').html('');
    }

    var addToWishlist = $('#add-to-wishlist');

    var changeProductInWishlist = function(productPath) {
        wishlistArray = JSON.parse(localStorage.getItem("wishlist"));

        if (!wishlistArray) {
            wishlistArray = [];
        }

        var updateWishlist = function (wishlistArray) {
            localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
            $('.js-header-wishlist').html(wishlistArray.length);
            if (wishlistArray.length) {
                var text = ': ' + wishlistArray.length;
                $('.js-header-wishlist-mobile').html(text);
            } else {
                $('.js-header-wishlist-mobile').html('');
            }

            addToWishlist.toggleClass('special-pdp-product__info-controls-add-to-fav_added');
        }

        if (jQuery.inArray(productPath, wishlistArray) >= 0) {
            var wishlistArray = wishlistArray.filter(function(elem){
               return elem != productPath;
            });
            updateWishlist(wishlistArray);
        } else {
            wishlistArray.push(productPath);
            updateWishlist(wishlistArray);
        }
    }

    if (addToWishlist.length) {
        var productPath = window.location.pathname;

        if (jQuery.inArray(productPath, wishlistArray) >= 0) {
            addToWishlist.addClass('special-pdp-product__info-controls-add-to-fav_added');
        }

        addToWishlist.click(function() {
            changeProductInWishlist(productPath)
        })
    }

    if (wishlistBlock.length) {

        var template = $('#wishlist-template');
        var wishlistWrapper = $('#wishlist-wrapper');
        var cartList;

        var renderWishlistItems = function () {
            for (var i = 0; i < wishlistArray.length; i++) {
                jQuery.getJSON(wishlistArray[i] +'.js', function(product) {
                    var item = template.html();
                    var isInCart = false;
                    item = $(item)
                    item.attr('data-url', product.url);
                    item.find('.wishlist-link').attr('href', product.url);
                    item.attr('data-id', product.variants[0].id);
                    item.find('.item-designer').html(product.vendor);
                    item.find('.item-title').html(product.title);
                    var price = product.price.toString();
                    var xx = price.length - 2;
                    price = price.substring(0, xx) + "." + price.substring(xx, price.length)

                    item.find('.item-price').html('$' + price);
                    item.find('.special-bag__item-col1 img').attr('src', product.images[0] + '&width=248');
                    item.appendTo(wishlistWrapper);

                    item.find('.special-bag__item-close').click(function() {
                        var wish = item.attr('data-url');
                        var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
                        var wishlistArray = wishlistArray.filter(function(elem){
                           return elem != wish;
                        });
                        localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
                        $('.js-header-wishlist').html(wishlistArray.length)
                        if (wishlistArray.length) {
                            var text = ': ' + wishlistArray.length;
                            $('.js-header-wishlist-mobile').html(text);
                        } else {
                            $('.js-header-wishlist-mobile').html('');
                        }

                        $(this).closest('.special-bag__item').remove();
                    });

                    // console.log(cartList);
                    // console.log(product);

                    for (var i = 0; i < cartList.length; i++) {
                        if (cartList[i].id == product.variants[0].id) {
                            isInCart= true;
                            break
                        }
                    }

                    if (isInCart) {
                        item.find('.wishlist-button').hide();
                        item.find('.wishlist-button').next().show();
                    }

                    item.find('.wishlist-button').click(function() {
                        var id = $(this).closest('.special-bag__item').attr('data-id');
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
                                $(this).hide();
                                $(this).next().show();

                                // var wish = $(this).closest('.special-bag__item').attr('data-url');
                                // var wishlistArray = JSON.parse(localStorage.getItem("wishlist"));
                                // var wishlistArray = wishlistArray.filter(function(elem){
                                //    return elem != wish;
                                // });
                                // localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
                                // $('.js-header-wishlist').html(wishlistArray.length)
                                // $(this).closest('.special-bag__item').remove();

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

                            if (response.status === 422) {
                                $(this).html('SOLD OUT');
                                $(this).css('background', '#000');
                                $(this).attr('disabled', true)
                            }
                            // console.log(response)
                          return response.json();
                        })
                        .catch((error) => {
                          console.error('Error:', error);
                        });
                    });

                    // console.log(product)
                } );
            }
        }

        fetch(window.Shopify.routes.root + 'cart.js', {
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(result => {
            cartList = result.items;
            renderWishlistItems();
        })
        .catch((error) => {
          console.error('Error:', error);
        });

        if (!wishlistArray.length) {
            $('#empty').show();
        }


    }

}


