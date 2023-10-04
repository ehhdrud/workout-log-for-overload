'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '@/styles/timer.css';

const Timer = forwardRef((props: { restTime: number; workoutName: string }, ref: any) => {
    const { restTime } = props;

    const [seconds, setSeconds] = useState(restTime);
    const [isCounting, setIsCounting] = useState(false);

    const editTimer = (newRestTime: number) => {
        setSeconds(newRestTime);
    };

    const startTimer = () => {
        if (seconds > 0) {
            setIsCounting(true);
        }
    };

    const toggleTimer = () => {
        if (isCounting) {
            setIsCounting(false);
            setSeconds(restTime);
        } else {
            if (seconds > 0) {
                setIsCounting(true);
            }
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = undefined;

        if (isCounting) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        if (seconds === 0) {
            setIsCounting(false);
            setSeconds(restTime);
        }

        return () => clearInterval(interval);
    }, [isCounting, seconds]);

    useImperativeHandle(ref, () => ({
        editTimer,
        startTimer,
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
        </div>
    );
});

export default Timer;