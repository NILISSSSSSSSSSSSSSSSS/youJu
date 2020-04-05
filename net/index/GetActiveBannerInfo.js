import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取首页悬浮活动
export class GetActiveBannerInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/getBannerList";
    }
}
