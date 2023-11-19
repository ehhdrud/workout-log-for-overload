import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// Next.js의 SSR 구조는 서버에서 미리 렌더링할 데이터를 만들어서 정적으로 내려줘야하는데, 서버에는 웹 스토리지가 없으므로 오류가 발생.
// 일단 sessionStorage를 undefined로 선언해서 서버에서 window.sessionStorage 객체를 로드하지 않도록 처리.
const sessionStorage = typeof window !== 'undefined' ? window.sessionStorage : undefined;

// recoilPersist를 통해 Recoil atom이 변경될 때마다 해당 atom의 값을 지정된 storage에 저장.
const { persistAtom } = recoilPersist({
    key: 'sessionStorage',
    storage: sessionStorage,
});

export const isAcceptedAtom = atom<boolean>({
    key: 'isAcceptedAtom',
    default: false,
    // persistAtom을 effects_UNSTABLE 배열에 추가하여 위 효과를 적용
    effects_UNSTABLE: [persistAtom],
});
