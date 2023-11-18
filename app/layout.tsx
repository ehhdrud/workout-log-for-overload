import './globals.css';
import type { Metadata } from 'next';
import Recoil from './components/Recoil';
import Image from 'next/image';
import backgroundImg from '@/assets/Cloudy.svg';

export const metadata: Metadata = {
    title: 'workout log for overload',
    description: '점진적 과부하를 위한 운동 기록 일지',
    keywords: 'workout, log, timer, rest, 운동, 일지, 타이머, 휴식',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <Image
                    src={backgroundImg}
                    alt="img"
                    fill
                    style={{ zIndex: -1, objectFit: 'cover' }}
                />
                <h1 className="main-title">
                    <p className="title-top">WORKOUT LOG</p>
                    <div className="title-bottom">OVERLOAD</div>
                </h1>

                <Recoil>{children}</Recoil>
            </body>
        </html>
    );
}
