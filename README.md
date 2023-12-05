# Workout Log for Overload

> 🔎 [개발 배경 및 기획](https://buttery-python-af0.notion.site/9926a3876b8b42f9a709b57f57d719ae?pvs=4)

웨이트 트레이닝 루틴의 점진적 과부하를 위한 운동 일지

현존하는 운동 일지 앱에는 존재하지 않는 _운동 별로_ 휴식 시간 타이머를 설정할 수 있는 기능 추가

<br />

## 🚩 Link

- 배포 사이트: [workout-log-for-overload.vercel.app](https://workout-log-for-overload.vercel.app/)
- 시연 영상: [youtu.be/ryEzFFWjQ4o](https://youtu.be/ryEzFFWjQ4o)

<br />

## 🚩 STACKS

<div>
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/next.js-11112a?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
  <img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black">
  <img src="https://img.shields.io/badge/vercel-222222?style=for-the-badge&logo=vercel&logoColor=white">
</div>

<br />

## 🚩 FUNCTIONS

-   루틴에 운동을 저장하고 운동 별 세트, 세트 별 무게/횟수를 저장하고 관리 ✅
-   운동 별로 개별적인 타이머 설정이 가능. 타이머 설정 시 세트 입력을 마칠 때 타이머를 자동 실행 ✅
-   총 볼륨(무게) 진척도 그래프
-   이번달 운동한 날을 달력 형식으로 표시

<br />

## 🚩 사용 방법

1. SECRET CODE(*ehhdrud*)를 입력하여 사용 권한을 부여받는다. 
2. 하루 단위의 루틴을 생성한다.
3. 생성한 루틴에서 여러 운동을 생성하고 SETS, WEIGHT, REPS, TIMER을 세팅한다.
4. REPS를 수정할 때 마다 TIMER가 자동으로 실행된다. 설정되어 있는 숫자를 클릭해도 실행된다.
    - TIMER는 선택적으로 사용 가능한 기능이다.
    - 각 운동의 마지막 세트를 수정할 때는 TIMER가 동작하지 않는다.
    
5. 타이머 종료 시 TIMEOUT 메시지와 알림음이 출력된다.
6. 설정한 운동 정보는 데이터베이스에 저장되므로 지속적으로 관리할 수 있다.

<br />

## 🚩 SCREENSHOTS

### 🔸 First Page

![1시크릿코드](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/1595209d-cab9-44f3-bdfa-6dc0a3f29a87)

---

### 🔸 Routine Page

![2루틴페이지](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/d374cc1f-55f4-4f81-9835-3d6dc4a8d206)

#### 🔹 루틴 추가
![2루틴페이지2](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/be2f5192-d257-48f6-a30b-9852896cf02f)

#### 🔹 기존 루틴 이름 수정
![2루틴페이지3](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/fbbd3f90-b860-4e06-b82d-84f1c364464a)

#### 🔹 루틴 삭제
![2루틴페이지4](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/5fe6aafd-fd5d-427d-a5a1-9cc0133eaf08)

---

### 🔸 Log Page

![3로그페이지](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/5ee2d4c1-6e52-4cf5-abee-fdc9100c60dd)

#### 🔹 운동 추가
![3로그페이지2](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/01d760aa-840e-42a5-9371-29a25b18c446)

#### 🔹 운동 혹은 세트 삭제
![3로그페이지3](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/ca2a92b7-f082-4778-8d31-7392f4edb2a8)

#### 🔹 운동 정보 수정
![3로그페이지4](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/668cccfc-4dca-4709-98ae-1258f39e4936)

#### 🔹 타이머 종료 시 화면 (with 알람음)
![3로그페이지5](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/1417e413-726a-48e7-b603-8f534018e4e7)

---

### 🔸 lighthouse 렌더링 성능

![lighthouse경고X](https://github.com/ehhdrud/d3sign-dao-studio/assets/106059716/f7690587-042d-4af9-9ba9-650679912337)
