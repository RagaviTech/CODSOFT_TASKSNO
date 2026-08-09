/* =========================================
   SONG DATA
========================================= */

const songs = [

    {
        title: "Dream Escape",
        artist: "Alan Walker",
        src: "songs/song1.mp3",
        cover: "images/cover1.jpg"
    },

    {
        title: "Summer Vibes",
        artist: "Marshmello",
        src: "songs/song2.mp3",
        cover: "images/cover2.jpg"
    },

    {
        title: "Night Drive",
        artist: "The Weeknd",
        src: "songs/song3.mp3",
        cover: "images/cover3.jpg"
    }

];


/* =========================================
   VARIABLES
========================================= */

let currentSong = 0;

let isPlaying = false;

let isShuffle = false;

let repeatMode = "off";

// repeatMode:
// "off"
// "all"
// "one"


/* =========================================
   GET HTML ELEMENTS
========================================= */

const audio = document.getElementById("audio");

const cover = document.getElementById("cover");

const title = document.getElementById("title");

const artist = document.getElementById("artist");

const playPauseBtn =
    document.getElementById("play-pause");

const previousBtn =
    document.getElementById("previous");

const nextBtn =
    document.getElementById("next");

const progress =
    document.getElementById("progress");

const currentTimeDisplay =
    document.getElementById("current-time");

const durationDisplay =
    document.getElementById("duration");

const volumeSlider =
    document.getElementById("volume");

const muteBtn =
    document.getElementById("mute");

const shuffleBtn =
    document.getElementById("shuffle");

const repeatBtn =
    document.getElementById("repeat");

const favoriteBtn =
    document.getElementById("favorite");

const playlist =
    document.getElementById("playlist");

const player =
    document.querySelector(".music-player");


/* =========================================
   FAVORITES
========================================= */

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


/* =========================================
   LOAD SONG
========================================= */

function loadSong(index) {

    const song = songs[index];

    title.textContent = song.title;

    artist.textContent = song.artist;

    cover.src = song.cover;

    audio.src = song.src;

    audio.load();

    progress.value = 0;

    currentTimeDisplay.textContent = "00:00";

    durationDisplay.textContent = "00:00";

    updateFavoriteButton();

    updatePlaylist();

}


/* =========================================
   PLAY SONG
========================================= */

function playSong() {

    audio.play()
        .then(() => {

            isPlaying = true;

            playPauseBtn.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

            playPauseBtn.title = "Pause";

            player.classList.add("playing");

        })
        .catch(error => {

            console.log("Audio could not play:", error);

        });

}


/* =========================================
   PAUSE SONG
========================================= */

function pauseSong() {

    audio.pause();

    isPlaying = false;

    playPauseBtn.innerHTML =
        '<i class="fa-solid fa-play"></i>';

    playPauseBtn.title = "Play";

    player.classList.remove("playing");

}


/* =========================================
   PLAY / PAUSE BUTTON
========================================= */

playPauseBtn.addEventListener("click", () => {

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }

});


/* =========================================
   NEXT SONG
========================================= */

function nextSong() {

    if (isShuffle) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(Math.random() * songs.length);

        } while (
            randomIndex === currentSong &&
            songs.length > 1
        );

        currentSong = randomIndex;

    } else {

        currentSong++;

        if (currentSong >= songs.length) {

            currentSong = 0;

        }

    }

    loadSong(currentSong);

    playSong();

}


/* =========================================
   NEXT BUTTON
========================================= */

nextBtn.addEventListener("click", () => {

    nextSong();

});


/* =========================================
   PREVIOUS SONG
========================================= */

previousBtn.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {

        currentSong = songs.length - 1;

    }

    loadSong(currentSong);

    playSong();

});


/* =========================================
   UPDATE TIME AND PROGRESS
========================================= */

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) {

        return;

    }

    const progressPercent =
        (audio.currentTime / audio.duration) * 100;

    progress.value = progressPercent;


    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);

});


/* =========================================
   GET DURATION
========================================= */

