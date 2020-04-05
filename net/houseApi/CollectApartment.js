import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 收藏公寓
export class CollectApartment extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/collectApartment";
    }
}
