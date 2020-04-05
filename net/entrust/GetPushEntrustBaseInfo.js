import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取发布委托基础信息
export class GetPushEntrustBaseInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBaseInfo4Entrust";
    }
}