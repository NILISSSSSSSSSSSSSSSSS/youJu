import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 新盘楼书分享信息
export class GetBuildBookDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/App/ZshftApp/miniBuildingBookForNewHouse";
    }
}

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

// 新盘分享 预约看房信息提交
export class SubmitYuYueLookHouseInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/MiniApp/saveIntentionCustomerInfo";
    }
}

// 是否显示活动按钮
export class IsShowActive extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/isShowActive";
    }
}


