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

  document.getElementById("GetStreamButton").addEventListener("click", getStream);
  document.getElementById("TakePhotoButton").addEventListener("click", takePhoto);
  document.getElementById("ShareButton").addEventListener("click", share);