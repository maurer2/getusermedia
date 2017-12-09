'use strict';

const mediaSettings = {
  audio: false,
  video: {
    width: 1280,
    height: 720
  }
};

navigator.mediaDevices.getUserMedia(mediaSettings)
  .then(function (mediaStream) {
    let video = document.querySelector('video');
    let canvas = document.querySelector('canvas');

    let colorBoxRed = document.querySelector('.color-box-red');
    let colorBoxGreen = document.querySelector('.color-box-green');
    let colorBoxBlue = document.querySelector('.color-box-blue');
    let updateInterval;

    canvas.width = 640;
    canvas.height = 480;

    video.srcObject = mediaStream;

    video.onloadedmetadata = function () {
      video.play();
    };

    video.addEventListener('play', function(){
      updateInterval = setInterval(function(){
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        let imgd = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        let pix = imgd.data;
        let pixelsRed = [];
        let pixelsGreen = [];
        let pixelsBlue = [];

        // Loop over each pixel and invert the color.
        for (let i = 0, n = pix.length; i < n; i += 4) {
            pixelsRed.push(pix[i]);
            pixelsGreen.push(pix[i + 1]);
            pixelsBlue.push(pix[i + 2]);
        }

        let red = pixelsRed.reduce(function(a, b) {
          return Math.max(a, b);
        });

        let green = pixelsGreen.reduce(function(a, b) {
          return Math.max(a, b);
        });

        let blue = pixelsBlue.reduce(function(a, b) {
          return Math.max(a, b);
        });

        colorBoxRed.style.backgroundColor = 'rgb(' + red + ',' + '0' + ',' + '0' + ')';
        colorBoxGreen.style.backgroundColor = 'rgb(' + '0' + ',' + green + ',' + '0' + ')';
        colorBoxBlue.style.backgroundColor = 'rgb(' + '0' + ',' + '0' + ',' + blue + ')';

        //canvas.getContext('2d').putImageData(imgd, 0, 0);
      }, 33);
    });

    video.addEventListener('stop', function(){
      clearInterval(updateInterval);
    });

  })
  .catch(function (err) {
    console.log(err.name + ':' + err.message);
  });
