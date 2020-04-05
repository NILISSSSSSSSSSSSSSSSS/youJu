import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 掌通房源房源分享记录
export class ErpHouseShareRecord extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/houseShareRecord";
    }
}