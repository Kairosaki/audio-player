var slider = document.getElementById('audio-slider');
// counter to track music position on playlist
var counter = 1;
var paused = document.querySelector('#audio-pause');
var played = document.querySelector('#audio-play');

if (document.getElementById('playlist').childElementCount > 0) {
  var currentMusic = document.getElementById('currentSong').children[0];
} else {
  alert('please add a music');
}

function playMusic() {
  if (!currentMusic || document.getElementById('playlist').childElementCount == 0) {
    alert('there is no music in playlist');
  } else {
    var x = document.createElement('audio');
    x.setAttribute('id', 'audioPlayer');
    var c = currentMusic.getAttribute('href');
    if (x.canPlayType('audio/mpeg') || x.canPlayType('audio/ogg')) {
      x.setAttribute('src', c);
    } else {
      alert('you need to add a audio format mp3 or ogg');
    }
    document.getElementById('audio-main').appendChild(x);
    x.setAttribute('onended', 'onEndedTrack()');
    x.setAttribute('onprogress', 'setMusicTime()');
    x.setAttribute('ontimeupdate', 'setProgressBar()');
    x.play();
    x.volume = 0.02;
  }
}

function nextSong() {
  var playlistLengh = document.getElementById('playlist').childElementCount;
  var p = document.getElementById('audioPlayer');
  played.setAttribute('style', 'display:none;');
  paused.setAttribute('style', 'display:inline-block;');
  if (document.getElementById('currentSong')) {
    var currentMusic = document.getElementById('currentSong').children[0];
    resetStyle();
  } else {
    var currentMusic = document.getElementById('playlist').children[0].children[0];
  }

  if (currentMusic) {
    if (counter > 0 && counter < playlistLengh) {
      counter++;
      currentMusic.parentElement.removeAttribute('id');
      currentMusic = currentMusic.parentElement.nextElementSibling;
      currentMusic.setAttribute('id', 'currentSong');
      currentMusic = currentMusic.children[0];
      p.setAttribute('src', currentMusic.getAttribute('href'));
    } else {
      counter = 1;
      currentMusic.parentElement.removeAttribute('id');
      currentMusic = document.getElementById('playlist').children[0].children[0];
      currentMusic.parentElement.setAttribute('id', 'currentSong');
      p.setAttribute('src', currentMusic.getAttribute('href'));
    }
    document.getElementById('audio-title').textContent = currentMusic.textContent;
    p.play();
  } else {
    alert('there is no music in the playlist');
  }
}

function previousSong() {
  var playlistLengh = document.getElementById('playlist').childElementCount;
  var p = document.getElementById('audioPlayer');
  var c = playlistLengh - 1;
  played.setAttribute('style', 'display:none;');
  paused.setAttribute('style', 'display:inline-block;');

  // in case of stop is clicked while the first song in playlist is playing and we click on previous, the id will be removed, have to fix it somehow
  if (!document.getElementById('currentSong')) {
    currentMusic = document.getElementById('playlist').children[0];
  } else {
    currentMusic = document.getElementById('currentSong');
    resetStyle();
  }
  if (currentMusic || playlistLengh > 0) {
    if (counter > 1 && playlistLengh > 1) {
      currentMusic.removeAttribute('id');
      currentMusic = currentMusic.previousElementSibling;
      currentMusic.setAttribute('id', 'currentSong');
      currentMusic = currentMusic.children[0];
      p.setAttribute('src', currentMusic.getAttribute('href'));
      counter--;
    } else {
      counter = playlistLengh;
      if (currentMusic.getAttribute('id')) {
        currentMusic.removeAttribute('id');
      }

      currentMusic = document.getElementById('playlist').children[c];
      currentMusic.setAttribute('id', 'currentSong');
      currentMusic = currentMusic.children[0];
      p.setAttribute('src', currentMusic.getAttribute('href'));
    }
    document.getElementById('audio-title').textContent = currentMusic.textContent;
    p.play();
  } else {
    alert('there is no music in the playlist');
  }
}

function restartMusic() {
  var p = document.getElementById('audioPlayer');
  if (currentMusic) {
    p.load();
    p.play();
  } else {
    alert('there is no music in the playlist');
  }
}

function pauseMusic() {
  document.getElementById('audioPlayer').pause();
  paused.setAttribute('style', 'display:none;');
  played.setAttribute('style', 'display:inline-block;');
}

function resumeMusic() {
  if (document.getElementById('currentSong')) {
    document.getElementById('audioPlayer').play();
  } else {
    alert('select music first');
  }
  played.setAttribute('style', 'display:none;');
  paused.setAttribute('style', 'display:inline-block;');
}

function stopMusic() {
  if (document.getElementById('currentSong')) {
    resetStyle();
  }

  paused.setAttribute('style', 'display:none;');
  played.setAttribute('style', 'display:inline-block;');
  document.getElementById('audio-title').textContent = 'no music selected';
  var p = document.getElementById('audioPlayer');
  if (document.getElementById('currentSong')) {
    currentMusic = document.getElementById('currentSong').children[0];
  }

  counter = 1;
  if (currentMusic) {
    p.currentTime = 0;
    p.pause();
    p.setAttribute('src', '');
    currentMusic.parentElement.removeAttribute('id');
  } else {
    alert('there is no music in the playlist');
  }
}

