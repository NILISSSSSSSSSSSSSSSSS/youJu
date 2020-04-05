import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 领取优惠券
export class ReceiveCoupon extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/receiveCouponAction";
    }
}

// 获取优惠券信息
export class GetCouponDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/getCouponReceiveInfo";
    }
}
