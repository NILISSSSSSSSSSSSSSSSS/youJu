import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取首页活动弹窗信息
export class GetActivityTcInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/isShow";
    }
}