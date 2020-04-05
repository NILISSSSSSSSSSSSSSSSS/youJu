import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 保存用户行为统计
export class SaveUserBehavior extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/saveCustBehavior";
    }
}
