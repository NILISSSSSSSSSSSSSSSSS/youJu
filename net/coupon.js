import { RequestApi, RequestApiItem } from "../utils/RequestApi";

// 访客记录 - 请求参数
export class AddWebsiteVisitorRecordsRequest {
  buildId = "";
  cityId = "";
  duration = 0; // 时长 单位秒
  source = 1; // 来源 1小程序 2B端
  wxId = ""; // 优优用户ID
}

// 访客记录
export class AddWebsiteVisitorRecords extends RequestApi{
  constructor(responseData) {
      let item = new RequestApiItem();
      item.domain = "uuhf";
      item.data = responseData;
      item.method = "post";
      item.header = 'application/json';
      super(item);
  }

  getUrl() {
      return "/newBuildWeb/openApi/cust/addWebsiteVisitorRecords";
  }
}

// 发送验证码
export class SendMobileKey extends RequestApi {
  constructor (responseData) {
    let item = new RequestApiItem();
    item.domain = "uuhf";
    item.data = responseData;
    item.method = 'post';
    item.header = 'application/json';
    super(item);
  }

  getUrl () {
    return "/newBuildWeb/openApi/build/sendMobileKey";
  }
}

// 验证验证码
export class CheckMobileKey extends RequestApi {
  constructor (responseData) {
    let item = new RequestApiItem();
    item.domain = "uuhf";
    item.data = responseData;
    item.method = 'post';
    item.header = 'application/json';
    super(item);
  }

  getUrl () {
    return "/newBuildWeb/openApi/build/checkMobileKey";
  }
}

// 领取优惠券
export class GetCoupon extends RequestApi {
  constructor (responseData) {
    let item = new RequestApiItem();
    item.domain = "uuhf";
    item.data = responseData;
    item.method = 'post';
    item.header = 'application/json';
    super(item);
  }

  getUrl () {
    return "/newBuildWeb/openApi/commission/getCoupon";
  }
}
