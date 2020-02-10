import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CordovaBodyscaleService } from 'autochek-device/services/cordova-bodyscale.service';
import { CordovaBpmeterService } from 'autochek-device/services/cordova-bpmeter.service';
import { CordovaGlucosemeterService } from 'autochek-device/services/cordova-glucosmeter.service';
import { CordovaPedometerService } from 'autochek-device/services/cordova-pedometer.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private bodyscaleService:CordovaBodyscaleService,
    private bpmeterService:CordovaBpmeterService,
    private glucosemeterService:CordovaGlucosemeterService,
    private pedometerService:CordovaPedometerService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

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
    });
  }
}
