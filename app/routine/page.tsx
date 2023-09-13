'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';
import '../../styles/routine-page.css';
import Spinner from '../../assets/Spinner.svg';

const Routine = () => {
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const [recoilIsAccepted, setIsAccepted] = useRecoilState(isAcceptedAtom);
    const [routine, setRoutine] = useState<string>('');
    const [routineList, setRoutineList] = useState<string[]>([]);

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            setRoutineList([...routineList, routine]);
            setRoutine('');
        }
    };

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    return isAccepted ? (
        <div className="routinePage">
            <div>
                {routineList.map((item, index) => (
                    <Link href={`/${item}`}>{item}</Link>
                ))}
            </div>
            <input
                className="routineInput"
                type="text"
                value={routine}
                placeholder="routine name"
                onChange={(e) => setRoutine(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    ) : (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    );
};

export default Routine;
