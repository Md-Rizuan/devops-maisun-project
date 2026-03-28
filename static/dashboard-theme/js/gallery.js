(function () {
    "use strict";
  
    /*Basic glightbox */
    var lightbox = GLightbox({
      selector: '.glightbox'
  });
    lightbox.on('slide_changed', ({ prev, current }) => {
      const { slideIndex, slideNode, slideConfig, player } = current;
    });
    var lightbox1 = GLightbox({
      selector: ".glightbox"
    });
  
    /*Image with Description*/
    var lightboxDescription = GLightbox({
      selector: '.glightbox2'
    });
  
    var lightboxVideo = GLightbox({
      selector: '.glightbox3'
    });
    lightboxVideo.on('slide_changed', ({ prev, current }) => {
  
      const { slideIndex, slideNode, slideConfig, player } = current;
  
      if (player) {
        if (!player.ready) {
          // If player is not ready
          player.on('ready', (event) => {
            // Do something when video is ready
          });
        }
  
        player.on('play', (event) => {
        });
  
        player.on('volumechange', (event) => {
        });
  
        player.on('ended', (event) => {
        });
      }
    });
  })();