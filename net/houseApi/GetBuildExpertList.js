import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取小区专家列表
export class GetBuildExperList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBuildOwnerInfo";
    }
}
