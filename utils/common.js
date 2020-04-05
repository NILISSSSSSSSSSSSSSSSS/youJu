

import { DealUserInfo } from "../net/DealUserInfo.js";
import { UserInfoModel } from "../model/UserInfoModel.js";
import { GetUserTelphone } from "../net/GetUserTelphone.js";
import { GetTelephoneInfoFormLogin } from "../net/common/GetTelephoneInfoFormLogin.js";
import { Notification } from "../utils/Notification.js";
import { Notify } from "../utils/Notify.js";
import { GpsInfoModel } from "../model/GpsInfoModel.js";
import { UpUserInfo } from "../net/common/GetSessionKey.js";
import { ImChart } from "../utils/ImChart.js";
import { CheckUserInfo } from "../net/common/CheckUserInfo.js";
import { GetChartDetail } from "../net/im/GetChartDetail.js";
import {CommonModel} from "../model/CommonModel";
import { PostFormId } from "../net/kaidanbao/PostFormId/PostFormId.js";
import {Config} from "./config";
import {DefaultModel} from "../model/DefaultModel";
import {Const} from "./Const";
import {ShareVisitingBehavior} from '../net/ShareVisitingBehavior.js'
import {SaveUserTypeForCclient} from '../net/SaveUserTypeForCclient.js'

// formid初始化
export class InitFormSubmit {
	page = null;

	constructor(page) {
		this.page = page;
		this.page.formSubmit = this.formSubmit.bind(this);
	}

	formSubmit(e) {
		let me = new UserInfoModel().getModel("me") || {};
		if(!me.userId || !me.openId) return;

		if (e.detail && e.detail.formId){
			console.log("收集的formId", e.detail.formId);
			new PostFormId({
				formId: e.detail.formId,
				userId: me.userId,
				openId: me.openId,
				formType: 13,
				formSource: "kdb"
			}).send()
		}
	}
}

export class GetUseInfo {
	static init() {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: function (loginRes) {
					uni.getUserInfo({
						provider: 'weixin',
						withCredentials: true,
						success: function (infoRes) {
							resolve(infoRes);
						},
						fail(err) {
							reject(err);
						}
					});
				},
				fail: function(err) {
					reject(err);
				}
			});
		});
	}
}

// 更新用户信息
class UpDataUserInfo{
	up() {
		let me = new UserInfoModel().getModel("me") || {};
		let userInfo = new UserInfoModel().getModel("userInfo") || {};
		if(!me.userId) {
			return Promise.resolve("暂无用户id");
		}

		if(!userInfo.userInfo) {
			return Promise.resolve("暂无用户信息");
		}

		return new UpUserInfo({userId: me.userId, userInfo: JSON.stringify(userInfo.userInfo)}).send()
			.then(res => {
				// console.log(res);
			});
	}
}

// 更新资料（用于蒙层授权和我的更新）
export class DealUserInfoFromLogin {
	static init(userInfoParams = {}, needNc = true) {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN || H5
			new UserInfoModel().setModel(userInfoParams || {}, "userInfo");
			uni.login({
				provider: 'weixin',
				success: function (loginRes) {
					new DealUserInfo({code:loginRes.code,userInfo: userInfoParams}).send()
						.then(res => {
							let data = res.data || {};
							let me = {openId: data.openId || "", userId: data.userId || ""};
							new UserInfoModel().setModel(me, "me");
							GetTelephoneFormLogin.checkUserInfo(me.userId);
							if(!new UserInfoModel().getModel("me")
								|| !new UserInfoModel().getModel("me").userId
								|| (new UserInfoModel().getModel("me").userId != me.userId)) {
								ImChart.upAccid().then(() => {
									ImChart.initConfig();
								});
							}

							new UpDataUserInfo().up();
							if(needNc) {
								new Notification().postNotification(Notify.UserInfoChanged.Name,
									new UserInfoModel().getModel("userInfo"));
							}
							resolve(me);
						})
						.catch(err => {
							reject(err);
						});
				},
				fail: function(err) {
					reject(err);
				}
			});
			// #endif
		});
	}
}

