
import {HouseShareRecord} from "../net/CompStoreNet";
import {GpsInfoModel} from "../../model/GpsInfoModel";
import {UserInfoModel} from "../../model/UserInfoModel";


/**
 * 掌通分享统计 #9872
 * 用户ERP内统计埋点
 * source //1=微店，2=房源链接，3=快消海报，4=楼书，5=抢单，6=优惠券
 *
 * classType :
 *    来源微店的情况， 分享到微信好友1 = 有公司微店并且开通小程序， 2 = 有公司微店并且没有开通微店小程序， 3 = 未开通微店并且是优优加盟店， 4 = 未开通微店并且不是优优加盟。 来源微店的情况分享到朋友圈： 5 = 有公司微店， 6 = 无公司微店;
 来源房源链接的情况： 1 = 二手房详情页面分享， 2 = 房源推广页面入口分享;
 来源快销海报的情况： 1 有公司微店并且开通了小程序， 2 = 有公司微店并且没有开通小程序， 3 = 未开通微店;
 其他来源只有只有一种情况的传1
 */
export class ShareRecord {
    params = {};

    // params = {archiveId: archiveId,
    // 			source: 1, //1:掌通微店分享
    // 			classType: 4 //4 = 一、进入 最新优选好房小程序 - 旗舰店;}
    constructor(params = {}) {
        this.params = params;
        this.init();
    }

    init() {
        if(!this.params || !this.params.archiveId) return;

        if(!new UserInfoModel().getModel("me") || !new UserInfoModel().getModel("me").userId) return;

        let basicParams = {
            'cityId': this.params.cityId || (new GpsInfoModel().getModel("cityInfo")
                ? new GpsInfoModel().getModel("cityInfo").cityId || "" : "") ,
            'youyouUserId': new UserInfoModel().getModel("me")
                ? new UserInfoModel().getModel("me").userId || "" : "",
        };
        basicParams = Object.assign(basicParams, this.params);
        new HouseShareRecord(basicParams).send();
    }
}