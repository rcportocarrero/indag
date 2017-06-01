/* IE fadeIn() and fadeOut() Fix */
$(document).ready(function(){
	$("#btnagregarotrasede").click(function(){
        $('.otrasede-one').css({ display: none; });
        $('.otrasede-two').css({ display: block; });
    });
});
