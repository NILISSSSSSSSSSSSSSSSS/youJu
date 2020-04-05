import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 投诉房源
export class FakeHouse extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/compalaint";
    }
}
