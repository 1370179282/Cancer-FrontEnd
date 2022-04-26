import { observable, action } from "mobx";

export class UserStore {
  @observable
  test: boolean = false;

  @action.bound
  setTest = (val: boolean) => {
    this.test = val;
  };
}
const userStore = new UserStore();
export default userStore;
