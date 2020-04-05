
import {RequestApi, RequestApiItem} from "@/utils/RequestApi";

// 获取用户电话号码
export class GetAgentPhone extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/elses/getBrokerCallType";
    }
}

