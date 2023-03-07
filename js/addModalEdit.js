var check = true
const list = $('.list')
const downArrow = $('.down-arrow')
const id = $('#id')

$('.select-field').on('click',()=>{

    if (check){
        $('.list').toggle('show')
        $('.down-arrow').addClass('rotate180')
        $('#id').addClass('squaring-corners')
        check = false
    }else{
        $('.list').toggle('show')
        $('.down-arrow').removeClass('rotate180')
        $('#id').removeClass('squaring-corners')
        check = true
    }
});


