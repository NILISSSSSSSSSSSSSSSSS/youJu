import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 获取验证码
export class GetCaptcha extends RequestApi{
    constructor(responseData) {
        responseData["signType"] = 4;
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/sendMobileCaptcha";
    }
}

// 获取验证码
export class GetSendMsg extends RequestApi{
    constructor(responseData) {
        responseData["signType"] = 4;
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/sendMobileCaptcha";
    }
}

// 获取验证码(新房樓書專用)
export class GetSendMsgBuildBook extends RequestApi{
    constructor(responseData) {
        responseData["signType"] = 4;
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/sendMsg";
    }
}
