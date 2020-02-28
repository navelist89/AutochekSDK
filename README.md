# AutochekSDK


## 1. 환경설정
0) 안드로이드 sdk 설치 필요 (기존에 안드로이드 개발에 사용하던 PC에서 설정시 별달리 신경써 줄 필요가 없습니다)

1) node 설치 https://nodejs.org/ko/

2) cordova / ionic 설치
  > npm install -g ionic
  
  > npm install -g cordova


3) 본 리포지토리에서 pull

  > git clone https://github.com/navelist89/AutochekSDK
  
  * 주의 : 본 프로젝트는 두개의 submodule을 사용합니다. 반드시 아래의 커맨드를 입력하여 submodule 반영하여야 합니다.
  
  > git submodule init
  
  > git submodule update

4) npm 의존성 설치
  > 본 리포지토리의 pacakge.json 과 같은 경로 내에서
  
  > npm install
  
5) 실행
  > ionic cordova run android

안드로이드 폰이 연결되었다면 해당 폰에서, 혹은 에뮬레이터가 실행되며 바이너리가 동작됨을 알 수 있습니다.

## 2. Hello World


## 3. 디바이스 데이터 처리

 src/app/app.component.ts 파일을 참조하면
 
```
      this.bodyscaleService.setUser({gender:'male', age:20, birth:new Date(2000, 1, 1), height:170});
      this.bodyscaleService.onBodyscaleMeasurment.subscribe(
        (value)=>{
          console.log('bodyscale result ', value);
        }
      )

      this.bpmeterService.onBloodpressureMeasurement.subscribe(
        (value)=>{
          console.log('bpmeter result', value);
        }
      )

      this.glucosemeterService.onGlucosemeterMeasurements.subscribe(
        (value)=>{
          console.log('glucosemeter result', value);
        }
      )

      this.pedometerService.setUser({gender:'female', age:20, birth:new Date(2000, 1,1), height:170, weight:62});
      this.pedometerService.onPedometerDaySummary.subscribe(
        (value)=>{
          console.log('pedometer day summary', value);
        }
      )
```
  각각의 장비가 데이터를 전송하면, sdk는 장비의 종류에 해당하는 서비스 (CordovaBodyscaleService, CordovaPedometerService, etc...) 내에 존재하는 메소드를 호출하여 데이터를 전송한다. 이 결과는 각 서비스 내의 데이터 타입에 해당하는 subject에 subscribe하여 observable로 받아올 수 있다.
  
        this.bodyscaleService.onBodyscaleMeasurment.subscribe(
          (value)=>{
            console.log('bodyscale result ', value);
          }
        )
  위 코드의 경우는 단순히 Bodyscale(체지방계)의 측정값이 들어올 때 이를 console.log로 출력하라는 콜백을 등록한 경우이다. 여기에 자신이 원하는 콜백을 등록하면 데이터 처리 과정을 customize 할 수 있다.
  
  autochek의 경우는 여기에 서버로 해당 데이터를 전송하는 코드가 삽입되어 있다.
  

 ```
      this.bodyscaleService.setUser({gender:'male', age:20, birth:new Date(2000, 1, 1), height:170});
 ```

  일부 서비스는 위와 같이 유저 정보를 설정해주는 것이 추천된다. (bodyscale / pedometer) 이것이 필요한 이유는, 체지방계의 경우 bmi의 측정에 유저의 정보가 필요하고, 활동량계(스마트밴드)의 경우 칼로리 및 거리 계산에 필요하기 때문이다. 
