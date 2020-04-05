import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取首页热门活动和经纪人及门店数量
export class GetHotActivityInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/initBizInfoNew/positionCityNew";
    }
}
