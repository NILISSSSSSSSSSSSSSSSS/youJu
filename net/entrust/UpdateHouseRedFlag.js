import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 更新红点
export class UpdateHouseRedFlag extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/my/updateHouseRedFlag";
    }
}
