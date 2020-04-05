import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 是否收藏二手房
export class AddOrDeleteCollect extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/addOrDeleteCollect";
    }
}
