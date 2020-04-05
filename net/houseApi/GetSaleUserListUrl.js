import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 新房置业顾问列表
export class GetSaleUserListUrl extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getSaleUserList";
    }
}

// 查询VR首图
export class GetVRFirstPhoto extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getVRFirstPhoto";
    }
}
