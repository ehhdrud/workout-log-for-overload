'use client';

import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';
import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';
import '@/styles/routine-id-page.css';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    const [workoutData, setWorkoutData] = useState<Workout[]>([]);

    const [selectedWorkout, setSelectedWorkout] = useState<string>('');
    const [weightEditIndex, setWeightEditIndex] = useState<number | null>(null);
    const [repsEditIndex, setRepsEditIndex] = useState<number | null>(null);
    const [createWorkoutInput, setCreateWorkoutInput] = useState<boolean>(false);

    const [workoutNameEditState, setWorkoutNameEditState] = useState<boolean>(false);
    const [editedWorkoutName, setEditedWorkoutName] = useState<string | null>(null);
    const [deleteState, setDeleteState] = useState<boolean>(false);

    const [tableRowInputOverlayState, setTableRowInputOverlayState] = useState<boolean>(false);
    const [tableCaptionInputOverlayState, setTableCaptionInputOverlayState] =
        useState<boolean>(false);
    const [workoutInputOverlayState, setWorkoutInputOverlayState] = useState<boolean>(false);

    // 운동을 추가하는 함수
    const handleAddWorkout = (e: any) => {
        if (e.key === 'Enter') {
            // workout 이름이 이미 존재하는지 확인
            const workoutExists = workoutData.some((item) => item.hasOwnProperty(workout));
            if (workoutExists) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }

            const workoutDataObj = {
                [workout]: [{ weight: null, reps: null }],
            };
            setWorkoutData([...workoutData, workoutDataObj]);

            setWorkout('');
            setWeight(null);
            setReps(null);
            setCreateWorkoutInput(false);
            setWorkoutInputOverlayState(false);
        }
    };

    // 세트를 추가하는 함수
    const addSet = (workoutName: string) => {
        setDeleteState(false);
        const updatedWorkoutData = [...workoutData];
        const workoutArray = updatedWorkoutData.find((workout) =>
            workout.hasOwnProperty(workoutName)
        );
        if (workoutArray) {
            workoutArray[workoutName].push({ weight: null, reps: null });

            setWorkoutData(updatedWorkoutData);
        }
    };

    // 무게 셀을 클릭할 때 실행되는 함수
    const handleWeightDataCellClick = (
        index: number,
        workoutName: string,
        currnetWeight: number
    ) => {
        setDeleteState(false);
        setWeightEditIndex(index);
        setRepsEditIndex(null);
        setSelectedWorkout(workoutName);
        setWeight(currnetWeight);
        setTableRowInputOverlayState(true);
    };

    // 횟수 셀을 클릭할 때 실행되는 함수
    const handleRepsDataCellClick = (index: number, workoutName: string, currentReps: number) => {
        setDeleteState(false);
        setRepsEditIndex(index);
        setWeightEditIndex(null);
        setSelectedWorkout(workoutName);
        setReps(currentReps);
        setTableRowInputOverlayState(true);
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
            setSelectedWorkout('');
            setWeightEditIndex(null);
            setTableRowInputOverlayState(false);
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
            setSelectedWorkout('');
            setRepsEditIndex(null);
            setTableRowInputOverlayState(false);
        }
    };

    // 운동을 삭제하는 함수
    const handleWorkoutDelete = (workoutName: string) => {
        const updatedWorkoutData = workoutData.filter((item) => !item[workoutName]);
        setWorkoutData(updatedWorkoutData);
    };

    // 세트를 삭제하는 함수
    const handleSetDelete = (workoutName: string, setIndex: number) => {
        const updatedWorkoutData = [...workoutData];

        const workoutArray = updatedWorkoutData.find((workout) =>
            workout.hasOwnProperty(workoutName)
        );

        if (workoutArray) {
            workoutArray[workoutName].splice(setIndex, 1);

            setWorkoutData(updatedWorkoutData);
        }
    };

    // 운동 이름(캡션)을 수정하는 함수
    const handleEditWorkoutName = (e: any, workoutName: string) => {
        if (e.key === 'Enter') {
            const workoutExists = workoutData.some((item) => item.hasOwnProperty(selectedWorkout));
            if (workoutExists) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }

            const updatedWorkoutData = [...workoutData];

            const workoutArray = updatedWorkoutData.find((workout) =>
                workout.hasOwnProperty(workoutName)
            );

            if (workoutArray && editedWorkoutName) {
                workoutArray[editedWorkoutName] = workoutArray[workoutName];
                delete workoutArray[workoutName];

                setWorkoutData(updatedWorkoutData);
                setWorkoutNameEditState(false);
                setEditedWorkoutName(null);
                setTableCaptionInputOverlayState(false);
            }
        }
    };

    // TableRow-Input의 수정 상태를 초기화하는 함수
    const resetTableRowInputEditState = () => {
        setWeightEditIndex(null);
        setRepsEditIndex(null);
        setTableRowInputOverlayState(false);
    };

    // Table-Caption의 수정 상태를 초기화하는 함수
    const resetTableCaptionInputEditState = () => {
        setWorkoutNameEditState(false);
        setTableCaptionInputOverlayState(false);
    };

    // WorkoutInput의 활성화 상태를 초기화하는 함수
    const resetWorkoutInputEditState = () => {
        setCreateWorkoutInput(false);
        setWorkoutInputOverlayState(false);
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    return isAccepted ? (
        <div className="logPage">
            {tableRowInputOverlayState && (
                <div
                    className="tableRowInputOverlay"
                    onClick={() => {
                        resetTableRowInputEditState();
                    }}
                />
            )}
            {tableCaptionInputOverlayState && (
                <div
                    className="tableCaptionInputOverlay"
                    onClick={() => {
                        resetTableCaptionInputEditState();
                    }}
                />
            )}
            {workoutInputOverlayState && (
                <div
                    className="workoutInputOverlay"
                    onClick={() => {
                        resetWorkoutInputEditState();
                    }}
                />
            )}
            <div className="logContainer">
                <h2 className="routineName">📌 {decodeURIComponent(props.params.id)}</h2>
                <div className="logDataContainer">
                    {workoutData.map((item, index) => (
                        <table className="workoutTable">
                            <caption className="workoutTableCaption">
                                {deleteState && selectedWorkout === String(Object.keys(item)) && (
                                    <button
                                        className="deleteBtn"
                                        onClick={() =>
                                            handleWorkoutDelete(String(Object.keys(item)))
                                        }
                                    >
                                        X
                                    </button>
                                )}
                                {workoutNameEditState &&
                                selectedWorkout === String(Object.keys(item)) ? (
                                    <input
                                        className="workoutTableCaptionInput"
                                        type="text"
                                        defaultValue={Object.keys(item)}
                                        onChange={(e) => setEditedWorkoutName(e.target.value)}
                                        onKeyDown={(e) =>
                                            handleEditWorkoutName(e, String(Object.keys(item)))
                                        }
                                    />
                                ) : (
                                    <p
                                        className="workoutNameTxt"
                                        onClick={() => {
                                            setDeleteState(false);
                                            setWorkoutNameEditState(true);
                                            setSelectedWorkout(String(Object.keys(item)));
                                            setTableCaptionInputOverlayState(true);
                                        }}
                                    >
                                        🏋️‍♀️ {Object.keys(item)}
                                    </p>
                                )}
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
                                        {deleteState &&
                                            selectedWorkout === String(Object.keys(item)) && (
                                                <button
                                                    className="deleteBtn"
                                                    onClick={() =>
                                                        handleSetDelete(
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                >
                                                    X
                                                </button>
                                            )}
                                        <td className="tableDataCell">
                                            <p className="workoutTableInfo">{subIndex + 1}</p>
                                        </td>
                                        <td className="tableDataCell">
                                            {weightEditIndex === subIndex &&
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
                                                    {subItem.weight || '-'}
                                                </p>
                                            )}
                                        </td>
                                        <td className="tableDataCell">
                                            {repsEditIndex === subIndex &&
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
                                                    {subItem.reps || '-'}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <button
                                className="addSetBtn"
                                type="button"
                                onClick={() => addSet(String(Object.keys(item)))}
                            >
                                + Add SET
                            </button>
                            {deleteState && selectedWorkout === String(Object.keys(item)) ? (
                                <button
                                    className="closeDeleteBtn"
                                    onClick={() => {
                                        setDeleteState(false);
                                        setSelectedWorkout('');
                                    }}
                                >
                                    <p className="doneTxt">Done</p>
                                </button>
                            ) : (
                                <button
                                    className="createDeleteBtn"
                                    onClick={() => {
                                        setDeleteState(true);
                                        setSelectedWorkout(String(Object.keys(item)));
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} fontSize="14px" />
                                </button>
                            )}
                        </table>
                    ))}
                </div>
            </div>
            {!createWorkoutInput ? (
                <button
                    className="createInputFeild"
                    onClick={() => {
                        setDeleteState(false);
                        setCreateWorkoutInput(true);
                        setWorkoutInputOverlayState(true);
                    }}
                >
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
                    autoFocus
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
