
import {RequestApi, RequestApiItem} from "@/utils/RequestApi";

// 给经纪人点赞
export class upHelp extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/index/updateFavoriteStatus";
    }
}

