function menu_seleccion() {
    load_form(0, 0);
    jQuery('.left_menu li').removeClass('clicked');
    jQuery('#mnuSeleccion').addClass('clicked');
}

function load_form(state, uuid) {

    if (valida_sesion(1) === false) {

        return;
    }

    BaseX.load_html(root + '/seleccion/index/indexpresentacion', {
        data: {
            state: state,
            uuid: uuid
        },
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
        }
    });
}
