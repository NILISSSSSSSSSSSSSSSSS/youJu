import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 获取合租时的电话
export class GetTelFromHeZuMobileCode extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/othenBiz/otherBizController/getAesEncrypt";
    }
}
