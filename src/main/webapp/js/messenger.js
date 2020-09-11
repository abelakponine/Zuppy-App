$(document).ready(function(){
	$("footer").hide();

	$("#container").css("height", $(window).innerHeight());

        if ($(window).outerWidth() > 780){
                $('#centercol').removeClass('display-hide');
        }

	setTimeout((e)=>{
		$("#leftcol").css({
			"left":"0",
			"height": $(window).innerHeight()+"px",
			"transition-duration":"0.4s"});
		$("#centercol").css({
			"height": $(window).innerHeight()+"px",
			"transition-duration": "0.45s"});
		$("#rightcol").css({
			"height": $(window).innerHeight()+"px",
			"transition-duration": "0.45s"});
		if ($('#centercol').css('display') !== 'none') {	
			$(".text-editor").css({
				"width": $('#centercol').outerWidth()+"px",
				"left": $('#leftcol').outerWidth()+"px",
				"transition-duration": "0.45s"});
		}
		else {	
			$(".text-editor").css({
				"width": $(window).outerWidth()+"px",
				"left": "0px",
				"transition-duration": "0.45s"});
		}
		$("#active-chats").css({
			"height": `calc(${$(window).innerHeight()}px - ${$('#leftcol #header').outerHeight()}px - 85px)`});
	}, 1000);

	$(window).on("resize", ()=>{

		$("#container").css("height", $(window).innerHeight());
		
		setTimeout((e)=>{
			$("#leftcol").css({
				"left":"0",
				"height": $(window).innerHeight()+"px",
				"transition-duration":"0.4s"});
			$("#centercol").css({
				"height": $(window).innerHeight()+"px",
				"transition-duration": "0.45s"});
			$("#rightcol").css({
				"height": $(window).innerHeight()+"px",
				"transition-duration": "0.45s"});
			if ($('#centercol').css('display') !== 'none') {	
				$(".text-editor").css({
					"width": $('#centercol').outerWidth()+"px",
					"left": $('#leftcol').outerWidth()+"px",
					"transition-duration": "0.45s"});
			}
			else {	
				$(".text-editor").css({
					"width": $(window).outerWidth()+"px",
					"left": "0px",
					"transition-duration": "0.45s"});
			}
			$("#active-chats").css({
				"height": `calc(${$(window).innerHeight()}px - ${$('#leftcol #header').outerHeight()}px - 85px)`});
		}, 500);

		if ($(window).outerWidth() > 780){
			$('#centercol').removeClass('display-hide');
			if (location.hash.includes('#messenger')){
				$(".message-board.active").show();
			}
			else if (location.hash == "#start"){
				$("#start-screen").show();
				$(".message-board").hide();
			}
		}
		else if (!location.hash.includes('#messenger')) {
			$('#centercol').addClass('display-hide');
		}
	});
});

$('#options > li').on('click',()=>{
	toggleOptions();
});

$("body").not(".option-btn").on('touchstart mousedown focus',()=>{
	$(options).css({
		'width':'0px',
		'height':'0px'}).promise().done(e=>{
			e.hide(100);
		});
});

function showSearch(){
	$("#search-field").css({'display':'inline-flex','transition':'0.5s'});
	$(".cog-btn,.logout-btn,.search-btn,.option-btn").hide();
}
function doSearch(elem){
	if ($(".search").val().length > 0){
		$('#active-chats > li').attr('data-visible',false).hide();
		$('#active-chats hr').hide();
		// show only found contacts
		for (chat of $('#active-chats > li')){
			if (chat.innerText.toLowerCase().includes(elem.value.toLowerCase())){
				let hrSibling = chat.nextElementSibling;
				$(chat).attr('data-visible',true).show();
				$(hrSibling).show();
			}
		}
		if ($("#active-chats > li[data-visible=true]").length < 1){
			$('#active-chats > #not-found').show();
		}
		else {
			$('#active-chats > #not-found').hide();
		}
	}
	else {
		// show all contacts
		$('#active-chats > li').attr('data-visible',true).show();
		$('#active-chats hr').show();
		if ($("#active-chats > li[data-visible=true]").length < 1)
			$('#active-chats > #not-found').show();
		else $('#active-chats > #not-found').hide();
	}
}
function showSmileys(){
	$('.emo-nav > .smileys-nav').addClass('active');
	$('.emo-nav > .emojis-nav').removeClass('active');
	$('.text-editor .emojis').hide();
	$('.text-editor .smileys').show();
}
function showEmojis(){
	$('.emo-nav > .smileys-nav').removeClass('active');
	$('.emo-nav > .emojis-nav').addClass('active');
	$('.text-editor .smileys').hide();
	$('.text-editor .emojis').show();
	
}
function closeEmo(){
	$('.emos,.close-emo,.emo-nav').hide();
	$('.textarea .value').removeClass('z-index-10');
}
function showEmo(){
	$('.emos,.close-emo,.emo-nav').show();
	$('.textarea .value').addClass('z-index-10');
}
function closeSearch(){
	$("#search-field").hide(100);
	$(".cog-btn,.logout-btn,.search-btn,.option-btn").show();
	if ($(window).outerWidth() >= 1190){
		$(".cog-btn").hide();
	}
	$('.search').val('');
	$('#active-chats > li, #active-chats hr').show();
}
function toggleOptions(){

	if ($(options).css('display') == "none"){
		$(options).css({
			'width':'140px',
			'height':'initial'});
		$(options).show(80);
	}
	else {
		$(options).css({
			'width':'0px',
			'height':'0px'}).promise().done(e=>{
				e.hide(100);
			});
	}
}
function getCookies(name=""){
	let cookieString = document.cookie.split(";");
	let cookies = [];
	for (cookie of cookieString){
		cookie = cookie.trim().split("=");
		cookies[cookie[0]] = cookie[1];
	}
	if (name !== "")
		return cookies[name];
	else
		return cookies;
}
function showProfileData(){
	location.href = '#profile';
        for (img of $('img')) adjustImage($(img)[0]);
	$("#data-loader, #profile-data-container").fadeIn(100);
	$("#data-content").scrollTop(0);
}
function closeProfileData(){
	goBack();
	$("#data-loader, #profile-data-container, .profiles").fadeOut(100);
}
function startChat(elem, uid=0, display=true){
	uid = $(elem).parent().data('id') || uid;
	let user = userdata[uid];
	let avatar;

	if (user !== undefined){
		if (user.Avatar == "avatar.png") avatar = user.Avatar;
		else avatar = user.username+"/avatar/"+user.Avatar;
		
		let newChat = `<li id="chat${user.id}" class="member rowspan">
			<div class="display-flex">
				<span class="avatar grid column-5 no-border no-padding overflow-hide relative" onclick="viewProfile(this)">
					<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%)" data-uid="${user.id}">
				</span>
				<div id="info-box" onclick="showMessage(${user.id})" style="width:70%;margin:auto 0;padding:6px 0">
					<span class="user-info grid column-1 no-border no-padding">${user.fullname}</span>
					<div class="display-flex">
						<span class="msg-preview grid column-1 no-border inline-table">&nbsp;</span>
						<small class="msg-preview-status grid column-5 no-border inline-table" style="margin:0 0 0 auto;font-size:11.4px;color:#d2cacd;white-space:nowrap;max-width:63px;">&nbsp;</small>
					</div>
				</div>
			</div>
		</li><hr>`;
		let newMsg = $('.message-board').eq(0).clone();
		newMsg.addClass('msg'+user.id);
		newMsg.find('#header-data .avatar > img').attr({'src':'/users/'+avatar,'data-uid':user.id});
		newMsg.find('#header-data #header-info-box > span').eq(0).text(user.fullname);
		newMsg.find('.text-editor').attr('data-to', user.id);
		
		if (!$('#active-chats')[0].contains($('#chat'+user.id)[0])){
			$('#active-chats').prepend(newChat);
			$('.member').removeClass('active');
			$('#chat'+user.id).addClass('active');
			$('#centercol').append(newMsg);
		}
		$('#active-chats #loading-message,#active-chats #not-found').hide();
	
		if (display){
			showMessage(user.id);
		}
		else if ($(window).outerWidth() <= 780){
			$('#centercol').addClass('display-hide');
			$('#start-screen,.message-board').hide();
		}
	}
	if (elem != null){
		showMessage(uid);
		$("#data-loader, #contacts-container").fadeOut(100);
	}
}
function adjustMessageBoard(){
	// adjust message display board
	let subtracted = $('.message-board.active #header').outerHeight()
					+$('.message-board.active #header-data').outerHeight()
					+$('.message-board.active .text-editor').outerHeight()+2;
	$('.display-board').css('height',($(window).outerHeight()-subtracted)+"px");
}
function showMessage(uid){
	window.location.href = "#messenger;msg"+uid;
	$('#centercol').removeClass('display-hide');
	$('#start-screen,.message-board').hide();
	$('.message-board').removeClass('active');
	$('.msg'+uid).find('.text-editor .textarea').attr('data-receiver',uid);
	$('.msg'+uid).addClass('active').show();
	adjustMessageBoard();
	if ($('.message-board.active .display-board')[0] !== undefined){
		$('.message-board.active .display-board').scrollTop($('.message-board.active .display-board')[0].scrollHeight);	
	}
}

