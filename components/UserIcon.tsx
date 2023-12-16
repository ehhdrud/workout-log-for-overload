import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/firebase';
import { FaUser } from 'react-icons/fa';
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
        router.push('/');
    };
    return (
        <div>
            <UserIconBox
                onClick={() => {
                    setPopupState(!popupState);
                }}
            >
                <FaUser color="#668" size="15" />
            </UserIconBox>
            {popupState && (
                <PopupContainer>
                    <PopupOverlay
                        onClick={() => {
                            setPopupState(!popupState);
                        }}
                    />
                    <PopupModal>
                        <PopupTxt>{nickname}</PopupTxt>
                        <PopupSignoutBtn onClick={handleLogout}>Sign Out</PopupSignoutBtn>
                    </PopupModal>
                </PopupContainer>
            )}
        </div>
    );
};

const UserIconBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 25px;
    height: 25px;
    border: 3px solid #002;
    border-radius: 50%;
    overflow: hidden;
    background-color: #002;
    z-index: 22;
    cursor: pointer;
`;

const PopupContainer = styled.div`
    position: relative;
`;

const PopupOverlay = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 20;
`;

const PopupModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 30px;
    border-radius: 10px;
    background-color: #333;
    z-index: 21;
    white-space: nowrap;
`;

const PopupTxt = styled.p`
    color: white;
    font-weight: bold;
    white-space: nowrap;
`;

const PopupSignoutBtn = styled.div`
    padding: 5px 15px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    border-bottom: 4px solid #500;
    color: white;
    background-color: #c44;
`;

export default UserIcon;