export class GetUserTel {
	static init(e = {}) {
		let that = this;
		return new Promise((resolve, reject) => {
			if(new UserInfoModel().getModel("telephone")) {
				resolve(that.dealTel(new UserInfoModel().getModel("telephone") || ""));
				return;
			}

			if(e === null) {
				resolve(e);
				return;
			}

			if(Object.keys(e).length === 0 || !e.detail || !e.detail.encryptedData || !e.detail.iv) {
				reject("请传递e信息");
				return;
			}

			that.login()
				.then(loginRes => {
					return new GetUserTelphone({code: loginRes.code,encryptedData: e.detail.encryptedData,iv: e.detail.iv}).send();
				})
				.then(res => {
					if (res.STATUS == 0) {
						uni.showToast({
							text: "获取手机号失败，再试一次",
							icon: "none"
						});
						resolve("");
						return;
					}

					let tel = res && res.DATA ? res.DATA.phoneNumber || "" : "";
					new UserInfoModel().setModel(tel, "telephone");
					resolve(that.dealTel(tel));
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	static dealTel(tel = "") {
		if(tel.length === 11) {
			tel = tel.substr(0, 3) + '****' + tel.substr(7);
		}
		return tel;
	}

	static login() {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: function (loginRes) {
					resolve(loginRes);
				},
				fail: function(err) {
					reject(err);
				}
			});
		});
	}
}

// app启动时调用
export class GetTelephoneFormLogin {
	static init() {
		return new Promise((resolve, reject) => {
			let that = this;
			// #ifdef MP-WEIXIN
			uni.login({
				success: function (loginRes) {
					if(!loginRes || !loginRes.code) {
						reject(loginRes);
						return;
					}

					new GetTelephoneInfoFormLogin({code: loginRes.code}).send()
						.then(res => {
							let data = res.DATA || {};
							if(!res || res.STATUS != 1 || !res.DATA) {
								reject(res);
								return;
							}

							let oleMe = new UserInfoModel().getModel("me") || {};
							let me = {
								openId: data.openId,
								userId: data.userId
							};
							let wxMobile = data.userInfo ? data.userInfo.wxMobile
								|| data.userInfo.WX_MOBILE || "" : "";
							new UserInfoModel().setModel(me, "me");
							new UserInfoModel().setModel(wxMobile, "telephone");
							// 用戶id发生变化时再发送通知和更新im id
							if(!oleMe.userId || oleMe.userId !== me.userId) {
								ImChart.upAccid();
								new Notification().postNotification(Notify.UserInfoChanged.Name);
							}
							resolve(res);
						})
						.catch(err => reject(err));
				},
				fail: function(err) {
					reject(err);
				}
			});
			// #endif

			// #ifdef H5 || APP-PLUS || APP-PLUS-NVUE
			let me = new UserInfoModel().getModel("me") || {};
			if(me.userId) {
				this.checkUserInfo(me.userId)
					.then(res => {
						new Notification().postNotification(Notify.UserInfoChanged.Name);
					});
			}
			// #endif
		});
	}

	static checkUserInfo(userId) {
		return new CheckUserInfo({userId: userId}).send()
			.then(res => {
				let data = res.DATA || {};
				let tel = "";
				do{
					if(res.STATUS != 1) {
						break;
					}

					if(data.WX_MOBILE) {
						tel = data.WX_MOBILE;
						break;
					}

					tel = "";
				}while(false);
				new UserInfoModel().setModel(tel, "telephone");
				let userInfo = new UserInfoModel().getModel("userInfo") || {};
				userInfo = userInfo.userInfo  || {};
				// #ifdef MP-BAIDU
				userInfo["nickName"] = data["NICKNAME_BAIDU"] || userInfo["nickName"] || "";
				userInfo["avatarUrl"] = data["USER_PHOTO_BAIDU"] || userInfo["avatarUrl"] || "";
				// #endif
				// #ifdef MP-ALIPAY
				userInfo["nickName"] = data["NICKNAME_ALI"] || userInfo["nickName"] || "";
				userInfo["avatarUrl"] = data["USER_PHOTO_ALI"] || userInfo["avatarUrl"] || "";
				// #endif
				// #ifdef MP-WEIXIN || H5
				userInfo["nickName"] = data["WX_NICKNAME"] || userInfo["nickName"] || "";
				userInfo["avatarUrl"] = data["WX_PHOTO"] || userInfo["avatarUrl"] || "";
				// #endif
				// #ifdef APP-PLUS || APP-PLUS-NVUE
				userInfo["nickName"] = userInfo["nickName"] || data["WX_NICKNAME"] || "";
				userInfo["avatarUrl"] = userInfo["avatarUrl"] || data["WX_PHOTO"] || "";
				// #endif
				new UserInfoModel().setModel({userInfo: userInfo}, "userInfo");
				return tel;
			});
	}
}

// 在线咨询
export class OnlineChartItem {
	archiveId = "";  // 经纪人id
	caseId = ""; // 房源id
	caseType = "";  // 房源类型
	archiveName = "";  // 经纪人名称
	cityId = "";   // 当前房源的城市id
	reSource = "";  // 当前房源数据来源
}
export class OnlineChart {
	chartItem = new OnlineChartItem();

