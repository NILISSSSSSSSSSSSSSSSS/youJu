import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// im 获取委托房源列表
export class GetImEntrustHouseList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Im/queryImEntrustHouseList";
    }
}
