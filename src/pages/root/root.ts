import { Platform, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Credentials } from '../../providers/credentials.holder';
import { Component } from '@angular/core';

@Component({
    templateUrl: 'root.html'
})
export class RootPage {
    constructor(private platform: Platform, private nav: NavController, public creds: Credentials){
        platform.ready().then(
            () => {
                this.InitCredentials();
                this.nav.setRoot(LoginPage);
            }
        );
    }

    InitCredentials() {
        // Let's navigate to our first page
        //this.nav.setRoot(LoginPage);
        console.log('ionViewDidLoad First');
        this.creds.set("First singleton data");
        this.creds.log(); // log init data;
    }
}