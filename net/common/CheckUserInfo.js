import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 查询用户信息
export class CheckUserInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/AppUser/getUserInfo";
    }
}

// 绑定手机号
export class BindUserMobile extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/bindUserMobile";
    }
}