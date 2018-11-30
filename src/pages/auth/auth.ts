import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MidataService } from '../../services/midataService';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage {

   _ellol = false;
   _tabBarElement: any;

  constructor(public navCtrl: NavController,
              public ms: MidataService) {
    
  }

  authenticate() {
      this.ms.authenticate().then(success => {
          if (success) {
            this.navCtrl.setRoot(TabsPage);
          } else {
            console.log('ellol');
            this._ellol = true;
          }
      })
  }

  ionViewDidEnter(){
    //this._tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //this._tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
    //this._tabBarElement.style.display = 'flex';
  }
}
