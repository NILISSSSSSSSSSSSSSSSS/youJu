import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 删除委托
export class DeleteEntrust extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/my/deleteQueue";
    }
}