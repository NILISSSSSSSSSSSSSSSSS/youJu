import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 公寓详情
export class GetApartmentDetail extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getApartmentInfo";
    }
}
