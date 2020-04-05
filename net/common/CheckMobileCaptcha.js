import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 检查验证码
export class CheckMobileCaptcha extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/checkMobileCaptcha";
    }
}