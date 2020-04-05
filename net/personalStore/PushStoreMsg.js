import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 微店主动推送消息
export class PushStoreMsg extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/pushViewMsgStore";
    }
}