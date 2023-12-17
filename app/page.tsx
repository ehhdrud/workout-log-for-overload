'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// firebase 관련 import
import { auth, logout } from '@/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
// recoil 관련 import
import { useRecoilValue, useRecoilState } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';
import { nicknameSelector } from '@/recoil/selectors';
// 스타일링 관련 import
import styled from 'styled-components';
import Lottie from 'react-lottie-player';
import Animation from '@/assets/Animation.json';

const MainPage = (): JSX.Element => {
    const router = useRouter();
    // 사용자 정보 상태 관리를 위한 State
    const [userInfoReocoil, setUserInfoRecoil] = useRecoilState<InfoType | null>(userAtom);
    const nicknameRecoil = useRecoilValue<string | undefined>(nicknameSelector);
    const [userInfo, setUserInfo] = useState<InfoType | null>(null);
    const [nickname, setNickname] = useState<string | undefined>();
    // 부드러운 애니메이션 효과를 위한 State
    const [opacity, setOpacity] = useState(0);

    // 로그인 페이지로 이동하는 함수
    const moveToSignIn = () => {
        console.log("세션 스토리지에 'sessionStorage' Key가 없으므로 관찰자를 생성합니다.");
        // 사용자 관찰자 생성
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInfoRecoil({
                    uid: user.uid,
                    email: user.email,
                });
                console.log('현재 사용자의 UID:', user.uid, '현재 사용자의 Email:', user.email);
            } else {
                setUserInfoRecoil(null);
                console.log('사용자가 로그인되어 있지 않습니다.');
            }
        });
        router.push('/login');
    };

    // 회원가입 페이지로 이동하는 함수
    const moveToSignOut = () => {
        console.log("세션 스토리지에 'sessionStorage' Key가 없으므로 관찰자를 생성합니다.");
        // 사용자 관찰자 생성
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInfoRecoil({
                    uid: user.uid,
                    email: user.email,
                });
                console.log('현재 사용자의 UID:', user.uid, '현재 사용자의 Email:', user.email);
            } else {
                setUserInfoRecoil(null);
                console.log('사용자가 로그인되어 있지 않습니다.');
            }
        });
        router.push('/signup');
    };

    // 로그아웃 핸들러
    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    };

    // Hydrate 에러를 방지하기 위한 useEffect - 1
    useEffect(() => {
        setUserInfo(userInfoReocoil);
    }, [userInfoReocoil]);

    // Hydrate 에러를 방지하기 위한 useEffect - 2
    useEffect(() => {
        if (nicknameRecoil) {
            setNickname(nicknameRecoil);
        }
    }, [nicknameRecoil]);

    // 애니메이션의 부드러운 렌더링을 위한 useEffect
    useEffect(() => {
        setOpacity(1);
    }, []);

    const elementStyle = {
        width: '250px',
        height: '250px',
        opacity: opacity,
        transition: 'opacity 2s',
    };

    return (
        <MainPageContainer>
            <Lottie animationData={Animation} loop play style={elementStyle} />
            {userInfo ? (
                <LoginStateBtnContainer>
                    <Link href={'/routine'} as={'/routine'}>
                        <RoutinePageBtn>{nickname}&apos;s routine →</RoutinePageBtn>
                    </Link>
                    <SignOutBtn onClick={handleSignOut}>Sign Out</SignOutBtn>
                </LoginStateBtnContainer>
            ) : (
                <LogoutStateBtnContainer>
                    {/* <Link className="signin-link" href={'/login'} as={'/login'}> */}
                    <SignInPageBtn onClick={moveToSignIn}>Sign In →</SignInPageBtn>
                    {/* </Link> */}
                    {/* <Link className="signup-link" href={'/signup'} as={'/signup'}> */}
                    <SignUpPageBtn onClick={moveToSignOut}>Sign Up →</SignUpPageBtn>
                    {/* </Link> */}
                </LogoutStateBtnContainer>
            )}
        </MainPageContainer>
    );
};

const MainPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const LoginStateBtnContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const RoutinePageBtn = styled.button`
    width: 230px;
    height: 25px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #00b;
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
`;

const SignOutBtn = styled.button`
    width: 230px;
    height: 25px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #777;
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
`;

const LogoutStateBtnContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const SignInPageBtn = styled.button`
    width: 230px;
    height: 25px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #55f;
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
`;
const SignUpPageBtn = styled.button`
    width: 230px;
    height: 25px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    background-color: #00b;
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
`;

export default MainPage;
