import {RequestApi, RequestApiItem} from "../utils/RequestApi";

export class SaveUserTypeForCclient extends RequestApi {
  constructor(responseData) {
      let item = new RequestApiItem();
      item.domain = "uuhf";
      item.data = responseData;
      item.method = "post";
      item.header = 'application/json';
      super(item);
  }

  getUrl() {
      return "/uuhfWeb/wfUserManager/saveUserTypeForCclient";
  }
}
