jQuery(document).on('ready', function () {
    jQuery('.menu li').click(function () {
        jQuery(this).toggleClass('clicked');
    });

    var l = document.getElementById('menu_seleccion');
    if (l !== undefined) {
        l.click();
    }

});

function menu_presentacion() {
    loadHtml(root + '/dashboard/seleccion/indexpresentacion', '#workArea', function (xhr, text) {
        $('.menu li').removeClass('clicked');
        $(this).addClass('clicked');
    })
}
function menu_seleccion() {
    loadHtml(root + '/dashboard/seleccion/indexseleccion', '#workArea', function (xhr, text) {
        jQuery('.menu li').removeClass('clicked');
        jQuery(this).addClass('clicked');
        jQuery("#tabs").tabs();
        //cargar combo region
	cargar_lista_prioridades();
        cargar_cboregion();
        cargar_lenguas();
        cargar_familia();
		/*cuando es 1 registro de la etapa 2 se selecciona por defecto la region*/
		
        
        jQuery("#btn_vista_previa").off('click');
        jQuery("#btn_vista_previa").click(function (event) {
            loadHtml(root + '/dashboard/seleccion/vistaprevia', '#workArea', function (xhr, text) {
                jQuery("#btn_regresar_seleccion").click(function () {
                    var l = document.getElementById('mnu_seleccion');
                    if (l !== undefined) {
                        l.click();
                    }
                });
               // event.stopPropagation();
                
                 jQuery("#btn_reenviar_mail").click(function () {
                    var timer;
                    jQuery("#btn_reenviar_mail").removeClass("btn btn-naranja").addClass("btn btn-naranja-disabled");
                    jQuery('#btn_reenviar_mail').attr('disabled', 'disabled');
                    jQuery.ajaxSetup({
                        async: false
                    });
                    jQuery.ajax({
                        url: root + '/dashboard/seleccion/enviarformatodigital',
                        type: 'POST',
                        dataType: 'json',
                        success: function (data) {
                            var version = msieversion();
                            if (parseInt(version) === 1) {
                                alerta_general(data.mensaje);
                                timer = setTimeout("reset_timer_id()", 900000);
                            } else {
                                alert(data.mensaje);
                                timer = setTimeout("reset_timer_id()", 900000);
                            }
                        }
                    });
                });
            })
        });
		

        jQuery('#cboFamilia').change(function (e) {
            if (checks_seleccionados.length > 0) {
                jQuery("#error_familia").dialog({
                    dialogClass: 'no-close',
                    resizable: false,
                    width: 400,
                    modal: true,
                    draggable: false,
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
            }

        });

        jQuery('#cboRegion').change(function (e) {

            if (checks_seleccionados.length > 0) {
                jQuery("#error_region").dialog({
                    dialogClass: 'no-close',
                    resizable: false,
                    width: 400,
                    modal: true,
                    draggable: false,
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
            }  else {
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
		

        //validar cambio de region
        jQuery('#cboRegion').on('click', function (e) {
            if (checks_seleccionados.length > 0) {
                jQuery("#error_region").dialog({
                    dialogClass: 'no-close',
                    resizable: false,
                    width: 400,
                    modal: true,
                    draggable: false,
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
//                                jQuery("#lista_seleccionados").trigger("sortupdate");
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
            }
        });
		

        jQuery('#cboFamilia').on('click', function (e) {
            if (checks_seleccionados.length > 0) {
                jQuery("#error_familia").dialog({
                    dialogClass: 'no-close',
                    resizable: false,
                    width: 400,
                    modal: true,
                    draggable: false,
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
//                                jQuery("#lista_seleccionados").trigger("sortupdate");
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
            }
        });

//        busqueda_grid();

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

        jQuery("#all_lenguas").click(function () {
            if (this.checked) {
                jQuery('#list_lenguas input[type="checkbox"]').each(function () {
                    this.checked = true;
                    jQuery(this).attr('checked', 'true');
                });
            }
            if (!this.checked) {
                jQuery('#list_lenguas input[type="checkbox"]').each(function () {
                    this.checked = false;
                });
            }
        });

        jQuery("#btn_limpiar").click(function () {
            jQuery('#panel_1 input[type="checkbox"],#panel_2 input[type="checkbox"]').each(function () {
                this.checked = false;
            });
            $("#grid").GridUnload();
            jQuery('#grid_principal').hide();


        });


        /*
         
         var cantidad = 5;
         var array = [1, 2, 4, 4, 5];
         var registros =array.length;
         var error = 0;
         var faltante = [];
         if (registros <= cantidad) {
         for (var i = 0; i < registros; i++) {  
         if (array.indexOf(i+1) === -1) {                
         faltante.push(i+1);
         error++;
         }
         };
         
         }
         
         */
		validar(7);
        jQuery("#btn_save_plazas").click(function () {
            var array_prioridad = [];
            var listado = [];
            var error = 0;
            var faltante = [];
            var cont_registros = 0;
            jQuery("#lista_seleccionados li").each(function (index) {
                listado.push(jQuery(this).find('input').val() + '__' + this.id);
                array_prioridad.push(parseInt(jQuery(this).find('input').val()));
                cont_registros++;
            });

            if (cont_registros <= max_seleccion) {
                for (var i = 0; i < cont_registros; i++) {
                    if (array_prioridad.indexOf(i + 1) === -1) {
                        faltante.push(i + 1);
                        error++;
                    }
                }
            } else {
                return false;
            }

            if (cont_registros > 0) {
                if (error > 0) {
                    alerta_general('Debe ingresar la prioridad de forma correcta, donde la de su mayor preferencia es la número 1 y así de manera correlativa.');
//                    alerta_general('Corrija las prioridades asignadas. Recuerde que la última prioridad que asigne está en función del número de registros seleccionados');
                } else {
                    var objSeleccion1 = {
                        ids: listado,
                    };
                    jQuery.ajax({
                        url: root + '/dashboard/seleccion/guardar_seleccion_plazas',
                        type: 'POST',
                        data: objSeleccion1,
                        dataType: 'json',
                        success: function (data) {
                            jQuery('#btn_save_plazas').removeAttr('disabled');
                            jQuery('#btn_vista_previa').prop("disabled", false);
                            jQuery("#btn_vista_previa").removeClass("btn btn-naranja-disabled").addClass("btn btn-naranja");
                            alerta_general(data.mensaje);
                        }
                    });
                }

            } else {

                if (jQuery('#e_rgster').val() !== '0') {
                    var objSeleccion2 = {
                        ids: 0,
                    };
                    jQuery.ajax({
                        url: root + '/dashboard/seleccion/guardarsinseleccion',
                        type: 'POST',
                        data: objSeleccion2,
                        dataType: 'json',
                        success: function (data) {
                            jQuery('#btn_save_plazas').removeAttr('disabled');
                            jQuery('#btn_vista_previa').prop("disabled", false);
                            alerta_general(data.mensaje);
                        }
                    });

//                    return false;
                } else {
                    alerta_general('No tiene registros desea guardar.');
                    return false;
                }
            }
        });

        jQuery("#btn_search").click(function () {
            if (jQuery('#cboRegion').val() === '') {
                alerta_general('Debe seleccionar una Región.');
                return false;
            }

            if (parseInt(jQuery('#id_grupo').val()) === 13) {
                if (parseInt(jQuery('#cboFamilia').val()) === 0) {
                    alerta_general('Debe seleccionar una Familia profesional.');
                    return false;
                }
            }

            jQuery('#contenedor_busqueda').show();
            var selected = [];
            var selected2 = [];
            var selected3 = [];
            var selected4 = [];
            var selected5 = [];

            jQuery('#list_ugeles input:checked').each(function () {
                if (jQuery(this).is(':checked')) {
                    if (jQuery(this).attr('value') !== undefined) {
                        selected.push(jQuery(this).attr('value'));
                    }
                }
            });

            jQuery('#list_lenguas input:checked').each(function () {
                if (jQuery(this).is(':checked')) {
                    if (jQuery(this).attr('value') !== undefined) {
                        selected2.push(jQuery(this).attr('value'));
                    }
                }
            });

            jQuery('#list_gestion input:checked').each(function () {
                if (jQuery(this).is(':checked')) {
                    selected3.push(jQuery(this).attr('value'));
                }
            });

            jQuery('#list_ruralidad input:checked').each(function () {
                if (jQuery(this).is(':checked')) {
                    selected4.push(jQuery(this).attr('value'));
                }
            });

            jQuery('#list_tipo_iiee input:checked').each(function () {
                if (jQuery(this).is(':checked')) {
                    selected5.push(jQuery(this).attr('value'));
                }
            });
            var objQuery = {
                qry_region: jQuery('#cboRegion').val(),
                qry_dre_ugel: selected,
                qry_lenguas: selected2,
                qry_gestion: selected3,
                qry_ruralidad: selected4,
                qry_tipoiiee: selected5
            };
            var id_fam = 0;
            var id_familia = jQuery('#cboFamilia').val();
            if (id_familia !== undefined && id_familia !== 0 && id_familia !== null) {
                id_fam = id_familia;
            }
            var qry_str = JSON.stringify(objQuery);
            if (jQuery('#cboRegion').val() === '') {
                jQuery('#grid_principal').hide();
            } else {
                jQuery('#grid_principal').show();
                var encoded_query = Base64.encode(qry_str);
//                    busqueda_grid2(qry_str);


                busqueda_grid2(encoded_query, id_fam);

            }


        });


    });
}
;

function limpiar_checkbox() {
    jQuery('#panel_1 input[type="checkbox"],#panel_2 input[type="checkbox"]').each(function () {
        this.checked = false;
    });

}
;
function msieversion() {
    if (navigator.userAgent.indexOf('MSIE') != -1) {
        var detectIEregexp = /MSIE (\d+\.\d+);/ //test for MSIE x.x
    } else { // if no "MSIE" string in userAgent
        var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ //test for rv:x.x or rv x.x where Trident string exists
    }
    if (detectIEregexp.test(navigator.userAgent)) { //if some form of IE
        var ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
        if (ieversion >= 5) {
            return -1;
        }
    } else {
        return 1;
    }
};

function validar(id){
 
var region_hddn = jQuery("#idregion_2").val();
var grupo_hddn = jQuery("#id_grupo").val();
var familia_hddn = jQuery("#idfamilia_2").val();
if (region_hddn !== undefined) {
 
           jQuery("#cboRegion").val(region_hddn);
           jQuery("#cboRegion").attr('disabled', 'disabled');
           cargar_ugel(region_hddn);
          if ( grupo_hddn === "13" ) {
 
jQuery("#cboFamilia").val(familia_hddn);
               jQuery("#cboFamilia").attr('disabled', 'disabled');
           }
       }
 
}



