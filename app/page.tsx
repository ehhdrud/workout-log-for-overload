'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';

import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/page.css';

export default function Home() {
    const router = useRouter();
    const [secretCode, setSecretCode] = useState('');
    const [isAccepted, setClientIsAccepted] = useState<string | boolean>('');
    const [recoilIsAccepted, setIsAccepted] = useRecoilState(isAcceptedAtom);

    useEffect(() => {
        setClientIsAccepted(recoilIsAccepted);
    }, [recoilIsAccepted]);

    const handleFormSubmit = (e: any) => {
        e.preventDefault();

        if (secretCode === 'ehhdrud') {
            setIsAccepted(true);
            router.push('/routine');
        }
    };

    return (
        <main>
            <h2 className="guide-text">Please enter the secret code.</h2>
            <form className="myForm" onSubmit={handleFormSubmit}>
                <input
                    className="code-input"
                    type="password"
                    placeholder="secret code..."
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    autoFocus
                />
            </form>
            <div className="hint">
                <div>
                    <FontAwesomeIcon icon={faUnlock} fontSize="12px" color="#dd0" />
                </div>
                <div>
                    <FontAwesomeIcon icon={faKey} fontSize="12px" color="#dd0" />
                </div>
                <span>ehhdrud</span>
            </div>
        </main>
    );
}
