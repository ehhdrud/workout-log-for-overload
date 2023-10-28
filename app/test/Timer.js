'use client';

import React, { useState, useEffect, useRef } from 'react';

function Timer() {
    if (typeof Worker === 'undefined') {
        // 브라우저 환경에서 Worker를 지원하지 않을 경우
        return <div>Web Workers are not supported in this browser</div>;
    }

    const isWebWorkersSupported = typeof Worker !== 'undefined';
    const [isCounting, setIsCounting] = useState(false);
    const [timerValue, setTimerValue] = useState('00:00');

    const worker = useRef(new Worker(new URL('./worker.js', import.meta.url)));

    const setupWorker = () => {
        if (!isWebWorkersSupported) {
            return console.log('%c😢 Web Workers are not supported...', 'color:#ff8b56');
        }
    };

    const onUpdate = (fn) => {
        worker.current.addEventListener('message', (evt) => fn.call(fn, evt.data));
    };

    const onError = (fn) => {
        worker.current.addEventListener('error', (evt) => fn.call(fn, evt.data));
    };

    const start = () => {
        setupWorker();
        worker.current.postMessage('start');
        setIsCounting(true);
        console.log('▶ Timer has been started');
    };

    const stop = () => {
        setIsCounting(false);
        console.log('⏹ Timer has been stopped');
    };

    useEffect(() => {
        onUpdate((value) => {
            setTimerValue(value);
        });

        onError(() => {
            setTimerValue('--:--');
            throw new Error('💩 Something goes wrong...');
        });
    }, []);

    return (
        <div>
            <div id="timer-container">{timerValue}</div>

            <button id="start-timer" type="button" onClick={start}>
                Start
            </button>
            <button id="stop-timer" type="button" onClick={stop}>
                Stop
            </button>
        </div>
    );
}

export default Timer;
