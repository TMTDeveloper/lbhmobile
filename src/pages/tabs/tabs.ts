import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { PostPage } from '../post/post';

import { Credentials } from '../../providers/credentials.holder';
import { Events, NavController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = PostPage;

  constructor(private creds: Credentials, public events:Events, navCtrl:NavController) {
    events.subscribe('user:logout',()=>{
      navCtrl.popToRoot();
    })
  }
}
