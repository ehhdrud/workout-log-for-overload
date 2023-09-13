'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/page.css';

export default function Home() {
    const [secretCode, setSecretCode] = useState('');
    const router = useRouter();

    const handleFormSubmit = (e: any) => {
        e.preventDefault();

        // 시크릿 코드가 "ehhdrud"와 일치하는 경우에만 페이지 이동
        if (secretCode === 'ehhdrud') {
            router.push('/log');
        }
    };

    return (
        <main>
            <h2>Please enter the secret code.</h2>
            <form id="myForm" onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    id="codeInput"
                    placeholder="secret code..."
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    autoFocus
                />
            </form>
        </main>
    );
}
