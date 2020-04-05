import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 删除委托房源图片
export class DealHousePhoto extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/deleteVipPhoto";
    }
}
