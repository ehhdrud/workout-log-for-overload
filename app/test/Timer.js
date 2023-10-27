'use client';

// import React, { useState, useEffect } from 'react';

// function Timer() {
//     const [time, setTime] = useState(10); // 타이머 초기 값 (10초)
//     const [isRunning, setIsRunning] = useState(false); // 타이머가 실행 중인지 여부

//     useEffect(() => {
//         let timerInterval;

//         if (isRunning) {
//             timerInterval = setInterval(() => {
//                 if (time === 0) {
//                     clearInterval(timerInterval);
//                     alert('타이머 종료');
//                     setIsRunning(false);
//                     setTime(10);
//                 } else {
//                     setTime((prevTime) => prevTime - 1);
//                 }
//             }, 1000);
//         } else {
//             clearInterval(timerInterval);
//         }

//         return () => {
//             clearInterval(timerInterval);
//         };
//     }, [isRunning, time]);

//     const startTimer = () => {
//         setIsRunning(true);
//     };

//     const stopTimer = () => {
//         setIsRunning(false);
//         setTime(10); // 타이머 초기화
//     };

//     return (
//         <div>
//             <h1>10초 타이머</h1>
//             <p>남은 시간: {time} 초</p>
//             {isRunning ? (
//                 <button onClick={stopTimer}>정지</button>
//             ) : (
//                 <button onClick={startTimer}>시작</button>
//             )}
//         </div>
//     );
// }

// export default Timer;

import React, { useState, useEffect } from 'react';

function Timer() {
    const [timerType, setTimerType] = useState('countdown');
    const [timerDuration, setTimerDuration] = useState(60 * 60);
    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const [isRunning, setIsRunning] = useState(false);

    // 로컬 스토리지에서 설정 읽기
    useEffect(() => {
        const storedTimerType = localStorage.getItem('timerType');
        const storedTimerDuration = parseInt(localStorage.getItem('timerDuration'));

        if (storedTimerType) {
            setTimerType(storedTimerType);
        }

        if (!isNaN(storedTimerDuration)) {
            setTimerDuration(storedTimerDuration);
            setTimeLeft(storedTimerDuration);
        }
    }, []);

    // 로컬 스토리지에 설정 저장
    useEffect(() => {
        localStorage.setItem('timerType', timerType);
        localStorage.setItem('timerDuration', timerDuration.toString());
    }, [timerType, timerDuration]);

    // 타이머 로직
    useEffect(() => {
        let timer;

        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isRunning, timeLeft]);

    // 시작 버튼 클릭 처리
    const handleStart = () => {
        setIsRunning(true);
    };

    // 중지 버튼 클릭 처리
    const handleStop = () => {
        setIsRunning(false);
    };

    // 재설정 버튼 클릭 처리
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(timerDuration);
    };

    return (
        <div>
            <h1>Timer App</h1>
            <div>
                <p>Timer Type: {timerType}</p>
                <button onClick={() => setTimerType('countdown')}>Countdown</button>
                <button onClick={() => setTimerType('countup')}>Countup</button>
            </div>
            <div>
                <p>Time Left: {timeLeft} seconds</p>
                {isRunning ? (
                    <button onClick={handleStop}>Stop</button>
                ) : (
                    <button onClick={handleStart}>Start</button>
                )}
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
}

export default Timer;
