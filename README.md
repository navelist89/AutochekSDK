# AutochekSDK

## 0. History

### 2020. 2. 13
  
내부 파일 몇가지들이 submodule로 수정되었습니다. 빌드 시 수정해야 할 사항은 '환경설정' 항목에 추가되었습니다.

### 2020. 2. 28
  
오토첵 듀얼 체지방계 지원되었습니다. npm install 한번 더 해줘야 


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

## 4. 오토첵듀얼 체지방계 지원

### 1) 개발 주의 사항
    
  오토첵듀얼 체지방계를 사용하기 위해서는 앱의 위치 권한이 fine으로 주어져야 합니다. coarse로는 권한 에러가 발생하게 됩니다.

  현재 본 sdk에서는 오토첵듀얼 체지방계를 연결하기 전에 별다른 권한 관리를 진행하지 않고 있습니다. 이 부분은 앱 개발자가 직접 권한 요청을 호출하셔야 합니다.

  테스트 단계에서는 안드로이드의 앱 권한 설정에서 직접 '위치' 권한을 주는 방식으로 테스트 진행이 가능합니다.

  기존의 디바이스들을 스캔 시도할 때에는 자동으로 블루투스 권한을 요청하는 것을 확인하실 수 있습니다. 다만 이 때 요청되는 권한은 coarse이므로 오토첵듀얼을 사용 시에 권한 에러가 발생합니다. 이 경우 권한을 제거했다가 수동으로 다시 주시면 됩니다.

  실제로 앱개발을 진행할 때는 앱의 진입점에서부터 fine 권한을 요청하도록 하여야 합니다.
    
### 2) 듀얼 측정 시나리오
    
  autochek dual 버튼을 누를 경우 60초의 timeout을 가진 측정 시나리오가 시작됩니다.

  해당 시나리오는 제조사측에서 제공한 sdk를 호출하여 동작되며, 장비에 연결을 시도하고, 장비로부터 측정 결과를 받아올 때 까지 지속됩니다. 그 이전에 60초 timeout 될 경우 실패 처리 됩니다.

  사용 방법은 home.page.ts 의 startAutochekDual 함수를 참조하시고, 더 자세한 사항은 src/autochek-device/services/device-bodycheck-dual 서비스를 읽어보시기 바랍니다.



