const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048; // Set FFT size for frequency data

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        visualize();
    })
    .catch(error => {
        console.error('Error accessing microphone:', error);
    });

function visualize() {
    requestAnimationFrame(visualize);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    canvasContext.fillStyle = 'rgb(200, 200, 200)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
    }
}
