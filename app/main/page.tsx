'use client';

import React, { useState, useEffect } from 'react';
import { auth, logout } from '@/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userAtom, InfoType } from '@/recoil/atoms';
import { nicknameSelector } from '@/recoil/selectors';
import Link from 'next/link';
import styled from 'styled-components';

const MainPage: React.FC = (): JSX.Element => {
    const [userInfoReocoil, setUserInfoRecoil] = useRecoilState<InfoType | null>(userAtom);
    const nicknameRecoil = useRecoilValue<string | undefined>(nicknameSelector);
    const [userInfo, setUserInfo] = useState<InfoType | null>(null);
    const [nickname, setNickname] = useState<string | undefined>();

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

    // 관찰자를 생성하기 위한 useEffect
    useEffect(() => {
        if (!sessionStorage.getItem('sessionStorage')) {
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
        }
    }, []);

    return (
        <MainPageContainer>
            <p>Manage your own weight training routine.</p>
            <p>Save exercise information in each routine.</p>
            <p>Set the weight, reps, and timer for each exercise.</p>
            {userInfo ? (
                <div>
                    <RoutinePageBtn>go to&nbsp;{nickname}&apos;s routine →</RoutinePageBtn>
                    <SignOutBtn onClick={handleSignOut}>Sign Out</SignOutBtn>
                </div>
            ) : (
                <div>
                    <SignInPageBtn>
                        <Link className="signin-link" href={'/login'} as={'/login'}>
                            Sign In →
                        </Link>
                    </SignInPageBtn>
                    <SignUpPageBtn>
                        <Link className="signup-link" href={'/signup'} as={'/signup'}>
                            Sign Up →
                        </Link>
                    </SignUpPageBtn>
                </div>
            )}
        </MainPageContainer>
    );
};

const MainPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
    }
`;

const RoutinePageBtn = styled.button``;
const SignOutBtn = styled.button``;
const SignInPageBtn = styled.button``;
const SignUpPageBtn = styled.button``;

export default MainPage;
