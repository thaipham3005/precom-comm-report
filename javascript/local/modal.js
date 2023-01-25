$('.modal').find('.btn-close, .btn-cancel').on('click', function (e) {
    let modal = $(this).parents('.modal')
    let modalcontent = $(this).parents('.modal-content')
    $(modalcontent).removeClass('flyin')
    $(modalcontent).addClass('flyout')

    window.setTimeout(() => $(modal).addClass('hidden'), 500)

})

$('#btn-login').on('click', function (e) {
    $('.modal').removeClass('hidden')
    let modalcontent = $('#modal-username').find('.modal-content')
    $(modalcontent).removeClass('flyout')

    $(modalcontent).addClass('flyin')


})

