'use client';

import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/api/firebase';

import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/routine-id-page.css';

interface Set {
    weight: number | null;
    reps: number | null;
}

interface Workout {
    [key: string]: Set[];
}

const Log = (props: any) => {
    // docId(루틴 이름) 저장
    const docId = decodeURIComponent(props.params.id);

    // 시크릿 코드 유지를 위한 State
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const recoilIsAccepted = useRecoilValue(isAcceptedAtom);

    // 취합한 데이터 State
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);

    // 운동, 무게, 횟수 State
    const [workout, setWorkout] = useState<string>('');
    const [weight, setWeight] = useState<number | null>(null);
    const [reps, setReps] = useState<number | null>(null);

    // 운동,무게,횟수를 선택했을 때 필요한 State
    const [selectedWorkout, setSelectedWorkout] = useState<string>('');
    const [weightEditIndex, setWeightEditIndex] = useState<number | null>(null);
    const [repsEditIndex, setRepsEditIndex] = useState<number | null>(null);

    // '운동 생성 Input' 렌더링에 필요한 State
    const [createWorkoutInput, setCreateWorkoutInput] = useState<boolean>(false);

    // '운동 이름 수정 Input' 렌더링에 필요한 State
    const [workoutNameEditState, setWorkoutNameEditState] = useState<boolean>(false);
    const [editedWorkoutName, setEditedWorkoutName] = useState<string | null>(null);

    // '운동 삭제' 시 필요한 State
    const [deleteState, setDeleteState] = useState<boolean>(false);

    // '각 Input의 Overlay' 렌더링에 필요한 State
    const [tableRowInputOverlayState, setTableRowInputOverlayState] = useState<boolean>(false);
    const [tableCaptionInputOverlayState, setTableCaptionInputOverlayState] =
        useState<boolean>(false);
    const [workoutInputOverlayState, setWorkoutInputOverlayState] = useState<boolean>(false);

    // 운동을 불러오는 함수
    const readDocumentField = async () => {
        try {
            const docRef = doc(db, 'workout-log', docId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setWorkoutData(Object.values(data)[0]);
            } else {
                console.error(`필드가 존재하지 않습니다.`);
            }
        } catch (error) {
            console.error('문서를 읽어오는 중 오류 발생:', error);
        }
    };

    // 운동을 추가하는 함수
    const handleAddWorkout = async (e: any) => {
        if (e.key === 'Enter') {
            const workoutExists = workoutData.some((item) => item.hasOwnProperty(workout));
            if (workoutExists) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }

            try {
                const docRef = doc(db, 'workout-log', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    const newWorkout = {
                        [workout]: [
                            {
                                weight: weight,
                                reps: reps,
                            },
                        ],
                    };

                    data[docId].push(newWorkout);

                    await updateDoc(docRef, data);

                    readDocumentField();
                    console.log('⭐create workout⭐:', workout);
                } else {
                    console.error('문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }

            setWorkout('');
            setWeight(null);
            setReps(null);
            setCreateWorkoutInput(false);
            setWorkoutInputOverlayState(false);
        }
    };

    // 세트를 추가하는 함수
    const addSet = async (workoutIndex: number, workoutName: string) => {
        setDeleteState(false);
        try {
            const docRef = doc(db, 'workout-log', docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                const newSet = {
                    weight: weight,
                    reps: reps,
                };

                data[docId][workoutIndex][workoutName].push(newSet);

                await updateDoc(docRef, data);

                readDocumentField();
                console.log('⭐create set⭐:', `${docId}/${workoutName}`);
            } else {
                console.error('문서(Routine)가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
        // }
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
    const handleEditWeight = async (
        e: any,
        workoutIndex: number,
        workoutName: string,
        setIndex: number
    ) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    data[docId][workoutIndex][workoutName][setIndex].weight = weight;

                    await updateDoc(docRef, data);

                    readDocumentField();
                    console.log('⭐edit weight:', `${docId}-0번 운동-0번 세트`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }

            setSelectedWorkout('');
            setWeightEditIndex(null);
            setTableRowInputOverlayState(false);
        }
    };

    // 횟수를 수정하는 함수
    const handleEditReps = async (
        e: any,
        workoutIndex: number,
        workoutName: string,
        setIndex: number
    ) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    data[docId][workoutIndex][workoutName][setIndex].reps = reps;

                    await updateDoc(docRef, data);

                    readDocumentField();
                    console.log('⭐edit reps:', `${docId}-0번 운동-0번 세트`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }

            setSelectedWorkout('');
            setRepsEditIndex(null);
            setTableRowInputOverlayState(false);
        }
    };

    // 운동을 삭제하는 함수
    const handleWorkoutDelete = async (workoutName: string) => {
        try {
            const docRef = doc(db, 'workout-log', docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                const updatedWorkouts = data[docId].filter(
                    (workout: any) => !workout.hasOwnProperty(workoutName)
                );

                data[docId] = updatedWorkouts;

                await updateDoc(docRef, data);

                readDocumentField();
                console.log(`❌delete workout❌: ${docId}/${workoutName}`);
            } else {
                console.error('문서가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 세트를 삭제하는 함수
    const handleSetDelete = async (workoutIndex: number, workoutName: string, setIndex: number) => {
        try {
            const docRef = doc(db, 'workout-log', docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                data[docId][workoutIndex][workoutName].splice(setIndex, 1);

                await updateDoc(docRef, data);

                readDocumentField();
                console.log('❌delete set❌:', `${docId}-${workoutName}-${setIndex}번 세트`);
            } else {
                console.error('문서(=Routine)가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 운동 이름(캡션)을 수정하는 함수
    const handleEditWorkoutName = async (e: any, workoutIndex: number, workoutName: string) => {
        if (e.key === 'Enter') {
            if (editedWorkoutName) {
                const workoutExists = workoutData.some((item) =>
                    item.hasOwnProperty(editedWorkoutName)
                );
                if (workoutExists) {
                    alert('같은 이름이 이미 존재합니다 😢');
                    return;
                }
            } else if (!editedWorkoutName) {
                alert('이름을 입력해주세요 😢');
                return;
            }

            try {
                const docRef = doc(db, 'workout-log', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    if (editedWorkoutName) {
                        data[docId].splice(workoutIndex, 1, {
                            [editedWorkoutName]: data[docId][workoutIndex][workoutName],
                        });

                        await updateDoc(docRef, data);

                        readDocumentField();
                        console.log(
                            `✏️ Edit workout name ✏️: ${docId}/${workoutName} -> ${docId}/${editedWorkoutName}`
                        );
                    } else {
                        alert('이름을 입력해주세요');
                    }
                } else {
                    console.error('문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
            setWorkoutNameEditState(false);
            setEditedWorkoutName(null);
            setTableCaptionInputOverlayState(false);
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

    useEffect(() => {
        readDocumentField();
    }, []);

    return isAccepted ? (
        <div className="log-page">
            {tableRowInputOverlayState && (
                <div
                    className="table-row-input-overlay"
                    onClick={() => {
                        resetTableRowInputEditState();
                    }}
                />
            )}
            {tableCaptionInputOverlayState && (
                <div
                    className="table-caption-input-overlay"
                    onClick={() => {
                        resetTableCaptionInputEditState();
                    }}
                />
            )}
            {workoutInputOverlayState && (
                <div
                    className="workout-input-overlay"
                    onClick={() => {
                        resetWorkoutInputEditState();
                    }}
                />
            )}
            <div className="log-container">
                <h2 className="routine-name">📌 {decodeURIComponent(props.params.id)}</h2>
                <div className="log-data-container">
                    {workoutData.map((item, index) => (
                        <table key={String(Object.keys(item))} className="workout-table">
                            <caption className="workout-table-caption">
                                {deleteState && selectedWorkout === String(Object.keys(item)) && (
                                    <div
                                        className="workout-delete-btn"
                                        onClick={() =>
                                            handleWorkoutDelete(String(Object.keys(item)))
                                        }
                                    >
                                        X
                                    </div>
                                )}
                                {workoutNameEditState &&
                                selectedWorkout === String(Object.keys(item)) ? (
                                    <input
                                        className="workout-table-caption-input"
                                        type="text"
                                        defaultValue={Object.keys(item)}
                                        onChange={(e) => setEditedWorkoutName(e.target.value)}
                                        onKeyDown={(e) =>
                                            handleEditWorkoutName(
                                                e,
                                                index,
                                                String(Object.keys(item))
                                            )
                                        }
                                    />
                                ) : (
                                    <p
                                        className="workout-name-txt"
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
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-header-cell">SET</th>
                                    <th className="table-header-cell">KG</th>
                                    <th className="table-header-cell">REPS</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {Object.values(item)[0].map((subItem, subIndex) => (
                                    <tr
                                        key={`${String(Object.keys(item))}의 세트`}
                                        className="table-row"
                                    >
                                        {deleteState &&
                                            selectedWorkout === String(Object.keys(item)) && (
                                                <div
                                                    className="set-delete-btn"
                                                    onClick={() =>
                                                        handleSetDelete(
                                                            index,
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                >
                                                    X
                                                </div>
                                            )}
                                        <td className="table-data-cell">
                                            <p className="workout-table-info">{subIndex + 1}</p>
                                        </td>
                                        <td className="table-data-cell">
                                            {weightEditIndex === subIndex &&
                                            selectedWorkout === String(Object.keys(item)) ? (
                                                <input
                                                    className="workout-table-input"
                                                    type="text"
                                                    defaultValue={subItem.weight || undefined}
                                                    onChange={(e) =>
                                                        setWeight(Number(e.target.value))
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleEditWeight(
                                                            e,
                                                            index,
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder={weight ? String(weight) : '? kg'}
                                                    autoFocus
                                                />
                                            ) : (
                                                <p
                                                    className="workout-table-info"
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
                                        <td className="table-data-cell">
                                            {repsEditIndex === subIndex &&
                                            selectedWorkout === String(Object.keys(item)) ? (
                                                <input
                                                    className="workout-table-input"
                                                    type="text"
                                                    defaultValue={subItem.reps || undefined}
                                                    onChange={(e) =>
                                                        setReps(Number(e.target.value))
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleEditReps(
                                                            e,
                                                            index,
                                                            String(Object.keys(item)),
                                                            subIndex
                                                        )
                                                    }
                                                    placeholder={reps ? String(reps) : '? reps'}
                                                    autoFocus
                                                />
                                            ) : (
                                                <p
                                                    className="workout-table-info"
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
                                className="add-set-btn"
                                type="button"
                                onClick={() => addSet(index, String(Object.keys(item)))}
                            >
                                + Add SET
                            </button>
                            {deleteState && selectedWorkout === String(Object.keys(item)) ? (
                                <button
                                    className="close-delete-btn"
                                    onClick={() => {
                                        setDeleteState(false);
                                        setSelectedWorkout('');
                                    }}
                                >
                                    <p className="done-txt">Done</p>
                                </button>
                            ) : (
                                <button
                                    className="create-delete-btn"
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
                    className="create-input-feild"
                    onClick={() => {
                        setDeleteState(false);
                        setCreateWorkoutInput(true);
                        setWorkoutInputOverlayState(true);
                    }}
                >
                    Create new workout
                </button>
            ) : (
                <input
                    className="workout-input"
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
