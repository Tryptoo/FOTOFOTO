<template>
  <!DOCTYPE html>
  <html lang="">
    <head>
      <meta charset="utf-8">
      <title>FOTOFOTO</title>
      <link href="style.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Staatliches&display=swap" rel="stylesheet">
      <link rel="manifest" href="manifest.json">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
    </head>

    <header>
      <h1>FOTOFOTO</h1>
    </header>

    <body>
      <p><button id="GetStreamButton">Enable Camera Access</button></p>
      <p><video id="video" autoplay></video></p>
      <p><button id="TakePhotoButton">Take FOTO</button></p>
      <p><img id="imageTag"></p>
      <p><button id="ShareButton">Share FOTO</button></p>
      <p><button id="DownloadButton">Download</button></p>
      <p><button id="addBtn">Home App FOTOFOTO</button></p>
    </body>
  </html>

</template>

<script>
function getUserMedia(options, successCallback, failureCallback) {
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
}

var theStream;

function getStream() {
  if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }
  
  var constraints = {
    video: true
  };

  getUserMedia(constraints, function (stream) {
    var mediaControl = document.querySelector('video');
    if ('srcObject' in mediaControl) {
      mediaControl.srcObject = stream;
    } else if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    } else {
      mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
    }
    theStream = stream;
  }, function (err) {
    alert('Error: ' + err);
  });
}

var blobImage

function takePhoto() {
  if (!('ImageCapture' in window)) {
    alert('ImageCapture is not available');
    return;
  }
  
  if (!theStream) {
    alert('Grab the video stream first!');
    return;
  }
  
  var theImageCapturer = new ImageCapture(theStream.getVideoTracks()[0]);

  theImageCapturer.takePhoto()
    .then(blob => {
      var theImageTag = document.getElementById("imageTag");

      blobImage = blob

      theImageTag.src = URL.createObjectURL(blob);
    })
    .catch(err => alert('Error: ' + err));
}

async function share() {
  if (!("share" in navigator)) {
    alert('Web Share API not supported.');
    return;
  }
  
  const filesArray = [
    new File(
      [blobImage],
      'meme.jpg',
      {
        type: "image/jpeg",
      }
   )
  ];

  var theImageTag = document.getElementById("imageTag");
  navigator.share({
      title: 'FOTOFOTO',
      text: 'Look at my cool Foto !',
      files: filesArray
    })
    .then(() => console.log('Successful share'))
    .catch(error => console.log('Error sharing:', error));
}

function download() {
if (blobImage) {
  //code from "https://dev.to/nombrekeff/download-file-from-blob-21ho"
  //////////////////////////////////////////////////////////////////////
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blobImage);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = "foto.jpg";

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );

  // Remove link from body
  document.body.removeChild(link);
  //////////////////////////////////////////////////////////////////////
}
}

document.getElementById("GetStreamButton").addEventListener("click", getStream);
document.getElementById("TakePhotoButton").addEventListener("click", takePhoto);
document.getElementById("ShareButton").addEventListener("click", share);

let deferredPrompt;
const addBtn = document.querySelector('#addBtn');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
// Prevent Chrome 67 and earlier from automatically showing the prompt
e.preventDefault();
// Stash the event so it can be triggered later.
deferredPrompt = e;
// Update UI to notify the user they can add to home screen
addBtn.style.display = 'block';

addBtn.addEventListener('click', () => {
  // hide our user interface that shows our A2HS button
  addBtn.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  });
});
});
</script>

<style lang="scss">
img{
    max-width: 100%;
}

*{
    box-sizing: border-box;
}


html{
    display: flex;
    background-color: #48586f;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: 'Lato','Open Sans',sans-serif;
    font-size: 100%;
    padding-left: 10%;
    padding-right: 10%;
}

header{
    font-size: 200%;
    font-family: 'Staatliches',sans-serif;
}


body{
    display: flex;
    flex-direction: column;
    align-items: center;
}

video{
    width: 50vw;
    height: 50vh;
}

button{
    margin-top:2%;
    padding:1% ;
    font-family: 'Staatliches',sans-serif;
    font-size: 150%;
    height: 50%;
    width: auto;
    color:#ffffc0;
    transition-duration: 0.4s;
    background-color: #d62e2e;
    text-decoration: none;
    border-radius: 5%;
}
</style>
