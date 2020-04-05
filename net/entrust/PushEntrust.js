import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 发布求租求购委托
export class PushBuyLeaseEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/createCustEntrust";
    }
}


// 发布房源委托
export class PushHouseEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/createHouseEntrust";
    }
}


// 获取卖房、租房委托信息
export class GetHouseEntrustDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getCaseDetailInfo";
    }
} 


// 再次编辑出售委托信息
export class UpSaleEntrustDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/updateVipSaleInfo";
    }
}

// 再次编辑出租委托信息
export class UpLeaseEntrustDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/updateVipLeaseInfo";
    }
}

// 获取委托列表房源点击后的详情
export class GetEntrustCaseInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getVipCaseInfo";
    }
}