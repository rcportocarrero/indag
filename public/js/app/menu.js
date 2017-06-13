function menu() {
    menu_instrumento();

    var left_menu = jQuery('.nav-stacked li');
    left_menu.off('click').on('click', function (evt) {
        var _this = jQuery(this);
        var _function_handle = _this.data('function-handle');
        eval(_function_handle + '()');
    });

}

function menu_inicio() {
    jQuery('.nav-stacked li').removeClass('active');
    jQuery('#mnuInicio').addClass('active');
    load_inicio();
}

function menu_reportes() {
    jQuery('.nav-stacked li').removeClass('active');
    jQuery('#menuReportes').addClass('active');
    load_reportes();
}

function menu_instrumento() {

    jQuery('.nav-stacked li').removeClass('active');
    jQuery('#menuInstrumento').addClass('active');

    load_instrumentos();
}

function load_inicio() {
    BaseX.load_html(root + '/seleccion/index/inicio', {
        data: {},
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
        }
    });
}
function load_reportes() {
    BaseX.load_html(root + '/seleccion/index/reportes', {
        data: {},
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
            var data = preguntas_fec_listar();
            var source = jQuery("#tpl_preguntas_frecuentes_content").html();
            var template = Handlebars.compile(source);
            jQuery('#content_out').html(template(data));
        }
    });
}

function load_instrumentos() {
    BaseX.load_html(root + '/seleccion/index/instrumentos', {
        data: {},
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
            BaseX.Grid('#grid_instrumentos').clear();
            BaseX.Grid('#grid_instrumentos_detail').clear();
            //Cargar data de instrumentos
            var instrumentos = instrumentos_listar();
            //Crear grilla de instrumentos
            cargar_table_instrumentos();
            //Setear data a grilla de instrumentos
            BaseX.Grid('#grid_instrumentos').setData(instrumentos);
        }
    });
}
function load_detalle_instrumentos() {
    BaseX.load_html(root + '/seleccion/index/instrumentosdet', {
        data: {},
        success: function (xhr) {
            jQuery('#workArea').html(xhr);
            var instrumentos_detail = instrumentos_detail_listar();
            BaseX.Grid('#grid_instrumentos_detail').clear();
            //Crear grilla detalle de instrumentos
            cargar_table_detail_instrumentos();
            BaseX.Grid('#grid_instrumentos_detail').setData(instrumentos_detail);
            //Evento de cambio de dre
            evt_chg_dre_ugel();
        }
    });
}

function instrumentos_listar(obj) {
    if (obj === undefined) {
        obj = {};
    }
    var data;
    BaseX.get({
        url: root + '/seleccion/index/get-instrumentos',
        data: obj,
        success: function (xhr, txt) {
            data = xhr;
        }
    });

    return data;
}
function instrumentos_detail_listar() {

    var data;
    BaseX.get({
        url: root + '/seleccion/index/get-instrumentos-detail',
        data: {},
        success: function (xhr, txt) {
            data = xhr.empleados;
            cargar_dre(xhr.lista_dre);
        }
    });

    return data;
}
function preguntas_fec_listar() {
    var obj = {};
    BaseX.get({
        url: root + '/seleccion/index/get-preguntas-frecuentes',
        data: obj,
        success: function (xhr, txt) {
            data = xhr;
        }
    });
    return data;
}
function preguntas_listar(obj) {
    if (obj === undefined) {
        obj = {};
    }
    var data;
    BaseX.get({
        url: root + '/seleccion/index/get-preguntas',
        data: obj,
        success: function (xhr, txt) {
            data = xhr;
        }
    });

    return data;
}
function set_datos_instrumento(obj) {
    if (obj === undefined) {
        obj = {};
    }
    var data;
    BaseX.post({
        url: root + '/seleccion/index/set-instrumentos',
        data: obj,
        success: function (xhr, txt) {
        }
    });

    return data;
}

function cargar_dre(md) {
    jQuery("#lista_dre").html("");
    var cmb2 = [];
    cmb2.push('<option value="0">--Seleccione--</option>');
    jQuery.each(md, function (key, val) {
        cmb2.push('<option value="' + val["id"] + '">' + val["desc"] + '</option>');
    });

    jQuery("#lista_dre").html(cmb2.join(''));

}

