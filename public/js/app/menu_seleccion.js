function menu_seleccion() {
    load_menu_seleccion();
    jQuery('.left_menu li').removeClass('clicked');
    jQuery('#mnuSeleccion').addClass('clicked');
}

function load_menu_seleccion() {

    if (valida_sesion(1) === false) {

        return;
    }

    BaseX.load_html(root + '/seleccion/index/indexseleccion', {
        data: {},
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
            jQuery('#cboRegion').off('change');
            jQuery('#cboRegion').on('change', function () {

                if (checks_seleccionados.length > 0) {
                    jQuery("#error_region").dialog({
                        dialogClass:    'no-close',
                        resizable:      false,
                        width:          400,
                        modal:          true,
                        draggable:      false,
                        buttons: [
                            {
                                text: "SÍ",
                                "class": 'btn-naranja',
                                click: function () {
                                    jQuery('#cboRegion').val('');
                                    jQuery('#cboRegion_hddn').val('');
                                    jQuery('#cboFamilia').val(0);
                                    jQuery('#cboFamilia_hddn').val(0);
                                    checks_seleccionados = [];
                                    jQuery('#lista_seleccionados').empty();
                                    texto_seleccionados();
                                    jQuery('#contenedor_seleccionadas').hide();
                                    jQuery('#list_ugeles').html("");
                                    jQuery("#grid").GridUnload();
                                    jQuery('#contenedor_busqueda').hide();
                                    jQuery(this).dialog("close");
                                }
                            },
                            {
                                text: "NO",
                                "class": 'btn-naranja',
                                click: function () {
                                    jQuery('#cboRegion').val(jQuery('#cboRegion_hddn').val());
                                    jQuery('#cboFamilia').val(jQuery('#cboFamilia_hddn').val());
                                    jQuery(this).dialog("close");
                                    e.preventDefault();
                                }
                            }
                        ]
                    }).prev(".ui-dialog-titlebar").css("background", "#777777 !important");
                } else {
                    jQuery("#grid").GridUnload();
                    jQuery('#contenedor_busqueda').hide();
                }

                if (jQuery('#cboRegion').val() !== '') {

                    limpiar_checkbox();
                    //cargar combo ugeles

                    cargar_ugel(jQuery('#cboRegion').val());

                    //Marcar todas las ugeles
                    jQuery('#list_ugeles input[type="checkbox"]').each(function () {
                        this.checked = true;
                        jQuery(this).attr('checked', 'true');
                    });
                    //Marcar todas las lenguas
                    jQuery('#list_lenguas input[type="checkbox"]').each(function () {
                        this.checked = true;
                        jQuery(this).attr('checked', 'true');
                    });
                    //Marcar los checks Gestión
                    jQuery('#list_gestion input[type="checkbox"]').each(function () {
                        this.checked = true;
                        jQuery(this).attr('checked', 'true');
                    });
                    //Marcar los checks de Ruraridad
                    jQuery('#list_ruralidad input[type="checkbox"]').each(function () {
                        this.checked = true;
                        jQuery(this).attr('checked', 'true');
                    });
                    //Marcar los cheks de Tipo de IE
                    jQuery('#list_tipo_iiee input[type="checkbox"]').each(function () {
                        this.checked = true;
                        jQuery(this).attr('checked', 'true');
                    });

                    jQuery("#all_ugel").click(function () {
                        if (this.checked) {
                            jQuery('#list_ugeles input[type="checkbox"]').each(function () {
                                this.checked = true;
                            });
                        }
                        if (!this.checked) {
                            jQuery('#list_ugeles input[type="checkbox"]').each(function () {
                                this.checked = false;
                            });
                        }
                    });
                } else {
                    jQuery('#contenedor_busqueda').hide();
                    jQuery('#list_ugeles').html('');
                    limpiar_checkbox();

                }

            });
        }
    });
}
