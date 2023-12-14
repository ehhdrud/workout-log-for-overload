import { selector } from 'recoil';
import { userAtom } from './atoms';

export const nicknameSelector = selector<string | undefined>({
    key: 'nicknameSelector',
    get: ({ get }) => {
        const userInfo = get(userAtom);
        if (!userInfo) {
            return undefined;
        }
        const atIndex = userInfo?.email?.indexOf('@');
        const nickname = userInfo?.email?.substring(0, atIndex);
        return nickname;
    },
});