function playThisSong(i) {
  preventClick();
  var paused = document.querySelector('#audio-pause');
  var played = document.querySelector('#audio-play');
  played.setAttribute('style', 'display:none;');
  paused.setAttribute('style', 'display:inline-block;');

  var p = document.getElementById('audioPlayer');
  // counter need to be set as i+1 selected element
  counter = i + 1;
  var playingMusic = document.getElementById('currentSong');
  var selectedMusic = document.getElementById('playlist').children[i].children[0];
  document.getElementById('audio-title').textContent = selectedMusic.textContent;
  var getMusic = selectedMusic.getAttribute('href');
  p.setAttribute('src', getMusic);
  if (playingMusic) {
    playingMusic.removeAttribute('id');
  }
  document.getElementById('playlist').children[i].setAttribute('id', 'currentSong');

  p.play();
}

function addMusic(i) {
  var fileAdded = document.getElementById('audio-file');

  if (fileAdded.files[0] != null) {
    if (i == null) {
      i = 0;
    }
    var musicSelected = fileAdded.files[0].name;
    var musicText = musicSelected.replace('.mp3', '');
    var playlistLengh = document.getElementById('playlist').childElementCount;
    var duplicated = false;

    // verify if the music is already on the list
    for (t = 0; t < playlistLengh; t++) {
      if (document.getElementById('playlist').children[t].children[0].textContent == musicText) {
        duplicated = true;
      }
    }

    // verify is music is on correct format
    if ((musicSelected.indexOf('.mp3') || musicSelected.indexOf('.ogg')) && !duplicated) {
      addMusicBis(i);
    } else {
      alert('music already in the playlist');
      // on standard audio html5 we see the filename when choosen even if its duplicated or not same format
      fileAdded.files[0] == null;
    }
  } else {
    alert('You have not selected a music');
  }
}

function addMusicBis(i) {
  var fileAdded = document.getElementById('audio-file');
  var musicAddedLink = window.URL.createObjectURL(fileAdded.files[0]);
  i = document.getElementById('playlist').childElementCount;
  var musicSelected = fileAdded.files[0].name;
  var musicText = musicSelected.replace('.mp3', '');
  var musicItem = document.createElement('li');
  var musicLink = document.createElement('a');
  musicLink.setAttribute('href', musicAddedLink);
  musicLink.setAttribute('onclick', 'playThisSong(' + i + ')');
  musicLink.textContent = musicText;
  document.getElementById('playlist').appendChild(musicItem);
  musicItem.appendChild(musicLink);
  window.URL.revokeObjectURL(fileAdded.files[0]);
}

function preventClick() {
  var pl = document.getElementById('playlist');
  var cc = document.getElementById('playlist').childElementCount;
  for (i = 0; i < cc; i++) {
    pl.children[i].addEventListener(
      'click',
      function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      false
    );
  }
}

function shufflePlaylist() {
  var ul = document.getElementById('playlist');
  // cloning the playlist ( better performance when looping )
  var temp = ul.cloneNode(true);
  var rndNb;
  var listRnd = [];

  // Create an array with unique random numbers
  while (listRnd.length < temp.children.length) {
    rndNb = (Math.random() * temp.children.length) | 0;
    if (listRnd.indexOf(rndNb) === -1) {
      listRnd.push(rndNb);
    }
  }

  for (i = 0; i < listRnd.length; i++) {
    temp.appendChild(temp.children[listRnd[i]]);
  }

  for (j = 0; j < temp.children.length; j++) {
    temp.children[j].children[0].setAttribute('onclick', 'playThisSong(' + j + ')');
  }
  ul.parentNode.replaceChild(temp, ul);
  stopMusic();
}

function muteVolume() {
  slider.value = 0;
  document.getElementById('audioPlayer').volume = 0;
}

function maxVolume() {
  slider.value = 100;
  document.getElementById('audioPlayer').volume = 1;
}

function setVolume(myVolume) {
  document.getElementById('audioPlayer').volume = myVolume;
}

slider.oninput = function() {
  setVolume(this.value / 100);
};

function setProgressBar() {
  setMusicTime();
  setPercentBar();
}

function onEndedTrack() {
  nextSong();
  document.getElementById('progress-bar').value = 0;
}

function setMusicTime() {
  document.getElementById('audio-time').textContent = convertTime(document.getElementById('audioPlayer').currentTime);
}

function convertTime(t) {
  var mymin = (t / 60) | 0;
  var mysec = t % 60 | 0;
  if (mymin < 10) {
    mymin = '0' + mymin;
  }
  if (mysec < 10) {
    mysec = '0' + mysec;
  }
  return mymin + ':' + mysec;
}

function setPercentBar() {
  var actualTime = document.getElementById('audioPlayer').currentTime;
  var audioLength = document.getElementById('audioPlayer').duration;
  if (actualTime < audioLength) {
    document.getElementById('progress-bar').value = (actualTime / audioLength) * 100;
  } else {
    document.getElementById('progress-bar').value = 0;
  }
}

document.getElementById('progress-bar').addEventListener('click', function(e) {
  var valueClicked = (e.offsetX * this.max) / this.offsetWidth;
  document.getElementById('audioPlayer').currentTime =
    (valueClicked * document.getElementById('audioPlayer').duration) / 100;
});

window.addEventListener('play', styleChange, true);
function styleChange() {
  document.getElementById('currentSong').children[0].style.fontStyle = 'italic';
  document.getElementById('currentSong').children[0].style.fontSize = '0.9rem';
}

window.addEventListener('ended', resetStyle, true);
function resetStyle() {
  document.getElementById('currentSong').children[0].style.fontStyle = 'normal';
  document.getElementById('currentSong').children[0].style.fontSize = '0.7rem';
}
