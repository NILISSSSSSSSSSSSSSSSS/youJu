import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 悬赏列表
export class GetAcountList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getAcountList";
    }
}