function sendMessage(elem){
	let prevElem = $($(elem)[0].previousElementSibling);
	let sender = getCookies('id');
	let receiver = prevElem.data('receiver');
	let input = prevElem.find('.writer');
	let output = input.text().trim().replace(/\.*\</gi,"&lt;").replace(/\.*\>/gi,"&gt;");
	let date = new Date();

	// check for attachments
	let Xfiles = [];
	if ($("#audio")[0].files.length > 0){
		Xfiles.push($("#audio")[0].files);
	}
	if ($("#camera")[0].files.length > 0){
		Xfiles.push($("#camera")[0].files);
	}
	if ($("#image")[0].files.length > 0){
		Xfiles.push($("#image")[0].files);
	}
	if ($("#files")[0].files.length > 0){
		Xfiles.push($("#files")[0].files);
	}
	
	if (input.text().trim().length > 0 || Xfiles.length > 0){

		// upload attachments before sending message.
		if (Xfiles.length > 0){
			hasAttachment = "yes";
			let xhr = new XMLHttpRequest();
			let formData = new FormData();
			let i = 0;
			
			formData.append("type","messageFiles");
			formData.append("receiver",receiver);
			formData.append("message",encodeURI(output));
			
			for (files of Xfiles){
				for (file of files){
					formData.append(i, file);
					i++;
				}
			}
						
			$($('.msg'+receiver+' .display-board')[0].lastElementChild).after('<meter id="updMeter'+uploadMeter+'" low="30" min="0" max="100" style="width:100%;max-width:120px;height:4px;margin:4px 20px 0 auto;display:block;border-radius:20px;overflow:hidden"></meter>');
			
			xhr.upload.addEventListener("progress", (e)=>{
				let per = (e.loaded/e.total)*100;
				$('#updMeter'+uploadMeter).val(per);
				if (per > 99){
					$('.filecount').text('');
					$('#file-input *').val('');
					let updm = uploadMeter;
					setTimeout((e)=>{
						$('#updMeter'+updm).fadeOut(50).remove();
					}, 3000);
					uploadMeter++;
				}
			});
			
			xhr.onreadystatechange = (e)=>{
				if (e.target.readyState == 4){
					let data = JSON.parse(e.target.response);
					// send message to websocket after upload
					let output2 = JSON.stringify({
						sender: getCookies("id"),
						receiver: receiver,
						type: "private",
						message: encodeURI(output),
						date: date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
						time: date.getHours()+":"+date.getMinutes(),
						attachments: data.fileList,
						hasAttachment: "yes"
					});
					
					let filecheck = [];
					let filecount = "";
					for (files of Xfiles){
						for (file of files){
							filecheck.push(file);
						}
					}

					if (filecheck.length == 1){
					 	filecount = "1 file";
					}
					else if (filecheck > 1) {
						filecount = filecheck.length+" files";
					}
					
					// show message sending
					$('.msg'+receiver).find('.display-board').append(`
						<div class="sending">
							<span class="status grid" style="font-size:12px;margin:4px 4px 0px;display:flex;float:right;clear:both;color:#8c8c8c">Sending...</span>
							<div class="me msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:12px;color:black;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(output)}</div>
							</div>
						</div>
					`);
					
					if (send(output2)){
						console.log("Message sent.");
					}
					else {
						showError("Server error: unable to send message. <br>Please try again.");
						$('.msg'+receiver).find('.display-board .sending .status').html('Message sending failed, retry!');
						setTimeout(()=>{
							$('.msg'+receiver).find('.text-editor .writer').html(decodeURI(output));
							$('.msg'+receiver).find('.display-board .sending').remove();
						}, 3000);
					}
				}
			};
			
			xhr.open('POST','../uploader');
			xhr.send(formData);
		}
		
		else {
			// send messages without attachments to websocket
			let output2 = JSON.stringify({
				sender: getCookies("id"),
				receiver: receiver,
				type: "private",
				message: encodeURI(output),
				date: date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
				time: date.getHours()+":"+date.getMinutes(),
				hasAttachment: "no"
			});

			// show message sending
			$('.msg'+receiver).find('.display-board').append(`
				<div class="sending">
					<span class="grid" style="font-size:12px;margin:4px 4px 0px;display:flex;float:right;clear:both;color:#8c8c8c">Sending...</span>
					<div class="me msg grid column-1 no-border no-padding display-flex flex-column-reverse">
						<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:12px;color:black;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(output)}</div>
					</div>
				</div>
			`);

			if (send(output2)){
				console.log("Message sent.");
			}
			else {
				showError("Server error: unable to send message. <br>Please try again.");
				$('.msg'+receiver).find('.display-board .sending .status').html('Message sending failed, retry!');
				setTimeout(()=>{
					$('.msg'+receiver).find('.text-editor .writer').html(decodeURI(output));
					$('.msg'+receiver).find('.display-board .sending').remove();
				}, 3000);
			}
		}
		
		$('#active-chats > #chat'+receiver+' .msg-preview').text('Sending...');
		$('.message-board.active').find('.writer').html('&nbsp;');

		if ($('.message-board.active .display-board')[0] !== undefined){
			$('.message-board.active .display-board').scrollTop($('.message-board.active .display-board')[0].scrollHeight);	
		}
	}
	closeEmo();
}
function toggleChatOptions(elem){
	event.preventDefault();
	event.stopImmediatePropagation();
	if ($(window).outerWidth() <= 580){
		$("#toggle i").toggleClass("fa-chevron-right fa-chevron-left");
		$(".chat-options").toggleClass("display-flex");
	}
}
function hideChatOptions(elem){
	if ($(window).outerWidth() <= 580){
		$("#toggle i").removeClass("fa-chevron-left");
		$("#toggle i").addClass("fa-chevron-right");
		$(".chat-options").removeClass("display-flex");
	}
}
function doAddStory(elem){
	let accepted = ["jpg","png","gif","mp4","3gp"];
	let filestatus = [];
	$('#'+elem.id).attr("data-error",null);
	// check files type
	for (x of elem.files){
		let ext = getFileExt(x.name); // file extension

		if (accepted.includes(ext)){
			filestatus.push("accepted");
		}
		else {
			filestatus.push("not-accepted");
		}
	}
	if (filestatus.includes('not-accepted')){
		$('#'+elem.id).attr("data-error","An unsupported file was attached.");
		$('#'+elem.id).val('');
	}
	if ($('#'+elem.id).data("error") !== undefined){
		alert($('#'+elem.id).data("error"));
	}
	else {

		let xhr = new XMLHttpRequest();
		let formData = new FormData();
		let i = 0;
		
		formData.append("type","storyFiles");
		
		for (file of elem.files){
			formData.append(i, file);
			i++;
		}

		$('#storyUploader').addClass('uploading').css("display","flex");
		
		xhr.upload.addEventListener("progress", (e)=>{
			let per = Math.round((e.loaded/e.total)*100);
			$('#updCounter'+uploadMeter).val(per);
			$('#storyUploader .counter').text(per+"%");
			if (per > 99){
				$('#storyUploader .counter').text("Done!");
				$('.filecount').text('');
				$('#file-input *').val('');
				$('#storyUploader .counter').text("Processing...");
			}
		});
		
		xhr.onreadystatechange = (e)=>{
			if (e.target.readyState == 4){
				// process stories
				processStories(e.target.response);
			}
		};
		
		xhr.open('POST','../uploader');
		xhr.send(formData);
	}
}
function goBack(){
	previousHash = location.href;
	if (previousHash == "#start") return ()=>{ return 'You are about leaving Zuppy App, \r\n Continue?'};
	if (location.href.includes("#messenger")) location.href = "#start";

	else history.back();
}
function showProfileSettings(){
	location.href = "#settings";
	$("#data-loader, #profile-data-container, #user-settings").fadeIn(100);
	$("#data-settings").scrollTop(0);
}
function closeProfileSettings(){
	goBack();
	$("#user-settings").fadeOut(100);
}
function updateProfile(elem){
	event.preventDefault();
	event.stopPropagation();
	$(elem).find('#updBtn i').show();
	
	$.ajax({
		url: "../updateProfile",
		method: "POST",
		data: $(elem).serialize(),
		processData: false,
		success: (e)=>{

			if (e.status){
				$(elem).find('#updBtn i').toggleClass('fa-check fa-spinner fa-spin');
				setTimeout(()=>{
					$(elem).find('#updBtn i').hide();
					$('.profile-info .fullname').html(e.firstname+" "+e.lastname
							+' &sdot; <small style="font-size:12px"><a style="color:#ff00cb;font-size:15px;font-weight:normal">@'+getCookies('username'));
					$('.profile-info .age').html('Age '+e.age);
					$('.profile-info .country').html(e.country);
					$('.profile-info .JobTitle').html(e.jobTitle);
					$('.profile-info .WorkPlace').html(e.workplace);
					$('.profile-info .HighestEducation').html(e.highestEducation);
					$('.profile-info .Relationship').html(e.relationship);
					$('.profile-info .Birthday').html(e.birthday);
					$('.profile-info .Blockquote').html(e.blockQuote);
					showProfileData();
					$("#user-settings").fadeOut(100);
					$(elem).find('#updBtn i').toggleClass('fa-check fa-spinner fa-spin').hide();
				}, 2000);
			}
		},
		error: (e)=>{
			showError("Error updating profile information: <br>"+ e.responseText)
		}
	});
}
function adjustImage(img){
	if (img.width > img.height){
		$(img).css({"width":"auto","height":"100%"});
	}
	else {
		$(img).css({"width":"100%","height":"auto"});
	}
	// readjust profile image frame on screen orientation change
	$('.profile-image').css("height", $('.profile-image').outerWidth()+"px");
}
function closeContacts(){
	goBack();
	$("#data-loader, #contacts-container").fadeOut(100);
}
function showContacts(){
	location.href = "#contacts";
	$("#data-loader, #contacts-container").fadeIn(100);
	$(".my-requests").removeClass("active");
	$(".my-contacts").addClass("active");
	$("#my-requests,.request-search").hide(50);
	$("#my-contacts,.contact-search").show(50);
}
function closeRequests(){
	goBack();
	$("#data-loader, #contacts-container").fadeOut(100);
}
function showRequests(){
	location.href = "#contacts";
	$("#data-loader, #contacts-container").fadeIn(100);
	$(".my-contacts").removeClass("active");
	$(".my-requests").addClass("active");
	$("#my-contacts,.contact-search").hide(50);
	$("#my-requests,.request-search").show(50);
}
function doContactSearch(elem){
	if ($(".contact-search").val().length > 0){
		$("#contacts > div,#contacts > hr").hide();
		// show only found contacts
		for (user of $('#contacts > div')){
			if (user.innerText.toLowerCase().includes(elem.value.toLowerCase())){
				let hrSibling = user.nextElementSibling;
				$(user).show();
				$(hrSibling).show();
			}
		}
	}
	else {
		// show all contacts
		$("#contacts > div,#contacts > hr").show();
	}
}
function doRequestSearch(elem){
	elem.onblur = ()=>{
		if ($(".request-search").val().length < 1)
			$("#friend-finder").hide(100)
	};
	if ($(".request-search").val().length > 0){
		$("#friend-finder,#ff-loader > .fa-spinner").show(100);
		let input = `me=${(getCookies("id")*1)}&user=${$('.request-search').val()}&searchType=requests`;
		$.ajax({
			method: "GET",
			url: "../finduser",
			data: input,
			processData: false,
			success: (e)=>{
				if (e == null) {
					$("#ff-loader > .ff-data").empty();
					$("#ff-loader > .fa-spinner").hide();
					$("#ff-loader > .ff-data").append(`<h4 style="color:#909090;text-align:center;font-family:fontFace;font-weight:normal;">
							<i class="fa fa-surprise" style="font-size:2.4rem;vertical-align:middle;"></i> !Oops...User not found or <p>already exists in your request list.</p></h4>`);
				}
				else {
					$("#ff-loader > .ff-data").empty();
					for (userData of e){
						let avatar;
						if (userData.Avatar == "avatar.png") avatar = userData.Avatar;
						else avatar = userData.username+"/avatar/"+userData.Avatar;
						
						let userElem = `<div id="found-user${userData.id}" style="display:flex;margin:5px 0;">
								<div class="display-flex" style="width:100%">
									<span class="avatar grid column-5 no-border no-padding overflow-hide relative" style="margin:auto 20px auto 10%;border-radius:50%;min-width:50px;height:50px;">
										<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%)">
									</span>
									<span class="user-info grid column-1 no-border no-padding" style="font-size:1rem;font-weight:bold;">${userData.fullname}</span>
								</div>
								<div id="actions" data-id="${userData.id}" style="min-width:150px;display:flex;margin:0 8%;transform:scale(0.9)">
									<button class="chat-btn csbtn" style="background:#3077f9;white-space:nowrap;" onclick="sendRequest(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Send Request</button>
								</div>
							</div><hr style="border-color:#e3e3e3;">`;
						
						$("#ff-loader > .fa-spinner").hide();
						$("#ff-loader > .ff-data").append(userElem);
					}
				}
			},
			error: (e)=>{console.log("An error occured while searching requests: <br>", e)}
		});
	}
	else {
		$("#friend-finder").hide(100);
	}
}
function sendRequest(elem){
	$(elem).find('.fas').show();
	let input = JSON.stringify({
		rq_type: 'new', sender: (getCookies("id")*1),
		receiver: $(elem).parent().data("id")});
	$.ajax({
		url: "../doRequest",
		method: "POST",
		data: input,
		contentType: "application/json",
		processData: false,
		success: (e)=>{
			$(elem).find('.fas').removeClass('fa-spinner fa-spin').addClass('fa-check');
			setTimeout(()=>{
				$(elem).find('.fas').hide();
				$(elem).css('background','silver').attr('disabled', true);
				$(elem).text("Pending");
				//$("#friend-finder").hide();
				$('#rq-info').hide();
				// define underlying hr element and readjust request position
				let hrSibling = $(`#found-user${$(elem).parent().data("id")}`)[0].nextElementSibling;
				$("#pending-request").append($(`#found-user${$(elem).parent().data("id")}`));
				$("#pending-request").append(hrSibling);
				//$(".ff-data").empty();
				//$(".request-search").val('');
			}, 1000);
		},
		error: (e)=>{showError("Error! unable to send request: <br>"+ e.responseText)},
	});
}
function acceptRequest(elem){
	$(elem).find('.fas').show();
	let input = JSON.stringify({
		rq_id: $(elem).parent().data('rqid'), rq_type: 'approval',
		sender: (getCookies("id")*1)});
	$.ajax({
		url: "../doRequest",
		method: "POST",
		data: input,
		contentType: "application/json",
		processData: false,
		success: (e)=>{
			// add new contact to userdata
			findUser($(elem).parent().data('id')).then(e=>{
				userdata[e[0].id] = e[0];
			});
			$(elem).find('.fas').removeClass('fa-spinner fa-spin').addClass('fa-check');
			setTimeout(()=>{
				$(elem).find('.fas').hide();
				$(elem).css({'background':'#ffe8fc','color':'#ff90f1'}).attr('disabled', true);
				$(elem).text("Friends");
				$('#ct-info').hide();
				$(elem)[0].nextElementSibling.remove(); // remove decline button
				// define underlying hr element and readjust request position
				let hrSibling = $(`#user${$(elem).parent().data("id")}`)[0].nextElementSibling;
				$("#pending-request").append($(`#user${$(elem).parent().data("id")}`));
				$("#pending-request").append(hrSibling);
				let newContact = $(`#user${$(elem).parent().data("id")}`).clone();
				newContact.find('#actions').html(`
							<button class="chat-btn csbtn" onclick="startChat(this)">Chat</button>
							<button class="block-btn csbtn" onclick="blockContact(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Block</button>
							<button class="delete-btn csbtn" onclick="deleteContact(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Delete</button>`);
				$("#contacts").append(newContact);
				$("#contacts").append($(hrSibling).clone());
			}, 1000);
		},
		error: (e)=>{showError("Error! unable to accept request: <br>"+ e.responseText)},
	});
}
function declineRequest(elem){
	$(elem).find('.fas').show();
	let input = JSON.stringify({
		rq_id: $(elem).parent().data('rqid'), rq_type: 'decline',
		sender: (getCookies("id")*1)});
	$.ajax({
		url: "../doRequest",
		method: "POST",
		data: input,
		contentType: "application/json",
		processData: false,
		success: (e)=>{
			// remove user from userdata
			delete userdata[$(elem).parent().data("id")];
			let hrSibling = $(`#user${$(elem).parent().data("id")}`)[0].nextElementSibling;
			$(elem).parent().parent().fadeOut().remove();
			$(hrSibling).remove();
		},
		error: (e)=>{showError("An error occured while declining request: <br>"+ e.responseText)},
	});
}
function blockContact(elem){
	let dialog = confirm("Do you want to proceed with blocking this contact?");
	if (dialog){
		$(elem).find('.fas').show();
		let input = JSON.stringify({
			rq_id: $(elem).parent().data('rqid'), rq_type: 'block',
			sender: (getCookies("id")*1)});
		$.ajax({
			url: "../doRequest",
			method: "POST",
			data: input,
			contentType: "application/json",
			processData: false,
			success: (e)=>{
				$(elem).parent().parent().addClass('blocked-contact');
				$(elem).parent().html(`<button class="chat-btn csbtn" onclick="unblockContact(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Unblock</button>
				<button class="delete-btn csbtn" onclick="deleteContact(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Delete</button>`);
			},
			error: (e)=>{showError("An error occured while blocking contact: <br>"+ e.responseText)},
		});
	}
}
function deleteContact(elem){
	let dialog = confirm("Do you want to proceed with deleting this contact?");
	if (dialog){
		declineRequest(elem);
	}
}
function logout(elem){
	let dialog = confirm("Do you want to logout?");
	if (dialog){
		$(elem).find('.fas').removeClass('fas fa-logout').addClass('fa fa-spinner fa-spin');
		let device = location.href.split(";")[1].split("=")[1];
		$.ajax({
			url: "../logout;device="+device,
			method: "POST",
			data: JSON.stringify({input: 'logout'}),
			contentType: "application/json",
			processData: false,
			success: (e)=>{
				console.log("result: ",e);
				if (e.result) window.location.href = e.path+"/app/login;device="+e.device;
			},
			error: (e)=>{showError("Logout error, unable to logout: <br>"+ e.responseText)}
		});
	}
}
function viewProfile(elem){
	location.href = '#view-user';
	for (img of $('img')) adjustImage($(img)[0]);
	let uid = $(elem).find('img').data('uid');
	if (!$('#data-loader')[0].contains($('.user'+uid)[0])){
		let container = $('#profile-data-container').clone();
		let userData = userdata[uid];
		let avatar;
		if (userData.Avatar == "avatar.png") avatar = "/users/"+userData.Avatar;
		else avatar = "/users/"+userData.username+"/avatar/"+userData.Avatar;
		container.find('.profile-image > img').attr('src',avatar);
		container.find('.fullname').html(userData.fullname+" &sdot; <small style='font-size:12px'><a style='color:#ff00cb;font-size:15px;font-weight:normal'>@"+userData.username+"</a></small>");
		container.find('.age').text("Age "+userData.age);
		container.find('.country').text(" "+userData.country);
		container.find('.JobTitle').text(userData.JobTitle);
		container.find('.WorkPlace').text(userData.WorkPlace);
		container.find('.HighestEducation').text(userData.HighestEducation);
		container.find('.Relationship').text(userData.Relationship);
		container.find('.Birthday').text(userData.Birthday);
		container.find('.edit-data').hide();
		container.addClass('user'+uid).removeAttr('id');
		$('#data-loader').append(container);
		$('#data-loader .profiles').hide();
		$('#data-loader, #data-loader .user'+uid).show();
	}
	else {
		$('#data-loader .profiles').hide();
		$('#data-loader, #data-loader .user'+uid).show();
	}
	$('#data-loader .user'+uid+' #data-content').scrollTop(0);
}
function doFileUpload(elem){
	if (elem.value !== ""){
		let dialog = confirm("This will change your profile picture,\nWant to proceed?");
		if (dialog){
			let activeProfileImage = imageUploadPreview.src;
			let url = window.URL || window.webkitURL;
			let blobUrl = url.createObjectURL(elem.files[0]);
			$("#imageUploadPreview").attr("src",blobUrl);
			
			imageUploadPreview.onload = ()=>{
				adjustImage($(imageUploadPreview)[0]);
				adjustImage($("#leftcol #user-avatar > img")[0]);
				adjustImage($(".profile-image > img")[0]);
				adjustImage($("#story-header .user-avatar > img")[0]);
				url.revokeObjectURL(blobUrl);
			};
			
			let form = new FormData();
			form.append("image",elem.files[0]);
			form.append("file-type","avatar");
		
			let xhr = new XMLHttpRequest();
		
			xhr.onreadystatechange = (e)=>{
				try {
					let response = JSON.parse(e.target.response);
					if (e.target.readyState == 4 && response.status == "success"){
						$("#imgUploadStat").hide(50);
						$("#imgUpMeter").text(response.description);
						console.log(response.description);
						$("#imageUploadPreview,#profile-data-container .profile-image > img,#leftcol #user-avatar > img, #story-header .user-avatar > img, .author-avatar img").attr("src", response.filePath);
						$('#rightcol .story:nth-of-type(1) video').attr("poster", response.filePath)
						document.cookie="avatar="+getCookies("username")+"/avatar/"+response.filename; //change avatar cookie
	
						$(elem).val("");
						setTimeout(()=>{
							$("#imgUpMeter").hide(100);
							$("#imgUpMeter").empty();
						}, 30000);
					}
					else {
						$("#imgUploadStat").hide(50);
						$("#imgUpMeter").text(response.description);
						$("#imageUploadPreview").attr("src", activeProfileImage);
						$(elem).val("");
					}
				}catch(e){
					console.log("response not ready, still waiting...\n");
				}
			};
			
			xhr.upload.addEventListener("progress", (e)=>{
				$("#imgUploadStat,#imgUpMeter").fadeIn(100);
				$("#imgUpMeter").text(Math.floor((e.loaded/e.total) * 100)+"%");
			});
			
			xhr.open("POST", "../uploader");
			xhr.send(form);
		}
		else { elem.value=null}
	}
}
function findUser(uid){
	let status, result;
	let input = `me=${(getCookies("id")*1)}&user=${uid}`;
	return new Promise((res,rej)=>{
		res($.ajax({
			method: "GET",
			url: "../finduser",
			data: input,
			processData: false,
			success: (e)=>{
				status = "complete";
				result = e[0];
				return {status,result};
			},
			error: (e)=>{
				status = "error";
				result = e;
				console.log(showError("An error occured while searching for user: <br>"+ e.responseText));
			}
		}));
	});
}
function fetchMessages(uid, msgArray){
	let input = `uid=${uid}`;
	return new Promise((res,rej)=>{
		res($.ajax({
			url: "../fetchMessages",
			data: input,
			method: "GET",
			processData: false,
			success: (e)=>{
				for (msg of e){

					let date = msg.date.split("-").reverse().join("-");
					let fileType1 = ["jpg","png","gif","webp"];
					let fileType2 = ["mpeg","mp4","3gp","mp3","wav","amr","aac","ogg"];
					let fileType3 = ["pdf","doc","docx","ppt","txt"];
					let filecount = "";
					let attachments = "";
					
					// add message attachments onload
					if (msg.attachments !== "none" && msg.attachments !== undefined){
						
						let fileArray = JSON.parse(msg.attachments);
						
						if (fileArray.length == 1){
						 	filecount = "1 file";
						}
						else if (fileArray.length > 1) {
							filecount = fileArray.length+" files";
						}
						// attaching files to message
						if (fileType1.includes(getFileExt(fileArray[0].filename))){
							attachments = `
									<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:200px;overflow:hidden;border-radius:20px;filter:blur(0.4px) brightness(92%);">
										<img src="${fileArray[0].filepath}" alt="${fileArray[0].filename}" style="width: 100%;margin-top: 50%;transform: translateY(-50%);min-height: 100%;height: auto;" oncontextmenu="return false">
									</div>
									<div class="file-desc" style="z-index:10;position:absolute;bottom:0;padding:3% 6px;color:white;background:#c70080;border-radius:4px 4px 20px 20px;width:calc(100% - 12px);text-align:center;font-size:12px;"> ${filecount} attached </div>`;
						}
						else if (fileType2.includes(getFileExt(fileArray[0].filename))){
							attachments = `
									<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:200px;overflow:hidden;border-radius:20px;filter:blur(0.4px) brightness(92%);">
										<video src="${fileArray[0].filepath}" alt="${fileArray[0].filename}" style="width: 100%;margin-top: 50%;transform: translateY(-50%);min-height: 100%;height: auto;" oncontextmenu="return false"></video>
									</div>
									<div class="file-desc" style="z-index:10;position:absolute;bottom:0;padding:3% 6px;color:white;background:#c70080;border-radius:4px 4px 20px 20px;width:calc(100% - 12px);text-align:center;font-size:12px;"> ${filecount} attached </div>`;
						}
						else if (fileType3.includes(getFileExt(fileArray[0].filename))){
							attachments = `
									<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:150px;overflow:hidden;filter:blur(0.4px) brightness(92%);min-height: 50px;z-index: 2;">
		                                <span class="fa fa-file-alt" style="font-size:2.5rem;color:#ff4aae;"></span>
									</div>
									<div class="file-desc" style="z-index:10;position:absolute;bottom: 12px;padding: 3% 10px 3% 26px;color:white;background: #444243;border-radius:4px;width:calc(100% - 36px);text-align:center;font-size:12px;z-index:1;"> ${filecount} attached </div>`;
						}
					}
					
					// message contents
					if (msg.sender == getCookies("id") && msg.type !== "call" && userdata[msg.receiver] !== undefined){
						let msgElem = "";
						if (msg.data == ""){
							msgElem = `
								<div id="msg-files" style="width:40%;display:block;align-self:flex-end;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						else {
							msgElem = `<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:12px;color:black;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(msg.data)}</div>
								<div id="msg-files" style="width:40%;display:block;align-self:flex-end;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						
						startChat(null,msg.receiver,false);
						$('.msg'+msg.receiver).find('.display-board').append(`
							<div class="me msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
							</div>
						`);
						
						if (decodeURI(msg.data).length > 14)
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(decodeURI(msg.data).substr(0,14)+' ...');
						else if (decodeURI(msg.data) == "" && msg.attachments !== "none") {
							let filecount = msg.attachments.split(",").length;
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(`<span class="fa fa-file-alt"></span>&nbsp; file content`);
						}
						else
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(decodeURI(msg.data));
						$('#active-chats > #chat'+msg.receiver+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
					if (msg.receiver == getCookies("id") && msg.type !== "call" && userdata[msg.sender] !== undefined){
						let msgElem = "";
						if (msg.data == ""){
							msgElem = `
								<div id="msg-files" style="width:40%;display:block;align-self:flex-start;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						else {
							msgElem = `<div class="grid" style="background:#f746b8;width:max-content;height:max-content;max-width:60%;margin:5px auto 5px 0;padding:10px 12px;color:white;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(msg.data)}</div>
								<div id="msg-files" style="width:40%;display:block;align-self:flex-start;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						
						startChat(null,msg.sender,false);
						$('.msg'+msg.sender).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
							</div>
						`);

						if (decodeURI(msg.data).length > 14)
							$('#active-chats > #chat'+msg.sender+' .msg-preview').html(decodeURI(msg.data).substr(0,14)+' ...');
						else if (decodeURI(msg.data) == "" && msg.attachments !== "none") {
							let filecount = msg.attachments.split(",").length;
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(`<span class="fa fa-file-alt"></span>&nbsp; file content`);
						}
						else
							$('#active-chats > #chat'+msg.sender+' .msg-preview').html(decodeURI(msg.data));
						$('#active-chats > #chat'+msg.sender+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
					
					// call messages
					if (msg.receiver == getCookies("id") && msg.type == "call" && userdata[msg.sender] !== undefined){
						let msgdata = decodeURI(msg.data).replace("{{target}}", "from");
						let msgElem = `<div class="grid" style="background:#ff22b059;height:max-content;max-width:min-content;margin:5px auto 5px 0;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap;text-align:center">${msgdata}</div>`;
						
						startChat(null,msg.sender,false);
						$('.msg'+msg.sender).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex">
								${msgElem}
							</div>
						`);

						$('#active-chats > #chat'+msg.sender+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
						$('#active-chats > #chat'+msg.sender+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
					if (msg.sender == getCookies("id") && msg.type == "call" && userdata[msg.receiver] !== undefined){
						let msgdata = decodeURI(msg.data).replace("{{target}}", "to");
						let msgElem = `<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap"><span class="fa fa-video"></span>&nbsp; video call </span></div>`;
						
						startChat(null,msg.receiver,false);
						$('.msg'+msg.receiver).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex">
								${msgElem}
							</div>
						`);

						$('#active-chats > #chat'+msg.receiver+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
						$('#active-chats > #chat'+msg.receiver+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
				}
			},
			error: (e)=>{
				showError("Error! unable to fetch message: "+ e.responseText)
			}
		}))
	});
}
function timeConvention(time) {
	time = time.split(":")[0];
	if (time < 12){
		return "am";
	}
	else {
		return "pm";
	}
}
function insertEmoji(elem){
	let input;
	let value;
	if (emojiPointStart < emojiPointEnd){
		input = $(elem).parent().parent().parent().find('.textarea');
		value = input.text().trim().substr(0,emojiPointStart)
					+(elem.innerText)+input.text().trim().slice(emojiPointEnd);
	}
	else {
		input = $(elem).parent().parent().parent().find('.textarea');
		value = input.text().trim().substr(0,emojiPointEnd)
					+elem.innerText+input.text().trim().slice(emojiPointStart);
	}
	input.find('.writer').text(value.trim());
	emojiPointStart+=2;
	emojiPointEnd+=2;
}
function processInput(elem){
	if (event.inputType == "insertFromPaste"){
		reformatInput(elem);
	}
	emojiPointStart = getSelection().anchorOffset;
	emojiPointEnd = getSelection().focusOffset;

	if (elem.innerText.length < 2){
		$(elem).html('<p class="writer" style="margin:0;height:100%">&nbsp;</p>');
	}
}
function reformatInput(elem){
	let input = $(elem).text().trim();
	$(elem).html('<p class="writer" style="margin:0;height:100%"><span>'+input+'</span></p>');
	getSelection().setPosition($(elem).find('.writer')[0], 1);
}
function hideAllLayers(){
	if (location.hash !== "#start") goBack();
	$('#data-loader,#contacts-container,#stories,#profile-data-container,'
		+'#user-settings,.profiles').hide();
}
function doAttachment(elem){
	let accepted = ["mp3","wav","amr","aac","ogg","jpeg","jpg","webp","png","gif",
			"mpeg","mp4","3gp","mp4","3gp","pdf","doc","docx","ppt","txt"];
	let filestatus = [];
	
	$('#file-input input:not(#'+elem.id+')').val('');
	// check files type
	for (x of elem.files){
		let ext = getFileExt(x.name); // file extension

		if (accepted.includes(ext)){
			filestatus.push("accepted");
			if (elem.files.length > 1){
				filetxt = " files added.";
			}
			else {
				filetxt = " file added";
			}
			
			$('.filecount').text(elem.files.length+filetxt).css('color','black').show();
		}
		else {
			filestatus.push("not-accepted");
		}
	}
	if (filestatus.includes('not-accepted')){
		$('.filecount').text("An unsupported file was attached.").css('color','red').show();
		$('#'+elem.id).val('');
	}
}
function getFileExt(filename){
	return filename.split('.')[filename.split('.').length-1];
}
function deleteProfile(elem){
	if (confirm("Are you sure you want to delete your account?\r\nThis cannot be undone.")){
		$(elem).find('i').show();
		$.post("../deleteProfile", "delete", (e)=>{
			console.log("Deleting profile...");
			$.ajax({
				url: "../logout",
				method: "POST",
				data: JSON.stringify({input: 'logout'}),
				contentType: "application/json",
				processData: false,
				success: (e)=>{
					console.log("Profile Deleted.\r\nSigning out...");
					window.location.href = "../login";
				},
				error: (e)=>{ showError('Error occured while deleting profile: <br>'+ e.responseText)}
			});
		});
	}
}
window.onload = ()=>{

	// intitialize platform
	previousHash = '';
	location.href = "#start";
	user_status = "initializing";
	emojiPointStart = 0;
	emojiPointEnd = 0;
	uploadMeter = 1;
	// Make an array to hold list user's data on load.
	userdata = [];
	$('.emos .smileys li').attr("onclick","insertEmoji(this)");
	$('.emos .emojis li').attr("onclick","insertEmoji(this)");
	// complete user data settings
	let dataValue1 = $('#data-settings select').eq(0).data('value');
	let dataValue2 = $('#data-settings select').eq(1).data('value');
	$('#data-settings option:contains('+dataValue1+'),'
	+ '#data-settings option:contains('+dataValue2+')')[0].selected=true
	// readjust profile image frame on first load
	$('#data-loader,#profile-data-container').css("visibility","hidden");
	$('#data-loader,#profile-data-container').show();
	$('.profile-image').css("height", $('.profile-image').outerWidth()+"px");
	$('#data-loader,#profile-data-container').hide(20);
	$('#data-loader,#profile-data-container').css("visibility","");
	
	$('.inputLabel').on('click',(e)=>{
		$(e.target).find('label').click();
	});
	
	// fetch user's contacts data on page load
	$.ajax({
		url: "../doRequest",
		method: "GET",
		data: "me="+(getCookies("id")*1)+"&rq_type=get-contacts",
		processData: false,
		success: (e)=>{
			// Fetch users data as contacts from requests table (only friends data)
			if (e !== undefined){
				for (friend of e){
					// add fetched data to userdata list.
					userdata[friend.id] = friend;
					// build contact list from fetched data
					let avatar;
					if (friend.Avatar == "avatar.png") avatar = friend.Avatar;
					else avatar = friend.username+"/avatar/"+friend.Avatar;
					if (friend.rq_status == 'friends'){
						$("#contacts").append(`<div id="user${friend.id}" style="display: flex;margin: 5px 0;">
							<div class="display-flex cursor-pointer" style="width:100%" data-id="${friend.id}">
								<span class="avatar grid column-5 no-border no-padding overflow-hide relative" style="margin:auto 20px auto 10%;border-radius:50%;min-width:50px;max-width:50px;height:50px;" onclick="viewProfile(this)">
									<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%);" data-uid="${friend.id}">
								</span>
								<span class="user-info grid column-1 no-border no-padding" style="font-size: 1rem;" onclick="startChat(this)"><b style="white-space:nowrap">${friend.fullname}</b> <a style="color:#ff00cb;font-size:15px;font-weight:normal">@${friend.username}</a></span>
							</div>
							<div id="actions" data-id="${friend.id}" data-rqid="${friend.rqid}" style="display:flex;margin:0 8%;min-width:150px;transform:scale(0.9)">
								<button class="chat-btn csbtn" onclick="startChat(this)">Chat</button>
								<button class="block-btn csbtn" onclick="blockContact(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Block</button>
								<button class="delete-btn csbtn" onclick="deleteContact(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Delete</button>
							</div>
						</div><hr style="border-color:#e3e3e3;">`);
					}
				}
			}
			else {
				$("#contacts").append(`<h4 id="ct-info" style="color:#909090;text-align:center;font-family:fontFace;font-weight:normal;">
					<i class="fa fa-address-book" style="font-size:2.4rem;vertical-align:middle;"></i>&emsp; Contact list empty.<br>Try adding new friends!</p></h4>`)
			}

			// que all incoming messages until database is sorted
			msgList = [];
			msgque = [];
			fetchMessages(getCookies("id"), msgList).then(e=>{
				$('#active-chats #loading-message').hide();
				if ($('#active-chats > li').length < 1){
					$('#active-chats #not-found').show();
					// $('#centercol').removeClass('display-hide');
					// $('#start-screen').show();
				}
				if ($(window).outerWidth() > 780){
					$('#centercol').removeClass('display-hide');
				}

				// process all queued messages
				for (msg of msgque){

					let date = msg.date.split("-").reverse().join("-");
					let fileType1 = ["jpg","png","gif","webp"];
					let fileType2 = ["mpeg","mp4","3gp","mp3","wav","amr","aac","ogg"];
					let fileType3 = ["pdf","doc","docx","ppt","txt"];
					let filecount = "";
					let attachments = "";

					// add queued message attachments
					if (msg.attachments !== "none"){
						
						let fileArray = JSON.parse(msg.attachments);
						
						if (fileArray.length == 1){
						 	filecount = "1 file";
						}
						else if (fileArray.length > 1) {
							filecount = fileArray.length+" files";
						}
						// attaching files to message
						if (fileType1.includes(getFileExt(fileArray[0].filename))){
							attachments = `
									<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:200px;overflow:hidden;border-radius:20px;filter:blur(0.4px) brightness(92%);">
										<img src="${fileArray[0].filepath}" alt="${fileArray[0].filename}" style="width: 100%;margin-top: 50%;transform: translateY(-50%);min-height: 100%;height: auto;" oncontextmenu="return false">
									</div>
									<div class="file-desc" style="z-index:10;position:absolute;bottom:0;padding:3% 6px;color:white;background:#c70080;border-radius:4px 4px 20px 20px;width:calc(100% - 12px);text-align:center;font-size:12px;"> ${filecount} attached </div>`;
						}
						else if (fileType2.includes(getFileExt(fileArray[0].filename))){
							attachments = `
									<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:200px;overflow:hidden;border-radius:20px;filter:blur(0.4px) brightness(92%);">
										<video src="${fileArray[0].filepath}" alt="${fileArray[0].filename}" style="width: 100%;margin-top: 50%;transform: translateY(-50%);min-height: 100%;height: auto;" oncontextmenu="return false"></video>
									</div>
									<div class="file-desc" style="z-index:10;position:absolute;bottom:0;padding:3% 6px;color:white;background:#c70080;border-radius:4px 4px 20px 20px;width:calc(100% - 12px);text-align:center;font-size:12px;"> ${filecount} attached </div>`;
						}
						else if (fileType3.includes(getFileExt(fileArray[0].filename))){
							attachments = `
									<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:150px;overflow:hidden;filter:blur(0.4px) brightness(92%);min-height: 50px;z-index: 2;">
		                                <span class="fa fa-file-alt" style="font-size:2.5rem;color:#ff4aae;"></span>
									</div>
									<div class="file-desc" style="z-index:10;position:absolute;bottom: 12px;padding: 3% 10px 3% 26px;color:white;background: #444243;border-radius:4px;width:calc(100% - 36px);text-align:center;font-size:12px;z-index:1;"> ${filecount} attached </div>`;
						}
					}
					
					// message contents
					if (msg.sender == getCookies("id") && msg.type !== "call"){
						let msgElem = "";
						if (msg.data == ""){
							msgElem = `
								<div id="msg-files" style="width:40%;display:block;align-self:flex-end;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						else {
							msgElem = `<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:12px;color:black;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(msg.data)}</div>
								<div id="msg-files" style="width:40%;display:block;align-self:flex-end;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						
						startChat(null,msg.receiver,false);
						$('.msg'+msg.receiver).find('.display-board').append(`
							<div class="me msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
							</div>
						`);

						if (decodeURI(msg.data).length > 14)
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').htnl(decodeURI(msg.data).substr(0,14)+' ...');
						else if (decodeURI(msg.data) == "" && msg.attachments !== "none") {
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(`<span class="fa fa-file-alt"></span>&nbsp; file content`);
						}
						else
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(decodeURI(msg.data));
						$('#active-chats > #chat'+msg.receiver+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
					if (msg.receiver == getCookies("id") && msg.type !== "call"){
						let msgElem = "";
						if (msg.data == ""){
							msgElem = `
								<div id="msg-files" style="width:40%;display:block;align-self:flex-start;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						else {
							msgElem = `<div class="grid" style="background:#f746b8;width:max-content;height:max-content;max-width:60%;margin:5px auto 5px 0;padding:10px 12px;color:white;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(msg.data)}</div>
								<div id="msg-files" style="width:40%;display:block;align-self:flex-start;max-height:200px;position:relative;margin-top:8px">
									${attachments}
								</div>`;
						}
						
						$('.msg'+msg.sender).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
							</div>
						`);
						
						if (decodeURI(msg.data).length > 14)
							$('#active-chats > #chat'+msg.sender+' .msg-preview').html(decodeURI(msg.data).substr(0,14)+' ...');
						else if (decodeURI(msg.data) == "" && msg.attachments !== "none") {
							let filecount = msg.attachments.split(",").length;
							$('#active-chats > #chat'+msg.receiver+' .msg-preview').html(`<span class="fa fa-file-alt"></span>&nbsp; file content`);
						}
						else
							$('#active-chats > #chat'+msg.sender+' .msg-preview').html(decodeURI(msg.data));
						$('#active-chats > #chat'+msg.sender+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
					// call messages
					if (msg.receiver == getCookies("id") && msg.type == "call"){
						let msgdata = decodeURI(msg.data).replace("{{target}}", "from");
						let msgElem = `<div class="grid" style="background:#ff22b059;height:max-content;max-width:min-content;margin:5px auto 5px 0;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap;text-align:center">${msgdata}</div>`;
						
						startChat(null,msg.sender,false);
						$('.msg'+msg.sender).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex">
								${msgElem}
							</div>
						`);

						$('#active-chats > #chat'+msg.sender+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
						$('#active-chats > #chat'+msg.sender+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
					if (msg.sender == getCookies("id") && msg.type == "call"){
						let msgdata = msg.data.replace("{{target}}", "to");
						let msgElem = `<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap"><span class="fa fa-video"></span>&nbsp; video call </span></div>`;
						
						startChat(null,msg.receiver,false);
						$('.msg'+msg.receiver).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex">
								${msgElem}
							</div>
						`);

						$('#active-chats > #chat'+msg.receiver+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
						$('#active-chats > #chat'+msg.receiver+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+msg.time+' '+timeConvention(msg.time));
					}
				}
				user_status = "ready";
			});
			
		},
		error: (e)=>{ showError('Error fetching contact\'s data: <br>'+ e.responseText) }
	});
	// fetch user's requests data on page load
	$.ajax({
		url: "../doRequest",
		method: "GET",
		data: "me="+(getCookies("id")*1)+"&rq_type=get-requests",
		processData: false,
		success: (e)=>{
			// incoming requests
			if (e.incoming !== undefined){
				
				// show number of incoming requests at notification bell
				$('.notif-btn .num').text(e.incoming.length);
				
				// iterate and show all requests
				for (incoming of e.incoming){
					findUser(incoming).then(e=>{
						let avatar;
						if (e[0].Avatar == "avatar.png") avatar = e[0].Avatar;
						else avatar = e[0].username+"/avatar/"+e[0].Avatar;
						// if user is not a friend for incoming requests
						// prepend pending requests
						if (e[0].rq_status == 'pending'){
							$("#pending-request").prepend(`<div id="user${e[0].id}" style="display: flex;margin: 5px 0;">
								<div class="display-flex" style="width:100%">
									<span class="avatar grid column-5 no-border no-padding overflow-hide relative" style="margin:auto 20px auto 10%;border-radius:50%;min-width:50px;height:50px;">
										<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%)">
									</span>
									<span class="user-info grid column-1 no-border no-padding" style="font-size: 1rem;"><b style="white-space:nowrap">${e[0].fullname}</b> <a style="color:#ff00cb;font-size:15px;font-weight:normal">@${e[0].username}</a></span>
								</div>
								<div id="actions" data-id="${e[0].id}" data-rqid="${e[0].rqid}" style="display:flex;margin:0 8%;min-width:150px;transform:scale(0.9)">
									<button class="accept-btn csbtn" style="background:#5abf0c" onclick="acceptRequest(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Accept</button>
									<button class="decline-btn csbtn" onclick="declineRequest(this)"><i class="fa fa-spinner fa-spin" style="display:none"></i> Decline</button>
								</div>
							</div><hr style="border-color:#e3e3e3;">`);
						}
						// If user is already a friend for incoming requests
						if (e[0].rq_status == 'friends'){
							$("#pending-request").append(`<div id="user${e[0].id}" style="display: flex;margin: 5px 0;">
								<div class="display-flex" style="width:100%">
									<span class="avatar grid column-5 no-border no-padding overflow-hide relative" style="margin:auto 20px auto 10%;border-radius:50%;min-width:50px;height:50px;">
										<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%)">
									</span>
									<span class="user-info grid column-1 no-border no-padding" style="font-size: 1rem;"><b style="white-space:nowrap">${e[0].fullname}</b> <a style="color:#ff00cb;font-size:15px;font-weight:normal">@${e[0].username}</a></span>
								</div>
								<div style="display:flex;margin:0 8%;min-width:150px">
									<button class="accept-btn csbtn" style="background:#ffe8fc;color:#ff90f1" disabled>Friends</button>
								</div>
							</div><hr style="border-color:#e3e3e3;">`);
						}
					});
				}
			}
			if (e.pending !== undefined){
				for (pending of e.pending){
					findUser(pending).then(e=>{
						let avatar;
						if (e[0].Avatar == "avatar.png") avatar = e[0].Avatar;
						else avatar = e[0].username+"/avatar/"+e[0].Avatar;

						// if user is not a friend for outgoing requests
						if (e[0].rq_status == 'pending'){
							$("#pending-request").prepend(`<div id="user${e[0].id}" style="display: flex;margin: 5px 0;">
								<div class="display-flex" style="width:100%">
									<span class="avatar grid column-5 no-border no-padding overflow-hide relative" style="margin:auto 20px auto 10%;border-radius:50%;min-width:50px;height:50px;">
										<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%)">
									</span>
									<span class="user-info grid column-1 no-border no-padding" style="font-size: 1rem;"><b style="white-space:nowrap">${e[0].fullname}</b> <a style="color:#ff00cb;font-size:15px;font-weight:normal">@${e[0].username}</a></span>
								</div>
								<div style="display:flex;margin:0 8%;min-width:150px">
									<button class="pending-btn csbtn" style="background:silver" disabled>Pending</button>
								</div>
							</div><hr style="border-color:#e3e3e3;">`);
						}
						// If user is already a friend for out going requests
						if (e[0].rq_status == 'friends'){
							$("#pending-request").append(`<div id="user${e[0].id}" style="display: flex;margin: 5px 0;">
								<div class="display-flex" style="width:100%">
									<span class="avatar grid column-5 no-border no-padding overflow-hide relative" style="margin:auto 20px auto 10%;border-radius:50%;min-width:50px;height:50px;">
										<img class="absolute" src="/users/${avatar}" style="width:100%;border-radius:50%;top:50%;transform:translateY(-50%)">
									</span>
									<span class="user-info grid column-1 no-border no-padding" style="font-size: 1rem;"><b style="white-space:nowrap">${e[0].fullname}</b> <a style="color:#ff00cb;font-size:15px;font-weight:normal">@${e[0].username}</a></span>
								</div>
								<div style="display:flex;margin:0 8%;min-width:150px">
									<button class="accept-btn csbtn" style="background:#ffe8fc;color:#ff90f1" disabled>Friends</button>
								</div>
							</div><hr style="border-color:#e3e3e3;">`);
						}
					});
				}
			}
			if (e.incoming == undefined && e.pending == undefined){
				$("#pending-request").append(`<h4 id="rq-info" style="color:#909090;text-align:center;font-family:fontFace;font-weight:normal;">
					<i class="fas fa-meh-rolling-eyes" style="font-size:2.4rem;vertical-align:middle;"></i>&emsp; No Pending Request found.<br>Add new friends?</p></h4>`);
			}
		},
		error: (e)=>{showError("Error fetching pending requests data: <br>"+ e.responseText)}
	});
};

$(window).on("load resize scroll", ()=>{
	// adjust image objects onload and screen orientation change
	for (imgs of $("img")){
		$(imgs).attr("onloadeddata", adjustImage(imgs));
	}
	// adjust message display board
	adjustMessageBoard();
});

window.onhashchange = (e)=>{
	
	if ($(window).outerWidth() <= 780){
		if (location.hash == '#start' && $('#active-chats .member').length > 0){
			$('#centercol').addClass('display-hide');
			$(".message-board").removeClass("active").hide();
			closeEmo();
		}
		if (location.hash.includes('#messenger')){
			$('#centercol').removeClass('display-hide');
			showMessage(location.hash.split(';msg')[1]);
		}
		if (location.hash == "#start"){
			hideAllLayers();
		}
	}
	else {
		if ($('#active-chats .member').length > 0){
			$('#centercol').removeClass('display-hide');
		}
		if (location.hash.includes('#messenger')){
			showMessage(location.hash.split(';msg')[1]);
		}
		if (location.hash == "#start"){
			hideAllLayers();
		}
	}
	if (previousHash.includes('#messenger')){
	    previousHash = '';
	    location.href = '#start';
	}
}
