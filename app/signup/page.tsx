'use client';

import React, { useState } from 'react';
import { signupEmail } from '@/api/firebase';
import { useRouter } from 'next/navigation';
import '@/styles/signup-page.css';

const SignUp = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isSuccessed, setIsSuccessed] = useState<boolean>(false);

    const handleSignup = async () => {
        try {
            if (!email.includes('@') || !email.includes('.')) {
                setEmailError('Invalid email format');
                return;
            }
            if (password.length < 6) {
                setPasswordError('Password should be at least 6 characters');
                return;
            }
            if (password === confirmPassword) {
                await signupEmail(email, password);
                setIsSuccessed(true);
                setPasswordError('');
                setEmailError('');
            } else {
                setPasswordError("Passwords don't match");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const goToSignIn = () => {
        router.push('/login');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
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
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </div>
                <button className="signup-btn" onClick={handleSignup}>
                    Sign Up
                </button>
            </div>
            {(passwordError || emailError) && (
                <p className="error-message">{passwordError || emailError}</p>
            )}
            {isSuccessed && (
                <div className="success-message-container">
                    <div className="success-message-overlay" />
                    <div className="success-message">
                        <p className="success-message-txt">Sign up successful !</p>
                        <button className="success-message-btn" onClick={goToSignIn}>
                            Go to sign in →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
