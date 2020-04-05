import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 搜索附近小区
export class SearchNearBuildList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBuildListAction";
    }
}
