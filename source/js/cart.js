export const initCart = () => {
    if (!$('cart-items').length) {
        return
    }

    var form = $('#cart');

    form.change(function(event){
        var target = $(event.target);
        var item = target.closest('.special-bag__item');
        var line = item.index() + 1;

        var updateProperties = function () {
            var uploadedPic = item.find('input[name="attributes[upload]"]').val();
            var noteText = item.find('textarea[name="attributes[notes]"]').val();
            jQuery.post('/cart/change.js', { 'line': line, 'properties': { 'upload': uploadedPic, 'note': noteText} });
        }

        var checkUpload = function () {
            var targertPicLoadingStatis = item.find('.filepond--file-status-main').text().toLowerCase();
            if (targertPicLoadingStatis == 'upload complete') {
                clearInterval(timer);
                return true;
            }
        }

        if (target.attr('name') == 'attributes[notes]') {
            updateProperties()
        }

        if (target.attr('type') == 'file') {
            var timer = setInterval(function(){
                if (checkUpload()) {
                    updateProperties();
                }
            }, 500);
        }

    });

}


