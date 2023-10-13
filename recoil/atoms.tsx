import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'sessionStorage',
    storage: sessionStorage,
});

export const isAcceptedAtom = atom<boolean>({
    key: 'isAcceptedAtom',
    default: false,
    effects_UNSTABLE: [persistAtom],
});
