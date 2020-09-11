/*!
* Glui AppJs v1.0
* Author: Abel O. Akponine
* Facebook: http://www.facebook.com/exploxi
* Copyright © 2018
*/

( function($){
    window.document.onreadystatechange = ()=>{
    	if (document.readyState == "interactive" || document.readyState == "complete"){
    		$('.loader-text').fadeIn();
    	}
    };

    window.addEventListener('DOMContentLoaded', (event) => {
	    console.log('DOM fully loaded and parsed');
            setTimeout(()=>{
                $('.page-loader').fadeOut();
                $('#login,#signup').addClass('dropBounce');
            },5000);

	});

    $(document).ready(function(){
	window.onbeforeunload = (e)=>{
		if (this.vs !== undefined){
			vs.connection = false;
			vs.send("%disconnect%{eof}");
			vs.close();
			ws.connection = false;
			ws.send("%disconnect%{eof}");
			ws.close();
			console.log("Unloading resources...");
		}
	};
    	window.addEventListener("beforeinstallprompt", (e)=>{

    		e.preventDefault();
    		action = e;
    		$('.installZuppy').show();
    		$('.installZuppy').on("click", ()=>{
    			action.prompt();
    			action.userChoice.then((choice)=>{

    				if (choice.outcome == "accepted"){
    					console.log("Zuppy app installation accepted.");
    					$('.installZuppy').text("Zuppy installed").removeClass('.installZuppy');
    				}
    				else console.log("Zuppy app installation declined.");
    			});
    		});
    	});

    	setTimeout(()=>{
			$('#access-hover').css({'margin-top':$('.nav').outerHeight()+'px'});
			
			$('.navOffset').css({'margin-top':$('.nav').outerHeight()+'px'});
			$('.navOffsetx2').css({'margin-top':$('.nav').outerHeight()*2+'px'});
			$('.navOffsetx3').css({'margin-top':$('.nav').outerHeight()*3+'px'});
			$('.navOffsetx4').css({'margin-top':$('.nav').outerHeight()*4+'px'});
			$('.headerOffset').css({'margin-top':$('header,.header,#header').outerHeight()+'px'});
			            
			$('.slider .rowspan').attr({'style':'width: '+($('.slider .grid').outerWidth()*$('.slider .grid').length)+'px !important'});
			
			//responsive bg-image on load
			if ($('.bg-image').html() && $('body').outerHeight() <= $('.bg-image').outerHeight()){
				$('#body-wrapper,.bg-image').removeClass('absolute');
			}
			if ($('.bg-image').html() && $('body').outerHeight() > $('.bg-image').outerHeight()){
				$('#body-wrapper, .bg-image').addClass('absolute');
			}

			// Add index to sliders
			for (var i=0;i < $('.item-grid').length;i++){
				$('.item-grid').eq(i).attr('dataIndex',i);
			}
			
    	}, 200);
	});
    
    $(window).on('resize scroll touchend mouseup',()=>{
        $('#access-hover').css({'margin-top':$('.nav').outerHeight()+'px'});

        $('.navOffset').css({'margin-top':$('.nav').outerHeight()+'px'});
        $('.navOffsetx2').css({'margin-top':$('.nav').outerHeight()*2+'px'});
        $('.navOffsetx3').css({'margin-top':$('.nav').outerHeight()*3+'px'});
        $('.navOffsetx4').css({'margin-top':$('.nav').outerHeight()*4+'px'});
        $('.headerOffset').css({'margin-top':$('header,.header,#header').outerHeight()+'px'});

    	$('#container,#typewriter,#login,#signup').promise().done(()=>{
			//responsive body-wrapper on resize
			setTimeout(()=>{
				if ($('#container').outerHeight()+$('.nav').outerHeight() < window.outerHeight){
					$('header-layer,#body-wrapper').css("min-height","100%");
				}
				else {
					$('#header-layer,#body-wrapper').css("min-height", $('html')[0].scrollHeight+"px");
				}
			}, 250);
    	});
    });
  
	$(window).on("scroll", function(e) {
		if ($(window).scrollTop() >= $(".nav").outerHeight()){
			$(".nav").css("cssText","background:#75073f66 !important");
		}
		else {
			$(".nav").css("cssText","background:none !important;");
		}
	});

	/** App Login proceedure **/
	$('#login').on("submit", e=>{
		e.preventDefault();
		$('#signup .fa-spinner').hide();
		$("#login .fa-spinner").show();
		//send login form data
		$.post("processor", $('#login').serialize(), (e,s,x)=>{
			if (e.status == 'success'){
				$('#login > .submit').prop('disabled',true);
				$("#login .fa-spinner").hide();
				if (e.device !== ""){
					location.href='profile/'+e.user+';device='+e.device;
				}
				else {
					location.href='profile/'+e.user;
				}
			}
			else {
				showError("Error! unable to login: <br>"+e.description);
				$("#login .fa-spinner").hide();
			}
		}, 'json');
	});
	/** App Registration proceedure **/
	$('#signup').on("submit", e=>{
		e.preventDefault();
		$('#login .fa-spinner').hide();
		$("#signup .fa-spinner").show();
		//send registration form data
		$.post("processor", $('#signup').serialize(), (e,s,x)=>{
			if (e.status == 'success'){
				$('#login > .submit').prop('disabled',true);
				$("#login .fa-spinner").hide();
				if (e.device !== ""){
					location.href='profile/'+e.user+';device='+e.device;
				}
				else {
					location.href='profile/'+e.user;
				}
			}
			else {
				showError("Error! unable to create account: <br>"+e.description);
				$("#signup .fa-spinner").hide();
			}
		}, 'json');
	});
	
	$(window).on('dblclick', ()=>{
		hideError();
	});
	
})(jQuery);

function showError(msg){
	$("#error-diag").html(msg)
		.fadeIn(50).css({'top':'20px','z-index':'40','transition-duration':'0.4s'});
	setTimeout(()=>{
		hideError();
	}, 5000);
}

function hideError(){
	$("#error-diag").css({'top':'-10px','transition-duration':'1s'})
		.fadeOut(50).html('');
}
