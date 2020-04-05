import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 获取400电话
export class GetHouse400Phone extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getHouse400Phone";
    }
}