'use client';

import React, { useState, useEffect } from 'react';

function Timer() {
    const [time, setTime] = useState(10); // 타이머 초기 값 (10초)
    const [isRunning, setIsRunning] = useState(false); // 타이머가 실행 중인지 여부

    useEffect(() => {
        let timerInterval;

        if (isRunning) {
            timerInterval = setInterval(() => {
                if (time === 0) {
                    clearInterval(timerInterval);
                    alert('타이머 종료');
                    setIsRunning(false);
                    setTime(10);
                } else {
                    setTime((prevTime) => prevTime - 1);
                }
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [isRunning, time]);

    const startTimer = () => {
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
        setTime(10); // 타이머 초기화
    };

    return (
        <div>
            <h1>10초 타이머</h1>
            <p>남은 시간: {time} 초</p>
            {isRunning ? (
                <button onClick={stopTimer}>정지</button>
            ) : (
                <button onClick={startTimer}>시작</button>
            )}
        </div>
    );
}

export default Timer;
