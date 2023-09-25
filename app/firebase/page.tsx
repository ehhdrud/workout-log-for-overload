'use client';

import React, { useState, useEffect } from 'react';
import {
    collection,
    doc,
    //C
    setDoc,
    //R
    getDoc,
    getDocs,
    //U
    updateDoc,
    //D
    deleteDoc,
    deleteField,
} from 'firebase/firestore';
import { db } from '@/api/firebase';

const FirebaseTest = (props: any) => {
    const [weight, setWeight] = useState<number>(0);
    const [reps, setReps] = useState<number>(0);

    const [editedWeight, setEditedWeight] = useState<number>(0);
    const [editedReps, setEditedReps] = useState<number>(0);

    const [createRoutine, setCreateRoutine] = useState<string>('');
    const [createWorkout, setCreateWorkout] = useState<string>('');
    const [deleteRoutine, setDeleteRoutine] = useState<string>('');
    const [deleteWorkout, setDeleteWorkout] = useState<string>('');
    const [editRoutine, setEditRoutine] = useState<string>('');
    const [editWorkout, setEditWorkout] = useState<string>('');

    // 전체 읽어오기
    const readData = async () => {
        getDocs(collection(db, 'workoutlogforoverload')).then((snapshot) => {
            console.log(snapshot.docs);
        });
    };

    // 무게 수정
    const handleEditWeight = async (e: any, workoutName: string, index: number) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workoutlogforoverload', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    if (data[workoutName] && data[workoutName][index]) {
                        data[workoutName][index].weight = [editedWeight];

                        await updateDoc(docRef, data);
                        console.log(
                            '⭐edit weight⭐:',
                            `${createRoutine}-${workoutName}-${index}번 세트`
                        );
                    } else {
                        console.error('운동 또는 세트가 존재하지 않습니다.');
                    }
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 횟수 수정
    const handleEditReps = async (e: any, workoutName: string, index: number) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workoutlogforoverload', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    if (data[workoutName] && data[workoutName][index]) {
                        data[workoutName][index].reps = [editedReps];

                        await updateDoc(docRef, data);
                        console.log(
                            '⭐edit reps⭐:',
                            `${createRoutine}-${workoutName}-${index}번 세트`
                        );
                    } else {
                        console.error('운동 또는 세트가 존재하지 않습니다.');
                    }
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 루틴 추가
    const handleCreateRoutine = (e: any) => {
        if (e.key === 'Enter') {
            const docRef = doc(db, 'workoutlogforoverload', createRoutine);
            setDoc(docRef, {})
                .then(() => {
                    console.log('⭐create routine⭐:', createRoutine);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // 운동 추가
    const handleCreateWorkout = async (e: any) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workoutlogforoverload', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // 기존 데이터에 새로운 key:value 쌍 추가
                    data[createWorkout] = [
                        {
                            weight: [weight],
                            reps: [reps],
                        },
                    ];

                    // Firestore 문서 업데이트
                    await updateDoc(docRef, data);
                    console.log('⭐create workout⭐:', createWorkout);
                } else {
                    console.error('문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 세트 추가
    const handleCreateSet = async (workoutName: string) => {
        try {
            const docRef = doc(db, 'workoutlogforoverload', createRoutine);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                const newSet = {
                    weight: [weight],
                    reps: [reps],
                };

                data[workoutName].push(newSet);

                await updateDoc(docRef, data);
                console.log('⭐create set⭐:', `${createRoutine}/${workoutName}`);
            } else {
                console.error('문서(=Routine)가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 루틴 삭제
    const handleDeleteRoutine = (e: any) => {
        if (e.key === 'Enter') {
            const docRef = doc(db, 'workoutlogforoverload', deleteRoutine);
            deleteDoc(docRef)
                .then(() => {
                    console.log('❌delete routine❌:', deleteRoutine);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // 운동 삭제
    const handleDeleteWorkout = (e: any, workoutName: string) => {
        if (e.key === 'Enter') {
            const docRef = doc(db, 'workoutlogforoverload', deleteRoutine);
            updateDoc(docRef, {
                [workoutName]: deleteField(),
            })
                .then(() => {
                    console.log(`❌delete workout❌: ${deleteRoutine}/${workoutName}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // 루틴 수정
    const handleEditRoutine = async (e: any) => {
        if (e.key === 'Enter') {
            try {
                const docRefOld = doc(db, 'workoutlogforoverload', createRoutine);
                const docRefNew = doc(db, 'workoutlogforoverload', editRoutine);
                const docSnap = await getDoc(docRefOld);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    await setDoc(docRefNew, data);

                    await deleteDoc(docRefOld);

                    console.log('✏️edit routine✏️:', `${createRoutine} -> ${editRoutine}`);
                } else {
                    console.error('수정할 루틴이 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 운동 수정
    const handleEditWorkout = async (e: any) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workoutlogforoverload', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log(data);
                    console.log(data[createWorkout]);
                    if (data[createWorkout]) {
                        data[editWorkout] = data[createWorkout];

                        await updateDoc(docRef, data);

                        await updateDoc(docRef, {
                            [createWorkout]: deleteField(),
                        });

                        console.log(
                            `✏️ Edit workout name ✏️: ${createRoutine}/${createWorkout} -> ${createRoutine}/${editWorkout}`
                        );
                    } else {
                        console.error('운동이 존재하지 않습니다.');
                    }
                } else {
                    console.error('문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 세트 삭제
    const handleDeleteSet = async (workoutName: string, index: number) => {
        try {
            const docRef = doc(db, 'workoutlogforoverload', createRoutine);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                data[workoutName].splice(index, 1);

                await updateDoc(docRef, data);

                console.log('❌delete set❌:', `${createRoutine}-${workoutName}-${index}번 세트`);
            } else {
                console.error('문서(=Routine)가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    readData();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '30px',
                }}
            >
                기본 무게, 횟수 설정
                <input
                    type="text"
                    value={weight}
                    placeholder="weight"
                    onChange={(e) => setWeight(Number(e.target.value))}
                />
                <input
                    type="text"
                    value={reps}
                    placeholder="reps"
                    onChange={(e) => setReps(Number(e.target.value))}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '30px',
                }}
            >
                0번 인덱스 요소 무게, 횟수 수정
                <input
                    type="text"
                    value={editedWeight}
                    placeholder="editedWeight"
                    onChange={(e) => setEditedWeight(Number(e.target.value))}
                    onKeyDown={(e) => handleEditWeight(e, createWorkout, 0)}
                />
                <input
                    type="text"
                    value={editedReps}
                    placeholder="editedReps"
                    onChange={(e) => setEditedReps(Number(e.target.value))}
                    onKeyDown={(e) => handleEditReps(e, createWorkout, 0)}
                />
            </div>
            <input
                type="text"
                value={createRoutine}
                placeholder="createRoutine"
                onChange={(e) => setCreateRoutine(e.target.value)}
                onKeyDown={handleCreateRoutine}
            />
            <input
                type="text"
                value={createWorkout}
                placeholder="createWorkout"
                onChange={(e) => setCreateWorkout(e.target.value)}
                onKeyDown={handleCreateWorkout}
            />
            <input
                type="text"
                value={deleteRoutine}
                placeholder="deleteRoutine"
                onChange={(e) => setDeleteRoutine(e.target.value)}
                onKeyDown={handleDeleteRoutine}
            />
            <input
                type="text"
                value={deleteWorkout}
                placeholder="deleteWorkout"
                onChange={(e) => setDeleteWorkout(e.target.value)}
                onKeyDown={(e) => handleDeleteWorkout(e, deleteWorkout)}
            />
            <input
                type="text"
                value={editRoutine}
                placeholder="editRoutine"
                onChange={(e) => setEditRoutine(e.target.value)}
                onKeyDown={handleEditRoutine}
            />
            <input
                type="text"
                value={editWorkout}
                placeholder="editWorkout"
                onChange={(e) => setEditWorkout(e.target.value)}
                onKeyDown={handleEditWorkout}
            />
            <button
                type="button"
                placeholder="Add Set"
                onClick={() => handleCreateSet(createWorkout)}
            >
                Add SET
            </button>
            <button
                type="button"
                placeholder="Delete Set"
                onClick={() => handleDeleteSet(createWorkout, 0)}
            >
                Delete SET
            </button>
        </div>
    );
};

export default FirebaseTest;
