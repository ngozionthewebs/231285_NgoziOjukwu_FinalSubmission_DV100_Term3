
$(document).ready(function() {
    $('table').on('click', '.remove-button', function() {
        $(this).closest('tr').remove();
    });
});