	constructor(item = new OnlineChartItem()) {
		this.chartItem = item;
	}

	goToPage() {
		let system = uni.getSystemInfoSync()['system'];
		let isIOS = !!(system.indexOf('iOS') > -1);
		let me = new UserInfoModel().getModel("me") || {};
		let url = "/pagesTool/messageDetail/messageDetail";
		uni.navigateTo({
			url: url + '?messageId=' + this.chartItem.archiveId
				+ '&caseId=' + this.chartItem.caseId
				+ '&caseType=' + this.chartItem.caseType
				+ "&userId=" + me.userId + "&openId=" + me.openId
				+ "&name=" + this.chartItem.archiveName
				+ '&cityId=' + this.chartItem.cityId
				+ '&reSource=' + this.chartItem.reSource
		});
	}
}

// 获取星的列表
export class GetStarList {
	starNum = 5;
	maxNum = 5;
	minNum = 3;
	path = "../../";

	constructor(starNum = 5, path = "../../", maxNum = 5, minNum = 3) {
		this.maxNum = maxNum;
		this.minNum = minNum;
		this.starNum = starNum ? Number(starNum) > this.maxNum ? this.maxNum : starNum : starNum;
		this.path = path;
	}

	getGrayUrl(defaultUrl = "") {
		if(defaultUrl) return defaultUrl;

		return "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/house/star_gray.png";
	}

	getHalfUrl() {
		return "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/house/star_harf.png";
	}

	getAllUrl(activeUrl = "") {
		if(activeUrl) return activeUrl;

		return "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/house/star_all.png";
	}

	getList(ziDingYi = false, activeUrl = "", defaultUrl = "") {
		let starNum = this.starNum;
		starNum = Number(starNum);
		starNum = starNum < this.minNum ? this.minNum : starNum;
		let zheng = parseInt(starNum);
		let yu = starNum - zheng;
		let hasHalfStar = false;
		let grayStarNum = 0;
		let starList = [];
		if(yu > 0) {
			hasHalfStar = true;
		}
		for(let i = 1;i<=zheng;i++) {
			starList.push(this.getAllUrl(activeUrl));
		}
		if(hasHalfStar) {
			starList.push(this.getHalfUrl());
		}
		grayStarNum = this.maxNum - starList.length;
		for(let j = 1;j<=grayStarNum;j++) {
			starList.push(this.getGrayUrl(defaultUrl));
		}
		return starList;
	}
}

// 判断是否是iphone x
export class CheckIsIphoneX {
	static init() {
		const res = uni.getSystemInfoSync();
		if(res && res.model && (res.model.indexOf("iPhone X") >= 0 || res.model.indexOf("iPhone10") >= 0)) {
			return true;
		}

		return false;
	}
}

export class formatDate {
	now = "";

	constructor(now) {
		this.now = now;
	}

	getYear() {
		return (this.now.getYear()+1900).toString()
	}

	getMonth() {
		let month = this.now.getMonth()+1;
		return (month<10 ? "0"+month : month.toString());
	}

