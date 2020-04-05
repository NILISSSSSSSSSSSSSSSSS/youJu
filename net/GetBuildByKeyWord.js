import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 搜索房源
export class GetBuildByKeyWord extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBuildByKeyWord";
    }
}
