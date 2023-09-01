export const initCheckUpload = () => {
    var uploadButton = $('#checkout');

    var checkUpload = function() {
        var trueCount = 0;
        var statusBlocks = $('.filepond--file-status-main');
        var itemsLength = $('.special-bag__item').length

        if (statusBlocks.length) {

            statusBlocks.each(function(i) {
                var status = $(this).text().toLowerCase();
                if (status == 'upload complete') {
                    trueCount++;
                }
            });

            if (trueCount == itemsLength) {
                clearInterval(timer);
                uploadButton.text('checkout');

            }

        }
    }

    if ($('#main-cart-items').length) {
        var timer = setInterval(function(){
          checkUpload();
        }, 500);
    }
}


