'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/routine-page.css';

const Routine = (): JSX.Element => {
    // 로그인 State
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    // UID State
    const [uid, setUid] = useState<string>('');

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
    const readDocumentNames = useCallback(async () => {
        try {
            const docRef = collection(db, uid);
            const querySnapshot = await getDocs(docRef);

            const documentNames: string[] = [];
            querySnapshot.forEach((doc) => {
                documentNames.push(doc.id);
            });

            setRoutineList(documentNames);
        } catch (error) {
            console.error('문서를 읽어오는 중 오류 발생:', error);
        }
    }, [uid]);

    // 루틴을 생성하는 함수
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (routineList.includes(routine)) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }
            const docRef = doc(db, uid, routine);
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
    const handleEditRoutine = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        routineName: string
    ) => {
        if (e.key === 'Enter') {
            if (routineList.includes(editedRoutine)) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            } else if (!editedRoutine) {
                alert('이름을 입력해주세요 😢');
                return;
            }

            try {
                const docRefOld = doc(db, uid, routineName);
                const docRefNew = doc(db, uid, editedRoutine);
                const docSnap = await getDoc(docRefOld);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('data', data);

                    await setDoc(docRefNew, data);
                    await deleteDoc(docRefOld);

                    data[editedRoutine] = data[routineName];

                    await updateDoc(docRefNew, data); //data가 undefined !

                    await updateDoc(docRefNew, {
                        [routineName]: deleteField(),
                    });

                    readDocumentNames();
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
        const docRef = doc(db, uid, routineName);
        deleteDoc(docRef)
            .then(() => {
                readDocumentNames();
                console.log('❌delete routine❌:', routineName);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('현재 사용자의 UID:', user.uid, 'currentUser:', auth.currentUser);
                setLoggedIn(true);
                setUid(user.uid);
            } else {
                setLoggedIn(false);
                console.log('사용자가 로그인되어 있지 않습니다.');
            }
        });
    }, []);

    useEffect(() => {
        if (uid) {
            readDocumentNames();
        }
    }, [uid]);

    return loggedIn ? (
        <div className="routine-page">
            {routineNameEditState && (
                <div
                    className="edit-input-overlay"
                    onClick={() => {
                        setRoutineNameEditState(false);
                    }}
                />
            )}
            {createRoutineInput && (
                <div
                    className="create-input-overlay"
                    onClick={() => {
                        setCreateRoutineInput(false);
                    }}
                />
            )}
            <div className="routine-container">
                <div className="routine-header">
                    <h2 className="sub-title">
                        <FontAwesomeIcon icon={faStar} fontSize="18px" color="#dd0" />
                        <span className="sub-title-text">ROUTINE</span>
                    </h2>
                    <div className="edit-or-delete-container">
                        {createEditBtn ? (
                            <div className="done-text" onClick={() => setCreateEditBtn(false)}>
                                Done
                            </div>
                        ) : (
                            <button
                                className="routine-edit-btn"
                                type="button"
                                onClick={() => {
                                    setCreateEditBtn(true);
                                    setCreateDeleteBtn(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faPen} fontSize="16px" color="#668" />
                            </button>
                        )}
                        {createDeleteBtn ? (
                            <div className="done-text" onClick={() => setCreateDeleteBtn(false)}>
                                Done
                            </div>
                        ) : (
                            <button
                                className="routine-delete-btn"
                                type="button"
                                onClick={() => {
                                    setCreateDeleteBtn(true);
                                    setCreateEditBtn(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} fontSize="16px" color="#668" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="routine-items">
                    {routineList.map((item) => (
                        <div key={item} className="routine-item-container">
                            <div className="routine-item">
                                {routineNameEditState && item === selectedRoutine ? (
                                    <input
                                        className="routine-item-input"
                                        type="text"
                                        defaultValue={item}
                                        autoFocus
                                        onChange={(e) => setEditedRoutine(e.target.value)}
                                        onKeyDown={(e) => handleEditRoutine(e, item)}
                                    />
                                ) : (
                                    <Link
                                        className="routine-item"
                                        href={`/routine/${item}`}
                                        as={`/routine/${item}`}
                                    >
                                        {item}
                                    </Link>
                                )}
                            </div>
                            {createEditBtn && (
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setRoutineNameEditState(true);
                                        setSelectedRoutine(item);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPen} fontSize="16px" color="#668" />
                                </button>
                            )}
                            {createDeleteBtn && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleRoutineDelete(item)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="create-field">
                {!createRoutineInput ? (
                    <button
                        className="create-routine-input-feild"
                        onClick={() => setCreateRoutineInput(true)}
                    >
                        Create new routine
                    </button>
                ) : (
                    <input
                        className="routine-input-feild"
                        type="text"
                        value={routine}
                        placeholder="routine name..."
                        autoFocus
                        onChange={(e) => setRoutine(e.target.value)}
                        onKeyDown={handleKeyPress}
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
