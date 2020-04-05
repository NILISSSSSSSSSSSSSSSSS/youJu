import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 小程序根据城市查询赠送优惠券金额

export class GetRedpackages extends RequestApi {
  constructor(responseData) {
      let item = new RequestApiItem();
      item.domain = "uuhf";
      item.data = responseData;
      item.method = "get";
      item.header = 'application/json';
      super(item);
  }

  getUrl() {
      return "/uuhfWeb/entrust/getRedpackages";
  }
}

