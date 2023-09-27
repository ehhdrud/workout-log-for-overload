'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';

import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    deleteField,
} from 'firebase/firestore';
import { db } from '@/api/firebase';

import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/routine-page.css';

const Routine = () => {
    // 시크릿 코드 유지를 위한 State
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const recoilIsAccepted = useRecoilValue(isAcceptedAtom);

    // 취합한 데이터 State
    const [routineList, setRoutineList] = useState<string[]>([]);

    // '루틴 생성 Input' 렌더링에 필요한 State
    const [createRoutineInput, setCreateRoutineInput] = useState<boolean>(false);

    // 루틴 이름을 입력받는 State
    const [routine, setRoutine] = useState<string>('');

    // '수정/삭제 button'을 렌더링하기 위한 State
    const [createEditBtn, setCreateEditBtn] = useState<boolean>(false);
    const [createDeleteBtn, setCreateDeleteBtn] = useState<boolean>(false);

    // '루틴 수정 Input' 렌더링에 필요한 State
    const [routineNameEditState, setRoutineNameEditState] = useState<boolean>(false);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [editedRoutine, setEditedRoutine] = useState<string>('');

    // 문서(루틴) 읽어오기
    const readDocumentNames = async () => {
        try {
            const docRef = collection(db, 'workout-log');
            const querySnapshot = await getDocs(docRef);

            const documentNames: any = [];
            querySnapshot.forEach((doc) => {
                documentNames.push(doc.id);
            });

            setRoutineList(documentNames);
        } catch (error) {
            console.error('문서를 읽어오는 중 오류 발생:', error);
        }
    };

    // 루틴을 생성하는 함수
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            if (routineList.includes(routine)) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }
            const docRef = doc(db, 'workout-log', routine);
            setDoc(docRef, { [routine]: [] })
                .then(() => {
                    console.log('⭐create routine⭐:', routine);
                    readDocumentNames();
                })
                .catch((error) => {
                    console.error(error);
                });
            setRoutine('');
            setCreateRoutineInput(false);
        }
    };

    // 루틴 이름을 수정하는 함수
    const handleEditRoutine = async (e: any, routineName: string) => {
        if (e.key === 'Enter') {
            if (routineList.includes(editedRoutine)) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }

            try {
                const docRefOld = doc(db, 'workout-log', routineName);
                const docRefNew = doc(db, 'workout-log', editedRoutine);
                const docSnap = await getDoc(docRefOld);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    await setDoc(docRefNew, data);
                    await deleteDoc(docRefOld);

                    data[editedRoutine] = data[routineName];

                    await updateDoc(docRefNew, data);

                    await updateDoc(docRefNew, {
                        [routineName]: deleteField(),
                    });
                    console.log('✏️edit routine✏️:', `${routineName} -> ${editedRoutine}`);
                } else {
                    console.error('수정할 루틴이 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }

            setRoutineNameEditState(false);
        }
    };

    // 루틴을 삭제하는 함수
    const handleRoutineDelete = (routineName: string) => {
        const docRef = doc(db, 'workout-log', routineName);
        deleteDoc(docRef)
            .then(() => {
                console.log('❌delete routine❌:', routineName);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    useEffect(() => {
        readDocumentNames();
    });

    return isAccepted ? (
        <div className="routinePage">
            {routineNameEditState && (
                <div
                    className="editInputOverlay"
                    onClick={() => {
                        setRoutineNameEditState(false);
                    }}
                />
            )}
            {createRoutineInput && (
                <div
                    className="createInputOverlay"
                    onClick={() => {
                        setCreateRoutineInput(false);
                    }}
                />
            )}
            <div className="routineContainer">
                <h2 className="subTitle">🔥ROUTINE🔥</h2>
                <div className="editOrDelteContainer">
                    {createEditBtn ? (
                        <div className="doneText" onClick={() => setCreateEditBtn(false)}>
                            Done
                        </div>
                    ) : (
                        <button
                            className="routineEditBtn"
                            type="button"
                            onClick={() => {
                                setCreateEditBtn(true);
                                setCreateDeleteBtn(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faPen} fontSize="16px" />
                        </button>
                    )}
                    {createDeleteBtn ? (
                        <div className="doneText" onClick={() => setCreateDeleteBtn(false)}>
                            Done
                        </div>
                    ) : (
                        <button
                            className="routineDeleteBtn"
                            type="button"
                            onClick={() => {
                                setCreateDeleteBtn(true);
                                setCreateEditBtn(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashCan} fontSize="16px" />
                        </button>
                    )}
                </div>
                <div className="routineItems">
                    {routineList.map((item, index) => (
                        <div className="routineItemContainer">
                            <div className="routineItem">
                                {routineNameEditState && item === selectedRoutine ? (
                                    <input
                                        className="routineItemInput"
                                        type="text"
                                        defaultValue={item}
                                        onChange={(e) => setEditedRoutine(e.target.value)}
                                        onKeyDown={(e) => handleEditRoutine(e, item)}
                                    />
                                ) : (
                                    <Link className="routineItem" href={`/routine/${item}`}>
                                        📌 {item}
                                    </Link>
                                )}
                            </div>
                            {createEditBtn && (
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        setRoutineNameEditState(true);
                                        setSelectedRoutine(item);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPen} fontSize="16px" />
                                </button>
                            )}
                            {createDeleteBtn && (
                                <button
                                    className="deleteButton"
                                    onClick={() => handleRoutineDelete(item)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="createField">
                {!createRoutineInput ? (
                    <button
                        className="createRoutineInputFeild"
                        onClick={() => setCreateRoutineInput(true)}
                    >
                        create new routine
                    </button>
                ) : (
                    <input
                        className="routineInputFeild"
                        type="text"
                        value={routine}
                        placeholder="routine name..."
                        onChange={(e) => setRoutine(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />
                )}
            </div>
        </div>
    ) : (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    );
};

export default Routine;
