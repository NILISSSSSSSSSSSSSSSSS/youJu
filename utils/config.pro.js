import {GpsInfoModel} from "../model/GpsInfoModel";
import {UserInfoModel} from "../model/UserInfoModel";


export class Config {
	static env = "pro";
	static mask = true;
	static uuweb = "https://zdzfapi.haofang.net";
	static uuhf = "https://uuhf.haofang.net";
	static imKey = "bbfa3e3f827bfb19d81b0197adb91758";
	static kaidanbao = "https://zdzf.haofang.net";
	static haofang = "https://uu.haofang.net";
	static vr = "https://public.haofang.net";
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
	url: "https://zdzfapi.haofang.net/App/Index/commissionAllBackActivity?fromType=zdzf"
  }));

	// 装修团购
	static fitmentWebUrl = encodeURIComponent(JSON.stringify({
		url: "https://zdzfapi.haofang.net/C/Home/Fitment/index/cityId/"
			+ (new GpsInfoModel().getModel("cityInfo")
				? new GpsInfoModel().getModel("cityInfo").cityId || "" : ""),
		fromSource: "zdzf",
		source: "zdzfApp",
		// 源代码老哥写死的
		youyouUserId: (new UserInfoModel().getModel("me")
			? new UserInfoModel().getModel("me").userId || "1196941" : "1196941"),
		openFromApp: 2
	}));
}