function evt_chg_dre_ugel() {

    jQuery('#lista_dre').off('change');
    jQuery('#lista_dre').on('change', function () {
        if (jQuery('#lista_dre').val() !== '') {
            //cargar combo ugeles
            var obj = {
                id: jQuery('#lista_dre').val()
            };
            BaseX.get({
                url: root + '/seleccion/index/get-ugel-dre',
                data: obj,
                success: function (xhr, txt) {
                    jQuery("#lista_ugel").html("");
                    var cmb2 = [];
                    cmb2.push('<option value="0">--Seleccione--</option>');
                    jQuery.each(xhr, function (key, val) {
                        cmb2.push('<option value="' + val["id"] + '">' + val["desc"] + '</option>');
                    });

                    jQuery("#lista_ugel").html(cmb2.join(''));
                }
            });
        } else {
            jQuery("#lista_ugel").html("");
        }

    });
}
function cargar_table_instrumentos()
{
    jQuery("#grid_instrumentos").jqGrid({
        data: [],
        datatype: "local",
        height: 250,
        width: 800,
        colNames: ['Id', 'Nombre de instrumento', 'Meta', 'Informantes', 'total', 'Estado', 'Acciones'],
        colModel: [
            {name: 'a', index: 'a', width: 10, align: "left", sortable: true, hidden: true, key: true},
            {name: 'b', index: 'b', width: 300, align: "left", sortable: true},
            {name: 'm', index: 'm', width: 90, sortable: false},
            {name: 'i', index: 'i', width: 200, sortable: true},
            {name: 't', index: 't', width: 50, sortable: true, hidden: true},
            {name: 'n', index: 'n', width: 90, align: "center", formatter: estadoINS, sortable: false},
            {name: 'a', index: 'a', width: 100, formatter: agregarIE, align: "center", sortable: false},
        ],
        caption: "",
        rownumbers: false,
        rowNum: 50,
        rowList: [10, 30, 50],
        pager: '#pager_grid_instrumentos',
        sortname: 'a',
        viewrecords: true,
        hidegrid: false,
        resizable: true,
        ondblClickRow: function (rowid)
        {
            var obj = {
                id_instrumento: rowid
            };
            set_datos_instrumento(obj);
            load_detalle_instrumentos();
        }
    });

    jQuery("#grid_instrumentos").jqGrid('navButtonAdd', '#gridpager2', {
        caption: "Export to Excel",
        onClickButton: function () {
            jQuery("#grid_instrumentos").excelExport();
        }
    });

}
;
function cargar_table_detail_instrumentos()
{
    var lastSel;
    jQuery("#grid_instrumentos_detail").jqGrid({
        data: [],
        datatype: "local",
        height: 250,
        width: 800,
        colNames: ['Id', 'Id instrumento empleado', 'Instituación educativa', 'Informantes (Nombres y apellidos)', 'Total', 'Estado', 'Acciones'],
        colModel: [
            {name: 'a', index: 'a', width: 10, align: "left", sortable: true, hidden: true, key: true},
            {name: 'id_instrumento', index: 'id_instrumento', width: 10, align: "left", sortable: true, hidden: true},
            {name: 'institucion_educativa', index: 'institucion_educativa', width: 250, align: "left", sortable: false},
            {name: 'informante', index: 'informante', width: 250, sortable: false},
            {name: 'total', index: 'total', width: 250, sortable: false, hidden: true},
            {name: 'estado', index: 'estado', width: 90, align: "center", formatter: estadoINSDetail, sortable: false},
            {name: 'id_instrumento_empleado', index: 'id_instrumento_empleado', width: 100, formatter: agregarIE, align: "center", sortable: false},
        ],
        caption: "",
        rownumbers: false,
        rowNum: 5,
        rowList: [10, 30, 50],
        pager: '#pager_grid_instrumentos_detail',
        sortname: 'a',
        viewrecords: true,
        resizable: true,
        ondblClickRow: function (id)
        {
            if (id && id !== lastSel) {
                jQuery(this).restoreRow(lastSel);
                lastSel = id;
            }
            modal_lista_preg(lastSel);
        }
    });
}
;

function agregarIE(cellvalue, options, rowObject) {
    return "<span class='glyphicon glyphicon-th-list'></span>";
}
function estadoINS(cellvalue, options, rowObject) {
    return "<span class='label label-success'>" + cellvalue + "</span>";
}
function estadoINSDetail(cellvalue, options, rowObject) {
    return "<span class='label label-warning'>" + cellvalue + "</span>";
}

