import {RequestApi, RequestApiItem} from "../../../utils/RequestApi";


export class GetQuerBuildTrend extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/house/querBuildTrend";
    }
}
