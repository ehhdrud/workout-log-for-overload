'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';
import '@/styles/routine-page.css';
import Image from 'next/image';
import Spinner from '@/assets/Spinner.svg';

const Routine = () => {
    const [createRoutineInput, setCreateRoutineInput] = useState<boolean>(false);
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const [recoilIsAccepted, setIsAccepted] = useRecoilState(isAcceptedAtom);
    const [routine, setRoutine] = useState<string>('');
    const [routineList, setRoutineList] = useState<string[]>([]);

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            setRoutineList([...routineList, routine]);
            setRoutine('');
            setCreateRoutineInput(false);
        }
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    return isAccepted ? (
        <div className="routinePage">
            <div className="routineContainer">
                <h2 className="subTitle">🔥ROUTINE🔥</h2>
                <div className="routineItems">
                    {routineList.map((item, index) => (
                        <Link className="routineItem" href={`/routine/${item}`}>
                            📌 {item}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="createField">
                {!createRoutineInput ? (
                    <button
                        className="createInputFeild"
                        onClick={() => setCreateRoutineInput(true)}
                    >
                        create new routine
                    </button>
                ) : (
                    <input
                        className="InputFeild"
                        type="text"
                        value={routine}
                        placeholder="routine name..."
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
