import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取经纪人信息
export class GetAgentInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/headInfo";
    }
}