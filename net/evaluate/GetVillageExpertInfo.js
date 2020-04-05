import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取小区专家信息
export class GetVillageExpertInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/expertInfo";
    }
}