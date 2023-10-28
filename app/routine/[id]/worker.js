let currentSeconds = 0;
let currentState = false;
let interval;

self.onmessage = (e) => {
    if (e.data.type === 'startTimer') {
        if (interval) {
            clearInterval(interval);
        }
        currentSeconds = e.data.value;
        interval = setInterval(() => {
            if (currentSeconds > 0) {
                currentSeconds--;
                self.postMessage({
                    type: 'updateSeconds',
                    value: currentSeconds,
                });
            } else if (currentSeconds === 0) {
                self.postMessage({ type: 'timeout' });
                clearInterval(interval);
            }
        }, 1000);
    } else if (e.data.type === 'stopTimer') {
        clearInterval(interval);
    }
};
