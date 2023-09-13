'use client';

import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';
import '../../styles/log-page.css';

const Log = () => {
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const [recoilIsAccepted, setIsAccepted] = useRecoilState(isAcceptedAtom);
    const [workout, setWorkout] = useState<string>('');
    const [workoutList, setWorkoutList] = useState<string[]>([]);
    const [weight, setWeight] = useState<string>('');
    const [reps, setReps] = useState<string>('');
    const [set, setSet] = useState<number>(1);

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            setWorkoutList([...workoutList, workout]);
            setWorkout('');
        }
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    return (
        <div className="logPage">
            <div>
                {workoutList.map((item, index) => (
                    <table className="workoutTable">
                        <caption className="workoutTableCaption">{item}</caption>
                        <thead>
                            <tr>
                                <th>SET</th>
                                <th>KG</th>
                                <th>REPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{set}</td>
                                <td>
                                    <input
                                        className="workoutTableInput weightInput"
                                        type="text"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="헤더1 입력"
                                    />
                                </td>
                                <td>
                                    <input
                                        className="workoutTableInput repsInput"
                                        type="text"
                                        value={reps}
                                        onChange={(e) => setReps(e.target.value)}
                                        placeholder="헤더2 입력"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ))}
            </div>
            <input
                className="workoutInput"
                type="text"
                value={workout}
                placeholder="workout name"
                onChange={(e) => setWorkout(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
};

export default Log;
