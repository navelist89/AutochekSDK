import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceBase, EnumDeviceStaticStatus, EnumDeviceDynamicStatus } from 'autochek-device/objects/base/DeviceBase';
import { DeviceInfoProvider } from 'autochek-device/services/device-info';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.page.html',
  styleUrls: ['./device-detail.page.scss'],
})
export class DeviceDetailPage implements OnInit {

  private deviceId: string;
  private device: DeviceBase;

  public isConnected: boolean;

  public staticStatus: EnumDeviceStaticStatus;
  public dynamicStatus: EnumDeviceDynamicStatus;
  constructor(
    private route: ActivatedRoute,
    private deviceInfoProvider: DeviceInfoProvider,
    private ngZone: NgZone,
  ) {
    this.deviceId = this.route.snapshot.params['deviceId'];
    this.device = this.deviceInfoProvider.getDeviceFromId(this.deviceId);
    // this.device = this.router.getCurrentNavigation().extras.state.device;
  }

  ngOnInit() {
    this.device.staticStatusSubject.subscribe(
      (s) => {
        this.ngZone.run(
          ()=>{
            this.staticStatus = s;
            if(s===EnumDeviceStaticStatus.Connected) {
              this.isConnected = true;
            } else {
              this.isConnected = false;
            }
          }
        )
        
      }
    );
    this.device.dynamicStatusSubject.subscribe(
      (s) => {
        this.dynamicStatus = s;
      }
    )
    console.log('DeviceDetailPage', this.deviceId);
    console.log('DeviceDetailPage', this.device);
  }

  connect(){
    this.deviceInfoProvider.connectDevice(this.device);
  }
  disconnect(){
    this.deviceInfoProvider.disconnectDevice(this.device);
  }
  sync(){
    this.deviceInfoProvider.syncDevice(this.device);
  }
}
