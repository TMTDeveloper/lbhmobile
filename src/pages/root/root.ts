import { Platform, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Credentials } from '../../providers/credentials.holder';
import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
    templateUrl: 'root.html'
})
export class RootPage {
    constructor(private platform: Platform, private nav: NavController, public creds: Credentials, statusBar: StatusBar){
        platform.ready().then(
            () => {
                this.InitCredentials();
                this.nav.setRoot(LoginPage);
                statusBar.overlaysWebView(false);
            }
        );
    }

    InitCredentials() {
        // Let's navigate to our first page
        //this.nav.setRoot(LoginPage);
        //console.log('ionViewDidLoad First');
        this.creds.set("First singleton data");
        this.creds.log(); // log init data;
    }
}