'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { isAcceptedAtom } from '@/app/recoil/atoms';

import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/page.css';

export default function Home(): JSX.Element {
    const router = useRouter();
    const [secretCode, setSecretCode] = useState<string>('');

    const setIsAccepted = useSetRecoilState(isAcceptedAtom);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
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
                    autoFocus
                    onChange={(e) => setSecretCode(e.target.value)}
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
