'use client';

import { useRecoilValue } from 'recoil';
import { isAcceptedAtom } from '@/recoil/atoms';

const isAccepted = useRecoilValue(isAcceptedAtom);

const LogLayout = (props: any) => {
    return isAccepted && <div>{props.children}</div>;
};

export default LogLayout;
