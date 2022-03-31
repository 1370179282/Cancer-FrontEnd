import { observable, action } from "mobx";

export class UserStore {
  @observable
  isLogined: boolean = false;

  @action.bound
  setLogin = (val: boolean) => {
    this.isLogined = val;
  };
}
const userStore = new UserStore();
export default userStore;

