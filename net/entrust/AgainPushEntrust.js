import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 再次推送委托
export class AgainPushEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/my/sendMore";
    }
}
