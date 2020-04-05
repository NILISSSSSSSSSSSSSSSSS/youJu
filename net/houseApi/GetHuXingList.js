import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 户型介绍
export class GetHuXingList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getLayoutPhotoList";
    }
}
