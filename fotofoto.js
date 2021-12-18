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
document.getElementById("DownloadButton").addEventListener("click", download);

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
  });

  document.getElementById("HomeButton").addEventListener('click', async () => {
    // Hide the app provided install promotion
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    console.log('PWA was installed');
  });
