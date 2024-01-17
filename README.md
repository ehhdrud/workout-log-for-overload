# Workout Log for Overload

> 🔎 [개발 배경 및 기획](https://buttery-python-af0.notion.site/9926a3876b8b42f9a709b57f57d719ae?pvs=4)

웨이트 트레이닝 루틴의 점진적 과부하를 위한 운동 일지

현존하는 운동 일지 앱에는 존재하지 않는 '각 운동별로 설정할 수 있는 휴식 시간 타이머' 기능을 구현

<br />

## 🚩 Link

- 배포 사이트: [workout-log-for-overload.vercel.app](https://workout-log-for-overload.vercel.app/) (아이디 `test@test.com` 비밀번호 `574384`)
- 시연 영상: [youtu.be/iU5sZAEP5Jk](https://youtu.be/iU5sZAEP5Jk)

<br />

## 🚩 STACKS

<div>
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/next.js-11112a?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
  <img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black">
  <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
  <img src="https://img.shields.io/badge/vercel-222222?style=for-the-badge&logo=vercel&logoColor=white">
</div>

<br />

## 🚩 FUNCTIONS

-   로그인/회원가입 ✅
-   루틴에 운동을 저장하고 운동 별 세트, 세트 별 무게/횟수를 저장하고 관리 ✅
-   운동 별로 개별적인 타이머 설정이 가능. 타이머 설정 시 세트 입력을 마칠 때 타이머를 자동 실행 ✅
-   총 볼륨(무게) 진척도 그래프
-   이번달 운동한 날을 달력 형식으로 표시

<br />

## 🚩 사용 방법

1. SECRET CODE(*ehhdrud*)를 입력하여 사용 권한을 부여받는다. 
2. 하루 단위의 루틴을 생성한다.
3. 생성한 루틴에서 여러 운동을 생성하고 SETS, WEIGHT, REPS, TIMER을 세팅한다.
    - 설정한 운동 정보는 데이터베이스에 저장되므로 지속적으로 관리할 수 있다.
      
4. REPS를 수정할 때 마다 TIMER가 자동으로 실행된다. 설정되어 있는 숫자를 클릭해도 실행된다.
    - TIMER는 선택적으로 사용 가능한 기능이다.
    - 각 운동의 마지막 세트를 수정할 때는 TIMER가 동작하지 않는다.
    
5. 타이머 종료 시 "TIME OUT" 메시지와 알림음이 출력된다.

<br />

## 🚩 SCREENSHOTS

### 🔸 Main Page

#### ◽ 로그아웃 상태
![1메인페이지](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/1d0948f7-f11b-4879-8115-ce85fd51acea)

#### ◽ 로그인 상태
![1메인페이지로그인상태](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/7be49306-6871-4989-a4bc-625d9265f06c)

---

### 🔸 Login Page

![2로그인](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/439e5c3d-0859-40bb-9e7d-b0738f604426)

---

### 🔸 Signup Page

![2회원가입](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/f652c472-9a1e-4e54-9c0a-6b3e7dc25e5e)

---

### 🔸 Routine Page

#### ◽ 초기 화면
![3루틴페이지](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/9eb5a2d6-5efa-4341-a947-2d4e07089eee)

#### ◽ 루틴 생성
![3루틴생성](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/38a588de-4cbf-4dc3-890e-d7c3a5e23c45)

#### ◽ 기존 루틴 이름 수정
![3루틴수정](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/3be75b33-d52d-49f0-94f7-6dd77bb276eb)

#### ◽ 루틴 삭제
![3루틴삭제](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/9f512c34-cf4e-4b54-bb94-926a8b6f932f)

---

### 🔸 Log Page

#### ◽ 초기 화면
![4로그페이지](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/a12e8d54-4d1c-44bd-897f-b01fa2825f51)

#### ◽ 운동 추가
![4운동추가](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/1ab908c0-feff-4701-8165-011ae8e64233)

#### ◽ 운동 정보 수정
![4운동이름수정](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/213addc5-ab69-4d55-9456-a35aebfd6c49)
![4운동세트수정](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/abd6b344-4c04-44ae-8480-aac4e7e3cfd5)
![4타이머수정](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/8f013429-88e5-4753-9f12-38a8c5125148)
![4운동정보삭제](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/e5507cc0-c084-44d3-8eaf-bab61676a701)

#### ◽ 타이머 종료 시 화면 (with 알람음)
![4타이머동작](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/842f54d5-f4ca-4fb7-906a-5ec6a572591c)

---

### 🔸 PageSpeed Insights 성능 점수

![100,100,100,100](https://github.com/ehhdrud/workout-log-for-overload/assets/106059716/796467b9-2fc1-40fc-9031-86b68f907072)

