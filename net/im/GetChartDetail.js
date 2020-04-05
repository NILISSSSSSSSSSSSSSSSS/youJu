import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 聊天详情
class GetChartDetailApi extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/im/history";
    }
}
export class GetChartDetail {
    constructor(request = {}) {
        this.request = request;
    }

    send() {
        return new GetChartDetailApi(this.request).send()
            .then(res => {
                return {
                    data: (res || [])
                }
            })
    }
}
