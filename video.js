/* ========================================
   VIDEO-URI
======================================== */

const videos =
    document.querySelectorAll(
        ".video-frame video"
    );


/*
   Dacă pornește un video,
   orice alt video care rulează
   se oprește.
*/

videos.forEach(function (video) {

    video.addEventListener(
        "play",
        function () {

            videos.forEach(
                function (otherVideo) {

                    if (
                        otherVideo !== video &&
                        !otherVideo.paused
                    ) {

                        otherVideo.pause();

                    }

                }
            );

        }
    );

});