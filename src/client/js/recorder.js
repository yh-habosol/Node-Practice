const video = document.getElementById("preView");
const startBtn = document.getElementById("startBtn");

let stream;
let mediaRecorder;
let videoFile


const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "Myrecording.webm";
    document.body.appendChild(a);
    a.click();
}


const handleStop = () =>{
    startBtn.innerText = "Download Recording!";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    mediaRecorder.stop();
}



const handleStartBtn = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStartBtn);
    startBtn.addEventListener("click", handleStop);

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src=videoFile;
        video.loop = true,
        video.play();
    }

    mediaRecorder.start();
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
}

init();

startBtn.addEventListener("click", handleStartBtn);