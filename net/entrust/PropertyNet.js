

import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 物业版 邀请客户
export class InviteUser extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/invite";
    }
}

// 物业版 委托登记初始数据
export class InvitationToRegister extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/invitationToRegister";
    }
}

// 物业版 发布委托次数验证
export class ValidatePropertyEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/validateProtertyEntrust";
    }
}

// 求购、求租消息极光推送
export class PushPropertyMessage extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/pushPropertyMessage";
    }
}