	getDay() {
		let date = this.now.getDate();
		return (date<10 ? "0"+date : date.toString());
	}

	getHour() {
		let hour = this.now.getHours();
		return (hour<10 ? "0"+hour : hour.toString());
	}

	getMinute() {
		let minute = this.now.getMinutes();
		return (minute<10 ? "0"+minute : minute.toString());
	}

	getSecond() {
		let second = this.now.getSeconds();
		return (second<10 ? "0"+second : second.toString());
	}
}

// 格式化时间
function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n
}
export function formatTimeNew(number = "") {
	if (typeof number === "string") {
		number = number.replace(/-/g, "/");
	}
	let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	let returnArr = [];
	let currentArr = [];

	//当前时间
	let date = new Date();
	let curYear = date.getFullYear();
	let curMonth = formatNumber(date.getMonth() + 1);
	let curDay = formatNumber(date.getDate());
	let curHour = formatNumber(date.getHours());
	let curMin = formatNumber(date.getMinutes());
	let curSec = formatNumber(date.getSeconds());
	//需要格式化的时间
	let targetDate = new Date(number);
	let tarYear = targetDate.getFullYear();
	let tarMonth = formatNumber(targetDate.getMonth() + 1);
	let tarDay = formatNumber(targetDate.getDate());
	let tarHour = formatNumber(targetDate.getHours());
	let tarMin = formatNumber(targetDate.getMinutes());
	let tarSec = formatNumber(targetDate.getSeconds());

	//格式化输出日期
	if (curDay == tarDay && tarHour < 12){
		return '上午 ' + tarHour + ':'+tarMin;
	}

	if (curDay == tarDay && tarHour >= 12){
		return '下午 ' + tarHour + ':' + tarMin;
	}

	if(curDay - tarDay == 1){
		return '昨天 ' + tarHour + ':' + tarMin;
	}

	if (curDay - tarDay == 2) {
		return '前天 ' + tarHour + ':' + tarMin;
	}

	return tarMonth + '月' + tarDay + '日 ' +  tarHour + ':' + tarMin;
}

// 比较大小
export class compare {
	prop = null;
	compareBoolean = true;
	constructor(prop) {
		this.prop = prop;
	}

	init(){
		let prop = this.prop;
		let that = this;
		return function(obj_1,obj_2) {
			let val_1 = obj_1[prop] instanceof Array ? obj_1[prop].length : obj_1[prop];
			let val_2 = obj_2[prop] instanceof Array ? obj_2[prop].length : obj_2[prop];
			if (!isNaN(Number(val_1)) && !isNaN(Number(val_2))) {
				val_1 = Number(val_1);
				val_1 = Number(val_1);
			}
			return that.initSuccess(val_1,val_2);
		}
	}

	initSuccess(val_1, val_2) {
		const eventMap = {
			true: 'maxToMinEvent'
			,false: 'minToMaxEvent'
		};

		return this[eventMap[this.compareBoolean]](val_1, val_2);
	}

	maxToMin() {
		this.compareBoolean = true;
		return this.init();
	}

	minToMax() {
		this.compareBoolean = false;
		return this.init();
	}

	maxToMinEvent(val_1, val_2) {
		if (val_1 > val_2) return -1;

		if (val_1 < val_2) return 1;

		return 0;
	}

	minToMaxEvent(val_1, val_2) {
		if (val_1 < val_2) return -1;

		if (val_1 > val_2) return 1;

		return 0;
	}
}

// 百度设置keywords等信息
export class SetMetaInfo {
	title = "";  // 页面标题
	keywords = "";  // 页面关键字
	description = "";  // 页面描述信息
	releaseDate = this.dealTime();  //  原始发布时间(年-月-日 时:分:秒 带有前导零）
	constructor(title = "", keywords = "", description = "") {
		this.title = title;
		this.keywords = keywords;
		this.description = description;
	}

