'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// firebase, recoil 관련 import
import { signupEmail } from '@/api/firebase';
import { useRecoilValue } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';
// 스타일링 관련 import
import styled from 'styled-components';

const SignUp = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isSuccessed, setIsSuccessed] = useState<boolean>(false);
    const userInfoRecoil = useRecoilValue<InfoType | null>(userAtom);

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

    // 메인 화면을 거치지 않은 경우 혹은 로그인이 된 상태에선 메인 화면으로 이동
    // (메인 화면을 거처야 사용자 관찰자가 생성됨)
    useEffect(() => {
        if (!sessionStorage.getItem('sessionStorage') || userInfoRecoil !== null) {
            router.push('/');
        }
    }, []);

    return (
        <div>
            <SignupContainer>
                <InputContainer>
                    <InputContainerItem
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputContainerItem
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputContainerItem
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </InputContainer>
                <SignupBtn onClick={handleSignup}>Sign Up !</SignupBtn>
            </SignupContainer>
            {(passwordError || emailError) && (
                <ErrorMessage>{passwordError || emailError}</ErrorMessage>
            )}
            {isSuccessed && (
                <div>
                    <SuccessMessageOverlay />
                    <SuccessMessage>
                        <SuccessMessageTxt>Sign up successful !</SuccessMessageTxt>
                        <SuccessMessageBtn onClick={goToSignIn}>Go to Main →</SuccessMessageBtn>
                    </SuccessMessage>
                </div>
            )}
        </div>
    );
};

const SignupContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const InputContainerItem = styled.input`
    width: 225px;
    height: 25px;
    border: 1px solid black;
    outline: none;
`;

const SignupBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 232px;
    height: 35px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #08b;
    border: none;
    border-radius: 3px;
    margin-top: 20px;
    text-decoration: none;
    color: white;
    outline: none;
`;

const ErrorMessage = styled.p`
    text-align: center;
    font-weight: bold;
    color: gray;
`;

const SuccessMessageOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1;
`;

const SuccessMessage = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 15px 40px;
    border-radius: 15px;
    background-color: #333;
    z-index: 2;
    white-space: nowrap;
`;

const SuccessMessageTxt = styled.p`
    font-weight: bold;
    white-space: nowrap;
`;

const SuccessMessageBtn = styled.button`
    padding: 5px 15px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    border-bottom: 4px solid #005;
    color: white;
    background-color: #44c;
`;

export default SignUp;
