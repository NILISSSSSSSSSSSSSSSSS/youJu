

import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取AXB转接号码
class GetAxbPhoneNumberApi extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/AppUser/getAxbPhoneNumber";
    }
}
export class GetAxbPhoneNumber {
    constructor(request = {}) {
        this.request = request;
    }

    send() {
        return new GetAxbPhoneNumberApi(this.request).send()
            .then(res => {
                res = res || {};
                res.DATA = res.DATA || {};
                res.DATA = res.DATA.data || {};
                return  res;
            })
    }
}

// 用户绑定cityId
export class UserIdBindCityId extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/AppUser/bindCity";
    }
}