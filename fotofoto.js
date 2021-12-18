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

        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
          var base64data = reader.result;                
          console.log(base64data);
          theImageTag.src = base64data;
        }

      })
      .catch(err => alert('Error: ' + err));
  }

  function share() {
    if (!("share" in navigator)) {
      alert('Web Share API not supported.');
      return;
    }
  
    var theImageTag = document.getElementById("imageTag");
    navigator.share({
        title: 'FOTOFOTO',
        text: 'Look at my cool Foto !',
        files: fileName.value + '.webp'
      })
      .then(() => console.log('Successful share'))
      .catch(error => console.log('Error sharing:', error));
  }

  async function shareImage() {
    const filesArray = [
      new File(
        [blob],
        'meme.jpg',
        {
          type: "image/jpeg",
        }
     )
    ];
    const shareData = {
      files: filesArray,
    };
    navigator.share(shareData);
  }

  document.getElementById("GetStreamButton").addEventListener("click", getStream);
  document.getElementById("TakePhotoButton").addEventListener("click", takePhoto);
  document.getElementById("ShareButton").addEventListener("click", share);