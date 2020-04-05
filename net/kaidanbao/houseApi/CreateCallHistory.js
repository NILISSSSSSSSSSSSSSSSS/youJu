import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";

// 创建拨打记录
// 1语音拨打 2直拨 3IP拨打 4;400拨打 5:IM聊天 其中1语音拨打 3IP拨打小程序不行
export class CreateCallHistory extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/createCallHistory";
    }
}