import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取委托列表
export class GetEntrustList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/my/entrustList";
    }
}
