import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 获取聊天列表
export class GetChartList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Im/getContactList";
    }
}




