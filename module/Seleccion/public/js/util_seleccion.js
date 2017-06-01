var checks_seleccionados = [];
function cargar_cboregion() {
    $.getJSON(root + '/dashboard/seleccion/get_region', {format: "json"}, function (md) {
        $("#cboRegion").html("");
        var cmb2 = [];
        cmb2.push('<option value="">Seleccionar</option>');
        $.each(md, function (key, val) {
            cmb2.push('<option value="' + val["id_region"] + '">' + val["desc_region"] + '</option>');
        });
        $("#cboRegion").html(cmb2.join(''));
    });

}

function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}
function reset_timer_id(){    
    jQuery('#btn_reenviar_mail').removeAttr('disabled');
    jQuery("#btn_reenviar_mail").removeClass("btn btn-naranja-disabled").addClass("btn btn-naranja");
}
function cargar_familia() {
    if (parseInt(jQuery('#id_grupo').val()) === 13) {
        $("#div_list_familia").show();
        $.getJSON(root + '/dashboard/seleccion/get_familia', {format: "json"}, function (md) {
            $("#cboFamilia").html("");
            var cmb2 = [];
            cmb2.push('<option value="0">Seleccionar</option>');
            $.each(md, function (key, val) {
                cmb2.push('<option value="' + val["id_familia"] + '">' + val["de_familia"] + '</option>');
            });
            $("#cboFamilia").html(cmb2.join(''));
        });
    } else {
        $("#div_list_familia").hide();
    }

}
function cargar_ugel(id) {
    $.getJSON(root + '/dashboard/seleccion/get_dre_ugel?id=' + id, {format: "json"}, function (md) {
        $("#list_ugeles").html("");
        var cmb2 = [];
        cmb2.push('<input id="all_ugel"  type="checkbox" name="all_ugel"/>Todas<br>');
        $.each(md, function (key, val) {
            cmb2.push('<input id="id_ugel_' + val["id_dre_ugel"] + '" type="checkbox" name="dre[]" value="' + val["id_dre_ugel"] + '"/>' + val["desc_dre_ugel"] + '<br>');
        });
        $("#list_ugeles").html(cmb2.join(''));
    });
}
function cargar_lenguas() {
    $.getJSON(root + '/dashboard/seleccion/get_lenguas', {format: "json"}, function (md) {
        $("#list_lenguas").html("");
        var cmb2 = [];
        cmb2.push('<input id="all_lenguas"  type="checkbox" name="all_lenguas"/>Todas<br>');
        $.each(md, function (key, val) {
            cmb2.push('<input id="id_lengua_' + val["id_lengua"] + '" type="checkbox" name="lengua[]" value="' + val["id_lengua"] + '"/>' + val["desc_lengua"] + '<br>');
        });
        $("#list_lenguas").html(cmb2.join(''));
    });
}
function alerta_general_registro(id) {
    jQuery("#alerta_general_registro").html('<p>' + id + '</p>')
    jQuery("#alerta_general_registro").dialog({
        resizable: false,
        width: 300,
        modal: true,
        draggable: false,
        buttons: [
            {
                text: "Aceptar",
                "class": 'btn-naranja',
                click: function () {
                    jQuery(this).dialog("close");
                }
            }
        ]
    }).prev(".ui-dialog-titlebar").css("background", "#777777 !important");
}
function alerta_general(id) {
    jQuery("#alerta_general").html('<p>' + id + '</p>')
    jQuery("#alerta_general").dialog({
        resizable: false,
        width: 400,
        modal: true,
        draggable: false,
        buttons: [
            {
                text: "Aceptar",
                "class": 'btn-naranja',
                click: function () {
                    jQuery(this).dialog("close");
                }
            }
        ]
    }).prev(".ui-dialog-titlebar").css("background", "#777777 !important");
}
function cargar_lista_prioridades() {
    jQuery.getJSON(root + '/dashboard/seleccion/get_prioridades', {format: "json"}, function (md) {
        if (md.length > 0) {
            $('#contenedor_seleccionadas').show();
            jQuery('#cboRegion').val(md[0].id_region);
            jQuery('#cboRegion_hddn').val(md[0].id_region);
            jQuery('#cboFamilia').val(md[0].id_familia);
            jQuery('#cboFamilia_hddn').val(md[0].id_familia);
            cargar_ugel(md[0].id_region);
            jQuery.each(md, function (key, val) {
                if (checks_seleccionados.indexOf("" + val.codigo_modular + "") === -1) {
                    checks_seleccionados.push(val.codigo_modular);
                }
                texto_seleccionados();
                jQuery("#lista_seleccionados").append("<li id='list__" + val.codigo_modular + "__" + val.id_total_plazas_por_institucion + "'></input><label class='grid_sec'><input type='text' class='priority' onkeypress='validate(event)'  maxlength='" + caracteres_seleccion + "' name='prioridad[]' value='" + val.prioridad + "' id='prior_" + val.codigo_modular + "_" + val.id_total_plazas_por_institucion + "'></input></label><label class='grid_sec'>" + val.desc_institucion + "</label><label class='grid_sec'>" + val.codigo_modular + "</label><label class='grid_sec'>" + val.desc_dre_ugel + "</label><label class='grid_sec' style='text-align:center'><a href='javascript: ' onclick='rmv(\"" + val.codigo_modular + "__" + val.id_total_plazas_por_institucion + "\",\"" + val.codigo_modular + "\")'><img src='../public/img/ico_eliminar.png' /></a></label></li>");
            });
        }
    });
}
var rd3 = Math.random();
function busqueda_grid2(obquery, id_familia) 
{
    $("#grid").GridUnload();
    jQuery("#grid").jqGrid({
        url: root + '/dashboard/seleccion/get-data-grilla?q=' + rd3 + '',
        datatype: "json",
        postData: {'rndom': obquery, 'fm': id_familia},
        height: 200,
        width: 925,
        colNames: ['Agregar', 'Dre/Ugel', 'Código modular', 'Nombre de IE', 'Tipo de IE', 'Distrito', 'Ámbito', 'Bilingüe', 'Lengua', 'Frontera', 'Vraem', 'Gestión', 'Oficio/Especialidad', 'Nro. de plazas'],
        colModel: [
            {name: 'codigo_modular', index: 'codigo_modular', width: 100, formatter: agregarIE, align: "center", sortable: false},
            {name: 'desc_dre_ugel', index: 'desc_dre_ugel', width: 140, align: "left", sortable: true},
            {name: 'codigo_modular', index: 'codigo_modular', width: 95, sortable: false},
            {name: 'desc_institucion', index: 'desc_institucion', width: 220, sortable: true},
            {name: 'tipo_ie', index: 'tipo_ie', width: 100, align: "center", sortable: false},
            {name: 'distrito', index: 'distrito', width: 100, align: "left", sortable: false},
            {name: 'ruralidad', index: 'ruralidad', width: 100, align: "left", sortable: false},
            {name: 'bilingue', index: 'bilingue', width: 50, align: "center", sortable: false},
            {name: 'desc_lengua', index: 'desc_lengua', width: 100, align: "center", sortable: false},
            {name: 'es_frontera', index: 'es_frontera', width: 50, align: "center", sortable: false},
            {name: 'es_vraem', index: 'es_vraem', width: 50, align: "center", sortable: false},
            {name: 'gestion', index: 'gestion', width: 80, align: "center", sortable: false},
            {name: 'de_familia_especialidad', index: 'de_familia_especialidad', width: 600, align: "left", sortable: false},
            {name: 'total_plazas_por_grupo_inscripcion', index: 'total_plazas_por_grupo_inscripcion', width: 100, align: "center", sortable: false},
        ],
        caption: "",
        rownumbers: false,
        rowNum: 50,
        rowList: [10, 20, 30, 50, 100, 200],
        pager: '#pager_tbl_busqueda',
        sortname: 'codigo_modular',
        viewrecords: true,
        multiselect: false,
        shrinkToFit: false,
        hidegrid: false,
        resizable: true,
        loadComplete: function () {           
                $('#grid_resultados').html($('#grid').getGridParam('records')+' Instituciones encontradas.');  // I used top & bottom pagers, so I hid one
        }   
    });
//.jqGrid('setFrozenColumns')
};
function agregarIE(cellvalue, options, rowObject) {

    var objeto = {
        plaza: rowObject['id_total_plazas_por_institucion'],
        codmodular: rowObject['codigo_modular'],
        dre: rowObject['desc_dre_ugel'],
        iiee: rowObject['desc_institucion'],
        bilingue: rowObject['bilingue'],
        especialidad: rowObject['de_familia_especialidad'],
        gestion: rowObject['gestion'],
        es_frontera: rowObject['es_frontera'],
    };
    var str = JSON.stringify(objeto);
    return "<button id='add_lista_prioridad' name='add_lista_prioridad' onclick='add_list_priority(" + str + ");' >+</button>";
}
//function add_list_priority2(objIE) {
//    var tamanio_chk = checks_seleccionados.length;
//    if (tamanio_chk > 0) {
//
//        if (checks_seleccionados.indexOf("" + objIE.codmodular + "") !== -1) {
//            alerta_general('El código modular ingresado ya se encuentra en la lista.');
//        } else {
//            if (tamanio_chk === 5) {
//                alerta_general('Usted ha seleccionado el número máximo de IE. Para continuar debe eliminar alguna IE previamente seleccionada');
//            }
//            if (tamanio_chk < 5) {
//                if (checks_seleccionados.indexOf("" + objIE.codmodular + "") === -1) {
//                    error_seleccion_plaza(objIE.bilingue, objIE.es_frontera, objIE.gestion, objIE.especialidad);
//                    checks_seleccionados.push(objIE.codmodular);
//                    $("#lista_seleccionados").append("<li id='list__" + objIE.codmodular + "__" + objIE.plaza + "'></input><label class='grid_sec'><a href='javascript: ' onclick='up_priority(\"" + objIE.codmodular + "__" + objIE.plaza + "\")'><img src='../public/img/arrow-up.png' /></a><a href='javascript: ' onclick='down_priority(\"" + objIE.codmodular + "__" + objIE.plaza + "\")'><img src='../public/img/arrow-down.png' /></a></label><label class='grid_sec'>" + objIE.iiee + "</label><label class='grid_sec'>" + objIE.codmodular + "</label><label class='grid_sec'>" + objIE.dre + "</label><label class='grid_sec' style='text-align:center'><a href='javascript: ' onclick='rmv(\"" + objIE.codmodular + "__" + objIE.plaza + "\",\"" + objIE.codmodular + "\")'><img src='../public/img/ico_eliminar.png' /></a></label></li>");
//                    texto_seleccionados();
//                }
//            }
//        }
//    } else {
//        $('#contenedor_seleccionadas').show();
//        error_seleccion_plaza(objIE.bilingue, objIE.es_frontera, objIE.gestion, objIE.especialidad);
//        checks_seleccionados = [];
//        checks_seleccionados.push(objIE.codmodular);
//        $("#lista_seleccionados").append("<li id='list__" + objIE.codmodular + "__" + objIE.plaza + "'></input><label class='grid_sec'><a href='javascript: ' onclick='up_priority(\"" + objIE.codmodular + "__" + objIE.plaza + "\")'><img src='../public/img/arrow-up.png' /></a><a href='javascript: ' onclick='down_priority(\"" + objIE.codmodular + "__" + objIE.plaza + "\")'><img src='../public/img/arrow-down.png' /></a></label><label class='grid_sec'>" + objIE.iiee + "</label><label class='grid_sec'>" + objIE.codmodular + "</label><label class='grid_sec'>" + objIE.dre + "</label><label class='grid_sec' style='text-align:center'><a href='javascript: ' onclick='rmv(\"" + objIE.codmodular + "__" + objIE.plaza + "\",\"" + objIE.codmodular + "\")'><img src='../public/img/ico_eliminar.png' /></a></label></li>");
//        texto_seleccionados();
//    }
//}
function add_list_priority(objIE) {
    
//    console.debug(objIE);
    var tamanio_chk = checks_seleccionados.length;
    if(objIE.codmodular === '0395392'){
//        alert('oh');
        alerta_general('Estimado postulante, se le recuerda que una de las plazas corresponde al ANEXO-SAN SALVADOR que se encuentra en el distrito de Condomarca.');
    
    }
    
    if (tamanio_chk > 0) {
        if(jQuery('#cboRegion_hddn').val() === jQuery('#cboRegion').val()){
       
            if (checks_seleccionados.indexOf("" + objIE.codmodular + "") !== -1) {
                alerta_general('La institución educativa ya ha sido seleccionada.');
            } else {
                if (tamanio_chk === parseInt(max_seleccion)) {
                    alerta_general('Usted ha seleccionado el número máximo de IE. Para continuar debe eliminar alguna IE previamente seleccionada');
                    return;
                }
                if (tamanio_chk < max_seleccion) {
                    if (checks_seleccionados.indexOf("" + objIE.codmodular + "") === -1) {
                        error_seleccion_plaza(objIE.bilingue, objIE.es_frontera, objIE.gestion, objIE.especialidad);
                        checks_seleccionados.push(objIE.codmodular);
                        jQuery("#lista_seleccionados").append("<li id='list__" + objIE.codmodular + "__" + objIE.plaza + "'><label class='grid_sec'><input type='text'  class='priority' onkeypress='validate(event)' maxlength='" + caracteres_seleccion + "' name='prioridad[]' value='' id='prior_" + objIE.codmodular + "_" + objIE.plaza + "'></input></label><label class='grid_sec'>" + objIE.iiee + "</label><label class='grid_sec'>" + objIE.codmodular + "</label><label class='grid_sec'>" + objIE.dre + "</label><label class='grid_sec' style='text-align:center'><a href='javascript: ' onclick='rmv(\"" + objIE.codmodular + "__" + objIE.plaza + "\",\"" + objIE.codmodular + "\")'><img src='../public/img/ico_eliminar.png' /></a></label></li>");
                        texto_seleccionados();
                    }
                }
            }
         }else{
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
    } else {
        jQuery('#cboRegion_hddn').val(jQuery('#cboRegion').val());
        jQuery('#cboFamilia_hddn').val(jQuery('#cboFamilia').val());
        jQuery('#contenedor_seleccionadas').show();
        error_seleccion_plaza(objIE.bilingue, objIE.es_frontera, objIE.gestion, objIE.especialidad);
        checks_seleccionados = [];
        checks_seleccionados.push(objIE.codmodular);
        jQuery("#lista_seleccionados").append("<li id='list__" + objIE.codmodular + "__" + objIE.plaza + "'><label class='grid_sec'><input type='text'  class='priority' onkeypress='validate(event)' maxlength='" + caracteres_seleccion + "' name='prioridad[]' value='' id='prior_" + objIE.codmodular + "_" + objIE.plaza + "'></input></label><label class='grid_sec'>" + objIE.iiee + "</label><label class='grid_sec'>" + objIE.codmodular + "</label><label class='grid_sec'>" + objIE.dre + "</label><label class='grid_sec' style='text-align:center'><a href='javascript: ' onclick='rmv(\"" + objIE.codmodular + "__" + objIE.plaza + "\",\"" + objIE.codmodular + "\")'><img src='../public/img/ico_eliminar.png' /></a></label></li>");
        texto_seleccionados();
    }
}
function error_seleccion_plaza(es_bilingue, es_frontera, gestion, especialidad) {
    var con_errores = 0;
    var error_message = '';
    if (es_bilingue === 'SI' ) {
        error_message += $('#is_bilingue_error').html();
        con_errores++;
    }
    if (es_frontera === 'SI' ) {
        error_message += $('#is_frontera_error').html();
        con_errores++;
    }
    if (gestion === 'CONVENIO') {
        error_message += $('#is_convenio_error').html();
        con_errores++;
    }
    if (especialidad !== "-") {
        error_message += $('#is_especialidad_error').html();
        con_errores++;
    }

    if (con_errores > 0) {
        jQuery('#error_completo').html(error_message);
        jQuery("#error_completo").dialog({
            resizable: false,
            width: 400,
            modal: true,
            draggable: false,
            buttons: [
                {
                    text: "Aceptar",
                    "class": 'btn-naranja',
                    click: function () {
                        jQuery(this).dialog("close");
                    }
                }
            ]
        }).prev(".ui-dialog-titlebar").css("background", "#777777 !important");
    }
}
function rmv(id, modular) {
    if (checks_seleccionados.length === 1) {
        jQuery("#error_eliminar_registro").dialog({
            resizable: false,
            width: 400,
            modal: true,
            draggable: false,
            buttons: [
                {
                    text: "SÍ",
                    "class": 'btn-naranja',
                    click: function () {
                        jQuery('#list__' + id).remove();
                        checks_seleccionados = [];
                        jQuery("#lista_seleccionados").trigger("sortupdate");
                        jQuery('#contenedor_seleccionadas').hide();
                        texto_seleccionados();
                        jQuery(this).dialog("close");
                    }
                },
                {
                    text: "NO",
                    "class": 'btn-naranja',
                    click: function () {
                        jQuery(this).dialog("close");

                    }
                }
            ]
        }).prev(".ui-dialog-titlebar").css("background", "#777777 !important");

    } else {
        jQuery("#error_eliminar_registro").dialog({
            resizable: false,
            width: 400,
            modal: true,
            draggable: false,
            buttons: [
                {
                    text: "SÍ",
                    "class": 'btn-naranja',
                    click: function () {
                        checks_seleccionados.splice(checks_seleccionados.indexOf(modular), 1);
                        jQuery('#list__' + id).remove();
                        jQuery("#lista_seleccionados").trigger("sortupdate");
                        texto_seleccionados();
                        jQuery(this).dialog("close");
                    }
                },
                {
                    text: "NO",
                    "class": 'btn-naranja',
                    click: function () {
                        jQuery(this).dialog("close");

                    }
                }
            ]
        }).prev(".ui-dialog-titlebar").css("background", "#777777 !important");

    }
}
function up_priority(id) {
    moveUp(jQuery('#list__' + id));
}
function down_priority(id) {
    moveDown(jQuery('#list__' + id));
}
function moveUp($item) {
    $before = $item.prev();
    $item.insertBefore($before);
}
function moveDown($item) {
    $after = $item.next();
    $item.insertAfter($after);
}
function texto_seleccionados() {
    var tamanio = checks_seleccionados.length;
    var texto = '';
    //validación para ocultar div contenedor de seleccionados
    if (tamanio < 2) {
        texto = tamanio + ' seleccionada';
    } else {
        texto = tamanio + ' seleccionadas';
    }
    //Textos para cantidad de seleccionadas
    $('#subtitle_cantidad').text(texto);
//    return true;
}

var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },
    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}





