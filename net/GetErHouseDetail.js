import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 二手房详情老优优
export class GetUuErHouseDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/houseInfoManager/getHouseInfo";
    }
}

// 二手房详情
export class GetErHouseDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        // 换成网站部接口
        return "/Mini/App/houseDetail";
    }
}


// 获取小区专家经纪人
export class GetBiddBuilderInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        // 换成网站部接口
        return "/mini/app/biddBuilderInfo";
    }
}

