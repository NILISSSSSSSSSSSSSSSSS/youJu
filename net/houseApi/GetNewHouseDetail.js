import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 新房详情
export class GetNewHouseDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getNewhouseInfo";
    }
}
