# B-E

# 🏠[집을 모아놓다.zip](https://www.dotzip.today) [backend]

## 🙋‍♀️ 안녕하세요. [dot.zip](https://www.kkuljohab.com/) 백엔드 입니다.

<img width="673" alt="스크린샷 2022-01-25 오후 8 00 06" src="https://user-images.githubusercontent.com/80023108/150964817-baf6912d-46f3-4f66-a4c2-b596945846cc.png">

---

## 🐥팀노션

https://www.notion.so/kongom2/Team-zip-9e4ad0e0184448fc868950b076008e93

---

## 😀서비스 소개

여기저기 흩어져 있는 청약 정보를 한눈에 보기 쉽게 모아놓은 dotzip입니다.

---

## 👨‍👩‍👧‍👧팀원소개

- 팀장
  - 공성훈
- 프론트엔드
  - 공성훈 (https://github.com/kongom2)
  - 김형래 (https://github.com/O-h-y-o)
  - 신항민 (https://github.com/ssinking91)
- 백엔드
  - 정하나 (https://github.com/hana-j)
  - 곽태민 (https://github.com/kwak9898)
  - 민수현 (https://github.com/SuHyeon-Eleven)
- 디자이너
  - 서가람
  - 이세은

---

## 🖥Project Architecture

![백엔드](https://user-images.githubusercontent.com/80023108/150957823-87a08bd6-52cb-4721-9a6b-7e6395bbae46.png)

---

## 📕주요 라이브러리

| 라이브러리    | 설명                       | 버전   |
| ------------- | -------------------------- | ------ |
| Express       | Node.js                    | 4.17.1 |
| MYSQL         | 참조관계가 많은 데이터 특성. MySQL 적용 | 5.13.3 |
|sequelize      |                        |7.0.0 |
| CORS          | Request resouRce 제한      | 2.8.5  |
| Swagger       | API 문서화                 | 4.1.6  |
| Joi           | 유효성 검사                | 17.5.0 |
| dotenv        | 환경변수 설정              | 10.0.0 |
| nodemailer    | 메일 알림                  | 6.7.2  |
| node-schedule | 노드 스케줄러              | 2.1.0  |
| request       |                            | 2.88.2 |
| xml-js        | xml 변환                   | 1.6.11 |

---

## 🌠기능소개

- 소셜 로그인
- 공영 민영 청약 OPEN API에서 가져온 정보 일관적이게 제공
- 찜한 청약공고를 편하게 관리할 수 있도록 마이페이지를 제공
- 마이페이지에서 지역, 이메일 수정 가능
- 찜한 공고의 청약 접수날짜에 메일알림

---

## 🔥이슈 및 트러블슈팅
[상세보기] (https://www.notion.so/kongom2/c3584a65c5384c9d905924317c770ec0)
1. HTTP메서드 기본이지만 가장중요
2. 크롤링 대신에 openAPI 사용한이유!
3. GithubActions VS Jenkins
4. CI/CD .env참조문제
5. 요청이 많아 지면 어떻게 대응할 것인가?
6. MySQL을 사용한 이유

---

## 📌Tech Stack

Express.js  
MYSQL  
Swagger  
EC2  
S3
GithubActions
Codedeploy
