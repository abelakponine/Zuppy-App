$(document).ready(function(){
	$("footer").hide();
	
	$("#container > #maincol").show(400).css({
		"border-radius": "0px"
	});
	
	$("#container").css("height", $(window).outerHeight());
	
	setTimeout(()=>{
		$("#leftcol").css({
			"left":"0",
			"height": `calc(${$("#container").innerHeight()}px - 30px)`,
			"transition-duration":"0.4s"});
		$("#maincol").css({
			"height": `calc(${$("#container").innerHeight()}px - 20px)`,
			"left": $("#leftcol").outerWidth(),
			"width": `calc(100% - 2% - ${$("#leftcol").outerWidth()}px)`,
			"top": "0px",
			"transform": "unset",
			"transition-duration": "0.45s"});
		$("#widget_bar > #widget_container").css({
			"height": `calc(${$("#container").height()}px - 30px)`,
			"transition-duration": "0.45s"});
	}, 1000);

	responsive();

	$(window).on("resize", ()=>{

		setTimeout(()=>{
			$("#container").css("height", $(window).outerHeight());
			$("#leftcol").css({
				"left":"0",
				"height": `calc(${$("#container").innerHeight()}px - 30px)`,
				"transition-duration":"0.4s"});
			$("#maincol").css({
				"height": `calc(${$("#container").innerHeight()}px - 20px)`,
				"left": $("#leftcol").outerWidth(),
				"width": `calc(100% - 2% - ${$("#leftcol").outerWidth()}px)`,
				"top": "0px",
				"transform": "unset",
				"transition-duration": "0.45s"});
			$("#widget_bar > #widget_container").css({
				"height": `calc(${$("#container").height()}px - 30px)`,
				"transition-duration": "0.45s"});
		}, 500);

		responsive();
	});

	$("#activity-navigator > button").on("click", function(){
		$("#activity-navigator > button").removeClass("active");
		$(this).addClass("active");
	});
	// show feeds
	$("#activity-navigator > .feed").on("click", function(){
		$("#activity > div").not("#activity-navigator").hide(100);
		$("#activity > #feed").show(100);
	});
	// show messages
	$("#activity-navigator > .message").on("click", function(){
		$("#activity > div").not("#activity-navigator").hide(100);
		$("#activity > #messages").show(100);
	});
	// remove scroll event from html
	$("html").off("scroll");
});

function responsive(){
		if ($("body").outerWidth() < 1181){
			$("#activity-navigator > button:not(#activity-navigator > button.column-5)").removeClass("column-4");
			$("#activity-navigator > button:not(#activity-navigator > button.column-5)").addClass("column-5");
			$("#activity-navigator > button").eq(2).hide();
			$("#activity-navigator > button").eq(3).show();
		}
		else {
			$("#activity-navigator > button:not(#activity-navigator > button.column-4)").removeClass("column-5");
			$("#activity-navigator > button:not(#activity-navigator > button.column-4)").addClass("column-4");
			$("#activity-navigator > button").eq(3).hide();
			$("#activity-navigator > button").eq(2).show();
		}
		
		var viewport = new Promise((res, rej)=>{
			$("meta[name=viewport]").remove();
			res("true");
		}).then(res1=>{
			console.log(res1);
			if ($("body").outerWidth() > 849){
				if (!$('meta[name=viewport]')[0]){
					$("head").prepend("<meta name='viewport' content='width=820,minimum-scale=0.7,maximum-scale=1,user-scalable=no'>");
				}
			}
			else {
				$("head").prepend("<meta name='viewport' content='width=360,minimum-scale=0.7,maximum-scale=1,user-scalable=no'>");
			}
		});
}