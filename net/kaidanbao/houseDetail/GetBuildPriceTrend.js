import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 小区价格走势
export class GetBuildPriceTrend extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getPriceTrendNew";
		// return "/open/buildPrice/querBuildInfo"
    }
}
