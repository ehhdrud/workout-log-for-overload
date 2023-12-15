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
import '@/styles/login-page.css';
import Spinner from '@/assets/Spinner.svg';

const LogIn = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
    const userInfoRecoil = useRecoilValue<InfoType | null>(userAtom);

    // 이메일 로그인 핸들러
    const handleEmailLogin = async () => {
        try {
            // loginEmail 함수 실행 시, 지속성 Session으로 설정
            await loginEmail(email, password);
            router.push('/routine');
        } catch (error) {
            console.log(error);
        }
    };

    // 구글 로그인 핸들러
    const handleGoogleLogin = async () => {
        try {
            // loginGoogle 함수 실행 시, 지속성 Session으로 설정
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

    // // 관찰자를 생성하기 위한 useEffect
    // useEffect(() => {
    //     if (!sessionStorage.getItem('sessionStorage')) {
    //         console.log("세션 스토리지에 'sessionStorage' Key가 없으므로 관찰자를 생성합니다.");
    //         // 사용자 관찰자 생성
    //         onAuthStateChanged(auth, (user) => {
    //             if (user) {
    //                 setUserInfoRecoil({
    //                     uid: user.uid,
    //                     email: user.email,
    //                 });
    //                 console.log('현재 사용자의 UID:', user.uid, '현재 사용자의 Email:', user.email);
    //             } else {
    //                 setUserInfoRecoil(null);
    //                 console.log('사용자가 로그인되어 있지 않습니다.');
    //             }
    //         });
    //     }
    // }, []);

    // // 관찰자를 생성하기 위한 useEffect
    // useEffect(() => {
    //     if (!sessionStorage.getItem('sessionStorage')) {
    //         console.log("세션 스토리지에 'sessionStorage' Key가 없으므로 관찰자를 생성합니다.");
    //         // 사용자 관찰자 생성
    //         auth.onAuthStateChanged((user) => {
    //             if (user) {
    //                 setUserInfoRecoil({
    //                     uid: user.uid,
    //                     email: user.email,
    //                 });
    //                 console.log('현재 사용자의 UID:', user.uid, '현재 사용자의 Email:', user.email);
    //             } else {
    //                 setUserInfoRecoil(null);
    //                 console.log('사용자가 로그인되어 있지 않습니다.');
    //             }
    //         });
    //     }
    // }, []);

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

    return isSignedIn === null ? (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    ) : isSignedIn ? (
        <div>
            <Image src={Spinner} alt="Loading" />
        </div>
    ) : (
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
