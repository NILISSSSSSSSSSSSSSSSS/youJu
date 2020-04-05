import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 地图找房
class GetMpaFindHouseApi extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/mapFindHouseAction";
    }
}
export class GetMpaFindHouse {
    constructor(request = {}) {
        this.request = request;
    }

    send() {
        return new GetMpaFindHouseApi(this.request).send()
            .then(res => {
                res = res || {};
                res.data = res.data || {};
                if (res.DATA) {
                    res.data = res.DATA.DATA || {};
                }
                return res;
            })
    }
}
