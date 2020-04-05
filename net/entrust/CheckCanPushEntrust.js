import {RequestApi, RequestApiItem} from "../../utils/RequestApi";
import { GpsInfoModel } from "../../model/GpsInfoModel.js";
import { UserInfoModel } from "../../model/UserInfoModel.js";

// 判断是否能够发委托
export class CheckCanPushEntrust extends RequestApi{
    constructor(responseData = {}) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let me = new UserInfoModel().getModel("me") || {}; 
		if(!responseData["cityId"]) {
			responseData["cityId"] = cityInfo.cityId || "";
		}
		if(!responseData["youyouUserId"]) {
			responseData["youyouUserId"] = me.userId || "";
		}
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/requestRepeatAction";
    }
}
