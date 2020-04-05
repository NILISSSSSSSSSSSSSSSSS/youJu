import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取城市房价报告
export class GetCityPriceTrend {
    item = new RequestApiItem();
    constructor(responseData) {
        this.item.domain = "kaidanbao";
        this.item = responseData;
    }

    send() {
        return new GetCityPriceTrendRequest(this.item).send()
            // .then((res) => {
            //     return (res.data || {});
            // });
    }
}
class GetCityPriceTrendRequest extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/cityTrendPrice";
    }
}