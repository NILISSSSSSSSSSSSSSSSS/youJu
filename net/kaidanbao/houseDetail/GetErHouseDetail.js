import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 房源详情
export class GetErHouseDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        // item.domain = "uuhf";
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/house/getHouseDetail";
    }
}