function updateEstado(f) {
    var myGrid = $('#grid_instrumentos_detail'),
            selectedRowId = myGrid.jqGrid('getGridParam', 'selrow');
    var rowData = jQuery('#grid_instrumentos_detail').jqGrid('getRowData', selectedRowId);
    var actual = parseInt(rowData.total) - f;
    rowData.estado = actual + '/' + rowData.total;
    jQuery("#grid_instrumentos_detail").jqGrid('setRowData', selectedRowId, rowData);

}

function modal_lista_preg(id_emp) {
    jQuery('#content_out').html('');
    jQuery('#modal_preguntas_tmp').modal({
        keyboard: false,
        backdrop: 'static'
    });

    var modal_preguntas = jQuery('#modal_preguntas_tmp');
    modal_preguntas.on('shown.bs.modal', function (e) {
        jQuery(this).off('shown.bs.modal');
        var data = preguntas_listar({id_instrumento_emp: id_emp});
        var source = jQuery("#tpl_listado_formato_content").html();
        var template = Handlebars.compile(source);
        jQuery('#content_out').html(template(data));
        jQuery('#emp_t_hd').val(id_emp);
        var pgtas = Object.keys(data.instrumento.p).length;
        var rptas = Object.keys(data.instrumentoEmpleado.j).length;
        var preg_rpta = [];
        var preg_rpta_tipo = [];
        if (pgtas > 0) {
            for (i = 0; i < pgtas; i++) {
                var pg_grupos_ = Object.keys(data.instrumento.p[i].f).length;
                for (o = 0; o < pg_grupos_; o++) {
                    preg_rpta[data.instrumento.p[i].f[o].a] = data.instrumento.p[i].f[o].g.a;
                    preg_rpta_tipo[data.instrumento.p[i].f[o].a] = data.instrumento.p[i].f[o].d;
                }
            }
        }

        if (rptas > 0) {
            for (i = 0; i < rptas; i++) {
                if (Object.keys(data.instrumentoEmpleado.j[i].f).length > 0) {
                    //listaRespuestaRango
                    jQuery("#slctrango_" + data.instrumentoEmpleado.j[i].b + "").val(data.instrumentoEmpleado.j[i].f[0].b);
                }
                var multiples_ = Object.keys(data.instrumentoEmpleado.j[i].g).length;
                if (multiples_ > 0) {
                    //j.a id pregunta respuesta
                    if (preg_rpta[data.instrumentoEmpleado.j[i].b] === 'Vg') {
                        //Radio preg_rpta_tipo
                        radio_checked('optrd_' + data.instrumentoEmpleado.j[i].b, data.instrumentoEmpleado.j[i].g[0].c, true);
                    } else if (preg_rpta[data.instrumentoEmpleado.j[i].b] === 'qR') {
                        //Check
                        for (c = 0; c < multiples_; c++) {
                            radio_checked('optchk_' + data.instrumentoEmpleado.j[i].b + '', data.instrumentoEmpleado.j[i].g[c].c, true);
                        }
                    } else {
                        //Select
                        jQuery("#slct_" + data.instrumentoEmpleado.j[i].b + "").val(data.instrumentoEmpleado.j[i].g[c].c);

                    }
                }
                if (Object.keys(data.instrumentoEmpleado.j[i].h).length > 0) {
                    //listaRespuestaFecha
                }
                if (Object.keys(data.instrumentoEmpleado.j[i].i).length > 0) {
                    //listaRespuestaTexto
                }
            }
        }



        jQuery('#ul_preg li').click(function (e)
        {
            var li_active_ = $(this).attr("id");
            if (li_active_ === "li_resumen") {
                jQuery('#btn_finalizar').prop('disabled', false);
            } else {
                jQuery('#btn_finalizar').prop('disabled', true);
            }
        });

        jQuery('#btn_finalizar').click(function (e)
        {
            save_frm_last();
        });

        jQuery(".next-step").click(function (e) {
            var $active = $('.nav-tabs2 li.active');
            var $str = $("#frm_paso_" + $active.attr("data-pre")).serializeObject();
            var j = [];
            $.each($str, function (i, item) {
                var idd = i.split("_");
                var val = idd[1];
                var valu = val.valueOf();
                var obj = {};
                if (preg_rpta_tipo[valu] === 'p4') {
                    var val_c = idd[2];
                    var valu_c = val_c.valueOf();
                    var rp_f = [];
                    rp_f.push({"b": item, "c": valu_c});
                    obj = {"b": valu, "f": rp_f};
                } else if (preg_rpta_tipo[valu] === 'Vg' || preg_rpta_tipo[valu] === 'qR' || preg_rpta_tipo[valu] === 'am') {
                    var rp_g = [];
                    if (Array.isArray(item)) {
                        for (i = 0; i < item.length; i++) {
                            rp_g.push({"c": item[i]});
                        }
                    } else {
                        rp_g.push({"c": item});
                    }
                    obj = {"b": valu, "g": rp_g};
                } else if (preg_rpta_tipo[valu] === 'Rw') {
                    obj = {"b": valu, "h": item};
                } else if (preg_rpta_tipo[valu] === '75' || preg_rpta_tipo[valu] === 'mR') {
                    obj = {"b": valu, "i": item};
                }
                j.push(obj);
            });

            jQuery('#emp_t_hd').val(id_emp);
            var f_sav = {
                "a": jQuery('#emp_t_hd').val(),
                "j": j
            };
            var $post_save = JSON.stringify(f_sav);
            save_frm($post_save);
            $active.next().removeClass('disabled');
            nextTab($active);

        });
        jQuery(".prev-step").click(function (e) {

            var $active = $('.nav-tabs2 li.active');
            prevTab($active);

        });

        jQuery('[data-toggle="tooltip"]').tooltip();

    });

}

