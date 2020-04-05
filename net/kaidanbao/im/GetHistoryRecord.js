import {RequestApi, RequestApiItem} from "@/utils/RequestApi";

// 获取聊天历史记录 开单豹项目
export class GetHistoryRecord extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/im/history";
    }
}
