import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 二手房列表
export class GetErHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/secondHouseManager/getSecondHouseListAction";
    }
}

// 二手房列表(微店)
export class GetPersonalStoreErHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/bulletPlat/zdPlatHouseManager/leaseList";
    }
}



