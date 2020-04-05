import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 来自B端的邀请客户（新版真房源分享）
export class StimulerBroker extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/Active/stimulerBroker";
    }
}

// 咨询业主
export class GetAesEncrypt extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/othenBiz/otherBizController/getAesEncrypt";
    }
}

// 详情根据deptId换成adminDeptId
export class GetAdminDeptIdByErpDeptId extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/getAdminDeptIdByErpDeptId";
    }
}

