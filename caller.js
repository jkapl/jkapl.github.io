let myVideo = document.getElementById("me");
let yourVideo = document.getElementById("you");
let screenshotButton = document.getElementById("screenshotButton");
let screenshot = document.getElementById("screenshot");
let remoteDescriptionButton = document.getElementById("submitRemoteDescription");
let remoteDescription = document.getElementById("remoteDescription");
let startCallButton = document.getElementById("startCallButton");
let setAnswerButton = document.getElementById("submitAnswerButton");
let answer = document.getElementById("answer");
let callerIceCandidate = document.getElementById("callerIceCand");
let receiverIceCandidate = document.getElementById("receiverIceCand");

let callerIceCandidates = [];
let receiverIceCandidates = [];


let server = {
  iceServers: [{url: "stun:stun.l.google.com:19302"}]
}

let caller = new RTCPeerConnection(server);
let receiver = new RTCPeerConnection(server);

// Caller
// async function getVideo () {
//   const stream = await navigator.mediaDevices.getUserMedia( { video: true });
//   gotStream(stream);
// }

async function call () {

  const stream = await navigator.mediaDevices.getUserMedia( { video: true });
  // let caller = new RTCPeerConnection(server);
  console.log('calling')
  myVideo.srcObject = stream;

  stream.getTracks().forEach(track => caller.addTrack(track, stream));
  // caller.addTrack(stream);

  // caller.createOffer(offer => {
  //   caller.setLocalDescription(offer);
  // });

  let sessDescription = await caller.createOffer();
  console.log(JSON.stringify(sessDescription))

  caller.setLocalDescription(sessDescription)

  caller.onicecandidate = e => {
    if (!e.candidate) return
    let cand = JSON.stringify(e.candidate);
    console.log(cand);
    // callerIceCandidates.push(e.candidate);
    // caller.addIceCandidate(e.candidate);
    // caller.onicecandidate = null;
  }

  // caller.onaddstream = e => {
  //   yourVideo.srcObject = e.stream;
  // };

  caller.ontrack = e => {
    console.log('caller got track', e.track, e.streams);
    yourVideo.srcObject = e.streams[0];
  }

}

startCallButton.onclick = function() {
  call();
}


// receiver
async function receiverSendVideo() {

  receiver.setRemoteDescription(JSON.parse(remoteDescription.value))
  const stream = await navigator.mediaDevices.getUserMedia( { video: true });

  // let receiver = new RTCPeerConnection(server);
  console.log('receiving')
  myVideo.srcObject = stream;
  stream.getTracks().forEach(track => receiver.addTrack(track, stream));


  // receiver.setRemoteDescription(JSON.parse(remoteDescription.value))

  // caller.createOffer(offer => {
  //   caller.setLocalDescription(offer);
  // });

  let sessDescription = await receiver.createAnswer({configuration : {offerToReceiveVideo: 1}});
  console.log(JSON.stringify(sessDescription))

  receiver.setLocalDescription(sessDescription)

  receiver.onicecandidate = e => {
    if (!e.candidate) return
    let cand = JSON.stringify(e.candidate);
    console.log(cand);
    // receiverIceCandidates.push(e.candidate);
    // receiver.onicecandidate = null;
  }

  // receiver.onaddstream = e => {
  //   yourVideo2.srcObject = e.stream;
  // };

  receiver.ontrack = e => {
    console.log('receiver got track', e.track, e.streams);
    yourVideo.srcObject = e.streams[0];
  } 

}

remoteDescriptionButton.onclick = function() {
  receiverSendVideo();
  let candidate = new RTCIceCandidate(JSON.parse(callerIceCandidate.value));
  receiver.addIceCandidate(candidate);
}

setAnswerButton.onclick = function() {
  caller.setRemoteDescription(JSON.parse(answer.value));
  let candidate = new RTCIceCandidate(JSON.parse(receiverIceCandidate.value));
  caller.addIceCandidate(candidate);
}

screenshotButton.onclick = function() {
  screenshot.width = myVideo.videoWidth; 
  screenshot.height = myVideo.videoHeight;
  screenshot.getContext('2d').drawImage(myVideo, 0, 0); 
}
