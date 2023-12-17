import type { Metadata } from 'next';
import Recoil from '../recoil/Recoil';
import Link from 'next/link';
import Image from 'next/image';
import backgroundImg from '@/assets/Cloudy.svg';
import StyledComponentsRegistry from '@/styles/registry';
import './globals.css';

export const metadata: Metadata = {
    title: 'workout log for overload',
    description: '점진적 과부하를 위한 운동 기록 일지',
    keywords: 'workout, log, timer, rest, 운동, 일지, 타이머, 휴식',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="kr">
            <body>
                <Image
                    src={backgroundImg}
                    alt="img"
                    fill
                    style={{ zIndex: -1, objectFit: 'cover' }}
                />
                <Link className="main-link" href={'/'} as={'/'}>
                    <h1 className="main-title">
                        <p className="title-top">WORKOUT LOG</p>
                        <p className="title-bottom">OVERLOAD</p>
                    </h1>
                </Link>
                <StyledComponentsRegistry>
                    <Recoil>{children}</Recoil>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
