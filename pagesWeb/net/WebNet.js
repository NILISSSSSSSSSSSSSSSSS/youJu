import {RequestApi, RequestApiItem} from "../../utils/RequestApi";


// 门店列表
export class GetDeptList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/getDepsList";
    }
}