	dealTime() {
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		let day = date.getDate();
		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();
		month = parseInt(month) < 10 ? "0" + month : month;
		day = parseInt(day) < 10 ? "0" + day : day;
		hour = parseInt(day) < 10 ? "0" + hour : hour;
		minute = parseInt(minute) < 10 ? "0" + minute : minute;
		second = parseInt(second) < 10 ? "0" + second : second;
		return year+'-'+month+'-'+day+'- '+hour+':'+minute+':'+second;
	}

	getYearMonth() {
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		let day = date.getDate();
		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();
		month = parseInt(month) < 10 ? "0" + month : month;
		day = parseInt(day) < 10 ? "0" + day : day;
		hour = parseInt(day) < 10 ? "0" + hour : hour;
		minute = parseInt(minute) < 10 ? "0" + minute : minute;
		second = parseInt(second) < 10 ? "0" + second : second;
		return year+'年'+month+'月';
	}

	init() {
		// #ifdef MP-BAIDU
		if (typeof swan === "undefined") return;

		swan && swan.setPageInfo && swan.setPageInfo({
			title: this.title,
			keywords: this.keywords,
			description: this.description,
			releaseDate: this.releaseDate,
		});
		// #endif
	}

	initDefault() {
		this.title = "悠居客-国内领先的二手房、租房、新房房产网站";
		this.keywords = "新房,二手房,租房,公寓,悠居客";
		this.description =  "悠居客，作为国内领先的房产网站，为您提供新房、二手房、租房、公寓等海量的房源信息，满足您多元化的查询、购房的需求。悠居客，想你所想。免费找好房，就上悠居客！";
		this.releaseDate = this.dealTime();
		this.init();
	}

	initHome() {
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let cityName = cityInfo.cityName || "";
		if(!cityName) return;

		this.title = "【" + cityName + "房产网】 " + cityName + "房产信息网 - " + cityName + "悠居客";
		this.keywords = cityName + "房产网," + cityName + "房产信息网";
		this.description =  cityName + "悠居客提供真实的租房、二手房、整租、公寓等" + cityName + "房产信息，"
			+ "及时的房地产新闻资讯，每日实时更新全城数千中介公司上万经纪人最新挂牌的租售房源，"
			+ "免费查询" + cityName + "房产信息，就到" + cityName + "悠居客。";
		this.releaseDate = this.dealTime();
		this.init();
	}

	// 列表
	initErHouseList() {
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let cityName = cityInfo.cityName || "";
		if(!cityName) return;

		this.title = "【" + cityName + "二手房网|" + cityName + "二手房出售|" + cityName + "二手房买卖信息】- " + cityName + "悠居客";
		this.keywords = `${cityName}二手房网,${cityName}二手房出售,${cityName}二手房买卖信息`;
		this.description = `悠居客${cityName}二手房网为您提供2019年03月的${cityName}二手房出售、${cityName}二手房价格以及${cityName}二手房买卖信息,为您的二手房购房保驾护航。`;
		this.releaseDate = this.dealTime();
		this.init();
	}

	initNewHouseList() {
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let cityName = cityInfo.cityName || "";
		if(!cityName) return;

		this.title = `【${this.getYearMonth()}${cityName}新开盘楼盘房价|${cityName}新房出售|${cityName}新楼盘现房】 - ${cityName}悠居客`;
		this.keywords = `${cityName}新开盘楼盘房价,${cityName}新房出售,${cityName}新楼盘现房,${cityName}悠居客`;
		this.description = `${cityName}悠居客新房网提供2019年03月${cityName}新开楼盘、${cityName}新房出售、新楼盘现房以及新楼盘房价等最新信息.选新房、查看新开楼盘信息、了解${cityName}新房出售流程就上${cityName}悠居客新房网。`;
		this.releaseDate = this.dealTime();
		this.init();
	}

	initLeaseHouseList() {
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let cityName = cityInfo.cityName || "";
		if(!cityName) return;

		this.title = `【${cityName}租房价格|${cityName}租房网|${cityName}租房信息】- ${cityName}悠居客`;
		this.keywords = `${cityName}租房价格,${cityName}租房网,${cityName}租房信息,${cityName}悠居客`;
		this.description = `${cityName}悠居客租房网为${cityName}租户提供免中介费租房、押一付一租房等相关租房信息，房源真实、实时更新，租房子就到${cityName}租房网。`;
		this.releaseDate = this.dealTime();
		this.init();
	}

