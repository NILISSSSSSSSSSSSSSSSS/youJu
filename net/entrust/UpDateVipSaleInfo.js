import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 再次编辑出售委托信息
export class UpDateVipSaleInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/updateVipSaleInfo";
    }
}
