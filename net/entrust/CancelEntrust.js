import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 取消委托
export class CancelEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/my/cancelVipQueue";
    }
}