	initAparmentList() {
		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
		let cityName = cityInfo.cityName || "";
		if(!cityName) return;

		this.title = `【${cityName}公寓出租|${cityName}租房信息|${cityName}青年公寓租金】- ${cityName}悠居客`;
		this.keywords = `${cityName}公寓出租,${cityName}租房信息,${cityName}青年公寓租金`;
		this.description = `${cityName}悠居客单身公寓出租网提供2019年03月最新的${cityName}公寓出租、${cityName}公寓短租价格、${cityName}单身公寓免押金以及${cityName}公寓租金的最新信息,租单身公寓就上${cityName}悠居客.`;
		this.releaseDate = this.dealTime();
		this.init();
	}
}

// 分享自定义
export class ShareAppMessage {
	title = "悠居客,便宜找好房";
	des = "直连316城5万店真房源系统，找好房、找好经纪人，到子弹找房";
	path = "";
	imageUrl = "";
	
	constructor(path = "", title = "", des = "", imageUrl) {
		if(title) {
			this.title = title;
		}
		if(des) {
			this.des = des;
		}
		if (des === null) {
			this.des = "";
		}
		if(path) {
			this.path = path;
		}
		if(imageUrl) {
			this.imageUrl = imageUrl;
		}
	}
	
	init(callback = function() {}) {
		let obj = {
			title: this.title,
		};
		if (this.des) {
			obj.desc = this.des
		}
		if (this.path) {
			obj.path = this.path;
		}
		if (this.imageUrl) {
			obj.imageUrl = this.imageUrl;
		}
		obj.success = function(res) {
			console.error(11111111);
			callback(res)
		};
		obj.fail = function (err) {
			console.error(2222222222);
		};
		return obj;
	}
}

// C端用户判断
export class handleUserInfo {
	IfExistUser(){


		// #ifdef H5
		if(!userId){

		}
		// #endif
	}
}

// 在线客服
export class OnlineServicePageTo {
	path = "/pagesTool/messageDetail/messageDetail";
	serviceId = ImChart.getServiceId();
	userId = "";
	openId = "";
	serviceName = "专属客服";

	constructor(path = "", serviceId = "", userId = "", openId = "", serviceName = "") {
		let me = new UserInfoModel().getModel("me") || {};
		this.userId = me.userId || "";
		this.openId = me.openId || "";
		// #ifdef MP-BAIDU || MP-ALIPAY || MP-TOUTIAO || MP-QQ
		this.path = "/pagesTool/messageDetailH5/messageDetailH5";
		// #endif
		if(path) {
			this.path = path;
		}
		if(serviceId) {
			this.serviceId = serviceId;
		}
		if(userId) {
			this.userId = userId;
		}
		if(openId) {
			this.openId = openId;
		}
		if(serviceName) {
			this.serviceName = serviceName;
		}
	}

	go() {
		uni.navigateTo({
			url: this.path + "?messageId=" + this.serviceId
				+ "&name=" + this.serviceName
				+ "&userId=" + this.userId
				+ "&openId=" + this.openId
		});
	}
}

// 返回月日
export class GetMonthDay {
	formatNumber(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}

	init(date) {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		return this.formatNumber(month) + '月' + this.formatNumber(day) + '日'
	}
}

// 获取/处理cityId 根据number => 字母
export class GetCityMap {
	constructor() {}

