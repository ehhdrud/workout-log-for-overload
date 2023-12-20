'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// firebase, recoil 관련 import
import { loginEmail, loginGoogle } from '@/api/firebase';
import { useRecoilValue } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';
// 스타일링 관련 import
import styled from 'styled-components';
import Spinner from '@/assets/Spinner.svg';

const LogIn = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const userInfoRecoil = useRecoilValue<InfoType | null>(userAtom);

    const checkMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    };

    // 이메일 로그인 핸들러
    const handleEmailLogin = async () => {
        try {
            // loginEmail 함수 실행 시, 지속성 Session으로 설정
            await loginEmail(email, password);
            router.push('/routine');
        } catch (error) {
            setIsFailed(true);
            console.log(error);
        }
    };

    // 구글 로그인 핸들러
    // loginGoogle 함수 실행 시, 지속성 Session으로 설정
    const handleGoogleLogin = async () => {
        try {
            await loginGoogle();
            router.push('/routine');
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

    // 모바일 기기인지 확인하기 위한 useEffect
    useEffect(() => {
        setIsMobile(checkMobile());
    }, []);

    // Hydrate 에러를 방지하기 위한 useEffect
    useEffect(() => {
        if (userInfoRecoil) {
            setIsSignedIn(true);
        } else setIsSignedIn(false);
    }, [userInfoRecoil]);

    // 메인 화면을 거치지 않은 경우 혹은 로그인이 된 상태에선 메인 화면으로 이동
    // (메인 화면을 거처야 사용자 관찰자가 생성됨)
    useEffect(() => {
        if (!sessionStorage.getItem('sessionStorage') || userInfoRecoil !== null) {
            router.push('/');
        }
    }, [userInfoRecoil]);

    useEffect(() => {}, []);

    return isSignedIn === null ? (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    ) : isSignedIn ? (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    ) : (
        <LoginPage>
            {!isMobile && (
                <>
                    <GoogleLoginContainer onClick={handleGoogleLogin}>
                        <GoogleLogo
                            src="/google_logo.png"
                            alt="Google Logo"
                            width={30}
                            height={30}
                        />
                        <GoogleLoginText>Sign in with Google</GoogleLoginText>
                    </GoogleLoginContainer>
                    <OrText>OR</OrText>
                </>
            )}

            <EmailLoginContainer>
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
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </InputContainer>
                <LoginBtn onClick={handleEmailLogin}>Sign In</LoginBtn>
                <Link href={'/signup'} as={'/signup'}>
                    <SignupBtn>Create Account →</SignupBtn>
                </Link>
                {isFailed && <ErrorMessage>Check the account!</ErrorMessage>}
            </EmailLoginContainer>
        </LoginPage>
    );
};

const LoginPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
`;

const GoogleLogo = styled(Image)`
    margin-right: 10px;
`;

const GoogleLoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #55f;
    padding: 5px 15px;
    border-radius: 20px;
    width: 200px;
    height: 35px;
    cursor: pointer;
`;

const GoogleLoginText = styled.span`
    font-size: 15px;
    font-weight: bold;
    white-space: nowrap;
`;

const OrText = styled.p`
    margin: 20px;
    font-size: 12px;
    font-weight: bold;
`;

const EmailLoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 232px;
    gap: 5px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const InputContainerItem = styled.input`
    width: 225px;
    height: 25px;
    border: 1px solid black;
    outline: none;
`;

const LoginBtn = styled.button`
    width: 232px;
    height: 30px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #55f;
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
`;

const SignupBtn = styled.button`
    width: 232px;
    height: 30px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #00b;
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
`;

const ErrorMessage = styled.p`
    position: absolute;
    top: 100%;
    text-align: center;
    font-weight: bold;
    color: gray;
`;

export default LogIn;
