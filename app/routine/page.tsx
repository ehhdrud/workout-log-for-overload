'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';
import '@/styles/routine-page.css';
import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Routine = () => {
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const [recoilIsAccepted, setIsAccepted] = useRecoilState(isAcceptedAtom);

    const [createRoutineInput, setCreateRoutineInput] = useState<boolean>(false);
    const [routine, setRoutine] = useState<string>('');
    const [routineList, setRoutineList] = useState<string[]>([]);

    const [createEditBtn, setCreateEditBtn] = useState<boolean>(false);
    const [createDeleteBtn, setCreateDeleteBtn] = useState<boolean>(false);

    const [routineNameEditState, setRoutineNameEditState] = useState<boolean>(false);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [editedRoutine, setEditedRoutine] = useState<string>('');

    // 루틴을 생성하는 함수
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            if (routineList.includes(routine)) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }

            setRoutineList([...routineList, routine]);
            setRoutine('');
            setCreateRoutineInput(false);
        }
    };

    // 루틴 이름을 수정하는 함수
    const handleEditRoutine = (e: any, routineName: string) => {
        if (e.key === 'Enter') {
            if (routineList.includes(editedRoutine)) {
                alert('같은 이름이 이미 존재합니다 😢');
                return;
            }
            const updatedRoutineList = [...routineList];
            const indexToEdit = updatedRoutineList.indexOf(routineName);

            if (indexToEdit !== -1 && editedRoutine) {
                updatedRoutineList[indexToEdit] = editedRoutine;
                setRoutineList(updatedRoutineList);
                setRoutineNameEditState(false);
            }
        }
    };

    // 루틴을 삭제하는 함수
    const handleRoutineDelete = (routineName: string) => {
        const updatedRoutineList = routineList.filter((item) => item !== routineName);
        setRoutineList(updatedRoutineList);
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

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
