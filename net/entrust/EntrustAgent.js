import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取推送经纪人情况
export class GetPushAgentDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBrokerAction";
    }
}

// 砸蛋
export class ZaDan extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/lotteryAction";
    }
}