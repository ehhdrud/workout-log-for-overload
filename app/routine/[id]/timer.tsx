'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '@/styles/timer.css';

const Timer = forwardRef((props: { restTime: number }, ref: any) => {
    const { restTime } = props;
    const [seconds, setSeconds] = useState(restTime);
    const [isCounting, setIsCounting] = useState(false);
    const [timeoutAlert, setTimeoutAlert] = useState(false);

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

    const showTimeoutAlert = () => {
        setTimeoutAlert(true);
        setTimeout(() => {
            setTimeoutAlert(false);
        }, 3000);
    };

    // useEffect(() => {
    //     let interval: NodeJS.Timeout | undefined = undefined;

    //     if (isCounting) {
    //         interval = setInterval(() => {
    //             setSeconds((prevSeconds) => prevSeconds - 1);
    //         }, 1000);
    //     } else {
    //         clearInterval(interval);
    //     }

    //     if (isCounting && seconds === 0) {
    //         showTimeoutAlert();
    //         setIsCounting(false);
    //         setSeconds(restTime);
    //     }

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [isCounting, seconds, restTime]);
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = undefined;

        if (isCounting) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    showTimeoutAlert();
                    setIsCounting(false);
                    setSeconds(restTime);
                } else {
                    setSeconds((prevSeconds) => prevSeconds - 1);
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isCounting, seconds, restTime]);

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

// 'use client';

// import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
// import '@/styles/timer.css';

// const Timer = forwardRef((props: { restTime: number }, ref: any) => {
//     const worker = useRef(new Worker(new URL('./worker.js', import.meta.url)));

//     const { restTime } = props;
//     const [seconds, setSeconds] = useState(restTime);
//     const [isCounting, setIsCounting] = useState<boolean | null>(null);
//     const [timeoutAlert, setTimeoutAlert] = useState(false);

//     const editTimer = (newRestTime: number) => {
//         setSeconds(newRestTime);
//     };

//     const isCountingOn = () => {
//         setIsCounting(true);
//     };

//     const toggleTimer = () => {
//         if (!isCounting) {
//             if (seconds > 0) {
//                 setIsCounting(true);
//             }
//         } else {
//             setIsCounting(false);
//             setSeconds(restTime);
//         }
//     };

//     const startTimer = () => {
//         worker.current.postMessage({ type: 'startTimer', value: seconds, state: isCounting });
//     };

//     const stopTimer = () => {
//         worker.current.postMessage({ type: 'stopTimer', value: restTime, state: isCounting });
//     };

//     useEffect(() => {
//         if (isCounting === true) {
//             startTimer();
//         } else if (isCounting === false) {
//             stopTimer();
//             setIsCounting(null);
//         }
//     }, [isCounting]);

//     const showTimeoutAlert = () => {
//         setTimeoutAlert(true);
//         setTimeout(() => {
//             setTimeoutAlert(false);
//         }, 3000);

//         setIsCounting(null);
//         setSeconds(restTime);
//     };

//     worker.current.onmessage = (e) => {
//         if (isCounting) {
//             if (e.data.type === 'updateSeconds') {
//                 setSeconds(e.data.value);
//             } else if (e.data.type === 'timeout') {
//                 showTimeoutAlert();
//             }
//         }
//     };

//     useImperativeHandle(ref, () => ({
//         editTimer,
//         startTimer,
//         isCountingOn,
//     }));

//     return (
//         <div className="timer-feild">
//             {restTime !== 0 ? (
//                 <p className="timer-on" onClick={() => toggleTimer()}>
//                     {seconds} seconds
//                 </p>
//             ) : (
//                 <p className="timer-off">No rest-time setting</p>
//             )}
//             {timeoutAlert && (
//                 <div className="timoeout-alert-container">
//                     <div
//                         className="timeout-alert-overlay"
//                         onClick={() => {
//                             setTimeoutAlert(false);
//                         }}
//                     />
//                     <div className="timeout-alert">Time out !</div>
//                 </div>
//             )}
//         </div>
//     );
// });

// Timer.displayName = 'Timer';

// export default Timer;
