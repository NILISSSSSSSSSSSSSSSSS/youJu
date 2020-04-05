import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 屏蔽和解锁消息
export class BlockMsg extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/im/saveShield";
    }
}
