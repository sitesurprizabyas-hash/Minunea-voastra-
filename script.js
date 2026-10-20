
/* ========================================
   ELEMENTE PRINCIPALE
======================================== */

const intro = document.getElementById("intro");

const envelopeWrapper =
    document.getElementById("envelopeWrapper");

const seal = document.getElementById("seal");

const openHint = document.getElementById("openHint");

const letterContent =
    document.querySelector(".letter-content");

const startStory =
    document.getElementById("startStory");

const introVideo =
    document.getElementById("introVideo");

const introVideoSection =
    document.getElementById("introVideoSection");

const pregnancyMoment =
    document.getElementById("pregnancyMoment");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const testScene =
    document.getElementById("testScene");

const videos =
    Array.from(
        document.querySelectorAll(".video-frame video")
    );


/* ========================================
   STĂRI
======================================== */

let envelopeOpened = false;
let musicStarted = false;
let musicFadeInterval = null;
let introVideoStarting = false;


/* ========================================
   FUNCȚII PENTRU MUZICĂ
======================================== */

function getTargetVolume() {

    const isMobile =
        window.matchMedia(
            "(max-width: 700px)"
        ).matches;

    // Telefon: 1%
    // Laptop: 2.5%

    return isMobile ? 0.01 : 0.025;
}


function stopMusicFade() {

    if (musicFadeInterval !== null) {

        clearInterval(musicFadeInterval);

        musicFadeInterval = null;
    }
}


function pauseBackgroundMusic() {

    if (!backgroundMusic) return;

    stopMusicFade();

    backgroundMusic.pause();
}


function fadeInMusic() {

    if (!backgroundMusic) return;

    stopMusicFade();

    const targetVolume = getTargetVolume();

    backgroundMusic.volume = 0;

    musicFadeInterval = setInterval(function () {

        if (
            !backgroundMusic ||
            backgroundMusic.paused
        ) {

            stopMusicFade();
            return;
        }

        backgroundMusic.volume = Math.min(
            targetVolume,
            backgroundMusic.volume + 0.002
        );

        if (
            backgroundMusic.volume >= targetVolume
        ) {

            stopMusicFade();
        }

    }, 120);
}


function isAnyVideoPlaying() {

    if (introVideoStarting) {
        return true;
    }

    if (
        introVideo &&
        !introVideo.paused &&
        !introVideo.ended
    ) {

        return true;
    }

    return videos.some(function (video) {

        return !video.paused && !video.ended;
    });
}


function resumeBackgroundMusic() {

    if (!backgroundMusic) return;

    // Nu pornim muzica peste un videoclip.

    if (isAnyVideoPlaying()) return;

    // Nu pornim muzica înainte ca plicul
    // să fi fost deschis.

    if (!envelopeOpened) return;

    if (!backgroundMusic.paused) {
        return;
    }

    backgroundMusic.volume = 0;

    backgroundMusic.play()
        .then(function () {

            musicStarted = true;

            // Verificăm din nou, pentru cazul
            // în care între timp a pornit un video.

            if (isAnyVideoPlaying()) {

                pauseBackgroundMusic();
                return;
            }

            fadeInMusic();
        })
        .catch(function () {

            console.log(
                "Muzica de fundal nu a putut fi reluată."
            );
        });
}


function startBackgroundMusic() {

    if (!backgroundMusic || musicStarted) {
        return;
    }

    musicStarted = true;

    backgroundMusic.volume = 0;

    backgroundMusic.play()
        .then(function () {

            if (isAnyVideoPlaying()) {

                pauseBackgroundMusic();
                return;
            }

            fadeInMusic();
        })
        .catch(function () {

            musicStarted = false;
        });
}


/* ========================================
   DESCHIDEREA PLICULUI
======================================== */


if (seal) {

    seal.addEventListener("click", function () {

        if (envelopeOpened) return;

        envelopeOpened = true;
        startBackgroundMusic();
        if (envelopeWrapper) {
            envelopeWrapper.classList.add("open");
        }

        if (openHint) {
            openHint.textContent =
                "Povestea este pe cale să înceapă...";
        }

        setTimeout(function () {

            if (intro) {
                intro.classList.add("reading");
            }

            if (envelopeWrapper) {
                envelopeWrapper.classList.add("show-letter");
            }

        }, 1100);

        setTimeout(function () {

            if (letterContent) {
                letterContent.classList.add("show-text");
            }

        }, 2000);

    });

}


/* ========================================
   VIDEOCLIPUL INTRODUCTIV
======================================== */

if (
    startStory &&
    introVideo &&
    introVideoSection
) {

    startStory.addEventListener("click", function () {

        introVideoSection.scrollIntoView({
            behavior: "smooth"
        });

        // Oprim muzica înainte de video.

        introVideoStarting = true;

        pauseBackgroundMusic();

        // Pornim direct din click, pentru
        // compatibilitate mai bună pe telefon.

        introVideo.currentTime = 0;

        introVideo.play()
            .then(function () {

                introVideoStarting = false;

                pauseBackgroundMusic();
            })
            .catch(function () {

                introVideoStarting = false;

                resumeBackgroundMusic();

                console.log(
                    "Videoclipul introductiv nu a putut fi pornit."
                );
            });
    });
}


