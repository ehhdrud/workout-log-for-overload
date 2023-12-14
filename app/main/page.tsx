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

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setUserInfo(userInfoReocoil);
    }, [userInfoReocoil]);

    useEffect(() => {
        if (nicknameRecoil) {
            setNickname(nicknameRecoil);
        }
    }, [nicknameRecoil]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInfoRecoil({
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
                setUserInfoRecoil(null);
                console.log('사용자가 로그인되어 있지 않습니다.');
            }
        });
    }, []);

    return (
        <MainPageContainer>
            <p>Manage your own weight training routine.</p>
            <p>Save exercise information in each routine.</p>
            <p>Set the weight, reps, and timer for each exercise.</p>
            {userInfo ? (
                <div>
                    <RoutinePageBtn>go to&nbsp;{nickname}'s routine →</RoutinePageBtn>
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
                        <Link className="signup-link" href={'/login/signup'} as={'/login/signup'}>
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
