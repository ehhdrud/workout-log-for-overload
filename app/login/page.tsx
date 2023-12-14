'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/login-page.css';
import Image from 'next/image';

import { loginEmail, loginGoogle } from '@/api/firebase';

const LogIn: React.FC = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // 이메일 로그인 핸들러
    const handleEmailLogin = async () => {
        try {
            // loginEmail 함수 실행 시, 지속성 Session으로 설정
            await loginEmail(email, password);
            router.push('/routine_test');
        } catch (error) {
            console.log(error);
        }
    };

    // 구글 로그인 핸들러
    const handleGoogleLogin = async () => {
        try {
            // loginGoogle 함수 실행 시, 지속성 Session으로 설정
            await loginGoogle();
            router.push('/routine_test');
        } catch (error) {
            console.log(error);
        }
    };

    // Email 비밀번호 입력란 Enter키 입력 시 동작
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

                <Link className="signup-link" href={'/signup'} as={'/signup'}>
                    Create Account →
                </Link>
            </div>
        </div>
    );
};

export default LogIn;
