import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取经纪人是否在用户的黑名单 开单豹项目
export class GetUserInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/im/index";
    }
}
