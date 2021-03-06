/*
* Zuppy Web Socket PHP-JS V 1.0
* Created by Abel Akponine
* Java Script File
* Github: https://github.com/abelakponine
* Instagram: @kingabel.a
*/
var ws;
var host = "zuppy.ml"; 
var port = 443

function startSocket(){
	try {
	ws = new WebSocket(`wss://${host}:${port}/wss`);
	ws.connection = true;

	ws.onopen=(e)=>{
		console.log("Connection Open: state::",ws.readyState);
	};
	ws.onmessage=(e)=>{
		let data = JSON.parse(e.data);
		let sender = data.sender;
		let receiver = data.receiver;
		let date = data.date.split("-").reverse().join("-");
		let fileType1 = ["jpg","png","gif","webp"];
		let fileType2 = ["mpeg","mp4","3gp","mp3","wav","amr","aac","ogg"];
		let fileType3 = ["pdf","doc","docx","ppt","txt"];


		if (user_status == "ready"){
			let filecount = "";
			let attachments = "";
			
			if (data.hasAttachment == "yes"){
				
				let fileArray = JSON.parse(data.attachments);
				
				if (fileArray.length == 1){
				 	filecount = "1 file";
				}
				else if (fileArray.length > 1) {
					filecount = fileArray.length+" files";
				}
				// attaching files to message
				if (fileType1.includes(getFileExt(fileArray[0].filename))){
					attachments = `
						<div id="msg-files" style="width:40%;display:block;align-self:flex-end;max-height:200px;position:relative;margin-top:4px">
							<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:200px;overflow:hidden;border-radius:20px;filter:blur(0.4px) brightness(92%);">
								<img src="${fileArray[0].filepath}" alt="${fileArray[0].filename}" style="width: 100%;margin-top: 50%;transform: translateY(-50%);min-height: 100%;height: auto;" oncontextmenu="return false">
							</div>
							<div class="file-desc" style="z-index:10;position:absolute;bottom:0;padding:3% 6px;color:white;background:#c70080;border-radius:4px 4px 20px 20px;width:calc(100% - 12px);text-align:center;font-size:12px;"> ${filecount} attached </div>
						</div>`;
				}
				else if (fileType2.includes(getFileExt(fileArray[0].filename))){
					attachments = `
						<div id="msg-files" style="width:40%;display:block;align-self:flex-end;max-height:200px;position:relative;margin-top:8px">
							<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:200px;overflow:hidden;border-radius:20px;filter:blur(0.4px) brightness(92%);">
								<video src="${fileArray[0].filepath}" alt="${fileArray[0].filename}" style="width: 100%;margin-top: 50%;transform: translateY(-50%);min-height: 100%;height: auto;" oncontextmenu="return false"></video>
							</div>
							<div class="file-desc" style="z-index:10;position:absolute;bottom:0;padding:3% 6px;color:white;background:#c70080;border-radius:4px 4px 20px 20px;width:calc(100% - 12px);text-align:center;font-size:12px;"> ${filecount} attached </div>
						</div>`;
				}
				else if (fileType3.includes(getFileExt(fileArray[0].filename))){
					attachments = `
						<div id="msg-files" style="width:30%;display:block;align-self:flex-end;max-height:150px;position:relative;margin-top:8px;">
							<div class="file-preview" style="background:#e4e4e4;position:relative;height:max-content;width:100%;display:block;max-height:150px;overflow:hidden;filter:blur(0.4px) brightness(92%);min-height: 50px;z-index: 2;">
                                <span class="fa fa-file-alt" style="font-size:2.5rem;color:#ff4aae;"></span>
							</div>
							<div class="file-desc" style="z-index:10;position:absolute;bottom: 12px;padding: 3% 10px 3% 26px;color:white;background: #444243;border-radius:4px;width:calc(100% - 36px);text-align:center;font-size:12px;z-index:1;"> ${filecount} attached </div>
						</div>`;
				}
			}
			// message content
			if (data.type == "private"){
				
				if (receiver == getCookies('id')){
	
					let msgElem = "";
					if (data.message !== ""){
						msgElem = `<div class="grid" style="background:#f746b8;width:max-content;height:max-content;max-width:60%;margin:5px auto 5px 0;padding:10px 12px;color:white;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(data.message)}</div>`;
					}
					
					$('.msg'+sender).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
								${attachments}
							</div>
						`);
					if (decodeURI(data.message).length > 14)
						$('#active-chats > #chat'+data.sender+' .msg-preview').html(decodeURI(data.message).substr(0,14)+' ...');
					else
						$('#active-chats > #chat'+data.sender+' .msg-preview').html(decodeURI(data.message));
					$('#active-chats > #chat'+data.sender+' .msg-preview-status').html(date
							+'<br>at&nbsp;'+data.time+' '+timeConvention(data.time));
					$('.display-board').scrollTop($('.message-board.active').outerHeight());
				}
				else if (sender == getCookies('id')){
	
					let msgElem = "";
					if (data.message !== ""){
						msgElem = `<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:12px;color:black;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap">${decodeURI(data.message)}</div>`;
					}
					
					$('.msg'+receiver).find('.display-board .sending').remove();
					$('.msg'+receiver).find('.display-board').append(`
							<div class="me msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
								${attachments}
							</div>
					`);
					if (decodeURI(data.message).length > 14)
						$('#active-chats > #chat'+data.receiver+' .msg-preview').html(decodeURI(data.message).substr(0,14)+' ...');
					else
						$('#active-chats > #chat'+data.receiver+' .msg-preview').html(decodeURI(data.message));
					$('#active-chats > #chat'+data.receiver+' .msg-preview-status').html(date
							+'<br>at&nbsp;'+data.time+' '+timeConvention(data.time));

					// zuppy bot
					if (sender == getCookies('id') && receiver == 1023){
						sender = 1023;
						let msgElem = "";
						if (data.message !== ""){
							msgElem = `<div class="grid" style="background:#f746b8;width:max-content;height:max-content;max-width:60%;margin:5px auto 5px 0;padding:10px 12px;color:white;border-radius:20px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap"><b style="white-space:nowrap">Here's your message:</b><br>${decodeURI(data.message)}</div>`;
						}
						
						$('.msg'+sender).find('.display-board').append(`
								<div class="you msg grid column-1 no-border no-padding display-flex flex-column-reverse">
									${msgElem}
									${attachments}
								</div>
							`);
						if (decodeURI(data.message).length > 14)
							$('#active-chats > #chat'+data.sender+' .msg-preview').html(decodeURI(data.message).substr(0,14)+' ...');
						else
							$('#active-chats > #chat'+data.sender+' .msg-preview').html(decodeURI(data.message));
						$('#active-chats > #chat'+data.sender+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+data.time+' '+timeConvention(data.time));
						$('.display-board').scrollTop($('.message-board.active').outerHeight());
					}
				}
			}
			// add video call to receiver's message
			else if (data.type == "call"){

				if (sender == getCookies('id')){
					data.message = data.message.replace("{{target}}", "to");
					let msgElem = "";
					if (data.message !== ""){
						msgElem = `<div class="grid" style="background:#dbdbdb;width:max-content;height:max-content;max-width:60%;margin:5px 0 5px auto;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap"><span class="fa fa-video"></span>&nbsp; video call </span></div>`;
					}
					
					$('.msg'+receiver).find('.display-board .sending').remove();
					$('.msg'+receiver).find('.display-board').append(`
							<div class="me msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
							</div>
					`);

					$('#active-chats > #chat'+data.receiver+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
					$('#active-chats > #chat'+data.receiver+' .msg-preview-status').html(date
							+'<br>at&nbsp;'+data.time+' '+timeConvention(data.time));

					// zuppy bot
					if (sender == getCookies('id') && receiver == 1023){
						sender = 1023;
						data.message = data.message.replace("{{target}}", "from");
						let msgElem = "";
						if (data.message !== ""){
							msgElem = `<div class="grid" style="background:#ff22b059;height:max-content;max-width:min-content;margin:5px auto 5px 0;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap;text-align:center"><b style="white-space:nowrap">Zuppy get just got a</b><br>${decodeURI(data.message)}</div>`;
						}
						
						$('.msg'+sender).find('.display-board .sending').remove();
						$('.msg'+sender).find('.display-board').append(`
								<div class="you msg grid column-1 no-border no-padding display-flex flex-column-reverse">
									${msgElem}
								</div>
						`);

						$('#active-chats > #chat'+data.sender+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
						$('#active-chats > #chat'+data.sender+' .msg-preview-status').html(date
								+'<br>at&nbsp;'+data.time+' '+timeConvention(data.time));
					}
				}
				if (receiver == getCookies('id')){
					data.message = data.message.replace("{{target}}", "from");
					let msgElem = "";
					if (data.message !== ""){
						msgElem = `<div class="grid" style="background:#ff22b059;height:max-content;max-width:min-content;margin:5px auto 5px 0;padding:10px 12px;color:black;border-radius:30px;font-size:14px;line-height:2;user-select:text;white-space:pre-wrap;text-align:center">${decodeURI(data.message)}</div>`;
					}
					
					$('.msg'+sender).find('.display-board .sending').remove();
					$('.msg'+sender).find('.display-board').append(`
							<div class="you msg grid column-1 no-border no-padding display-flex flex-column-reverse">
								${msgElem}
							</div>
					`);

					$('#active-chats > #chat'+data.sender+' .msg-preview').html('<span class="fa fa-video"></span>&nbsp; video call </span>');
					$('#active-chats > #chat'+data.sender+' .msg-preview-status').html(date
							+'<br>at&nbsp;'+data.time+' '+timeConvention(data.time));
				}
			}
			if ($('.message-board.active .display-board')[0] !== undefined){
				$('.message-board.active').find('.writer').html('&nbsp;');
				$('.message-board.active .display-board').scrollTop($('.message-board.active .display-board')[0].scrollHeight);
			}
		}
		// queue messages if user status is not ready
		else {
			msgque.push(data);
		}
	};
	ws.onerror=(e)=>{
		if (ws.readyState == 3){
			console.log(e,"Disconnected unexpectedtly.");
			ws.close();
			console.log("Trying to reconnect...");
			wsReconnect();
		}
	};
	ws.onclose=(e)=>{
		if (ws.connection){
			console.log(e,"Connection closed unexpectedtly.");
			console.log("Trying to reconnect...");
			wsReconnect();
		}
	}
	} catch (e){

	}
}
function wsReconnect(){
	return startSocket();
}
function send(data){
	let response;
	
	if (data == "%disconnect%"){
		ws.connection = false;
	}
	if (data == "%reconnect%"){
		ws.connection = true;
		wsReconnect();
	}
	try { ws.send(data+"{eof}"); response = true; }
	catch(e) { console.log(e); response = false; }
	
	return response;
}

startSocket();
