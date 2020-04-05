import {RequestApi, RequestApiItem} from "../utils/RequestApi";
import {CommonModel} from "../model/CommonModel";

// 房源筛选列表接口
// 处理数据，存入缓存 4h
export class GetScreenList{
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

        return new GetScreenListRequest(this.responseData).send()
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
class GetScreenListRequest extends RequestApi{
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


// 新房筛选列表接口
export class GetNewScreenList extends RequestApi{
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
