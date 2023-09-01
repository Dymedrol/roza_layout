export const initMobileMenuAccordion = () => {
    var accordionTop = $('.js-mobilemenu-accordion');

    if (!accordionTop.length) {
        return
    }

    accordionTop.click(function() {
        var top = $(this);
        var bottom = $(this).next('.special-menu__mobile-accordion-inner');
        bottom.toggleClass('hidden');
        top.toggleClass('open');
    })
}


