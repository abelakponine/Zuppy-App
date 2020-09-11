// webRTC
this.myPC = new RTCPeerConnection();
this.myView = $("#myVideoView")[0];
this.peerView = $("#videoImage")[0];
this.peerID = null;
this.callState = "inactive";
this.callPermission = 'prompt';

// start video socket server
vsStart();
restartConnection();

function restartConnection(){
	myPC.close();
	myPC = new RTCPeerConnection();

	// send candidate
	myPC.onicecandidate = ({candidate})=>{
		let candidateOffer = {
				type: "candidate",
				sender: getCookies("id"),
				receiver: peerID,
				candidate: JSON.stringify(candidate)
			};
		vs.send(JSON.stringify(candidateOffer)+"{eof}"); // {eof} signifies end of file for socket server
		console.log("IceCandidate Sent.");
	};
	// send negotiation
	myPC.onnegotiationneeded = ()=>{
		console.log("Negotiation needed!");
		myPC.createOffer({iceRestart:true}).then(e=>{
			myPC.setLocalDescription(e).then(e=>{
				let offer = JSON.stringify({
					type: "offer",
					sender: getCookies("id"),
					receiver: peerID,
					desc: JSON.stringify(myPC.localDescription)
				});
				vs.send(offer+"{eof}");
				console.log("Negotiation sent!");
			});
		});
	};
	// on remote PC track added.
	myPC.ontrack = (e)=> {
		peerView.srcObject = e.streams[0];
		console.log("Remote track added.");
		$("#videoPane #status .info").text("Connected!");
		setTimeout(()=>{
			$("#videoPane #status").hide();
		}, 2000);

		$(peerView).removeClass("opacity-0-65");
		clearInterval(indicator);
	};
	myPC.oniceconnectionstatechange = (e)=>{
		if (myPC.iceConnectionState == "disconnected"){
			let endCall = {type: "end-call", sender: getCookies("id"), receiver: peerID};
			vs.send(JSON.stringify(endCall)+"{eof}");
			endVideoCall();
		}
	};
	//console.clear();
	console.log("WebRTC server restarted.");
}

function startVideoCall(elem){
	new Promise((res,rej)=>{
		res(restartConnection());
	}).then(e=>{
		callState = 'active';
		peerID = $(elem).parent().parent().parent().parent().find('.textarea').data('receiver');
		// send video call message to recipient
		let date = new Date();
		let videoCall = JSON.stringify({
				sender: getCookies("id"),
				receiver: peerID,
				type: "call",
				message: `<span class="fas fa-video display-inline"></span>&nbsp;&nbsp;video&nbsp;call&nbsp;from <span style="font-weight:bold;color:black">&nbsp;@kingabel.a</span>`,
				date: date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
				time: date.getHours()+":"+date.getMinutes(),
				hasAttachment: "no"
		});
		ws.send(videoCall+"{eof}");
		
		$("#videoPane #status .info").html("<i class='fas fa-video color-white'></i> &nbsp; <i class='user'></i>");
		$('#videoPane').find('.user').text('Calling '+userdata[peerID].firstname);
		$('#data-loader,#videoPane,#video-actions').show();
		console.log("Video call initiated...");
		let counter = 0;
		this.indicator = setInterval(()=>{
			$('.call-indicator').append(".");
			counter++;
			if (counter == 4){
				$('.call-indicator').text("");
				counter = 0;
			}
		}, 500);
		
		navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream=>{
			
			myView.muted = true;
			myView.srcObject = stream;
			myView.play();
			stream.getTracks().forEach((track)=>{
				myPC.addTrack(track, stream);
			});
		});

		document.body.onbeforeunload = ()=> endVideoCall();
	});
}

