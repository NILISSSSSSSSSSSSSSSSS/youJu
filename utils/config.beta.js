import {GpsInfoModel} from "../model/GpsInfoModel";
import {UserInfoModel} from "../model/UserInfoModel";


export class Config {
	static env = "beta";
	static mask = false;
	static uuweb = "https://gray.haofang.net";
	static uuhf = "http://hft.51vfang.cn";
	static imKey = "e72da5fe16c17a0d75c593e192ff51ed";
	static kaidanbao = "https://phpkdb.haofang.net";
	static haofang = "http://hft.51vfang.cn";
	// static haofang = "https://gray-www.haofang.net";
	static vr = "http://gray.hftsoft.com";
	static vrWeb = "http://plus.hftsoft.com/vr/index/indexNew";
	static java = "http://uuhf.myfun7.com";
	
	// 真房源web链接
	static realHouseRuleWebUrl = encodeURIComponent(JSON.stringify({
		url: "https://gray.haofang.net/Mini/Active/realHouseRule",
		fromSource: "zdzf"
	}));
	// 操作指南web链接
	static userGuideWebUrl = encodeURIComponent(JSON.stringify({
		url: "https://gray.haofang.net/Mini/App/userGuide",
		fromSource: "zdzf"
	}));
	// 用户协议web链接
	static userAgreementWebUrl = encodeURIComponent(JSON.stringify({
		url: "https://gray.haofang.net/Mini/Html/userAgreement",
		fromSource: "zdzf"
	}));
	// 贷款web链接
	static loanApplyCheckDirectWebUrl = encodeURIComponent(JSON.stringify({
		url: "https://gray.haofang.net/App/Index/loanApplyCheckDirect",
		fromSource: "zdzf"
	}));
	// 首頁0佣金活動
	static homeZeroEntrustMoneyWebUrl = encodeURIComponent(JSON.stringify({
		url: "http://weidian.hftsoft.com/app/zdzf/buyHouseCommission.html"
	}));
	// 装修团购
	static fitmentWebUrl = encodeURIComponent(JSON.stringify({
		url: "https://gray.haofang.net/C/Home/Fitment/index/cityId/"
			+ (new GpsInfoModel().getModel("cityInfo")
				? new GpsInfoModel().getModel("cityInfo").cityId || "" : ""),
		fromSource: "zdzf",
		source: "zdzfApp",
		// 源代码老哥写死的
		youyouUserId: (new GpsInfoModel().getModel("me")
			? new UserInfoModel().getModel("me").userId || "1196941" : "1196941"),
		openFromApp: 2
	}));
}
