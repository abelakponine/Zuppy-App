$(document).ready(function(){
	$("#container").eq(0).css({"margin-top":`${$("#nav").outerHeight()}px`});
	$("input:not('input[name=username]'):not('input[name=password]'):not('input[name=email]'),textarea").on("keyup", function(){
		if (this.value.length > 0){
			this.value = this.value[0].toUpperCase()+this.value.substr(1,this.value.length);
		}
	});
	$(".country-list > ul > li").on("mousedown touchstart click", function(){
		$("input[name=country]").val(this.innerText);
		$(".country-list").hide(60);
	});
	$("input[name=country]").blur(function(){
		setTimeout(()=>{
			$(".country-list").hide(60);
		}, 100);
	});
});