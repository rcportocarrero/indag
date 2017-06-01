var _config = {
    url_valida_sesion: root + '/usuario/sesion/valida',
    url_logout: root + '/usuario/sec/logout'
};

jQuery(document).on('ready', function () {
    menu();    
});

function valida_sesion(vfs) {
    var rp = true;
    jQuery.ajaxSetup({
        cache: false,
        async: false
    });
    jQuery.ajax({
        url: _config.url_valida_sesion,
        data: {
            neko: jQuery('#hdn_sesion_token').val(),
            vfs: vfs,
        },
        method: 'post',
        success: function (xhr, txt) {
            rp = xhr.activo;
            if (rp === false) {
                bootbox.dialog({
                    message: _strings.app.msg_sistema_termino_sesion,
                    title: "Mensaje del sistema",
                    closeButton: false,
                    buttons: {
                        success: {
                            label: "Aceptar",
                            className: "btn-aceptar",
                            callback: function () {
                                document.location = _config.url_logout;
                            }
                        }
                    }
                });
            }
            
            if (vfs === 1){
                if (rp === true) {
                    if (xhr.ini === true) {
                        if (xhr.fin === true) {
                            load_procfin();
                            rp = false;
                            return rp;
                        }
                    } else {
                        load_procini();
                        rp = false;
                        return rp;
                    }
                }                
            }

        }
    });

    return rp;
}

function load_procini(ops) {
    if (ops === undefined) {
        ops = 0;
    }

    BaseX.load_html(root + '/dashboard/index/procini', {
        data: ops,
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
        }
    });
}

function load_procfin(ops) {
    if (ops === undefined) {
        ops = 0;
    }

    BaseX.load_html(root + '/dashboard/index/procfin', {
        data: ops,
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
        }
    });
}