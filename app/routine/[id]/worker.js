let currentSeconds = 0;
let interval;

self.addEventListener('message', (e) => {
    if (e.data.type === 'startTimer') {
        restTime = e.data.value;
        currentSeconds = e.data.value;
        startTimer();
    }
});

function startTimer() {
    interval = setInterval(() => {
        if (currentSeconds > 0) {
            currentSeconds--;
            console.log(currentSeconds);
            self.postMessage({ type: 'updateSeconds', value: currentSeconds });
        } else {
            self.postMessage({ type: 'timeout' });
        }
    }, 1000);
}
