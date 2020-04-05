import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 获取城市信息根据gps
export class GetCityInfoByGps extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getCityIdByLocation";
    }
}
