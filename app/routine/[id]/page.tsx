'use client';

import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';
import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';
import '@/styles/routine-id-page.css';

interface Set {
    weight: number | null;
    reps: number | null;
}

interface Workout {
    [key: string]: Set[];
}

const Log = (props: any) => {
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const [recoilIsAccepted, setIsAccepted] = useRecoilState(isAcceptedAtom);

    const [workout, setWorkout] = useState<string>('');
    const [weight, setWeight] = useState<number | null>(null);
    const [reps, setReps] = useState<number | null>(null);

    const [setData, setSetData] = useState<Set[]>([]);
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);

    const [isEditted, setIsEditted] = useState<boolean>(true);
    const [createWorkoutInput, setCreateWorkoutInput] = useState<boolean>(false);

    // 운동을 추가하는 함수
    const handleAddWorkout = (e: any) => {
        if (e.key === 'Enter') {
            const workoutDataObj = {
                [workout]: [{ weight: null, reps: null }],
            };
            setWorkoutData([...workoutData, workoutDataObj]);
            setWorkout('');
            setCreateWorkoutInput(false);
        }
    };

    // 세트를 추가하는 함수
    const addSet = (workoutName: string) => {
        const updatedWorkoutData = [...workoutData];
        const workoutArray = updatedWorkoutData.find((workout) =>
            workout.hasOwnProperty(workoutName)
        );
        if (workoutArray) {
            workoutArray[workoutName].push({ weight: null, reps: null });

            setWorkoutData(updatedWorkoutData);
        }
    };

    // 무게를 수정하는 함수
    const handleEditWeight = (e: any, workoutName: string, setIndex: number) => {
        if (e.key === 'Enter') {
            const updatedWorkoutData = [...workoutData];

            const workoutArray = updatedWorkoutData.find((workout) =>
                workout.hasOwnProperty(workoutName)
            );

            if (workoutArray) {
                workoutArray[workoutName][setIndex].weight = weight;

                setWorkoutData(updatedWorkoutData);
            }

            setIsEditted(false);
        }
    };

    // 횟수를 수정하는 함수
    const handleEditReps = (e: any, workoutName: string, setIndex: number) => {
        if (e.key === 'Enter') {
            const updatedWorkoutData = [...workoutData];

            const workoutArray = updatedWorkoutData.find((workout) =>
                workout.hasOwnProperty(workoutName)
            );

            if (workoutArray) {
                workoutArray[workoutName][setIndex].reps = reps;

                setWorkoutData(updatedWorkoutData);
            }

            setIsEditted(false);
        }
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    return isAccepted ? (
        <div className="logPage">
            <div className="logContainer">
                <h2 className="routineName">📌 {decodeURIComponent(props.params.id)}</h2>
                <div className="logDataContainer">
                    {workoutData.map((item, index) => (
                        <table className="workoutTable">
                            <caption className="workoutTableCaption">
                                🏋️‍♀️ {Object.keys(item)}
                            </caption>
                            <thead className="tableHeader">
                                <tr className="tableRow">
                                    <th className="tableHeaderCell">SET</th>
                                    <th className="tableHeaderCell">KG</th>
                                    <th className="tableHeaderCell">REPS</th>
                                </tr>
                            </thead>
                            <tbody className="tableBody">
                                {Object.values(item)[0].map((subItem, subIndex) => (
                                    <tr className="tableRow" key={subIndex}>
                                        <td className="tableDataCell">
                                            <p className="workoutTableInfo">{subIndex + 1}</p>
                                        </td>
                                        <td className="tableDataCell">
                                            {subItem.weight && !isEditted ? (
                                                <p
                                                    className="workoutTableInfo weightInfo"
                                                    onClick={() => setIsEditted(true)}
                                                >
                                                    {subItem.weight}
                                                </p>
                                            ) : (
                                                <input
                                                    className="workoutTableInput weightInput"
                                                    type="text"
                                                    defaultValue={subItem.weight || undefined}
                                                    onChange={(e) =>
                                                        setWeight(Number(e.target.value))
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleEditWeight(
                                                            e,
                                                            String(Object.keys(workoutData[index])),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder="?kg"
                                                    autoFocus
                                                />
                                            )}
                                        </td>
                                        <td className="tableDataCell">
                                            {subItem.reps && !isEditted ? (
                                                <p
                                                    className="workoutTableInfo repsInfo"
                                                    onClick={() => setIsEditted(true)}
                                                >
                                                    {subItem.reps}
                                                </p>
                                            ) : (
                                                <input
                                                    className="workoutTableInput repsInput"
                                                    type="text"
                                                    defaultValue={subItem.reps || undefined}
                                                    onChange={(e) =>
                                                        setReps(Number(e.target.value))
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleEditReps(
                                                            e,
                                                            String(Object.keys(workoutData[index])),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder="?reps"
                                                    autoFocus
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <button
                                className="addSetBtn"
                                type="button"
                                onClick={() => addSet(String(Object.keys(workoutData[index])))}
                            >
                                + Add SET
                            </button>
                        </table>
                    ))}
                </div>
            </div>
            {!createWorkoutInput ? (
                <button className="createInputFeild" onClick={() => setCreateWorkoutInput(true)}>
                    create new routine
                </button>
            ) : (
                <input
                    className="workoutInput"
                    type="text"
                    value={workout}
                    placeholder="workout name"
                    onChange={(e) => setWorkout(e.target.value)}
                    onKeyDown={handleAddWorkout}
                />
            )}
        </div>
    ) : (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    );
};

export default Log;
