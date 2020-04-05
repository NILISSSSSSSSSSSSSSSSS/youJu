import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 委托详细信息查询
export class GetEntrustDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getEntrustHouseInfo";
    }
}

// 不同意看房
export class DisAgreeLookHouse extends RequestApi{
	constructor(responseData) {
	    let item = new RequestApiItem();
	    item.domain = "kaidanbao";
	    item.data = responseData;
	    super(item);
	}

	getUrl() {
	    return "/Mini/Trade/disagreen4Daikan";
	}
}

// 同意看房
export class AgreeLookHouse extends RequestApi{
	constructor(responseData) {
	    let item = new RequestApiItem();
	    item.domain = "kaidanbao";
	    item.data = responseData;
	    super(item);
	}

	getUrl() {
	    return "/Mini/Trade/agreen4Daikan";
	}
}

// 填写评价
export class WriteEvaluate extends RequestApi{
	constructor(responseData) {
	    let item = new RequestApiItem();
	    item.domain = "kaidanbao";
	    item.data = responseData;
	    super(item);
	}

	getUrl() {
	    return "/Mini/Trade/createWfRecomHouseEvaAction";
	}
}

// 佣金支付后的服务评价
export class WriteServiceEvaluate extends RequestApi{
	constructor(responseData) {
	    let item = new RequestApiItem();
	    item.domain = "kaidanbao";
	    item.data = responseData;
	    super(item);
	}

	getUrl() {
	    return "/Mini/Trade/getServiceEvaAction";
	}
}

// 支付成功后填写服务评价
export class PaySuccessWriteServiceEvaluate extends RequestApi{
	constructor(responseData) {
	    let item = new RequestApiItem();
	    item.domain = "kaidanbao";
	    item.data = responseData;
	    super(item);
	}

	getUrl() {
	    return "/Mini/Trade/createServiceEvaAction";
	}
}

// 获取委托跟进
export class GetEntrustFollowList extends RequestApi{
	constructor(responseData) {
	    let item = new RequestApiItem();
	    item.domain = "kaidanbao";
	    item.data = responseData;
	    super(item);
	}

	getUrl() {
	    return "/Mini/App/getUUHouseTrackInfos";
	}
}

// 卖房/出租 同意看房
export class SaleHouseAgreeLookHouse extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/agreen4FangKan";
    }
}

// 卖房/出租 拒绝看房
export class SaleHouseDisagreeLookHouse extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/disagreen4FangKan";
    }
}

// 卖房/出租 提交申诉
export class SaleHouseSubmitAppeal extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/appealApi";
    }
}


