import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取房源的房价走势
export class QuerBuildInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
		return "/api/house/querBuildInfo"
    }
}

// 小区价格走势
export class QuerBuildTrend extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }
	
    getUrl() {
		return "/api/house/querBuildTrend"
    }
}


// 城市二手房均价 环比
export class GetCityPriceTrend extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }
	
    getUrl() {
		return "/api/house/getCityPriceTrend"
    }
}


// 附近小区均价列表
export class QueryAroundResidentialAreaPrice extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }
	
    getUrl() {
        // return "/uuhfWeb/houseAssess/getPriceTrendNew";
		return "/api/house/queryAroundResidentialAreaPrice"
    }
}


// 获取房源的房价走势(平台)
export class GetHousePriceTrend extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/houseAssess/getPriceTrendNew";
    }
}