audio.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent =
        formatTime(audio.duration);

});


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(time) {

    if (isNaN(time)) {

        return "00:00";

    }

    const minutes =
        Math.floor(time / 60);

    const seconds =
        Math.floor(time % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


/* =========================================
   SEEK
========================================= */

progress.addEventListener("input", () => {

    if (!audio.duration) {

        return;

    }

    audio.currentTime =
        (progress.value / 100) *
        audio.duration;

});


/* =========================================
   VOLUME
========================================= */

audio.volume = 1;

volumeSlider.value = 1;


volumeSlider.addEventListener("input", () => {

    audio.volume =
        Number(volumeSlider.value);

    // If volume is increased after mute
    // automatically unmute

    if (audio.volume > 0) {

        audio.muted = false;

    }

    updateVolumeIcon();

});


/* =========================================
   MUTE
========================================= */

muteBtn.addEventListener("click", () => {

    audio.muted = !audio.muted;

    updateVolumeIcon();

});


/* =========================================
   VOLUME ICON
========================================= */

function updateVolumeIcon() {

    if (
        audio.muted ||
        audio.volume === 0
    ) {

        muteBtn.innerHTML =
            '<i class="fa-solid fa-volume-xmark"></i>';

    }

    else if (audio.volume < 0.5) {

        muteBtn.innerHTML =
            '<i class="fa-solid fa-volume-low"></i>';

    }

    else {

        muteBtn.innerHTML =
            '<i class="fa-solid fa-volume-high"></i>';

    }

}


/* =========================================
   SONG ENDED
========================================= */

audio.addEventListener("ended", () => {

    // Repeat current song

    if (repeatMode === "one") {

        audio.currentTime = 0;

        playSong();

        return;

    }


    // Play next song

    if (currentSong < songs.length - 1) {

        nextSong();

        return;

    }


    // Repeat all

    if (repeatMode === "all") {

        currentSong = 0;

        loadSong(currentSong);

        playSong();

        return;

    }


    // Playlist finished

    pauseSong();

    progress.value = 0;

});


/* =========================================
   SHUFFLE
========================================= */

shuffleBtn.addEventListener("click", () => {

    isShuffle = !isShuffle;

    shuffleBtn.classList.toggle(
        "active",
        isShuffle
    );

});


/* =========================================
   REPEAT
========================================= */

repeatBtn.addEventListener("click", () => {

    if (repeatMode === "off") {

        repeatMode = "all";

        repeatBtn.classList.add("active");

        repeatBtn.title = "Repeat All";

    }

    else if (repeatMode === "all") {

        repeatMode = "one";

        repeatBtn.classList.add("active");

        repeatBtn.innerHTML =
            '<i class="fa-solid fa-repeat"></i><small>1</small>';

        repeatBtn.title = "Repeat One";

    }

    else {

        repeatMode = "off";

        repeatBtn.classList.remove("active");

        repeatBtn.innerHTML =
            '<i class="fa-solid fa-repeat"></i>';

        repeatBtn.title = "Repeat Off";

    }

});


/* =========================================
   FAVORITE BUTTON
========================================= */

favoriteBtn.addEventListener("click", () => {

    const song = songs[currentSong];

    const existingIndex =
        favorites.findIndex(
            item => item.title === song.title
        );


    if (existingIndex !== -1) {

        favorites.splice(
            existingIndex,
            1
        );

    } else {

        favorites.push(song);

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    updateFavoriteButton();

});


/* =========================================
   UPDATE FAVORITE BUTTON
========================================= */

function updateFavoriteButton() {

    const isFavorite =
        favorites.some(
            item =>
                item.title === songs[currentSong].title
        );


    if (isFavorite) {

        favoriteBtn.classList.add("active");

        favoriteBtn.innerHTML =
            '<i class="fa-solid fa-heart"></i>';

    } else {

        favoriteBtn.classList.remove("active");

        favoriteBtn.innerHTML =
            '<i class="fa-regular fa-heart"></i>';

    }

}


/* =========================================
   PLAYLIST
========================================= */

function updatePlaylist() {

    playlist.innerHTML = "";


    songs.forEach((song, index) => {

        const listItem =
            document.createElement("li");


        listItem.textContent =
            `${song.title} - ${song.artist}`;


        if (index === currentSong) {

            listItem.classList.add("active");

        }


        listItem.addEventListener(
            "click",
            () => {

                currentSong = index;

                loadSong(currentSong);

                playSong();

            }
        );


        playlist.appendChild(listItem);

    });

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener("keydown", (event) => {

    // Space = Play / Pause

    if (
        event.code === "Space" &&
        event.target.tagName !== "INPUT"
    ) {

        event.preventDefault();

        if (isPlaying) {

            pauseSong();

        } else {

            playSong();

        }

    }


    // Right arrow = Next

    if (event.code === "ArrowRight") {

        nextSong();

    }


    // Left arrow = Previous

    if (event.code === "ArrowLeft") {

        previousBtn.click();

    }

});


/* =========================================
   START PLAYER
========================================= */

loadSong(currentSong);

updateVolumeIcon();