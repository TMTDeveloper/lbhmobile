import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import 'rxjs/add/operator/map';

import { BackendService } from './backend.service';
 
export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
 
@Injectable()
export class AuthService {

  constructor(
    private backend: BackendService
  ){}
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
        return Observable.throw("Please insert credentials");
    } else {
        return this.backend.validateAuth(credentials);
    }
  }
 
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.backend.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.backend.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}