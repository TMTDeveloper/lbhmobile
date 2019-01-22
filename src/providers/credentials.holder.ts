import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";

@Injectable()
export class Credentials {
  data: any;
  constructor() {
    console.log("Hello Singleton Provider");
  }

  set(data) {
    this.data = data;
  }

  log() {
    console.log("user data:");
    console.log(this.data);
  }

  setUsername(name) {
    this.set(name);
  }

  getUsername() {}

  getEmail() {}
}
