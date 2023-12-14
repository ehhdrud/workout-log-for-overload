'use client';

import React, { useState } from 'react';
import { loginEmail, loginGoogle } from '@/api/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/login-page.css';
import Image from 'next/image';

import {
    getAuth,
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence,
} from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';

const LogIn: React.FC = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const setUserInfo = useSetRecoilState<InfoType | null>(userAtom);

    // 유저 정보 저장 함수
    const saveUserInfo = () => {
        const auth = getAuth();
        // firebase auth instance의 지속성을 session으로 설정
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                console.log('인증 상태 Session에서 관리 시작');
            })
            .catch((error) => {
                console.error('인증 상태 지속성 수정 실패: ', error);
            });

        // Recoil을 통해 session storage에 저장
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInfo({
                    uid: user.uid,
                    email: user.email,
                });
                console.log(
                    '현재 사용자의 UID:',
                    user.uid,
                    '현재 사용자의 Email:',
                    auth.currentUser
                );
            } else {
                setUserInfo(null);
                console.log('사용자가 로그인되어 있지 않습니다.');
            }
        });
    };

    const handleEmailLogin = async () => {
        saveUserInfo();
        try {
            await loginEmail(email, password);
            router.push('/routine_test');
        } catch (error) {
            console.log(error);
        }
    };

    const handleGoogleLogin = async () => {
        saveUserInfo();
        try {
            await loginGoogle();
            router.push('/routine_test');
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEmailLogin();
        }
    };

    return (
        <div className="login-page">
            <div className="google-login-container" onClick={handleGoogleLogin}>
                <Image
                    className="google-logo"
                    src="/google_logo.png"
                    alt="Google Logo"
                    width={30}
                    height={30}
                />
                <span className="google-login-text">Sign in with Google</span>
            </div>
            <p className="or">OR</p>
            <div className="email-login-container">
                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </div>

                <button className="login-btn" onClick={handleEmailLogin}>
                    Sign In
                </button>

                <Link className="signup-link" href={'/login/signup'} as={'/login/signup'}>
                    Create Account →
                </Link>
            </div>
        </div>
    );
};

export default LogIn;
