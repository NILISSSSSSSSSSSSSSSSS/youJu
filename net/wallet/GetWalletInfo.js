import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取意向金
export class GetAcountList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getAcountList";
    }
}

// 获取优惠券列表
export class GetRedPacket extends RequestApi{
	constructor(responseData){
		let item = new RequestApiItem();
		item.domain = "kaidanbao";
		item.data = responseData;
		super(item);
	}
	getUrl() {
	    return "/Mini/App/getRedPacketList";
	}
}

// 获取打车押金
export class GetPayPaidInit extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getAcountList";
    }
}
// 获取委托奖励金
export class GetRewardMoney extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getAcountList";
    }
}
// 奖金提现
export class ReWardMoney extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getReWardMoney";
    }
}


// new GetAcountList({pageNum: }).send()
// 	.then(res => {
// 		
// 	})
// 	.catch(err => {
// 		
// 	});

