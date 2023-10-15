# Workout Log for Overload
> 점진적 과부하를 위한 운동 일지  
> 웨이트 트레이닝용 루틴 관리 웹 앱

## 개발 배경 및 기획
https://buttery-python-af0.notion.site/9926a3876b8b42f9a709b57f57d719ae?pvs=4

## 기본 기능 
- 루틴에 운동을 저장하고 운동 별 세트, 세트 별 무게/횟수를 저장하고 관리하는 기능
- 운동 별 타이머 설정이 가능. 타이머를 사용한다면 세트 입력을 마칠 때 타이머를 자동 실행 (운동 별 마지막 세트는 동작 X)

## 기술 스택
- IDE: VSCode
- 개발 환경: Next.js
- Library : React
- Language : TypeScript
- State: Recoil
- Database: Firebase(Cloud firestore)

### 추가 예정 기능
- 운동 순서를 쉽게 수정할 수 있는 드래그 앤 드롭 기능
- 총 볼륨(무게) 진척도 그래프
- 이번달 운동한 날을 달력 형식으로 표시

(추후 앱으로 전환할 예정)
