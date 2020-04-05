import {RequestApi, RequestApiItem} from "../utils/RequestApi";

// 城市列表
export class GetAllCityList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/cityList";
    }
}
