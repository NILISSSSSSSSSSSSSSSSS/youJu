/**
 * 掌通分享统计 #9872
 * 用户ERP内统计埋点
 * source //1=微店，2=房源链接，3=快消海报，4=楼书，5=抢单，6=优惠券
 * 
 * classType :
 *    来源微店的情况， 分享到微信好友1 = 有公司微店并且开通小程序， 2 = 有公司微店并且没有开通微店小程序，
	  3 = 未开通微店并且是优优加盟店， 4 = 未开通微店并且不是优优加盟。 来源微店的情况分享到朋友圈： 
	  5 = 有公司微店， 6 = 无公司微店;
      来源房源链接的情况： 1 = 二手房详情页面分享， 2 = 房源推广页面入口分享;
      来源快销海报的情况： 1 有公司微店并且开通了小程序， 2 = 有公司微店并且没有开通小程序， 3 = 未开通微店;
      其他来源只有只有一种情况的传1
*/

import { ErpHouseShareRecord } from "@/net/common/ErpHouseShareRecord.js";
import { GpsInfoModel } from "@/model/GpsInfoModel.js";
import { UserInfoModel } from "@/model/UserInfoModel.js";

export class ErpShareRecord {
	send(archiveId = "", source = "", classType = "") {
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let me = new UserInfoModel().getModel("me") || {};
		if(!archiveId || !me.userId || !cityInfo.cityId || !source || !classType) {
			return;
		}
		
		let request = {
			cityId: cityInfo.cityId,
			youyouUserId: me.userId,
			archiveId: archiveId,
			source: source,
			classType: classType
		};
		new ErpHouseShareRecord(request).send();
	}
}