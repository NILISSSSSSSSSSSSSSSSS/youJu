import {RequestApi, RequestApiItem} from "@/utils/RequestApi";

// 初始化用户信息 开单豹项目
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
