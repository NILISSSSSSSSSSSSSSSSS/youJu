import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 委托跟进数据
export class GetEntrustTrack extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/My/getUUHouseTrackInfos";
    }
}