	getMap() {
		// 过期时间 1天
		let expireTime = new CommonModel().getModel("cityMapJsonExpireTime") || 0;
		if (expireTime >= new Date().getTime() && new CommonModel().getModel("cityMapJson")) {
			return Promise.resolve(new CommonModel().getModel("cityMapJson"));
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url: "https://cdn.haofang.net/static/uuminiapp/cityMap.json",
				success(res) {
					if (res.data) {
						new CommonModel().setModel(res.data, "cityMapJson");
						new CommonModel().setModel(new Date().getTime() + 24*60*60*1000
							, "cityMapJsonExpireTime");
					}
					resolve(res.data || {});
				},
				fail(err) {
					reject(err);
				}
			})
		});
	}

	// cityKey => cityId对应的英文简写，例如成都 = cd
	getCityId(cityKey = "", callback = function () {}) {
		// #ifdef MP-BAIDU
		if(!isNaN(cityKey)) {
			callback(cityKey);
			return;
		}

		return this.getMap()
			.then(map => {
				callback(map[cityKey] || "");
			});
		// #endif

		// #ifndef MP-BAIDU
		callback(cityKey);
		// #endif
	}

	getCityKey(cityId = "") {
		if (!cityId) {
			return Promise.resolve("cd");
		}

		return this.getMap()
			.then(map => {
				map = map || {};
				let newMap = new Map();
				for (let key in map) {
					newMap.set(map[key], key);
				}
				if (!newMap.has(cityId)) {
					return "cd";
				}

				return newMap.get(cityId);
			});
	}
}

// 判断是否聊过天
export class ImChartDealDeal {
	haveChart = false;  // 是否有聊天

	getUserId() {
		let me = new UserInfoModel().getModel("me") || "";
		return (me.userId || "");
	}

	getAccid() {
		return (new UserInfoModel().getModel("accid") || "");
	}

	// 判断是否和某个经纪人有聊天  return boolean
	checkHaveChart(archiveId) {
		let that = this;
		return new Promise((resolve, reject) => {
			let userId = that.getUserId();
			let accid = that.getAccid();
			if (!userId || !archiveId || !accid) {
				that.haveChart = true;
				resolve(true);
				return;
			}

			new GetChartDetail({from: accid,to: archiveId}).send()
				.then(res => {
					if (!res || res.length === 0) {
						that.haveChart = false;
						resolve(false);
						return;
					}

					that.haveChart = true;
					resolve(true);
				})
				.catch(err => {
					that.haveChart = true;
					resolve(true);
				});
		});
	}
}


// 判斷是否需要清楚所有缓存并进入到首页（域名切换的时候使用）
export class ClearStorageIntoHomePage {
	env = Config.env;  // 当前环境

	constructor() {
		this.init();
	}

	init() {
		let agoEnv = new CommonModel().getModel("env") || this.env;
		new CommonModel().setModel(this.env, "env");
		if(agoEnv !== this.env) {
			new DefaultModel().clearModel();
			uni.showModal({
				title: "温馨提示",
				content: "小程序环境改变，请重新进入",
				showCancel: false,
				confirmText: "我知道了",
				confirmColor: "#ab7f2e",
				success() {
					uni.reLaunch({
						url: "/pages/index/index"
					});
				}
			});
		}
	}
}

// 上传文件
export class UploadFile {
	filePath = "";
	url = "";
	name = "";
	fileType = "";
	constructor(filePath, url = Config.uuweb + "/Mini/App/uploadFile", name = "file",
				fileType = "image") {
		this.filePath = filePath;
		this.url = url;
		this.name = name;
		this.fileType = fileType;
	}

	send() {
		return new Promise((resole, reject) => {
			uni.uploadFile({
				url:  this.url,
				filePath: this.filePath,
				name: this.name,
				'content-type': 'multipart/form-data',
				complete: function (res) {
					let info = {};
					// #ifdef MP-BAIDU
					info = res.data;
					// #endif
					// #ifndef MP-BAIDU
					info = JSON.parse(res.data);
					// #endif
					if(info.DATA === undefined && info.data) {
						info.DATA = info.data;
					}
					if(info.code && info.code === Const.success
						&& (info.STATUS === undefined || info.status === undefined)) {
						info.STATUS = 1;
						info.status = 1;
					}
					if(info.code && info.code === Const.success
						&& (info.ERROR_CODE === undefined)) {
						info.ERROR_CODE = 0;
					}
					if(info.code && info.code === Const.success
						&& (info.errCode === undefined)) {
						info.errCode = Const.success;
					}
					if (info.msg) {
						info.INFO = info.msg;
					}
					info.data = !info.DATA ? info.data || []
						: info.DATA.data || [];
					resole(info);
				}
			})
		});
	}
}

