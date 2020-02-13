# AutochekSubplatformCordovaDev


## 1. 환경설정
0) 안드로이드 sdk 설치 필요 (기존에 안드로이드 개발에 사용하던 PC에서 설정시 별달리 신경써 줄 필요가 없습니다)

1) node 설치 https://nodejs.org/ko/
2) cordova / ionic 설치
  > npm install -g ionic
  
  > npm install -g cordova
  
3) 본 리포지토리에서 pull

  > git clone https://github.com/navelist89/AutochekSDK
  
  > git submodule init
  
  > git submodule update

4) npm 의존성 설치
  > 본 리포지토리의 pacakge.json 과 같은 경로 내에서
  
  > npm install
  
5) 실행
  > ionic cordova run android

안드로이드 폰이 연결되었다면 해당 폰에서, 혹은 에뮬레이터가 실행되며 바이너리가 동작됨을 알 수 있습니다.
