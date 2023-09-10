const video = document.querySelector("video");
const videoControllerBox = document.getElementById("videoControllerBox");
const videoController = document.getElementById("videoController");
const psBtn = videoController.querySelector("#playPauseBtn");
const volumeBtn = videoController.querySelector("#volume");
const volumeRange = videoController.querySelector("#volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const screenBtn  = document.getElementById("screenBtn");
const videoContainer = document.getElementById("videoContainer");
const screenExpand = screenBtn.querySelector("i");


let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayAndStop = () => {
  if (video.paused) {
    video.play();
    psBtn.className = "fas fa-pause";
  } else {
    video.pause();
    psBtn.className = "fas fa-play";
  }
};

const handleSound = () => {
  if (video.muted) {
    if(volumeValue==="0"){
        volumeRange.value = volumeValue;
        volumeBtn.className = "fas fa-volume-mute";   
    }
    else{
        video.muted = false;
        volumeRange.value = volumeValue;
        volumeBtn.className = "fas fa-volume-up";
    }
    
  } else {
    video.muted = true;
    volumeRange.value = 0;
    volumeBtn.className = "fas fa-volume-mute";
  }
};

const handleVolume = (event) => {
  const {
    target: { value }
  } = event;
  if (video.muted) {
    video.muted = false;
    volumeBtn.className = "fas fa-volume-mute";
  }
  if (value === "0") {
    volumeBtn.className = "fas fa-volume-mute";
  } else {
    volumeBtn.className = "fas fa-volume-up";
  }
  video.volume = volumeValue = value;
};

const getTime = (seconds) => new Date(seconds*1000).toString().substr(19,5);

const handleLoadedMetaData = () => {
    timeline.max = Math.floor(video.duration);
    totalTime.innerText = getTime(Math.floor(video.duration));
}

const handleTimeLine = (event) => {
    const {
        target:{value}
    } = event;
    video.currentTime = value;
}

const handleTimeUpdate = () => {
    currentTime.innerText = getTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
    
}


const handleTimeMove = (e) => {
  if(e.keyCode===39){
    currentTime.innerText = getTime(Math.floor(video.currentTime+5));
    timeline.value = Math.floor(video.currentTime+5);
    video.currentTime = video.currentTime +5
  }
  else if (e.keyCode===37){
    currentTime.innerText = getTime(Math.floor(video.currentTime-5));
    timeline.value = Math.floor(video.currentTime-5);
    video.currentTime = video.currentTime - 5
  }
}


const handleScreenBtn = () => {
    const fullScreen = document.fullscreenElement;
    if(fullScreen){
        document.exitFullscreen();
    }
    else{
        videoContainer.requestFullscreen();
    }
    
}


// const handleFEsc = (e) => {
//   if(e.key==='f'){
//     videoContainer.requestFullscreen();
//   }
//   else if(e.key==="Escape"){
//     document.exitFullscreen();
//   }

// }

const handleSpaceBar = (e) => {
  if((e || window.event).keyCode === 32){
    e.preventDefault();
    if (video.paused) {
        video.play();
        psBtn.className = "fas fa-pause";
      } else {
        video.pause();
        psBtn.className = "fas fa-play";
      }
  }
}

const handleFullScreen = (e) => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    screenExpand.classList.remove("fa-expand");
    screenExpand.classList.add("fa-compress");
    video.style.width="100%";
    video.style.height="100%";
    videoControllerBox.style.width="96%";
} 
  else {
    screenExpand.classList.remove("fa-compress");
    screenExpand.classList.add("fa-expand");
    video.style.width="70%";
    video.style.height="18%";
    videoControllerBox.style.width="66%";
  }
}


const handleEnded = async () => {
    psBtn.className = "fas fa-play";
    
    const {id} = videoContainer.dataset;

    await fetch(`/api/videos/${id}`, {
        method: "POST",
    });

    
}



const hideControls = () => videoControllerBox.classList.remove("showing");

const handleMouseMove = () => {
  if(controlsTimeout){
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if(controlsMovementTimeout){
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControllerBox.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls,2000);
  
}


const handleMouseleave = () => {
  controlsTimeout = setTimeout(hideControls,2000);
}



psBtn.addEventListener("click", handlePlayAndStop);
volumeBtn.addEventListener("click", handleSound);
volumeRange.addEventListener("input", handleVolume);
video.addEventListener("loadeddata", handleLoadedMetaData);


video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimeLine);
document.addEventListener("keydown", handleTimeMove);


document.addEventListener("keydown", handleSpaceBar);


screenBtn.addEventListener("click", handleScreenBtn);
// document.addEventListener("keydown", handleFEsc);
videoContainer.addEventListener("fullscreenchange", handleFullScreen);


video.addEventListener("ended", handleEnded);

video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseleave);