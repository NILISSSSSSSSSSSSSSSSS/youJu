import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取佣金支付信息
export class GetPayMoneyInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Trade/brokeragePay4Deal";
    }
}


// 创建订单
export class CreateOrderId extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Trade/weiKuanPrePay";
    }
}

// 委托意向金支付
export class PrepayEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/prepayEntrust";
    }
}