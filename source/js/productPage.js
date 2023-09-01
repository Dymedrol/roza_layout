export const initProductPage = () => {
    var productPage = $('.special-pdp');

    if (!productPage.length) {
        return
    }

    var productId = productPage.attr('data-product-id');
    const submitButton = productPage.find('[type="submit"]');
    // console.log(productId);

    fetch(window.Shopify.routes.root + 'cart.js', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(result => {
        // console.log(result.items)
        var items = result.items;
        var isInCart = false;

        for (var i = 0; i < items.length; i++) {
            if (items[i].product_id == productId) {
                isInCart= true;
                break
            }
        }

        if (isInCart) {
            const goToCartButton = $('.special-pdp-product__info-controls-go-to-bag');
            goToCartButton.removeClass('hidden');
            $('.loading-overlay__spinner').addClass('hidden');
            submitButton.remove();
        } else {
            $('.loading-overlay__spinner').addClass('hidden');
            submitButton.removeClass('loading');
        }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

