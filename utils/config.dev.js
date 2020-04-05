import {GpsInfoModel} from "../model/GpsInfoModel";
import {UserInfoModel} from "../model/UserInfoModel";


export class Config {
	static env = "dev";
	static mask = false;
	static uuweb = "http://plus.hftsoft.com";
	static uuhf = "http://dev.51vfang.cn";
	static imKey = "e72da5fe16c17a0d75c593e192ff51ed";
	static kaidanbao = "http://plus.hftsoft.com";
	static haofang = "http://dev.51vfang.cn";
	static vr = "http://vr.hftsoft.com";
	static vrWeb = "http://plus.hftsoft.com/vr/index/indexNew";
	static java = "http://uuhf.myfun7.com";
	
	// 真房源web链接
	static realHouseRuleWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://plus.hftsoft.com/Mini/Active/realHouseRule",
		fromSource: "store"
	}));
	// 操作指南web链接
	static userGuideWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://plus.hftsoft.com/Mini/App/userGuide",
		fromSource: "store"
	}));
	// 用户协议web链接
	static userAgreementWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://plus.hftsoft.com/Mini/Html/userAgreement",
		fromSource: "store"
	}));
	// 贷款web链接
	static loanApplyCheckDirectWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://plus.hftsoft.com/App/Index/loanApplyCheckDirect",
		fromSource: "store"
	}));
	// 佣金全返活动
	static homeZeroEntrustMoneyWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://plus.hftsoft.com/App/Index/commissionAllBackActivity",
		fromSource: "store",
		code: "uniapp",
	}));
	// 装修团购
	static fitmentWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://plus.hftsoft.com/C/Home/Fitment/index/cityId/"
			+ (new GpsInfoModel().getModel("cityInfo")
				? new GpsInfoModel().getModel("cityInfo").cityId || "" : ""),
		fromSource: "store",
		source: "zdzfApp",
		// 源代码老哥写死的
		youyouUserId: (new UserInfoModel().getModel("me")
			? new UserInfoModel().getModel("me").userId || "1196941" : "1196941"),
		openFromApp: 2
	}));
}
