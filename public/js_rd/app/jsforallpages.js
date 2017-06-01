$(document).ready(function(){
    $('.modal-dialog').draggable({ handle: ".modal-header" });

	$(".next-step").click(function (e) {
        var $active = $('.nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);
    });
    $(".prev-step").click(function (e) {
        var $active = $('.nav-tabs li.active');
        prevTab($active);
    });

    var text_max = 200;
    $('#count_message').html(text_max + ' caracteres disponibles');
    $('#txtdirecc').keyup(function() {
        var text_length = $('#txtdirecc').val().length;
        var text_remaining = text_max - text_length;
        $('#count_message').html(text_remaining + ' caracteres disponibles');
    });
    $('#count_message2').html(text_max + ' caracteres disponibles');
    $('#txtdireccion').keyup(function() {
        var text_length = $('#txtdireccion').val().length;
        var text_remaining = text_max - text_length;
        $('#count_message2').html(text_remaining + ' caracteres disponibles');
    });

    /* La seccion OTRAS SEDES es igual para los 3(CETPROS, INSTITUTOS y UNIVERSIDADES) */
    $("#btnagregarotrasede").click(function(){
        $('.otrasede-one').fadeOut();
        $('.otrasede-two').fadeIn();
    });
    /*
    $('#btnfinalizar').click(function(){
        $('.otrasede-one').fadeOut();
        $('.otrasede-three').fadeIn();
    });
*/
    $('#btnatras4').click(function(){
        $('.otrasede-two').fadeOut();
        $('.otrasede-one').fadeIn();
    }); 
    $('#btnsendinfo').click(function(){
        $('.otrasede-three').fadeOut();
        $('.otrasede-four').fadeIn();
    });
    $('#btnmnumain').click(function(){
        $('.otrasede-three').fadeOut();
        $('.otrasede-one').fadeIn();
    });

    $('.group-one-resp .btn-editarinfo').click(function(){
        $('.group-one-resp').css('display', 'none');
        $('.group-two-resp').css('display', 'block');
    });
    $('.group-two-resp .btn-cancelar').click(function(){
        $('.group-two-resp').css('display', 'none');
        $('.group-one-resp').css('display', 'block');
    });
    $('.group-one-inst .btn-editarinfo').click(function(){
        $('.group-one-inst').css('display', 'none');
        $('.group-two-inst').css('display', 'block');
    });
    $('.group-two-inst .btn-cancelar').click(function(){
        $('.group-two-inst').css('display', 'none');
        $('.group-one-inst').css('display', 'block');
    });

    $('.btn-guardarinfo').click(function(){
        bootbox.dialog({
          message: "¿Desea guardar los cambios registrados?",
          title: "Guardar Información",
          buttons: {
            success: {
                label: "Aceptar",
                className: "btn-primary",
                callback: function() {
                    bootbox.dialog({
                        message: "Su información ha sido guardada satisfactoriamente.",
                        title: "Mensaje de Aceptación",
                        buttons: {
                            success: {
                                label: "Aceptar",
                                className: "btn-primary",
                                callback: function() {
                                    
                                }
                            }
                        }
                    });
                }
            },
            danger: { 
                label: "Cancelar", 
                className: "btn-danger",
                callback: function() {
                    bootbox.dialog({
                        message: "En caso hay modificado los datos, estos cambios se perderán.<br>¿Desea continuar?",
                        title: "Mensaje de Cancelación",
                        buttons: {
                            success: {
                                label: "Si",
                                className: "btn-primary",
                                callback: function() {
                                    
                                }
                            },
                            danger: {
                                label: "No",
                                className: "btn-danger",
                                callback: function() {
                                    
                                }
                            }
                        }
                    });
                }

            }
          }
        });
    });
    $('.btn-finalizar').click(function(){
        bootbox.dialog({
          message: "¿Esta seguro que desea dar por finalizado el llenado de la información del formulario?",
          title: "Finalización del registro de información",
          buttons: {
            success: {
              label: "Aceptar",
              className: "btn-primary",
              callback: function() {
                $('.otrasede-one').fadeOut();
                $('.otrasede-three').fadeIn();
              }
            },
            danger: {
              label: "Cancelar",
              className: "btn-danger",
              callback: function() { $('.modal').modal('hide'); }
            }
          }
        });
    });
});
function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