function save_frm(obj) {
    if (obj !== undefined) {
        BaseX.post({
            url: root + '/seleccion/index/save_frm',
            data: {a: Base64.encode(obj)},
            success: function (xhr, txtSting) {
                var _id = parseInt(xhr.id);
                updateEstado(xhr.rest);
            }
        });
    } else {
        alert("Por favor, debe seleccionar una respuesta.");
    }
}
function save_frm_last() {
    var id = jQuery('#emp_t_hd').val();
    BaseX.post({
        url: root + '/seleccion/index/save_frm_fn',
        data: {a: Base64.encode(id)},
        success: function (xhr, txtSting) {
            bootbox.dialog({
                message: xhr.msg,
                title: "Mensaje del sistema",
                closeButton: false,
                buttons: {
                    success: {
                        label: "Aceptar",
                        className: "btn-default",
                        callback: function () {
                            if (parseInt(xhr.id) > 0) {
                                $('#modal_preguntas_tmp').modal('hide');
                            }
                        }
                    }
                }
            });

        }
    });
}
function radio_checked(name, value, checked) {
    var selector = 'input[name=' + name + '][value="' + value + '"]';
    jQuery(selector).prop('checked', checked);
    if (checked === false) {
        jQuery(selector).parent('.btn').remove('active');
    } else {
        jQuery(selector).parent('.btn').addClass('active');
    }

}

function link_group(elem) {
    $("#li_paso_" + elem + "").find('a[data-toggle="tab"]').click();
}
function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}
function refresh_login()
{
    if (jQuery('#ref_login').val() !== undefined) {
        document.getElementById('ref_login').src = root + "/usuario/captcha/logincaptcha?rnd=" + Math.random();
    }
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    var $radio = $('input[type=radio],input[type=checkbox]', this);
    $.each($radio, function () {
        if (!o.hasOwnProperty(this.name)) {
            o[this.name] = '';
        }
    });
    return o;
};


(function () {
    function checkCondition(v1, operator, v2) {
        switch (operator) {
            case '==':
                return (v1 == v2);
            case '===':
                return (v1 === v2);
            case '!==':
                return (v1 !== v2);
            case '<':
                return (v1 < v2);
            case '<=':
                return (v1 <= v2);
            case '>':
                return (v1 > v2);
            case '>=':
                return (v1 >= v2);
            case '&&':
                return (v1 && v2);
            case '||':
                return (v1 || v2);
            default:
                return false;
        }
    }
    Handlebars.registerHelper('for', function (from, to, incr, block) {
        var accum = '';
        for (var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    });

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        return checkCondition(v1, operator, v2)
                ? options.fn(this)
                : options.inverse(this);
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function CapitalizeAll(cadena) {
        var parts = cadena.split(" ");
        var parts_fix = [];
        for (i = 0; i < parts.length; i++) {
            parts_fix.push(capitalizeFirstLetter(parts[i]));
        }
        return parts_fix.join(' ');
    }

    Handlebars.registerHelper('CapitalizeAll', function (cadena) {
        return CapitalizeAll(cadena);
    });

    Handlebars.registerHelper('toUpperCase', function (cadena) {
        return cadena.toUpperCase();
    });
}());