import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 判断是否是屏蔽
export class IsInBlackList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Im/isInBlackList";
    }
}