// 微店统计数据采集接口
export class ShareVisiting {
	behavior (dataObj) {
		console.log(dataObj, '微店统计数据采集data');
		if (!dataObj.cUserId || !dataObj.archiveId) { return Promise.reject() }

		return new ShareVisitingBehavior(dataObj).send();
	}
}

/**
 * C端用户类型的采集接口（ 区分平台客户 / 私有客户）--2019 - 11 - 12 抢单优化
 * @param {*} dataObj  archiveId 经纪人档案id; cUserId C端用户id; sourceType 1 = 平台， 2 = 私有
 */
export class SaveCclientUserType {
	behavior (dataObj) {
    if (!dataObj || !dataObj.archiveId || !dataObj.sourceType) return Promise.reject();
    let me = new UserInfoModel().getModel("me") || "";
    let userId = me.userId  || ""
    if (!userId) return Promise.reject();
    dataObj['cUserId'] = userId;
    console.log(dataObj, 'C端用户类型的采集接口（区分平台客户/私有客户）data')

		return new SaveUserTypeForCclient(dataObj).send();
	}
}


/**
 * 获取页面路径相关
 */
export class CurrentPages{
  //获取当前页面路径
  /**@param  {Boolean} hasOption  是否需要携带参数 */
  getCurFullPath(hasOption = false){
    let pages = getCurrentPages();
    if (pages.length == 0) return '';
    let curPages = {
      route: pages[pages.length - 1].route,
      options: pages[pages.length - 1].options,
    };
    if (!hasOption) return curPages.route

    let curPageUrl = this.buildUrl(curPages.route, curPages.options);
    return '/' + curPageUrl
  }

  buildUrl(url, obj) {
     if(this.isString(url)||this.isObject(obj)){
        let serializedParams = this.paramSerializer(obj)
        serializedParams = decodeURIComponent(serializedParams)
        if (serializedParams.length > 0) {
        url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
        }
        return url
    }else{
        console.log('检查参数是否传递正确？')
        return ''
    }
  }

  /**
	 * 判断某个元素是否为字符串
	 * @param  {String}  value
	 * @return {Boolean}
	 */
  isString(value) {
    return typeof value === 'string'
  }

  /**
	 * 判断某个元素是否为对象
	 * @param  {Obejct}  value
	 * @return {Boolean}
	 */
  isObject(value) {
    return value !== null && typeof value === 'object'
  }

  /**
	 * 判断某个元素是否为undefined
	 * @param  {undefined}  value
	 * @return {Boolean}
	 */
  isUndefined(value) {
    return typeof value === 'undefined'
  }

  /**
	 * 编码URI
	 * @param  {String} value
	 * @param  {String} pctEncodeSpaces
	 * @return {String}
	 */
  encodeUriQuery(value, pctEncodeSpaces) {
    return encodeURIComponent(value)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
  }

  	/**
	 * 判断某个元素是否为日期
	 * @param  {Date}  value
	 * @return {Boolean}
	 */
  isDate(value) {
    return this.type(value) === '[object Date]'
  }

  /**
	 * 判断某个元素是否为数组
	 * @param  {Array}  value
	 * @return {Boolean}
	 */
  isArray(value) {
    return Array.isArray(value)
  }

  /**
	 * 返回序列化的值
	 * @param  {String} value
	 * @return {String}
	 */
  serializeValue(value) {
    if (this.isObject(value)) return this.isDate(value) ? value.toISOString() : this.toJson(value)
    return value
  }

  /**
	 * 对象序列化
	 * @param  {Object} obj
	 * @return {String}
	 */
  paramSerializer(obj) {
    if (!obj) return ''
    let that = this
    let parts = []
    for (let key in obj) {
      const value = obj[key]
      if (value === null || that.isUndefined(value)) return
      if (that.isArray(value)) {
        value.forEach(function (v) {
          parts.push(that.encodeUriQuery(key) + '=' + that.encodeUriQuery(that.serializeValue(v)))
        })
      } else {
        parts.push(that.encodeUriQuery(key) + '=' + that.encodeUriQuery(that.serializeValue(value)))
      }
    }
    return parts.join('&')
  }

}
