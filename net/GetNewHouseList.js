import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 新房列表
export class GetNewHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/app/getListData";
    }
}


// 微店新房列表
export class GetStoreNewHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getNewBuildList";
    }
}

// 地图找房小区专家房源列表
export class GetListDataForMap extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getListData";
        // return "/mini/app/getListDataForMap";
    }
}
