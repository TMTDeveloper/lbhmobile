import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Credentials } from '../../providers/credentials.holder';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, private creds: Credentials) {
  }

}