if (introVideo) {

    introVideo.addEventListener("play", function () {

        pauseBackgroundMusic();
    });

    introVideo.addEventListener("ended", function () {

        introVideoStarting = false;

        resumeBackgroundMusic();

        if (pregnancyMoment) {

            setTimeout(function () {

                pregnancyMoment.scrollIntoView({
                    behavior: "smooth"
                });

            }, 500);
        }
    });
}


/* ========================================
   ANIMAȚII LA SCROLL
======================================== */

const revealElements =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");

                if (entry.target.id === "testScene") {

                    startPregnancyTest();
                }
            });
        },

        {
            threshold: 0.3
        }
    );

    revealElements.forEach(function (element) {

        observer.observe(element);
    });

} else {

    revealElements.forEach(function (element) {

        element.classList.add("visible");
    });

    if (testScene) {

        startPregnancyTest();
    }
}


/* ========================================
   ANIMAȚIA TESTULUI DE SARCINĂ
======================================== */

function startPregnancyTest() {

    if (!testScene) return;

    if (
        testScene.classList.contains("animate-test")
    ) {

        return;
    }

    setTimeout(function () {

        testScene.classList.add("animate-test");

    }, 500);
}


/* ========================================
   CELE 13 VIDEOCLIPURI CU MESAJE
======================================== */

videos.forEach(function (video) {

    const frame = video.closest(".video-frame");

    const cover = frame
        ? frame.querySelector(".video-cover")
        : null;


    /* ------------------------------------
       CLICK PE INIMĂ
    ------------------------------------ */

    if (cover) {

        cover.addEventListener("click", function () {

            // Nu resetăm currentTime.
            // Astfel, video-ul continuă de unde
            // a rămas dacă este pus pe pauză.

            pauseBackgroundMusic();

            video.play()
                .then(function () {

                    cover.classList.add("hidden");
                })
                .catch(function () {

                    resumeBackgroundMusic();

                    console.log(
                        "Videoclipul nu a putut fi pornit."
                    );
                });
        });
    }


    /* ------------------------------------
       CÂND PORNEȘTE UN VIDEOCLIP
    ------------------------------------ */

    video.addEventListener("play", function () {

        // Oprim orice alt mesaj video.

        videos.forEach(function (otherVideo) {

            if (
                otherVideo !== video &&
                !otherVideo.paused
            ) {

                otherVideo.pause();
            }
        });

        // Oprim și videoclipul introductiv,
        // dacă încă rulează.

        if (
            introVideo &&
            !introVideo.paused
        ) {

            introVideo.pause();
        }

        // Ascundem coperta, inclusiv dacă
        // video-ul a fost pornit din comenzile
        // native ale playerului.

        if (cover) {

            cover.classList.add("hidden");
        }

        pauseBackgroundMusic();
    });


    /* ------------------------------------
       CÂND VIDEOCLIPUL ESTE PE PAUZĂ
    ------------------------------------ */

    video.addEventListener("pause", function () {

        if (!video.ended) {

            resumeBackgroundMusic();
        }
    });


    /* ------------------------------------
       CÂND VIDEOCLIPUL SE TERMINĂ
    ------------------------------------ */

    video.addEventListener("ended", function () {

        resumeBackgroundMusic();
    });


    /* ------------------------------------
       DACĂ VIDEOCLIPUL ARE O EROARE
    ------------------------------------ */

    video.addEventListener("error", function () {

        console.log(
            "Eroare la încărcarea videoclipului:",
            video.currentSrc
        );

        resumeBackgroundMusic();
    });
});








// =====================================
// MUZICA - PAUZĂ ȘI RELUARE
// =====================================

if (backgroundMusic) {

    const musicStorageKey = "musicTime";
    let resumeAfterReturn = false;

    // Restaurăm poziția salvată.
    function restoreMusicPosition() {

        const savedTime = Number(
            localStorage.getItem(musicStorageKey)
        );

        if (
            Number.isFinite(savedTime) &&
            savedTime > 0 &&
            Number.isFinite(backgroundMusic.duration) &&
            savedTime < backgroundMusic.duration
        ) {
            backgroundMusic.currentTime = savedTime;
        }
    }

    if (backgroundMusic.readyState >= 1) {
        restoreMusicPosition();
    } else {
        backgroundMusic.addEventListener(
            "loadedmetadata",
            restoreMusicPosition,
            { once: true }
        );
    }

    // Salvăm secunda melodiei.
    function saveMusicPosition() {

        localStorage.setItem(
            musicStorageKey,
            String(backgroundMusic.currentTime)
        );
    }

    backgroundMusic.addEventListener(
        "timeupdate",
        saveMusicPosition
    );

    // Când utilizatorul pleacă din pagină.
    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            resumeAfterReturn = !backgroundMusic.paused;

            saveMusicPosition();
            pauseBackgroundMusic();

        } else if (resumeAfterReturn) {

            resumeAfterReturn = false;

            // Folosim funcția existentă,
            // care verifică și videoclipurile.
            resumeBackgroundMusic();
        }
    });

    // Când pagina este închisă sau părăsită.
    window.addEventListener("pagehide", function () {

        saveMusicPosition();
        pauseBackgroundMusic();
    });

}