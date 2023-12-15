import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/firebase';
import { FaUserCircle } from 'react-icons/fa';

import styled from 'styled-components';
import './user-icon.css';

interface Props {
    nickname: string | undefined;
}

const UserIcon: React.FC<Props> = (props: { nickname: string | undefined }): JSX.Element => {
    const { nickname } = props;
    const router = useRouter();
    const [popupState, setPopupState] = useState<boolean>(false);

    const handleLogout = () => {
        logout();
        router.push('/routine');
    };
    return (
        <div>
            <div
                className="UserIconContainer"
                onClick={() => {
                    setPopupState(true);
                }}
            >
                <FaUserCircle />
            </div>
            {popupState && (
                <div className="PopupContainer">
                    <div className="PopupOverlay" />
                    <div>
                        <p className="PopupTxt">{nickname}</p>
                        <button className="PopupSignoutBtn" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const UserIconContainer = styled.div``;

const PopupContainer = styled.div``;

const PopupOverlay = styled.div``;

const PopupTxt = styled.p``;

const PopupSignoutBtn = styled.div``;

export default UserIcon;
