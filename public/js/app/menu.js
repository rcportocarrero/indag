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
        colNames: ['Id', 'Nombre de instrumento', 'Meta', 'Informantes', 'Estado', 'Acciones'],
        colModel: [
            {name: 'a', index: 'a', width: 10, align: "left", sortable: true, hidden: true, key: true},
            {name: 'b', index: 'b', width: 300, align: "left", sortable: true},
            {name: 'm', index: 'm', width: 90, sortable: false},
            {name: 'i', index: 'i', width: 200, sortable: true},
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
        colNames: ['Id', 'Id instrumento empleado', 'Instituación educativa', 'Informantes (Nombres y apellidos)', 'Estado', 'Acciones'],
        colModel: [
            {name: 'a', index: 'a', width: 10, align: "left", sortable: true, hidden: true, key: true},
            {name: 'id_instrumento', index: 'id_instrumento', width: 10, align: "left", sortable: true, hidden: true},
            {name: 'institucion_educativa', index: 'institucion_educativa', width: 250, align: "left", sortable: false},
            {name: 'informante', index: 'informante', width: 250, sortable: false},
            {name: 'estado', index: 'estado', width: 90, align: "center", formatter: estadoINSDetail, sortable: false},
            {name: 'id_instrumento_empleado', index: 'id_instrumento_empleado', width: 100, formatter: agregarIE, align: "center", sortable: false},
        ],
        caption: "",
        rownumbers: false,
        rowNum: 50,
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



function modal_lista_preg(id_emp) {
    jQuery('#content_out').html('');
//    jQuery('#modal_preguntas_tmp').modal('show');

    jQuery('#modal_preguntas_tmp').modal({
        keyboard: false,
        backdrop: 'static'
    });

    var modal_preguntas = jQuery('#modal_preguntas_tmp');
    modal_preguntas.on('shown.bs.modal', function (e) {
        jQuery(this).off('shown.bs.modal');
//        jQuery('#rootwizard').bootstrapWizard({'tabClass': 'nav nav-pills'});

        var data = preguntas_listar({id_instrumento_emp: id_emp});
        var source = jQuery("#tpl_listado_formato_content").html();
        var template = Handlebars.compile(source);
        jQuery('#content_out').html(template(data));

    });

    modal_preguntas.on('loaded.bs.modal', function (e) {
        jQuery("#example-embed").steps({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "fade"
        });
    });
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
        document.getElementById('ref_login').src        = root + "/usuario/captcha/logincaptcha?rnd=" + Math.random();
    }
}

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