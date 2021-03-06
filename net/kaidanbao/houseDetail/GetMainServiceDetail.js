import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 主服务小区详情
export class GetIndexInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/index/index";
    }
}