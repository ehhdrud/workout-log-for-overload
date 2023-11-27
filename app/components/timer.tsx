'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import '@/styles/timer.css';
import alarmSound from '@/assets/Alarm.MP3';

interface WorkerMessage {
    type: 'updateSeconds' | 'timeout';
    value: number;
}

const Timer = forwardRef((props: { restTime: number }, ref: any): JSX.Element => {
    let worker = useRef<Worker | null>(null);

    const { restTime } = props;
    const [seconds, setSeconds] = useState<number>(restTime);
    const [isCounting, setIsCounting] = useState<boolean | null>(null);
    const [timeoutAlert, setTimeoutAlert] = useState<boolean>(false);

    const editTimer = (newRestTime: number) => {
        setSeconds(newRestTime);
    };

    const isCountingOn = () => {
        setIsCounting(true);
    };

    const toggleTimer = () => {
        if (!isCounting) {
            if (seconds > 0) {
                setIsCounting(true);
            }
        } else {
            setIsCounting(false);
            setSeconds(restTime);
        }
    };

    const startTimer = () => {
        if (!worker.current) {
            worker.current = new Worker(new URL('app/utils/worker.js', import.meta.url));
        }
        worker.current.postMessage({ type: 'startTimer', value: seconds, state: isCounting });
        console.log('start:', worker, worker.current);
    };

    const stopTimer = () => {
        if (worker.current) {
            worker.current.postMessage({ type: 'stopTimer', value: restTime, state: isCounting });
            worker.current.terminate();
            worker.current = null;
            console.log('stop:', worker, worker.current);
        }
    };

    const showTimeoutAlert = () => {
        const sound = new Audio(alarmSound);
        sound.play();
        setTimeoutAlert(true);
        setTimeout(() => {
            setTimeoutAlert(false);
        }, 3000);

        setIsCounting(null);
        setSeconds(restTime);

        if (worker.current) {
            worker.current.terminate();
            worker.current = null;
        }
    };

    useEffect(() => {
        if (isCounting === true) {
            startTimer();
        } else if (isCounting === false) {
            stopTimer();
            setIsCounting(null);
        }

        if (worker.current) {
            worker.current.onmessage = (e: MessageEvent<WorkerMessage>) => {
                if (isCounting) {
                    if (e.data.type === 'updateSeconds') {
                        setSeconds(e.data.value);
                    } else if (e.data.type === 'timeout') {
                        showTimeoutAlert();
                    }
                }
            };
        }
    }, [isCounting]);

    useImperativeHandle(ref, () => ({
        editTimer,
        startTimer,
        isCountingOn,
    }));

    return (
        <div className="timer-feild">
            {restTime !== 0 ? (
                <p className="timer-on" onClick={() => toggleTimer()}>
                    {seconds} seconds
                </p>
            ) : (
                <p className="timer-off">No rest-time setting</p>
            )}
            {timeoutAlert && (
                <div className="timoeout-alert-container">
                    <div
                        className="timeout-alert-overlay"
                        onClick={() => {
                            setTimeoutAlert(false);
                        }}
                    />
                    <div className="timeout-alert">Time out !</div>
                </div>
            )}
        </div>
    );
});

Timer.displayName = 'Timer';

export default Timer;
