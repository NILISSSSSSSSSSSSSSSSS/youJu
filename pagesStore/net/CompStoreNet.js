import {RequestApi, RequestApiItem} from "../../utils/RequestApi";
import {CommonModel} from "../../model/CommonModel";


// 掌通房源房源分享记录
export class HouseShareRecord extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/houseShareRecord";
    }
}

// 获取旗舰店的请求参数
export class Jscode2Session4FlagShipStore extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/jscode2Session4FlagShipStore";
    }
}

// 保存旗舰店的请求参数
export class SaveUserConfig extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/saveUserConfig";
    }
}

// 获取旗舰店配置
export class GetCompStoreConfig extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/initBasicParameter";
    }
    }

// 获取首页数据
export class GetCompStoreHomeData extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/getIndexData";
    }
}

// 埋点
export class ReceiveUserBehavior extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.method = "post";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/index/receiveUserBehavior";
    }
}

// 实时统计
export class AccessStatistics extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.method = "post";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/Statistical/accessStatistics";
    }
}

// 获取新房列表
export class GetCompNewBuildList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getNewBuildList";
    }
}

// 获取新房列表(金科专用)
export class GetJinKeNewBuildList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/getNewHouseList";
    }
}

// 行政区域
// 处理数据，存入缓存 4h
export class InitLocalStorage{
    responseData = {};

    constructor(responseData) {
        this.responseData = responseData;
    }

    send() {
        let initLocalStorageMap = new CommonModel().getModel("initLocalStorage") || {};
        // 过滤掉过期的缓存
        let newInitLocalStorageMap = {};
        for (let key in initLocalStorageMap) {
            if (initLocalStorageMap[key]
                && initLocalStorageMap[key].expireTime
                && initLocalStorageMap[key].expireTime >= new Date().getTime()) {
                newInitLocalStorageMap[key] = initLocalStorageMap[key];
            }
        }
        new CommonModel().setModel(newInitLocalStorageMap, "initLocalStorage");
        if (this.responseData.cityId && newInitLocalStorageMap[this.responseData.cityId]) {
            return Promise.resolve(newInitLocalStorageMap[this.responseData.cityId]);
        }

        return new InitLocalStorageRequest(this.responseData).send()
            .then(res => {
                res.expireTime = new Date().getTime() + 4 * 60 * 60 * 1000;
                if(this.responseData.cityId) {
                    newInitLocalStorageMap[this.responseData.cityId] = res;
                }
                new CommonModel().setModel(newInitLocalStorageMap, "initLocalStorage");
                return res;
            });
    }
}
class InitLocalStorageRequest extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/initLocalStorage";
    }
}

// 获取新房筛选条件
export class GetNewBuildListCondition extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getNewBuildListCondition";
    }
}

// 获取二手房和租房列表
export class GetSecondHouseListAction extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuhf";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/uuhfWeb/secondHouseManager/getSecondHouseListAction";
    }
}

// 来自B端的邀请客户(新版真房源分享)
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

// 微店推送消息
export class PushViewMsgStore extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/pushViewMsgStore";
    }
}

// 查询合同状态
export class QueryContract extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "uuweb";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/FlagshipStore/queryContract";
    }
}







