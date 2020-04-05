import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取约看信息
export class GetLookHouseInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/orderSee/getMakeHouseSchedule";
    }
}

// 关联用户
export class RelationMakeHouseSchedule extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/orderSee/relationMakeHouseSchedule";
    }
}

// 获取带看信息
export class GetTakeLookInfo extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/orderSee/getTakeHouseSchedule";
    }
}

// 创建带看评价信息
export class CreateWxTakeLookHouseEvaluate extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/orderSee/createWxTakeLookHouseEvaluate";
    }
}

// 查询带看评价信息
export class GetWxTakeLookHouseEvaluate extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/mini/orderSee/getWxTakeLookHouseEvaluate";
    }
}
