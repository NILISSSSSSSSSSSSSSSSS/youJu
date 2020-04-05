import {RequestApi, RequestApiItem} from "../../utils/RequestApi";
import {ImChart} from "../../utils/ImChart";
import {UserInfoModel} from "../../model/UserInfoModel";
import {CommonModel} from "../../model/CommonModel";


// 更新用户信息
export class UpUserInfo extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.data = responseData;
        item.domain = "kaidanbao";
        super(item);
    }

    getUrl() {
        return "/Mini/AppUser/updateUserInfo";
    }
}


// 模拟客服给C端客户发送一条消息, 在小程序上1分钟
export class SendServiceMsg {
    static timeoutVal = null;

    constructor() {
    }

    static send() {
        this.exit();
        let accid = new UserInfoModel().getModel("accid") || "";
        if(!accid) return;

        if(new CommonModel().getModel("SendServiceMsg_accid")
            && new CommonModel().getModel("SendServiceMsg_accid") == 1) return;

        this.timeoutVal = setTimeout(() => {
            if(!this.timeoutVal) return;

            new SendServiceMsgRequest({
                from: ImChart.getServiceId(),
                to: accid
            }).send().then(res => {
                new CommonModel().setModel(1,"SendServiceMsg_accid")
            });
        }, 60 * 1000);
    }

    // 退出
    static exit() {
        clearTimeout(this.timeoutVal);
        this.timeoutVal = null;
    }
}
class SendServiceMsgRequest extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.data = responseData;
        item.domain = "kaidanbao";
        super(item);
    }

    getUrl() {
        return "/Mini/Im/sendServiceMsg";
    }
}
