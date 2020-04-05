import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 首页
export class GetIndexData extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/app/getIndexData";
    }
}
