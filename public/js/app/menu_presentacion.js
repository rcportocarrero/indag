function menu_presentacion() {
    load_menu_presentacion();
    jQuery('.left_menu li').removeClass('clicked');
    jQuery('#mnuPresentacion').addClass('clicked');
}

function load_menu_presentacion(ops) {
    if (ops === undefined) {
        ops = 0;
    }

    if (valida_sesion() === false) {
        return;
    }

    BaseX.load_html(root + '/dashboard/index/presentacion', {
        data: ops,
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
        }
    });
}