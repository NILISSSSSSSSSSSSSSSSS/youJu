import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 初始化统计次数
export class InitEnterStoreCount extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getInStoreCount";
    }
}