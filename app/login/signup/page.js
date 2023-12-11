'use client';

import React, { useState } from 'react';
import { signupEmail } from '@/api/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/api/firebase';
import '@/styles/signup-page.css';

const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
                const result = await signupEmail(email, password);
                const user = result.user;
                await setDoc(doc(db, user.uid, 'Your Routine'), { 'Your Routine': [] });

                setSuccessMessage('Sign up successful !');
                setPasswordError('');
                setEmailError('');

                console.log(user.email, user.uid);
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

    const handleKeyPress = (e) => {
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
            {successMessage && <div className="success-message">{successMessage}</div>}
            {successMessage && (
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
