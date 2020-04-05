import {RequestApi, RequestApiItem} from "../utils/RequestApi";


class DealUserInfoApi extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/dealUserInfo";
    }
}
export class DealUserInfo {
    constructor(request = {}) {
        this.request = request;
    }

    send() {
        return new DealUserInfoApi(this.request).send()
            .then(res => {
                res = res || {};
                res.data = res.data || res.DATA || {};
                return res;
            })
    }
}


// 通过unionId openId useInfo去获取userId（wx_id）
export class GetWxIdByUnionId extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/AppUser/getWxIdByUnionId";
    }
}
