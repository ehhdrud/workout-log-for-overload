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

    const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
    const [weightEditIndex, setWeightEditIndex] = useState<number | null>(null);
    const [repsEditIndex, setRepsEditIndex] = useState<number | null>(null);
    const [createWorkoutInput, setCreateWorkoutInput] = useState<boolean>(false);

    // 운동을 추가하는 함수
    const handleAddWorkout = (e: any) => {
        if (e.key === 'Enter') {
            const workoutDataObj = {
                [workout]: [{ weight: null, reps: null }],
            };
            setWorkoutData([...workoutData, workoutDataObj]);
            setWorkout('');
            setWeight(null);
            setReps(null);
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

            setSelectedWorkout(null);
            setWeightEditIndex(null);
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

            setSelectedWorkout(null);
            setRepsEditIndex(null);
        }
    };

    // 무게 셀을 클릭할 때 실행되는 함수
    const handleWeightDataCellClick = (
        index: number,
        workoutName: string,
        currnetWeight: number
    ) => {
        setWeightEditIndex(index);
        setRepsEditIndex(null);
        setSelectedWorkout(workoutName);
        setWeight(currnetWeight);
    };

    // 횟수 셀을 클릭할 때 실행되는 함수
    const handleRepsDataCellClick = (index: number, workoutName: string, currentReps: number) => {
        setRepsEditIndex(index);
        setWeightEditIndex(null);
        setSelectedWorkout(workoutName);
        setReps(currentReps);
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
                                            {/* {subItem.weight && weightEditIndex !== subIndex ? (
                                                <p
                                                    className="workoutTableInfo weightInfo"
                                                    onClick={() =>
                                                        handleWeightDataCellClick(
                                                            subIndex,
                                                            String(Object.keys(item)),
                                                            Number(subItem.weight)
                                                        )
                                                    }
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
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder={weight ? String(weight) : '? kg'}
                                                    autoFocus
                                                />
                                            )} */}
                                            {subItem.weight &&
                                            weightEditIndex === subIndex &&
                                            selectedWorkout === String(Object.keys(item)) ? (
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
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder={weight ? String(weight) : '? kg'}
                                                    autoFocus
                                                />
                                            ) : (
                                                <p
                                                    className="workoutTableInfo weightInfo"
                                                    onClick={() =>
                                                        handleWeightDataCellClick(
                                                            subIndex,
                                                            String(Object.keys(item)),
                                                            Number(subItem.weight)
                                                        )
                                                    }
                                                >
                                                    {subItem.weight}
                                                </p>
                                            )}
                                        </td>
                                        <td className="tableDataCell">
                                            {/* {subItem.reps && repsEditIndex !== subIndex ? (
                                                <p
                                                    className="workoutTableInfo repsInfo"
                                                    onClick={() =>
                                                        handleRepsDataCellClick(
                                                            subIndex,
                                                            String(Object.keys(item)),
                                                            Number(subItem.reps)
                                                        )
                                                    }
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
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder={reps ? String(reps) : '? reps'}
                                                    autoFocus
                                                />
                                            )} */}
                                            {subItem.reps &&
                                            repsEditIndex === subIndex &&
                                            selectedWorkout === String(Object.keys(item)) ? (
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
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder={reps ? String(reps) : '? reps'}
                                                    autoFocus
                                                />
                                            ) : (
                                                <p
                                                    className="workoutTableInfo repsInfo"
                                                    onClick={() =>
                                                        handleRepsDataCellClick(
                                                            subIndex,
                                                            String(Object.keys(item)),
                                                            Number(subItem.reps)
                                                        )
                                                    }
                                                >
                                                    {subItem.reps}
                                                </p>
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
