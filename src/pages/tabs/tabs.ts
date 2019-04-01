import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { PostPage } from '../post/post';

import { Credentials } from '../../providers/credentials.holder';
import { Events, NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ChoosePostPage } from '../post/choose_post';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ChoosePostPage;
  tab5Root = ProfilePage;

  role;

  constructor(private creds: Credentials, public events:Events, navCtrl:NavController) {
    this.role = creds.data.role;
    events.subscribe('user:logout',()=>{
      navCtrl.popToRoot();
    })
  }
}
