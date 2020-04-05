import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 获取房源的房价走势
export class GetHousePriceTrend extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        // item.domain = "uuhf";
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        // return "/uuhfWeb/houseAssess/getPriceTrendNew";
		return "/api/house/querBuildTrend"
    }
}