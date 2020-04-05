import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 提交绑定
export class BindTel extends RequestApi{
    constructor(responseData) {
        responseData["userId"] = responseData["youyouUserId"];
        delete responseData["youyouUserId"];
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/userClaimEntrust";
    }
}

// 授权时认领弹框
export class SosoEntrustClaim extends RequestApi{
    constructor(responseData) {
        responseData["userId"] = responseData["youyouUserId"];
        delete responseData["youyouUserId"];
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/sosoEntrustClaim";
    }
}