function switchScreen(){
	$(myView).toggle('show');
}
// function to end call
function endVideoCall(){
	callState = 'ended';
	callPermission = 'prompt';

	clearInterval(indicator);
	$('.call-indicator').html("");
	$("#videoPane #status .info").text("Disconnected!");
	$("#videoPane #status").show();
	setTimeout(()=>{
		$('#data-loader,#videoPane').hide();
	}, 2000);
	if (peerView.srcObject){
		for (streams of peerView.srcObject.getTracks()){
			streams.stop();
		}
	}
	if (myView.srcObject){
		for (streams of myView.srcObject.getTracks()){
			streams.stop();
		}
	}
	myView.srcObject = null;
	peerView.src = null;
	console.log("Call ended!");
	myPC.close();
	restartConnection();
}
function vsStart(){
try {
	vs = new WebSocket("wss://vs.zuppy.ml:2053/vss");
	vs.connection = true;
	vs.onopen=(e)=>{
		console.log("Video Socket connection open: State::",vs.readyState);
	};

	let candidArray = []; // array of candidates
	
	vs.onmessage = (e)=>{
		//console.log(e.data, e.data.length); // => uncomment to debug data
		try {
			data = JSON.parse(e.data);
			
			if (data.receiver == getCookies("id")){
				peerID = data.sender;
				callState = 'active';
				
				if (data.type == "end-call"){
					endVideoCall();
				}
				else if (callPermission == "prompt" && data.type !== "candidate"){
					callPermission = 'pending';
					
					if (data.type == "offer"){
						
						new Promise((res,rej)=>{
							res(acceptCall());
						}).then(e=>{
	
						if (callPermission == "accepted"){
							
								myPC.setRemoteDescription(JSON.parse(data.desc)).then(e=>{
									console.log("Offer received.");
									navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream=>{
										myView.muted = true;
										myView.srcObject = stream;
										myView.play();
										
										stream.getTracks().forEach((track)=>{
											myPC.addTrack(track, stream);
										});
										
										myPC.createAnswer().then(e=>{
											
											myPC.setLocalDescription(e).then(e=>{
												// send back answer
												let answer = {
														type: "answer",
														sender: getCookies("id"),
														receiver: data.sender,
														desc: JSON.stringify(myPC.localDescription)
													};
												vs.send(JSON.stringify(answer)+"{eof}");
												console.log("Answer sent.");
											});
										});
									});
								});
							}
						});
					}
					else if (data.type == "answer"){
						myPC.setRemoteDescription(JSON.parse(data.desc));
						console.log("Answer received.");
					}
					
	
					function acceptCall(){
						
						if (confirm("You have an incoming call... \r\nFrom "+userdata[data.sender].firstname)){
							callPermission = 'accepted';
							$("#videoPane #status .info").html("<i class='fas fa-video color-white'></i> &nbsp; <i class='user'></i>");
							$('#videoPane').find('.user').text('Connecting '+userdata[data.sender].firstname);
							$('#data-loader,#videoPane,#video-actions').show();
							console.log("Video call connecting...");
							let counter = 0;
							this.indicator = setInterval(()=>{
								$('.call-indicator').append(".");
								counter++;
								if (counter == 4){
									$('.call-indicator').text("");
									counter = 0;
								}
							}, 500);
						}
						else {
							callPermission = 'rejected';
						}
					}
					
				}
				// Add candidates
				if (data.type == "candidate"){
					// queue all candidates until remote SDP is set
					candidArray.push(JSON.parse(data.candidate));
					
					let candidTime = setInterval(()=>{
						if (myPC.remoteDescription !== null){
							
							callPermission = 'accepted';
							
							for (candidate of candidArray){
								if (candidate !== null)
									myPC.addIceCandidate(candidate);
							}
							
							console.log("IceCandidates added.");
							$("#videoPane #status .info").text("Connected!");
							setTimeout(()=>{
								$("#videoPane #status").hide();
							}, 2000);
							$(peerView).removeClass("opacity-0-65");
							clearInterval(candidTime);
						}
					}, 1000);
				}
			}
		}
		catch (e){
			$("#videoPane #status .info").text("Connection Error! Please retry.");
        		setTimeout(()=>{ endVideoCall(); }, 3000);
		}
	};
	vs.onerror=(e)=>{
		if (ws.readyState == 3){
			console.log("Video Socket disconnected unexpectedtly.");
			vs.close();
			console.log("Trying to reconnect...");
			vsRestart();
		}
	};
	vs.onclose=(e)=>{
		if (vs.connection){
			console.log("Video Socket connection closed by server.");
			console.log("Trying to reconnect...");
			vsRestart();
		}
	};
}
catch (e){
	console.log(e);
}
}
// function to close video socket
function vsClose(){
	vs.connection = false;
        vs.send("%disconnect%{eof}");
	vs.close();
	console.log("Video Socket connection closed.");
}
// function to synchronize socket restart on accidental close
function vsRestart(){
	vsStart();
}
