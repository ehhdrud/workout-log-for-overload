'use client';

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
// firebase 관련 import
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, logout } from '@/api/firebase';
// recoil 관련 import
import { useRecoilValue } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';
import { nicknameSelector } from '@/recoil/selectors';
// 스타일링 관련 import
import styled from 'styled-components';
import Spinner from '@/assets/Spinner.svg';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 컴포넌트 import
import UserIcon from '@/components/UserIcon';
import Timer from '@/components/Timer';

interface Set {
    weight: number | null;
    reps: number | null;
}

interface WorkoutData {
    set: Set[];
    restTime: number;
}

interface Workout {
    [key: string]: WorkoutData;
}

const Log: React.FC<any> = (props: any): JSX.Element => {
    // Hydrate 에러를 방지하기 위한 상태
    const userInfoRecoil = useRecoilValue<InfoType | null>(userAtom);
    const nicknameRecoil = useRecoilValue<string | undefined>(nicknameSelector);
    const [userInfo, setUserInfo] = useState<InfoType | null>(null);
    const [nickname, setNickname] = useState<string | undefined>();

    // Hydrate 에러를 방지하기 위한 useEffect - 1
    useEffect(() => {
        setUserInfo(userInfoRecoil);
    }, [userInfoRecoil]);

    // Hydrate 에러를 방지하기 위한 useEffect - 2
    useEffect(() => {
        if (nicknameRecoil) {
            setNickname(nicknameRecoil);
        }
    }, [nicknameRecoil]);

    // docId(루틴 이름) 저장
    const docId = decodeURIComponent(props.params.id);
    // 취합한 데이터 State
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);
    // 운동, 무게, 횟수 State
    const [workout, setWorkout] = useState<string>('');
    const [weight, setWeight] = useState<number | null>(null);
    const [reps, setReps] = useState<number | null>(null);
    const [restTime, setRestTime] = useState<number>(0);
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
    // '휴식시간 수정' 시 필요한 State
    const [createRestTimeInput, setCreateRestTimeInput] = useState<boolean>(false);
    // '무게/횟수 수정 Input의 Overlay' 렌더링에 필요한 State
    const [tableRowInputOverlayState, setTableRowInputOverlayState] = useState<boolean>(false);
    // uid 값을 저장하기 위한 State
    const [uid, setUid] = useState<string>('');

    // 타이머 컴포넌트를 위한 useRef
    const timerRefs = useRef<any>({});

    // 운동을 불러오는 함수
    const readDocumentField = useCallback(async () => {
        try {
            const docRef = doc(db, uid, docId);
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
    }, [uid]);

    // 운동을 추가하는 함수
    const handleAddWorkout = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const workoutExists = workoutData.some((item) => item.hasOwnProperty(workout));
            if (workoutExists) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }
            try {
                const docRef = doc(db, uid, docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const newWorkout = {
                        [workout]: {
                            restTime: restTime,
                            set: [
                                {
                                    weight: weight,
                                    reps: reps,
                                },
                            ],
                        },
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
        }
    };

    // 세트를 추가하는 함수
    const addSet = async (workoutIndex: number, workoutName: string) => {
        setDeleteState(false);
        try {
            const docRef = doc(db, uid, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const newSet = {
                    weight: weight,
                    reps: reps,
                };
                data[docId][workoutIndex][workoutName].set.push(newSet);
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
        currentWeight: number
    ) => {
        setDeleteState(false);
        setWeightEditIndex(index);
        setRepsEditIndex(null);
        setSelectedWorkout(workoutName);
        setWeight(currentWeight);
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
        e: React.KeyboardEvent<HTMLInputElement>,
        workoutIndex: number,
        workoutName: string,
        setIndex: number
    ) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, uid, docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data[docId][workoutIndex][workoutName].set[setIndex].weight = weight;
                    await updateDoc(docRef, data);
                    readDocumentField();

                    console.log('✏️edit weight✏️:', `${docId}-${workoutName}-${setIndex}번 세트`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
            setWeight(null);
            setSelectedWorkout('');
            setWeightEditIndex(null);
            setTableRowInputOverlayState(false);
        }
    };

    // 횟수를 수정하는 함수
    const handleEditReps = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        workoutIndex: number,
        workoutName: string,
        setIndex: number,
        setLength: number
    ) => {
        if (e.key === 'Enter') {
            const lastIndex = setLength - 1;
            try {
                const docRef = doc(db, uid, docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data[docId][workoutIndex][workoutName].set[setIndex].reps = reps;
                    await updateDoc(docRef, data);
                    readDocumentField();
                    if (setIndex !== lastIndex) timerRefs.current[workoutName].isCountingOn();

                    console.log('✏️edit reps✏️:', `${docId}-${workoutName}-${setIndex}번 세트`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
            setReps(null);
            setSelectedWorkout('');
            setRepsEditIndex(null);
            setTableRowInputOverlayState(false);
        }
    };

    // 운동을 삭제하는 함수
    const handleWorkoutDelete = async (workoutName: string) => {
        try {
            const docRef = doc(db, uid, docId);
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
            const docRef = doc(db, uid, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                data[docId][workoutIndex][workoutName].set.splice(setIndex, 1);
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

    // 운동 이름을 수정하는 함수
    const handleEditWorkoutName = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        workoutIndex: number,
        workoutName: string
    ) => {
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
                const docRef = doc(db, uid, docId);
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
                            `✏️edit workout name✏️: ${docId}/${workoutName} -> ${docId}/${editedWorkoutName}`
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
            setEditedWorkoutName(null);
            setWorkoutNameEditState(false);
        }
    };

    // 휴식 시간을 설정하는 함수
    const handleEditRestTime = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        workoutIndex: number,
        workoutName: string
    ) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, uid, docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data[docId][workoutIndex][workoutName].restTime = restTime;
                    await updateDoc(docRef, data);
                    readDocumentField();
                    timerRefs.current[workoutName].editTimer(restTime);

                    console.log('✏️edit rest time✏️:', `${docId}/${workoutName} - ${restTime}초`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }

            setCreateRestTimeInput(false);
            setRestTime(0);
        }
    };

    // TableRow-Input의 수정 상태를 초기화하는 함수
    const resetTableRowInputEditState = () => {
        setWeightEditIndex(null);
        setRepsEditIndex(null);
        setTableRowInputOverlayState(false);
    };

    // null이 아닌 uid 값을 별도의 상태에 저장하여 사용하기 위한 useEffect
    useEffect(() => {
        if (userInfo?.uid) {
            setUid(userInfo.uid);
        }
    }, [userInfo]);

    // uid 상태가 바뀌면 문서 읽어오기 위한 useEffect
    useEffect(() => {
        if (uid) {
            readDocumentField();
        }
    }, [uid, readDocumentField]);

    return userInfo ? (
        <LogPage>
            {tableRowInputOverlayState && (
                <TableRowInputOverlay
                    onClick={() => {
                        resetTableRowInputEditState();
                    }}
                />
            )}
            {workoutNameEditState && (
                <TableCaptionInputOverlay
                    onClick={() => {
                        setWorkoutNameEditState(false);
                    }}
                />
            )}
            {createWorkoutInput && (
                <WorkoutInputOverlay
                    onClick={() => {
                        setCreateWorkoutInput(false);
                    }}
                />
            )}
            {createRestTimeInput && (
                <RestTimeInputOverlay
                    onClick={() => {
                        setCreateRestTimeInput(false);
                    }}
                />
            )}
            <LogContainer>
                <RoutineName>
                    <FontAwesomeIcon icon={faBolt} fontSize="16px" color="#dd0" />
                    {decodeURIComponent(props.params.id)}
                </RoutineName>
                <LogDataContainer>
                    {workoutData?.map((item, index) => (
                        <LogData key={String(Object.keys(item))}>
                            <WorkoutTable>
                                <WorkoutTableCaption>
                                    {deleteState &&
                                        selectedWorkout === String(Object.keys(item)) && (
                                            <WorkoutDeleteBtn
                                                onClick={() =>
                                                    handleWorkoutDelete(String(Object.keys(item)))
                                                }
                                            >
                                                X
                                            </WorkoutDeleteBtn>
                                        )}
                                    {workoutNameEditState &&
                                    selectedWorkout === String(Object.keys(item)) ? (
                                        <WorkoutTableCaptionInput
                                            type="text"
                                            defaultValue={Object.keys(item)}
                                            autoFocus
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
                                        <WorkoutNameTxt
                                            onClick={() => {
                                                setDeleteState(false);
                                                setSelectedWorkout(String(Object.keys(item)));
                                                setWorkoutNameEditState(true);
                                            }}
                                        >
                                            {Object.keys(item)}
                                        </WorkoutNameTxt>
                                    )}
                                </WorkoutTableCaption>
                                <thead>
                                    <TableRow>
                                        <TableHeaderCell>SET</TableHeaderCell>
                                        <TableHeaderCell>KG</TableHeaderCell>
                                        <TableHeaderCell>REPS</TableHeaderCell>
                                    </TableRow>
                                </thead>
                                <TableBody>
                                    {Object.values(item)[0].set.map((subItem, subIndex) => (
                                        <TableRow
                                            key={`${String(
                                                Object.keys(item)
                                            )}: ${subIndex}번째 세트`}
                                        >
                                            {deleteState &&
                                                selectedWorkout === String(Object.keys(item)) && (
                                                    <TableDeleteBtn
                                                        onClick={() =>
                                                            handleSetDelete(
                                                                index,
                                                                String(Object.keys(item)),
                                                                subIndex
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </TableDeleteBtn>
                                                )}
                                            <TableDataCell>
                                                <WorkoutTableInfo>{subIndex + 1}</WorkoutTableInfo>
                                            </TableDataCell>
                                            <TableDataCell>
                                                {weightEditIndex === subIndex &&
                                                selectedWorkout === String(Object.keys(item)) ? (
                                                    <WorkoutTableInput
                                                        type="text"
                                                        defaultValue={subItem.weight || undefined}
                                                        placeholder={
                                                            weight ? String(weight) : '? kg'
                                                        }
                                                        autoFocus
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
                                                    />
                                                ) : (
                                                    <WorkoutTableInfo
                                                        onClick={() =>
                                                            handleWeightDataCellClick(
                                                                subIndex,
                                                                String(Object.keys(item)),
                                                                Number(subItem.weight)
                                                            )
                                                        }
                                                    >
                                                        {subItem.weight || '-'}
                                                    </WorkoutTableInfo>
                                                )}
                                            </TableDataCell>
                                            <TableDataCell>
                                                {repsEditIndex === subIndex &&
                                                selectedWorkout === String(Object.keys(item)) ? (
                                                    <WorkoutTableInput
                                                        type="text"
                                                        defaultValue={subItem.reps || undefined}
                                                        placeholder={reps ? String(reps) : '? reps'}
                                                        autoFocus
                                                        onChange={(e) =>
                                                            setReps(Number(e.target.value))
                                                        }
                                                        onKeyDown={(e) =>
                                                            handleEditReps(
                                                                e,
                                                                index,
                                                                String(Object.keys(item)),
                                                                subIndex,
                                                                Object.values(item)[0].set.length
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <WorkoutTableInfo
                                                        onClick={() =>
                                                            handleRepsDataCellClick(
                                                                subIndex,
                                                                String(Object.keys(item)),
                                                                Number(subItem.reps)
                                                            )
                                                        }
                                                    >
                                                        {subItem.reps || '-'}
                                                    </WorkoutTableInfo>
                                                )}
                                            </TableDataCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </WorkoutTable>
                            <AddSetBtn
                                type="button"
                                onClick={() => addSet(index, String(Object.keys(item)))}
                            >
                                + SET
                            </AddSetBtn>
                            {deleteState && selectedWorkout === String(Object.keys(item)) ? (
                                <CloseDeleteBtn
                                    onClick={() => {
                                        setDeleteState(false);
                                        setSelectedWorkout('');
                                    }}
                                >
                                    <DoneTxt>Done</DoneTxt>
                                </CloseDeleteBtn>
                            ) : (
                                <CreateDeleteBtn
                                    onClick={() => {
                                        setDeleteState(true);
                                        setSelectedWorkout(String(Object.keys(item)));
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} fontSize="14px" />
                                </CreateDeleteBtn>
                            )}
                            <TimerContainer>
                                {createRestTimeInput &&
                                selectedWorkout === String(Object.keys(item)) ? (
                                    <RestTimeInput
                                        type="text"
                                        placeholder="seconds..."
                                        autoFocus
                                        onChange={(e) => setRestTime(Number(e.target.value))}
                                        onKeyDown={(e) =>
                                            handleEditRestTime(e, index, String(Object.keys(item)))
                                        }
                                    />
                                ) : (
                                    <RestTimeBtn
                                        type="button"
                                        onClick={() => {
                                            setCreateRestTimeInput(true);
                                            setSelectedWorkout(String(Object.keys(item)));
                                        }}
                                    >
                                        Set timer
                                    </RestTimeBtn>
                                )}
                                <Timer
                                    restTime={Object.values(item)[0].restTime}
                                    ref={(timerRef) => {
                                        if (timerRef) {
                                            timerRefs.current[String(Object.keys(item))] = timerRef;
                                        }
                                    }}
                                />
                            </TimerContainer>
                        </LogData>
                    ))}
                </LogDataContainer>
            </LogContainer>
            <UserIcon nickname={nickname} />
            {!createWorkoutInput ? (
                <CreateWorkoutBtn
                    onClick={() => {
                        setDeleteState(false);
                        setCreateWorkoutInput(true);
                    }}
                >
                    Create new workout
                </CreateWorkoutBtn>
            ) : (
                <CreateWorkoutInput
                    type="text"
                    value={workout}
                    placeholder="workout name"
                    onChange={(e) => setWorkout(e.target.value)}
                    onKeyDown={handleAddWorkout}
                    autoFocus
                />
            )}
        </LogPage>
    ) : (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    );
};

const LogPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

const TableRowInputOverlay = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

const TableCaptionInputOverlay = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
`;

const WorkoutInputOverlay = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
`;

const RestTimeInputOverlay = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 7;
`;

const LogContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    position: absolute;
    top: 18vh;
`;

const RoutineName = styled.h2`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    max-width: 250px;
    padding: 5px 20px;
    margin: 0px;
    background-color: #000025;
    border-bottom: 0;
    border-radius: 15px 15px 0 0;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const LogDataContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 60vh;
    padding: 0px 20px;
    background-color: rgba(0, 0, 40, 0.6);
    border-radius: 0px 15px 15px 15px;
    border-bottom: 0;
    overflow: auto;
`;

const LogData = styled.div`
    position: relative;
    color: black;
    margin: 20px 0px 30px;
`;

const WorkoutTable = styled.table`
    width: 300px;
`;

const WorkoutTableCaption = styled.caption`
    position: relative;
    left: 2px;
    width: max-content;
    max-width: 135px;
    padding: 2px 5px;
    color: black;
    font-weight: bold;
    text-align: start;
    background-color: #88a;
    border-radius: 10px 10px 0 00;
`;

const WorkoutDeleteBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0px;
    left: -20px;
    width: 18px;
    height: 18px;
    padding: 1px;
    font-weight: 400;
    font-size: 16px;
    color: white;
    border-radius: 5px;
    border-style: none;
    border: 2px solid black;
    background-color: red;
`;

const WorkoutTableCaptionInput = styled.input`
    position: relative;
    width: 75px;
    padding: 0;
    border-style: none;
    border-radius: 5px;
    z-index: 4;
`;

const WorkoutNameTxt = styled.p`
    padding: 0 5px;
    margin: 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TableRow = styled.tr`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    background-color: white;
`;

const TableHeaderCell = styled.th`
    display: flex;
    width: 90px;
`;

const TableBody = styled.tbody`
    display: flex;
    flex-direction: column;
    border-radius: 15px;
`;

const TableDeleteBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 3px;
    left: -15px;
    width: 12px;
    height: 12px;
    font-weight: 400;
    font-size: 12px;
    color: white;
    border-radius: 3px;
    border-style: none;
    border: 2px solid black;
    background-color: red;
`;

const TableDataCell = styled.td`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 20px;
`;

const WorkoutTableInfo = styled.p`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 75px;
    height: 10px;
`;

const WorkoutTableInput = styled.input`
    width: 75px;
    position: relative;
    border: 2px solid #666;
    z-index: 2;
`;

const AddSetBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 3px;
    right: 3px;
    width: max-content;
    height: 20px;
    padding: 3.5px 15px;
    font-weight: bold;
    font-size: 14px;
    border-style: none;
    border-radius: 15px;
    background-color: #dddd88;
    color: black;
`;

const CloseDeleteBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 3px;
    right: 80px;
    width: max-content;
    height: 20px;
    padding: 3.5px 7.5px;
    border-style: none;
    border-radius: 10px;
    background-color: #88a;
    color: black;
`;

const DoneTxt = styled.p`
    font-weight: bold;
    margin: 0;
`;

const CreateDeleteBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 3px;
    right: 80px;
    width: max-content;
    height: 20px;
    padding: 3.5px 15px;
    border-style: none;
    border-radius: 10px;
    background-color: #ee5544;
    color: black;
`;

const TimerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: -28px;
    height: 25px;
    padding-right: 10px;
    border-radius: 7.5px;
    background-color: #006;
    border-right: 1px solid black;
    border-bottom: 3px solid black;
    border-left: 1px solid black;
`;

const RestTimeInput = styled.input`
    height: 22px;

    width: 68px;
    height: 20px;
    padding-left: 5px;
    border-style: none;
    border-radius: 5px;
    margin-left: 2px;
    z-index: 8;
`;

const RestTimeBtn = styled.button`
    border-style: none;
    border-radius: 6px;
    padding: 0 10px;
    margin-left: 2px;
    background-color: #008;
    color: #ccc;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    margin-top: 2px;
    border-right: 1px solid black;
    border-bottom: 3px solid black;
    border-left: 1px solid black;
`;

const CreateWorkoutBtn = styled.button`
    position: absolute;
    bottom: 1vh;
    width: 260px;
    padding: 5px 0px;
    border-style: none;
    border: 3px solid black;
    border-bottom: 8px solid black;
    border-radius: 20px;
    font-family: VCR_OSD_MONO;
    font-size: 18px;
    font-weight: bold;
    color: black;
    background-color: blue;
    cursor: pointer;
`;

const CreateWorkoutInput = styled.input`
    position: absolute;
    bottom: 1vh;
    width: 215px;
    padding: 6px 20px;
    border-radius: 20px;
    font-size: 16px;
    outline: none;
    border: none;
    z-index: 6;
`;

export default React.memo(Log);
