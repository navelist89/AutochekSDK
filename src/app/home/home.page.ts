import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DeviceInfoProvider } from 'src/autochek-device/services/device-info';

import { CordovaGlucosemeterService } from 'src/autochek-device/services/cordova-glucosmeter.service';
import { GlucosemeterMeasurement } from 'autochek-base/objects/device-data-object';
import { EnumDeviceStaticStatus, DeviceBase } from 'src/autochek-device/objects/base/DeviceBase';
import { Router } from '@angular/router';
import { DeviceBodyscaleDual } from 'autochek-device/services/device-bodyscale-dual';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scannedList = [];
  bondedList = [];
  constructor(
    public navCtrl: NavController,
    private deviceInfoProvider: DeviceInfoProvider,
    private glucosemeterSerivce: CordovaGlucosemeterService,
    private ngZone: NgZone,
    private router: Router,
    private deviceBodyscaleDual:DeviceBodyscaleDual,
  ) {

    this.glucosemeterSerivce.onGlucosemeterMeasurements.subscribe(
      (gm: GlucosemeterMeasurement[]) => {
        console.log('measurement recieved', gm);
      }
    )

    this.deviceInfoProvider.connectedDevicesObservable.subscribe(
      (cd) => {
        this.bondedList = [];
        for (let devicetype of ['pedometer', 'glucosemeter', 'bodyscale', 'bpmeter']) {
          for (let device of cd[devicetype]) {
            this.bondedList.push(device);
            device.staticStatusSubject.subscribe(
              (status: EnumDeviceStaticStatus) => {
                console.log(`device ${device.name} status changed ${status}`);
              }
            )

          }
        }
      }
    )

  }



  startScan(type:string): void {
    this.scannedList = [];
    this.deviceInfoProvider.startScan(type).subscribe(
      (db) => {
        console.log('device found', db);
        this.ngZone.run(
          () => {
            this.scannedList.push(db);
            console.log(this.scannedList);
          }
        );
      }
    );
  }

  stopScan(): void {
    this.deviceInfoProvider.stopScan();
  }

  async bond(d: DeviceBase) {
    this.deviceInfoProvider.stopScan();
    this.stopScan();
    const res = await this.deviceInfoProvider.bondDevice(d);
    if (res) {
      this.scannedList = [];
    }

  }

  async debond(d: DeviceBase) {
    this.deviceInfoProvider.debondDevice(d);
    this.bondedList = this.bondedList.filter((db: DeviceBase) => db.id !== d.id)
  }

  connect(d: DeviceBase) {
    this.deviceInfoProvider.connectDevice(d);
  }

  openSubpage(d: DeviceBase) {
    // this.router.navigate(['device-detail'], { state: { device: d } });
    this.router.navigate(['device-detail', d.id]);
  }

  async startAutochekDual(){
    return await this.deviceBodyscaleDual.measureStart(171, 'male', 1989, 9, 13);
  }

}
