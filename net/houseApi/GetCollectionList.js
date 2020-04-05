import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 收藏的经纪人列表
export class GetCollectAgentList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getAttentionList";
    }
}

// 收藏的房源列表
export class GetCollectHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getHouseCollectionList";
    }
}

// 浏览的房源列表
export class GetHistoryHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.method = "post";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getHouseHistoryList";
    }
}
