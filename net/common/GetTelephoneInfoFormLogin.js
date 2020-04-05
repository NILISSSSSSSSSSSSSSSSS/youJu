import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 用户电话
export class GetTelephoneInfoFormLogin extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/getSecretInfoNew";
    }
}