import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { User } from "./auth-service";
import { Credentials } from "./credentials.holder";
@Injectable()
export class BackendService {
  // baseurlxpay:string='http://202.158.20.141:5001/xpay-service/api/'

  baseurl: string = "http://178.128.212.2:3003/";
  moni: boolean = false;
  constructor(public http: Http,
    private creds: Credentials) {}

  getreq(url: string) {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseurl + url, options).map(res => res.json());
  }

  postreq(url: string, body) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = new RequestOptions({
      headers: headers
    });
    return this.http
      .post(this.baseurl + url, body, options)
      .map(res => res.json());
  }

  patchreq(url: string, body) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = new RequestOptions({
      headers: headers
    });
    return this.http
      .patch(this.baseurl + url, body, options)
      .map(res => res.json());
  }
  
  currentUser: User;
  posts: any[];

  public validateAuth(credentials)
  {
    return Observable.create(observer => {
    // At this point make a request to your backend to make a real check!
    let encrypt = btoa(credentials.email+":"+credentials.password);
    //console.log("enctyption: " + encrypt.toString());

    // GET from server
    this.getreqAuth("login", encrypt).subscribe(response =>{
        if (response != null)
        {
            this.posts = response;
            
            console.log("got response");
            //console.log(this.posts);

            let access = this.validateCredentials(credentials, this.posts);
            observer.next(true);
            observer.complete();
        }
    });
  });
  }

  validateCredentials(credentials, posts: any[])
  {
    let name = posts[0];
    let email = posts[1];
    let role = posts[2];
    let password = posts[3];
    this.currentUser = new User(name , email);

    this.creds.set(posts);
    this.creds.log();

    return (credentials.password === password && credentials.email === email);
  }

  private getreqAuth(url: string, auth: string) {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + auth);
    
    const options = new RequestOptions({
    headers: headers
    });
    return this.http.get(this.baseurl + url, options).map(res => res.json());
    }
}
