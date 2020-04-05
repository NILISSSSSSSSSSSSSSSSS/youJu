import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 优惠券列表
export class GetRedPacketList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getRedPacketList";
    }
}
