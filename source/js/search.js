export const initSearch = () => {
    const searchInput = $('#desktop-search');

    searchInput.focusout(function() {
        $(this).val('');
    })
}


