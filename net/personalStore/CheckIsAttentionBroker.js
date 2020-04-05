import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 判断是否关注经纪人
export class CheckIsAttentionBroker extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/isAttentionBroker";
    }
}

// 添加关注
class AddOrRemoveAttentionApi extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/addOrRemoveAttention";
    }
}
export class AddOrRemoveAttention {
    constructor(request = {}) {
        this.request = request;
    }

    send() {
        return new AddOrRemoveAttentionApi(this.request).send()
            .then(res => {
                res = res || {};
                res.code = 0;
                if (res.STATUS && res.STATUS == 1) {
                    res.code = 200;
                }
                return res;
            })
    }
}