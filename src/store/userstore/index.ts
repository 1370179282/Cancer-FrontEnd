import { observable, action } from "mobx";

export class userStore {
  @observable
  isLogin: boolean = false;

  @action.bound
  setLogin = (val: boolean) => {
    this.isLogin = val;
  };
}
