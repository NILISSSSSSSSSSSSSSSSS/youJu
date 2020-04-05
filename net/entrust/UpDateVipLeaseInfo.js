
import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 再次编辑出租委托信息
export class UpDateVipLeaseInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/updateVipLeaseInfo";
    }
}
