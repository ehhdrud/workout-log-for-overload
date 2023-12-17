'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
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
        if (restTime > 0) {
            setIsCounting(true);
        }
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
            worker.current = new Worker(new URL('utils/worker.js', import.meta.url));
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
        <TimerField>
            {restTime !== 0 ? (
                <TimerOn onClick={() => toggleTimer()}>{seconds} seconds</TimerOn>
            ) : (
                <TimerOff>No rest-time setting</TimerOff>
            )}
            {timeoutAlert && (
                <div>
                    <TimerAlertOverlay
                        onClick={() => {
                            setTimeoutAlert(false);
                        }}
                    />
                    <TimerAlertMessage>Time out !</TimerAlertMessage>
                </div>
            )}
        </TimerField>
    );
});

const TimerField = styled.div`
    margin-left: 15px;
    font-size: 14px;
    font-weight: 600;
    color: #aaa;
`;

const TimerOn = styled.p`
    margin: 0px;
    cursor: pointer;
`;

const TimerOff = styled.p`
    margin: 0px;
`;

const TimerAlertOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 31;
`;

const TimerAlertMessage = styled.p`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 40px;
    font-weight: 900;
    white-space: nowrap;
    z-index: 32;
`;

Timer.displayName = 'Timer';

export default Timer;
