'use client';

import React, { useState } from 'react';
import { loginEmail, loginGoogle } from '@/api/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/login-page.css';
import Image from 'next/image';

const LogIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = async () => {
        try {
            await loginEmail(email, password);
            router.push('/routine_test');
        } catch (error) {
            console.log(error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginGoogle();
            router.push('/routine_test');
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyPress = (e) => {
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
