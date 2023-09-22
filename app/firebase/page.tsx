'use client';

import React, { useState, useEffect } from 'react';
import {
    collection,
    doc,
    //C
    setDoc,
    //R
    getDocs,
    //U
    updateDoc,
    //D
    deleteDoc,
    deleteField,
} from 'firebase/firestore';
import { db } from '@/api/firebase';

const FirebaseTest = (props: any) => {
    const weight = 100;
    const reps = 12;

    const [createRoutine, setCreateRoutine] = useState<string>('');
    const [createWorkout, setCreateWorkout] = useState<string>('');
    const [deleteRoutine, setDeleteRoutine] = useState<string>('');
    const [deleteWorkout, setDeleteWorkout] = useState<string>('');

    // 전체 읽어오기
    const readData = async () => {
        getDocs(collection(db, 'workoutlogforoverload')).then((snapshot) => {
            console.log(snapshot.docs);
        });
    };

    // 루틴 추가
    const handleCreateRoutine = (e: any) => {
        if (e.key === 'Enter') {
            console.log('⭐create routine⭐');
            setDoc(doc(db, 'workoutlogforoverload', createRoutine), {});
        }
    };

    // 운동 추가
    const handleCreateWorkout = (e: any) => {
        if (e.key === 'Enter') {
            console.log('⭐create workout');
            setDoc(doc(db, 'workoutlogforoverload', createRoutine), {
                [createWorkout]: {
                    weight: [weight],
                    reps: [reps],
                },
            });
        }
    };

    // 루틴 삭제
    const handleDeleteRoutine = (e: any) => {
        if (e.key === 'Enter') {
            console.log('❌delete routine❌');
            deleteDoc(doc(db, 'workoutlogforoverload', deleteRoutine));
        }
    };

    // 운동 삭제
    const handleDeleteWorkout = (e: any) => {
        if (e.key === 'Enter') {
            console.log('❌delete workout❌');
            updateDoc(doc(db, 'workoutlogforoverload', deleteRoutine), {
                [deleteWorkout]: deleteField(),
            });
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
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
                onKeyDown={handleDeleteWorkout}
            />

            <button type="button" placeholder="Add Set">
                Add Set
            </button>
        </div>
    );
};

export default FirebaseTest;
