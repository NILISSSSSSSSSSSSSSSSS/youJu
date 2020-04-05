import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 获取用户行为统计
class GetUserBehaviorApi extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBehaviorConfig";
    }
}

export class GetUserBehavior {
    constructor(request = {}) {
        this.request = request;
    }

    send() {
        return new GetUserBehaviorApi(this.request).send()
            .then((res) => {
                if (res.errCode !== 200) return Promise.reject(res);

                return {data: (res.data ? res.data.resultList || [] : [])};
            });
    }
}