'use client';

import React, { useState, useEffect } from 'react';
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
    // 부드러운 Lottie 애니메이션 효과를 위한 State와 객체
    const [opacity, setOpacity] = useState(0);
    const elementStyle = {
        width: '275px',
        height: '275px',
        opacity: opacity,
        transition: 'opacity 2s',
    };

    // 로그인 페이지로 이동하는 함수
    const moveToSignIn = () => {
        console.log("세션 스토리지에 'sessionStorage' Key가 없으므로 관찰자를 생성합니다.");
        // // 사용자 관찰자 생성
        // onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setUserInfoRecoil({
        //             uid: user.uid,
        //             email: user.email,
        //         });
        //         console.log('현재 사용자의 UID:', user.uid, '현재 사용자의 Email:', user.email);
        //     } else {
        //         setUserInfoRecoil(null);
        //         console.log('사용자가 로그인되어 있지 않습니다.');
        //     }
        // });
        router.push('/login');
    };

    // 회원가입 페이지로 이동하는 함수
    const moveToSignOut = () => {
        console.log("세션 스토리지에 'sessionStorage' Key가 없으므로 관찰자를 생성합니다.");
        // // 사용자 관찰자 생성
        // onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setUserInfoRecoil({
        //             uid: user.uid,
        //             email: user.email,
        //         });
        //         console.log('현재 사용자의 UID:', user.uid, '현재 사용자의 Email:', user.email);
        //     } else {
        //         setUserInfoRecoil(null);
        //         console.log('사용자가 로그인되어 있지 않습니다.');
        //     }
        // });
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
    }, []);

    return (
        <MainPageContainer>
            <Lottie animationData={Animation} loop play style={elementStyle} />
            {userInfo ? (
                <LoginStateBtnContainer>
                    <Link href={'/routine'} as={'/routine'}>
                        <RoutinePageBtn type="button">{nickname}&apos;s routine →</RoutinePageBtn>
                    </Link>
                    <SignOutBtn type="button" onClick={handleSignOut}>
                        Sign Out
                    </SignOutBtn>
                </LoginStateBtnContainer>
            ) : (
                <LogoutStateBtnContainer>
                    <SignInPageBtn type="button" onClick={moveToSignIn}>
                        Sign In →
                    </SignInPageBtn>
                    <SignUpPageBtn type="button" onClick={moveToSignOut}>
                        Sign Up →
                    </SignUpPageBtn>
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
    margin-top: 20px;
    user-select: none;
`;

const LoginStateBtnContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const RoutinePageBtn = styled.button`
    width: 232px;
    height: 35px;
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
    width: 232px;
    height: 35px;
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
    width: 232px;
    height: 35px;
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
    width: 232px;
    height: 35px;
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
