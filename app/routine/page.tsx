'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// firebase 관련 import
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
// recoil 관련 import
import { useRecoilValue } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';
import { nicknameSelector } from '@/recoil/selectors';
// 스타일링 관련 import
import styled from 'styled-components';
import Spinner from '@/assets/Spinner.svg';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 컴포넌트 import
import UserIcon from '@/components/UserIcon';

const Routine = (): JSX.Element => {
    // Hydrate 에러를 방지하기 위한 상태
    const userInfoRecoil = useRecoilValue<InfoType | null>(userAtom);
    const nicknameRecoil = useRecoilValue<string | undefined>(nicknameSelector);
    const [userInfo, setUserInfo] = useState<InfoType | null>(null);
    const [nickname, setNickname] = useState<string | undefined>();
    const [deletePopup, setDeletePopup] = useState<boolean>(false);
    const [deleteItem, setDeleteItem] = useState<string>('');

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

    // 취합한 데이터 State
    const [routineList, setRoutineList] = useState<string[] | null>(null);
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
    // uid 값을 저장하기 위한 State
    const [uid, setUid] = useState<string>('');

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
            if (routineList?.includes(routine)) {
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
            if (routineList?.includes(editedRoutine)) {
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
        setDeletePopup(false);
        setDeleteItem('');
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
            readDocumentNames();
        }
    }, [uid]);

    // 루틴이 없을 때, Default를 만들어주기 위한 useEffect
    useEffect(() => {
        if (routineList?.length === 0) {
            setDoc(doc(db, uid, 'Your Routine'), { 'Your Routine': [] });
            readDocumentNames();
        }
    }, [routineList]);

    return userInfo ? (
        <RoutinePage>
            {routineNameEditState && (
                <EditInputOverlay
                    onClick={() => {
                        setRoutineNameEditState(false);
                    }}
                />
            )}
            {createRoutineInput && (
                <CreateInputOverlay
                    onClick={() => {
                        setCreateRoutineInput(false);
                    }}
                />
            )}
            <RoutineContainer>
                <RoutineHeader>
                    <SubTitle>
                        <FontAwesomeIcon icon={faStar} fontSize="18px" color="#dd0" />
                        <SubTitleTxt>ROUTINE</SubTitleTxt>
                    </SubTitle>
                    <EditOrDeleteContainer>
                        {createEditBtn ? (
                            <DoneBtn onClick={() => setCreateEditBtn(false)}>Done</DoneBtn>
                        ) : (
                            <RoutineBtn
                                type="button"
                                onClick={() => {
                                    setCreateEditBtn(true);
                                    setCreateDeleteBtn(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faPen} fontSize="16px" color="#668" />
                            </RoutineBtn>
                        )}
                        {createDeleteBtn ? (
                            <DoneBtn onClick={() => setCreateDeleteBtn(false)}>Done</DoneBtn>
                        ) : (
                            <RoutineBtn
                                type="button"
                                onClick={() => {
                                    setCreateDeleteBtn(true);
                                    setCreateEditBtn(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} fontSize="16px" color="#668" />
                            </RoutineBtn>
                        )}
                    </EditOrDeleteContainer>
                </RoutineHeader>

                <RoutineItems>
                    {routineList?.map((item) => (
                        <RoutineItem key={item}>
                            <div>
                                {routineNameEditState && item === selectedRoutine ? (
                                    <RoutineItemInput
                                        type="text"
                                        defaultValue={item}
                                        autoFocus
                                        onChange={(e) => setEditedRoutine(e.target.value)}
                                        onKeyDown={(e) => handleEditRoutine(e, item)}
                                    />
                                ) : (
                                    <Link
                                        style={{ textDecoration: 'none' }}
                                        href={`/routine/${item}`}
                                        as={`/routine/${item}`}
                                    >
                                        <RoutineItemLink>{item}</RoutineItemLink>
                                    </Link>
                                )}
                            </div>
                            {createEditBtn && (
                                <EditBtn
                                    onClick={() => {
                                        setRoutineNameEditState(true);
                                        setSelectedRoutine(item);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPen} fontSize="16px" color="#668" />
                                </EditBtn>
                            )}
                            {createDeleteBtn && (
                                <DeleteBtn
                                    onClick={() => {
                                        setDeletePopup(true);
                                        setDeleteItem(item);
                                    }}
                                >
                                    X
                                </DeleteBtn>
                            )}
                        </RoutineItem>
                    ))}
                </RoutineItems>
            </RoutineContainer>
            <UserIcon nickname={nickname} />
            <CreateRoutineField>
                {!createRoutineInput ? (
                    <CreateRoutineFieldBtn onClick={() => setCreateRoutineInput(true)}>
                        Create new routine
                    </CreateRoutineFieldBtn>
                ) : (
                    <CreateRoutineFieldInput
                        type="text"
                        value={routine}
                        placeholder="routine name..."
                        autoFocus
                        onChange={(e) => setRoutine(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                )}
            </CreateRoutineField>
            {deletePopup && (
                <DeletePopupContainer>
                    <DeletePopupOverlay
                        onClick={() => {
                            setDeletePopup(!deletePopup);
                        }}
                    />
                    <DeletePopupModal>
                        <DeletePopupTxt>Routine: {deleteItem}</DeletePopupTxt>
                        <DeletePopupBtn onClick={() => handleRoutineDelete(deleteItem)}>
                            Delete
                        </DeletePopupBtn>
                    </DeletePopupModal>
                </DeletePopupContainer>
            )}
        </RoutinePage>
    ) : (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    );
};

const RoutinePage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
`;

const EditInputOverlay = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

const CreateInputOverlay = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
`;

const RoutineContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`;

const RoutineHeader = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 338px;
`;

const SubTitle = styled.h2`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    margin: 0px;
    background-color: #000025;
    border-bottom: 0;
    border-radius: 15px 15px 0 0;
`;

const SubTitleTxt = styled.span`
    font-family: VCR_OSD_MONO;
    font-weight: 400;
    font-size: 24px;
`;

const EditOrDeleteContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    top: 0px;
    right: 10px;
    width: 105px;
`;

const DoneBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 30px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    background-color: #002;
    border-style: none;
    border-radius: 15px 15px 0 0;
    cursor: pointer;
`;

const RoutineBtn = styled.button`
    width: 50px;
    height: 30px;
    border-style: none;
    background-color: #003;
    color: #d7d7d7;
    border-radius: 15px 15px 0 0;
    cursor: pointer;
`;

const RoutineItems = styled.div`
    display: flex;
    flex-direction: column;
    width: 240px;
    min-height: 180px;
    height: max-content;
    max-height: 360px;
    padding: 0px 50px;
    background-color: rgba(0, 0, 40, 0.5);
    border-radius: 0px 15px 15px 15px;
    overflow: auto;
`;

const RoutineItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    margin: 15px 0;
`;

const RoutineItemInput = styled.input`
    position: relative;
    width: 150px;
    height: 30px;
    padding: 0 10px;
    border-style: none;
    border-radius: 10px;
    font-size: 16px;
    z-index: 2;
`;

const RoutineItemLink = styled.div`
    max-width: 180px;
    padding: 5px 10px;
    text-decoration: none;
    color: white;
    font-size: 18px;
    font-weight: bold;
    background-color: #000025;
    color: white;
    border-radius: 7.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
`;

const EditBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    color: #bbb;
    border-radius: 10px;
    border-style: none;
    background-color: transparent;
    cursor: pointer;
`;

const DeleteBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    color: Black;
    font-weight: 400;
    font-size: 15px;
    font-weight: bold;
    border-style: none;
    border: 3px solid black;
    border-radius: 5px;
    background-color: red;
`;

const CreateRoutineField = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 1vh;
`;

const CreateRoutineFieldBtn = styled.button`
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

const CreateRoutineFieldInput = styled.input`
    position: relative;
    width: 215px;
    padding: 6px 20px;
    border-radius: 20px;
    font-size: 16px;
    outline: none;
    border: none;
    z-index: 4;
`;

const DeletePopupContainer = styled.div`
    position: relative;
`;

const DeletePopupOverlay = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 20;
`;

const DeletePopupModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 30px;
    border-radius: 10px;
    background-color: #333;
    z-index: 21;
    white-space: nowrap;
`;

const DeletePopupTxt = styled.p`
    color: white;
    font-weight: bold;
    white-space: nowrap;
`;

const DeletePopupBtn = styled.div`
    padding: 5px 15px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    border-bottom: 4px solid #500;
    color: white;
    background-color: #c44;
`;

export default Routine;
