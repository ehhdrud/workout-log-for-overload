'use client';

import React, { useState } from 'react';
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

    // 문서(루틴) 읽어오기 ✅
    const readDocumentNames = async () => {
        try {
            const docRef = collection(db, 'workout-log');
            const querySnapshot = await getDocs(docRef);

            const documentNames: any = [];
            querySnapshot.forEach((doc) => {
                documentNames.push(doc.id);
            });
        } catch (error) {
            console.error('문서를 읽어오는 중 오류 발생:', error);
        }
    };

    // 필드(운동) 읽어오기 ✅
    const readDocumentField = async () => {
        try {
            const docRef = doc(db, 'workout-log', '가슴');
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
            } else {
                console.error(`필드가 존재하지 않습니다.`);
            }
        } catch (error) {
            console.error('문서를 읽어오는 중 오류 발생:', error);
        }
    };

    // 무게 수정 ✅
    // 예시로 Index 0-0만 수정하도록 설정
    const handleEditWeight = async (e: any, workoutName: string) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    data[createRoutine][0][workoutName][0].weight = editedWeight;

                    await updateDoc(docRef, data);

                    console.log('⭐edit weight⭐:', `${createRoutine}-0번 운동-0번 세트`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 횟수 수정 ✅
    // 예시로 Index 0-0만 수정하도록 설정
    const handleEditReps = async (e: any, workoutName: string) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    data[createRoutine][0][workoutName][0].reps = editedReps;

                    await updateDoc(docRef, data);

                    console.log('⭐edit reps⭐:', `${createRoutine}-0번 운동-0번 세트`);
                } else {
                    console.error('문서(=Routine)가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 루틴 추가 ✅
    const handleCreateRoutine = (e: any) => {
        if (e.key === 'Enter') {
            const docRef = doc(db, 'workout-log', createRoutine);
            setDoc(docRef, { [createRoutine]: [] })
                .then(() => {
                    console.log('⭐create routine⭐:', createRoutine);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // 운동 추가 ✅
    const handleCreateWorkout = async (e: any) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    const newWorkout = {
                        [createWorkout]: [
                            {
                                weight: weight,
                                reps: reps,
                            },
                        ],
                    };

                    data[createRoutine].push(newWorkout);

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

    // 세트 추가 ✅
    const handleCreateSet = async (workoutIndex: number, workoutName: string) => {
        try {
            const docRef = doc(db, 'workout-log', createRoutine);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                const newSet = {
                    weight: weight,
                    reps: reps,
                };

                data[createRoutine][workoutIndex][workoutName].push(newSet);

                await updateDoc(docRef, data);

                console.log('⭐create set⭐:', `${createRoutine}/${workoutName}`);
            } else {
                console.error('문서(Routine)가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 루틴 삭제 ✅
    const handleDeleteRoutine = (e: any) => {
        if (e.key === 'Enter') {
            const docRef = doc(db, 'workout-log', deleteRoutine);
            deleteDoc(docRef)
                .then(() => {
                    console.log('❌delete routine❌:', deleteRoutine);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // 운동 삭제 ✅
    const handleDeleteWorkout = async (e: any, workoutName: string) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    const updatedWorkouts = data[createRoutine].filter(
                        (workout: any) => !workout.hasOwnProperty(workoutName)
                    );

                    data[createRoutine] = updatedWorkouts;

                    await updateDoc(docRef, data);

                    console.log(`❌delete workout❌: ${createRoutine}/${workoutName}`);
                } else {
                    console.error('문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 루틴 수정 ✅
    const handleEditRoutine = async (e: any) => {
        if (e.key === 'Enter') {
            try {
                const docRefOld = doc(db, 'workout-log', createRoutine);
                const docRefNew = doc(db, 'workout-log', editRoutine);
                const docSnap = await getDoc(docRefOld);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    await setDoc(docRefNew, data);
                    await deleteDoc(docRefOld);

                    data[editRoutine] = data[createRoutine];

                    await updateDoc(docRefNew, data);

                    await updateDoc(docRefNew, {
                        [createRoutine]: deleteField(),
                    });

                    console.log('✏️edit routine✏️:', `${createRoutine} -> ${editRoutine}`);
                } else {
                    console.error('수정할 루틴이 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 운동 수정 ✅
    // 예시로 Index 0만 수정하도록 설정
    const handleEditWorkout = async (e: any) => {
        if (e.key === 'Enter') {
            try {
                const docRef = doc(db, 'workout-log', createRoutine);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    data[createRoutine].splice(0, 1, {
                        [editWorkout]: data[createRoutine][0][createWorkout],
                    });

                    await updateDoc(docRef, data);

                    console.log(
                        `✏️ Edit workout name ✏️: ${createRoutine}/${createWorkout} -> ${createRoutine}/${editWorkout}`
                    );
                } else {
                    console.error('문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 세트 삭제 ✅
    // 예시로 index 0-1만 삭제하도록 설정
    const handleDeleteSet = async (workoutIndex: number, workoutName: string, setIndex: number) => {
        try {
            const docRef = doc(db, 'workout-log', createRoutine);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                data[createRoutine][workoutIndex][workoutName].splice(setIndex, 1);

                await updateDoc(docRef, data);

                console.log(
                    '❌delete set❌:',
                    `${createRoutine}-${workoutName}-${setIndex}번 세트`
                );
            } else {
                console.error('문서(=Routine)가 존재하지 않습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    readDocumentNames();
    readDocumentField();

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
                    defaultValue={editedWeight}
                    placeholder="editedWeight"
                    onChange={(e) => setEditedWeight(Number(e.target.value))}
                    onKeyDown={(e) => handleEditWeight(e, createWorkout)}
                />
                <input
                    type="text"
                    defaultValue={editedReps}
                    placeholder="editedReps"
                    onChange={(e) => setEditedReps(Number(e.target.value))}
                    onKeyDown={(e) => handleEditReps(e, createWorkout)}
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
                onClick={() => handleCreateSet(0, createWorkout)}
                style={{
                    margin: '10px',
                }}
            >
                Add SET
            </button>
            <button
                type="button"
                placeholder="Delete Set"
                onClick={() => handleDeleteSet(0, createWorkout, 1)}
            >
                Delete SET
            </button>
        </div>
    );
};

export default FirebaseTest;
