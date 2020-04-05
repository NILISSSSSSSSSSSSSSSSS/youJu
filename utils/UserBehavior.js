import { GetUserBehavior } from "../net/GetUserBehavior.js"; // 获取用户行为统计
import { SaveUserBehavior } from "../net/SaveUserBehavior.js"; // 保存用户行为
import { UserBehaviorModel } from "../model/UserBehaviorModel.js";
import { BehaviorPageConfigModel } from "../model/BehaviorPageConfigModel.js";
import { GpsInfoModel } from "../model/GpsInfoModel.js";
import { UserInfoModel } from "../model/UserInfoModel.js";
import { InitEnterStoreCount } from "../net/InitEnterStoreCount.js"; // 初始化统计次数
import { StoreCountModel } from "../model/StoreCountModel.js";

// 进入时间储存
class TimeMap {
	static map = new Map();

	static setTime(id, time) {
		if (time === undefined) {
			time = new Date().getTime();
		}
		this.map.set(id, time);
	}

	static getTime(id) {
		let time = 0;
		if (this.map.has(id)) {
			time = this.map.get(id);
		}
		return time;
	}

	// 获取停留时间
	static getInterval(id) {
		let currentTime = new Date().getTime();
		let secondTime = parseInt(currentTime - this.getTime(id)); // 毫秒
		secondTime = parseInt(secondTime / 1000); // 秒
		return this.formData(secondTime)
	}

	// secondTime 单位是秒， 返回转化后的时间
	static formData(secondTime) {
		let minuteTime = 0; // 分
		let hourTime = 0; // 小时
		if (secondTime > 60) {
			minuteTime = parseInt(secondTime / 60);
			secondTime = parseInt(secondTime % 60);
			if (minuteTime > 60) {
				hourTime = parseInt(minuteTime / 60);
				minuteTime = parseInt(minuteTime % 60);
			}
		}
		let result = "" + parseInt(secondTime);
		if (minuteTime > 0) {
			result = "" + parseInt(minuteTime) + "分" + result;
		}
		if (hourTime > 0) {
			result = "" + parseInt(hourTime) + "小时" + result;
		}
		return result;
	}
}

// 数据储存,不会存放到缓存，只在当前页面有效
class DataLocalMap {
	static map = new Map();

	static setVal(id, val) {
		this.map.set(id, val);
	}

	static getVal(id) {
		return this.map.has(id) ? this.map.get(id) : null;
	}
}


// 微店相关的 behaviorType：[ 0, 1, 4, 5, 6 ]
// 房源相关的 behaviorType：[ 2, 3, 7, 8, 9 ]

// 房源相关的接口params类型
export class HouseDetailParamsItem {
	behaviorType = ""; // 行为类型 (不用传 底层实现)
	intentionalityScore = ""; // 意向行为分数 (不用传 底层实现)
	cUserId = ""; // c端用户id (不用传 底层实现)
	shareArchiveId = ""; // 分享经济人id  (新房用这个)
	ownerArchiveId = ""; //所属人id 
	cityId = ""; // 城市ID (不传的话则使用定位城市的id)
	behaviorContent = ""; // 行为内容 (不用传 底层实现)
	sourceType = 3; // 1 : 个人微店  2： 小程序 3: 子弹找房
	caseId = ""; // 房源id
	caseType = ""; // 房源类型 1：二手房 9: 新房？ 4: 合租？
	intentionalityRegionName = ""; // 区域名称
	intentionalityRoom = ""; // 房子的户型  例如：3室
	intentionalityHousePrice = ""; // 房源总价
	priceUnit = ""; // 单价  (新房用这个)
	cacheKeyTime = ""; // 暂时不知道 (不用传 底层实现)
	cacheKey = ""; // 暂时不知道 (不用传 底层实现)
	behaviorNickName = ''; // 行为人昵称
	behaviorStyle = ''; //  行为分类
}

// 行为统计次数的参数
class StoreCountConfig {
	inStoreCount = 0; // 统计次数
	inStoreResidenceTime = ""; // 时间
	inStoreShareCount = 0; // 分享次数 
}


export class UserBehavior {
	// 推出小程序时需要处理的key
	static leaveKeys = ["inStoreTime", "inDetailTime"]

	constructor() {

	}

	// 用户行为列表, Map对象的格式返回
	static getBehaviorList() {
		return new Promise((resolve, reject) => {
			if (new UserBehaviorModel().getModel()) {
				resolve(new UserBehaviorModel().getModel());
				return;
			}

			new GetUserBehavior().send()
				.then(res => {
					let list = res ? res.data || [] : [];
					let behaviorMap = {};
					for (let item of list) {
						if (!item.groupType || item.groupType != 13) continue;

						if (item.behaviorType === undefined) continue;

						behaviorMap[item.behaviorType] = item;
					}
					
					// console.error("---用户行为文案 behaviorMap----", behaviorMap);
					
					new UserBehaviorModel().setModel(behaviorMap);
					resolve(behaviorMap);
				})
				.catch(err => {
					resolve(new Map());
				});
		});
	}

	// 获取某个类型的行为item, 参数 behaviorType：0，1，2等
	// 返回格式：Map对象 || null
	static getBehavior(behaviorType) {
		return new Promise((resolve, reject) => {
			this.getBehaviorList()
				.then((res) => {
					// console.error(res,"行为文案");
					if (behaviorType === undefined) {
						resolve(null);
						return;
					}

					behaviorType = Number(behaviorType);
					let item = res && res[behaviorType] ? res[behaviorType] || null : null;
					resolve(item);
				});
		});
	}


	// 退出小程序
	static leave() {
		// 推出小程序时需要处理的key
		let pageInfo = new BehaviorPageConfigModel().getModel();
	}

	// 获取行为统计的接口请求params
	// 会返回对应的接口返回参数
	// 已弃用
	static getBehaviorParams(behaviorType) {
		let behaviorItem = this.getBehavior(behaviorType);
		// console.error("---用户行为统计次数 behaviorItem---", behaviorItem);
		let cityId = new GpsInfoModel().getModel("cityInfo") ? new GpsInfoModel().getModel("cityInfo").cityId || "" : "";
		let cUserId = "25157"
		let behaviorContent = "";

		let paramsObj = {};
		let defaultObj = {
			cityId: cityId,
			cUserId: cUserId,
			behaviorContent: behaviorContent
		};
		let paramsMap = new Map()
			.set(0, {}) // 【】正在浏览您的专属微店
			.set(1, {}) // 【】正在浏览您的专属微店，这已经是第N次来了，快去了解客户的需求吧
			.set(2, {}) //  点击IM:【】想在线咨询你关于买房/租房的事情，赶紧把握住机会吧！
			.set(12, {}) // 进入房源:【】正在浏览您【】的【】房源，请及时跟进了解TA的【】意向
			.set(13, {}); // 第N次进入房源:【】正在浏览您的 英郡 3室 88㎡ 189万的出售房源，这已经是第N次来了，快去了解客户的需求吧

		if (!paramsMap.has(behaviorType)) {
			paramsObj = defaultObj;
		} else {
			paramsObj = Object.assign(defaultObj, paramsMap.get(behaviorType));
		}
		return paramsObj;



		switch (behaviorType) {
			case 0: // 【】正在浏览您的专属微店
				break;
			case 1: // 【】正在浏览您的专属微店，这已经是第N次来了，快去了解客户的需求吧
				break;
			case 2: //  点击IM:【】想在线咨询你关于买房/租房的事情，赶紧把握住机会吧！
				break;
			case 3: //  点击电话: 【】想给你电话咨询买房/租房的事情，机不可失时不再来！
				break;
			case 4: //  分享: 【】第N次给朋友推荐了你的专属微店，TA有朋友可能需要买房/租房哦，找他打听一下
				break;
			case 5: //  第一次退出: 【】第1次浏览了你的微店，停留了【】秒
				break;
			case 6: //  第N次退出: 【】第【】次浏览了你的微店，本次停留了【】秒，TA在你的微店中总共停留了【】秒
				break;
			case 7: //  筛选区域: 【】在微店中筛选了【】的【】房源，请及时跟进了解TA的【】意向	
				break;
			case 8: //  筛选价格: 【】在微店中筛选了价格为【】的【】房源，请及时跟进了解TA的【】意向	
				break;
			case 9: //  筛选户型: 【】在微店中筛选了户型为【】的【】房源，请及时跟进了解TA的【】意向	
				break;
		}
	}

	static getUserName() {
		let userInfo = new UserInfoModel().getModel("userInfo") || {};
		return (userInfo.userInfo ? userInfo.userInfo.nickName : "");
	}

	static getUserId() {
		let me = new UserInfoModel().getModel("me") || {};
		return (me.userId || "");
	}

	static getCityId() {
		return new GpsInfoModel().getModel("cityInfo") ?
			new GpsInfoModel().getModel("cityInfo").cityId || "" :
			"";
	}

	// 获取caseType 对应的文案：例如：出售
	static getCaseTypeText(caseType) {
		caseType = caseType ? Number(caseType) : "";
		let map = new Map()
			.set(1, "出售")
			.set(2, "出租") // 整租
			.set(3, "出租") // 合租
			.set(4, "新房")
			.set(5, "公寓")
			.set(6, "新房")
			.set(9, "新房");
		if (!map.has(caseType)) return "";

		return map.get(caseType);
	}

	// 保存 调用接口
	// sourceType: 2 || 1 : 个人微店  2： 小程序
	static saveBehavior(behaviorType, oldParams = {}) {
		oldParams["cityId"] = oldParams.cityId || this.getCityId();
		oldParams["cUserId"] = this.getUserId();
		let needDealKey = ["cUserId", "cityId", "behaviorContent"];
		let params = {};
		params.behaviorNickName = this.getUserName();
		// 没有端用户名称
		if(!params.behaviorNickName) {
			console.error('用户行为-没有获取到浏览用户名')
			return;
		}
		this.getBehavior(behaviorType)
			.then(res => {
				oldParams.intentionalityScore = res.intentionalityScore;
				for (let key in oldParams) {
					if (needDealKey.toString().indexOf(key) >= 0 && !oldParams[key]) {
						throw new Error("api必填项的值有问题" + key);
						return;
					}

					if (!oldParams[key]) continue;

					params[key] = oldParams[key];
				}
				
				if (Object.keys(params).length === 0) {
					throw new Error("当前接口请求参数为空，不满足");
					return;
				}
				
				params.bulletFlag = 1;		// 子弹找房添加的参数
				params.sourceType = 3;
				
				console.error("---埋码传的参数---", params);
				
				
				// 合租不用推送
				if (params.caseType == 3) return;

				// 经纪人id都不存在
				console.log('---params---',params)
				if (!params.shareArchiveId) return;

				params["cPlateType"] = 4;
				new SaveUserBehavior(params).send()
					.then(res => {
						// console.error('-----行为统计卖点'+res);
					});
			});
	}

	// 获取统计次数
	// flagshipStore: 旗舰店是传 1 其他传 0
	static getStoreCount(archiveId, caseId, caseType) {
		// || caseType === undefined || caseId === undefined
		return new Promise((resolve, reject) => {
			if (!archiveId ) {
				reject("行为统计次数-参数有undefined");
				return;
			}
			new InitEnterStoreCount({
				archiveId: archiveId,
				caseId: caseId,
				caseType: caseType,
				userId: this.getUserId(),
			}).send().then(res => {
				resolve(res.data || {});
			});
		});
	}

	// replaceCont = [{key: '【】': "val": "军安卫士"}]
	static houseDetailReplace(behaviorType, replaceCont = []) {
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if (!cacheKey) return;

		let item = DataLocalMap.getVal(cacheKey);
		if (!item) return;

		let newItem = {};
		for (let key in item) {
			newItem[key] = item[key];
		}
		this.getBehavior(behaviorType)
			.then(res => {
				newItem.behaviorType = behaviorType;
				newItem.houseName = "";
				newItem.houseInfo = "";
				newItem.behaviorContent = this.replaceContent(res.behaviorContent || "", replaceCont);
				this.saveBehavior(behaviorType, newItem);
			});
	}

	// 转换文案 replaceCont = [{key: '【】': "val": "军安卫士"}]
	static replaceContent(behaviorContent, replaceCont = []) {
		for (let info of replaceCont) {
			behaviorContent = behaviorContent.replace(info.key, info.val);
		}
		return behaviorContent;
	}

	// 获取houseCacheKey的val
	static getHouseItemVal(key = "houseCacheKey") {
		let cacheKey = DataLocalMap.getVal(key);
		if (!cacheKey) return null;

		let item = DataLocalMap.getVal(cacheKey);
		if (!item) return null;

		return item;
	}
	// --------------- 上面的方法view都不需要使用，都是底层调用的，下面是view需要调用的方法 -----------------


	// 初始化会清楚用为缓存，原因：防止后台数据更新后前端一直使用缓存数据而不变化
	static init() {
		new UserBehaviorModel().removeModel();
		return this.getBehaviorList();
	}


	// ---------------------- 悠居客用户行为 触发事件 start -----------------------
	
	
	// ---------------------- 悠居客房源列表埋点 -----------------------
	
	// 进入房源 behaviorType = 106(首次进入) || 107(多次进入);
	// houseInfo = 例如： 1室 85㎡ 108万
	static enterHouse(item = new HouseDetailParamsItem(), info = { houseName: "", houseInfo: "" }) {
		let behaviorType = 106;
		// 测试的经纪人id black的
		// item.ownerArchiveId = "1265761";
		// 原来的是这么写的 cacheKeyTime 和 cacheKey
		item.cacheKeyTime = item.ownerArchiveId + "" + this.getUserId() + "_inDetailTime";
		item.cacheKey = item.caseId + "" + item.ownerArchiveId + this.getUserId() + "_inDetailCount";

		// 行为次数统计
		this.getStoreCount(item.ownerArchiveId, item.caseId, item.caseType, 0)
		.then(data => {
			// 次数返回
			if (data.inStoreCount === undefined) {
				return Promise.reject("inStoreCount 是 undefined");
			}

			if (data.inStoreCount && data.inStoreCount > 0) {
				behaviorType = 107;
			}
			item.behaviorType = behaviorType;
			new StoreCountModel().setModel(data, item.cacheKey);
			return this.getBehavior(behaviorType);
		})
		.then(res => {
			// 返回文案
			let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
			item.behaviorType = behaviorType;
			let behaviorContent = res.behaviorContent || "";	// 当前使用文案
			let houseTypeText = this.getCaseTypeText(item.caseType);
			if (behaviorContent && behaviorType == 106) {
				behaviorContent = behaviorContent.replace('【】', '');
				behaviorContent = behaviorContent.replace('【】', info.houseName);
				behaviorContent = behaviorContent.replace('【】', info.houseInfo + houseTypeText);
				behaviorContent = behaviorContent.replace('【】', item.caseType == 1 ? '购房' : '租房');
			}
			if (behaviorContent && behaviorType == 107) {
				behaviorContent = behaviorContent.replace('【】', '');
				behaviorContent = behaviorContent.replace('【】', info.houseName);
				behaviorContent = behaviorContent.replace('【】', info.houseInfo + houseTypeText);
				behaviorContent = behaviorContent.replace('【】', countInfo.inStoreCount ? countInfo.inStoreCount + 1 : 1);
			}
			item.behaviorContent = behaviorContent;
			let newItem = Object.assign(info, item);
			DataLocalMap.setVal(item.cacheKey, newItem);
			DataLocalMap.setVal("houseCacheKey", item.cacheKey);
			TimeMap.setTime(item.cacheKey);
			this.saveBehavior(behaviorType, item);
		});
	}
	
	// 查看房源图片 behaviorType = 108
	static lookHousePhoto() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 108;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: item.houseName + item.houseInfo
			},
			{
				key: "【】",
				val: houseTypeText
			},
			{
				key: "【】",
				val: (item.caseType == 1 ? '购房' : '租房')
			}
		]);
	}

	// 查看地图周边 behaviorType = 111
	static lookMapAll() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 111;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: item.houseName
			},
			{
				key: "【】",
				val: item.houseInfo + houseTypeText
			},
		]);
	}
	
	// 查看地图周边学校 behaviorType = 112
	static lookTypeMap(text) {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
		let behaviorType = 112;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: item.houseName + ' '
			},
			{
				key: "【】",
				val: item.houseInfo + houseTypeText
			},
			{
				key: "【】",
				val: text
			},
		]);
	}
	
	// 在线咨询 behaviorType = 110
	static onlineChart() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 110;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: item.houseName
			},
			{
				key: "【】",
				val: item.houseInfo + houseTypeText
			},
		]);
	}
	
	// 电话咨询 behaviorType = 114
	static onPhone() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 114;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: item.houseName
			},
			{
				key: "【】",
				val: item.houseInfo + houseTypeText
			},
		]);
	}
	
	// 分享 behaviorType = 113
	static shareAppMessage() {
		let behaviorType = 113;
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let houseTypeText = this.getCaseTypeText(item.caseType);
		// 行为次数统计
		this.getStoreCount(item.ownerArchiveId, item.caseId, item.caseType, 0)
		.then(data => {
				if (data.inStoreShareCount === undefined) {
					return Promise.reject("inStoreShareCount 是 undefined");
				}
	
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data, item.cacheKey);
				this.houseDetailReplace(behaviorType, [{
						key: "【】",
						val: ''
					},
					{
						key: "N",
						val: data.inStoreShareCount ? data.inStoreShareCount + 1 : 1
					},
					{
						key: "【】",
						val: item.houseName + " " + item.houseInfo
					},
					{
						key: "【】",
						val: houseTypeText
					},
				]);
			});
	}
	
	// 房贷计算器 behaviorType = 109
	static lookJiSuanQi() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
		let behaviorType = 109;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: item.houseName + item.houseInfo
			},
		]);
	}


	// ---------------------- 悠居客首页埋点 -----------------------

	// 进入经纪人个人微店 behaviorType = 115
	static entryWeiDian(shareArchiveId = "") {
		shareArchiveId = shareArchiveId + "";
		let behaviorType = 115;
		TimeMap.setTime(shareArchiveId);
		DataLocalMap.setVal(shareArchiveId, {
			behaviorContent: "",
			behaviorType: behaviorType,
			cUserId: this.getUserId(),
			cacheKey: shareArchiveId + "_inStoreCount",
			cacheKeyTime: shareArchiveId + "_inStoreTime",
			cityId: "",
			intentionalityScore: 5,
			shareArchiveId: shareArchiveId,
			sourceType: 3
		});
		DataLocalMap.setVal("houseCacheKey", shareArchiveId);
		this.houseDetailReplace(behaviorType, [{
			key: "【】",
			val: ''
		}, ]);
	}

	// 离开经纪人个人微店 behaviorType = 120
	static backWeiDian(shareArchiveId = "") {
		shareArchiveId = shareArchiveId + "";
		
		let itemData = this.getHouseItemVal("houseCacheKey");
		if (!itemData) return;
		
		let cityId = new GpsInfoModel().getModel("cityInfo") ? new GpsInfoModel().getModel("cityInfo").cityId || "" : "";
		let behaviorType = 120;
		let inStoreResidenceTime = 0;
		let item = {
			behaviorContent: "",
			behaviorType: behaviorType,
			cUserId: this.getUserId(),
			cacheKey: shareArchiveId + "_inStoreCount",
			cacheKeyTime: shareArchiveId + "_inStoreTime",
			cityId: cityId,
			intentionalityScore: 5,
			shareArchiveId: shareArchiveId,
			sourceType: 1,
		};
		// 行为次数统计
		this.getStoreCount(shareArchiveId,itemData.caseId,itemData.caseType, 0)
		.then(data => {
			inStoreResidenceTime = data.inStoreResidenceTime ? Number(data.inStoreResidenceTime) : 0;
			if (data.inStoreCount === undefined) {
				return Promise.reject("inStoreCount 是 undefined");
			}
			if (data.inStoreCount && data.inStoreCount > 1) {
				behaviorType = 121;
			}
			
			new StoreCountModel().setModel(data, shareArchiveId);
			return this.getBehavior(behaviorType);
		})
		.then(res => {
				let countInfo = new StoreCountModel().getModel(shareArchiveId) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let intervalVal = TimeMap.getInterval(shareArchiveId);

				let secondsVal = parseInt((new Date().getTime() - TimeMap.getTime(shareArchiveId)) / 1000 + inStoreResidenceTime);
				if (behaviorContent && behaviorType == 120) {
					behaviorContent = behaviorContent.replace('【】', '');
					behaviorContent = behaviorContent.replace('【】', intervalVal);
				}
				if (behaviorContent && behaviorType == 121) {
					behaviorContent = behaviorContent.replace('【】', '');
					behaviorContent = behaviorContent.replace('【】', countInfo.inStoreCount ? countInfo.inStoreCount  : 1);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
					behaviorContent = behaviorContent.replace('【】', TimeMap.formData(secondsVal));
				}
				item.behaviorContent = behaviorContent;
				item.residenceTime = secondsVal;
				this.saveBehavior(behaviorType, item);
			});
	}

	// 给经纪人点赞 behaviorType = 116
	static onHelp() {
		let behaviorType = 116;
		this.houseDetailReplace(behaviorType, [{
			key: "【】",
			val: ''
		}, ]);
	}

	// 微信在线咨询 behaviorType = 117
	static weixiConsult() {
		let behaviorType = 117;
		this.houseDetailReplace(behaviorType, [{
			key: "【】",
			val: ''
		}, ]);
	}

	// 电话咨询 behaviorType = 118
	static phoneConsult() {
		let behaviorType = 118;
		this.houseDetailReplace(behaviorType, [{
			key: "【】",
			val: ''
		}, ]);
	}

	// 进入服务小区详情 behaviorType = 119
	static lookServer(buildName) {
		let behaviorType = 119;
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: buildName
			},
		]);
	}


	// ---------------------- 房源列表筛选埋点 -----------------------

	// 筛选区域 behaviorType = 101
	static screenRegion(region,caseType) {
		let behaviorType = 101;
		let houseTypeText = this.getCaseTypeText(caseType);
		// region = region.replace('区域','不限');
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: region
			},
			{
				key: "【】",
				val: houseTypeText
			},
			{
				key: "【】",
				val: (caseType == 1 ? '购房' : '租房')
			}
		]);
	}

	// 筛选价格 behaviorType = 102
	static screenPrice(price,caseType) {

		let behaviorType = 102;
		let houseTypeText = this.getCaseTypeText(caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: price
			},
			{
				key: "【】",
				val: houseTypeText
			},
			{
				key: "【】",
				val: (caseType == 1 ? '购房' : '租房')
			}
		]);
	}

	// 筛选户型 behaviorType = 103
	static screenApartment(apartment,caseType) {

		let behaviorType = 103;
		let houseTypeText = this.getCaseTypeText(caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: apartment
			},
			{
				key: "【】",
				val: houseTypeText
			},
			{
				key: "【】",
				val: (caseType == 1 ? '购房' : '租房')
			}
		]);
	}

	// 筛选面积 behaviorType = 104
	static screenArea(area,caseType) {
		let behaviorType = 104;
		let houseTypeText = this.getCaseTypeText(caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: area
			},
			{
				key: "【】",
				val: houseTypeText+'平米'
			},
			{
				key: "【】",
				val: (caseType == 1 ? '购房' : '租房')
			}
		]);
	}

	// 筛选类型 behaviorType = 105
	static screenType(houseType,caseType) {
		let behaviorType = 101;
		let houseTypeText = this.getCaseTypeText(caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: ''
			},
			{
				key: "【】",
				val: houseType
			},
			{
				key: "【】",
				val: houseTypeText
			},
			{
				key: "【】",
				val: (caseType == 1 ? '购房' : '租房')
			}
		]);
	}



	// ---------------------- 悠居客用户行为 触发事件 end -----------------------

















	// ---------------------- 新房详情埋码 -----------------------
	// 进入房源 behaviorType = 36(首次进入) || 37(多次进入);
	static enterNewHouse(item = new HouseDetailParamsItem(), info = { houseName: "",houseInfo: ""})  {
		let behaviorType = 36;
		// 原来的是这么写的 cacheKeyTime 和 cacheKey
		item.cacheKeyTime = item.shareArchiveId + "" + this.getUserId() + "_inDetailTime";
		item.cacheKey = item.caseId + "" + item.shareArchiveId + this.getUserId() + "_inDetailCount";
		this.getStoreCount(item.shareArchiveId, item.caseId, item.caseType, 0)
		.then(data => {
			if (data.inStoreCount === undefined) {
				return Promise.reject("inStoreCount 是 undefined");
			}

			if (data.inStoreCount && data.inStoreCount > 0) {
				behaviorType = 37;
			}
			item.behaviorType = behaviorType;
			new StoreCountModel().setModel(data, item.cacheKey);
			return this.getBehavior(behaviorType);
		})
		.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let houseTypeText = this.getCaseTypeText(item.caseType);
				if (behaviorContent && behaviorType == 36) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', info.houseName);
				}
				if (behaviorContent && behaviorType == 37) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', info.houseName);
					behaviorContent = behaviorContent.replace('N', countInfo.inStoreCount ? countInfo.inStoreCount + 1 : 1);
				}
				item.behaviorContent = behaviorContent;
				let newItem = Object.assign(info, item);
				DataLocalMap.setVal(item.cacheKey, newItem);
				DataLocalMap.setVal("houseCacheKey", item.cacheKey);
				TimeMap.setTime(item.cacheKey);
				this.saveBehavior(behaviorType, item);
			});
	}

	// 离开房源，key = houseCacheKey
	// behaviorType = 46(首次离开) || 47(多次离开);
	static leaveNewHouse() {
		let behaviorType = 46;
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if (!cacheKey) return;

		let item = DataLocalMap.getVal(cacheKey);
		if (!item) return;

		let inStoreResidenceTime = 0;
		this.getStoreCount(item.shareArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				inStoreResidenceTime = data.inStoreResidenceTime ? Number(data.inStoreResidenceTime) : 0;
				if (data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}

				if (data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 47;
				}
				new StoreCountModel().setModel(data, item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let intervalVal = TimeMap.getInterval(cacheKey);
				let houseTypeText = this.getCaseTypeText(item.caseType);

				let secondsVal = parseInt((new Date().getTime() - TimeMap.getTime(cacheKey)) / 1000 + inStoreResidenceTime);
				if (behaviorContent && behaviorType == 46) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', item.houseName);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
				}
				if (behaviorContent && behaviorType == 47) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('N', countInfo.inStoreCount ? countInfo.inStoreCount + 1 : 1);
					behaviorContent = behaviorContent.replace('【】', item.houseName);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
					behaviorContent = behaviorContent.replace('【】', TimeMap.formData(secondsVal));
				}
				item.behaviorContent = behaviorContent;
				item.residenceTime = secondsVal;
				this.saveBehavior(behaviorType, item);
			});
	}

	// 楼盘图库 behaviorType = 38;
	static newHouseLouPanTuKu() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;

		let behaviorType = 38;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName
			},
		]);
	}

	// 户型介绍 behaviorType = 40
	static newHouseHuXingInfo() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;

		let behaviorType = 40;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName
			},
		]);
	}

	// 分享 behaviorType = 41
	static newHouseShareAppMessage() {
		let behaviorType = 41;
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;

		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.getStoreCount(item.shareArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				if (data.inStoreShareCount === undefined) {
					return Promise.reject("inStoreShareCount 是 undefined");
				}

				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data, item.cacheKey);
				this.houseDetailReplace(behaviorType, [
					{ key: "【】", val: this.getUserName() },
					{ key: "N", val: data.inStoreShareCount ? data.inStoreShareCount + 1 : 1 },
					{ key: "【】", val: item.houseName },
				]);
			});
	}

	// 地图导航 behaviorType = 39
	static newHouseMapGps() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;

		let behaviorType = 39;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName
			},
		]);
	}

	// 浏览周边 behaviorType = 43
	static newHouseLookNearInfo() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;

		let behaviorType = 43;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName
			},
		]);
	}
	
	// 查看地图周边 behaviorType = 21
	static lookMapNear() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 21;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
			{key: "【】",val: item.houseInfo + houseTypeText},
		]);
	}
	
	// -------------------------- 二手/租房房源相关 -----------------------------------
	// 离开房源，key = houseCacheKey
	// behaviorType = 29(首次离开) || 30(多次离开);
	static leaveHouse() {
		let behaviorType = 29;
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if (!cacheKey) return;
	
		let item = DataLocalMap.getVal(cacheKey);
		if (!item) return;
	
		let inStoreResidenceTime = 0;

		this.getStoreCount(item.ownerArchiveId, item.caseId, item.caseType, 0)
		.then(data => {
			inStoreResidenceTime = data.inStoreResidenceTime ? Number(data.inStoreResidenceTime) : 0;
			if (data.inStoreCount == undefined) {
				return Promise.reject("inStoreCount 是 undefined");
			}
	
			if (data.inStoreCount && data.inStoreCount > 0) {
				behaviorType = 30;
			}
			new StoreCountModel().setModel(data, item.cacheKey);
			return this.getBehavior(behaviorType);
		})
		.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = '';
				if(res.behaviorContent !== undefined){ behaviorContent = res.behaviorContent || "";}
				let intervalVal = TimeMap.getInterval(cacheKey);
				let houseTypeText = this.getCaseTypeText(item.caseType);
	
				let secondsVal = parseInt((new Date().getTime() - TimeMap.getTime(cacheKey)) / 1000 + inStoreResidenceTime);
				if (behaviorContent && behaviorType == 29) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', item.houseName);
					behaviorContent = behaviorContent.replace('【】', item.houseInfo + houseTypeText);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
				}
				if (behaviorContent && behaviorType == 30) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', item.houseName);
					behaviorContent = behaviorContent.replace('【】', item.houseInfo + houseTypeText);
					behaviorContent = behaviorContent.replace('N', countInfo.inStoreCount ? countInfo.inStoreCount : 1);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
					behaviorContent = behaviorContent.replace('【】', TimeMap.formData(secondsVal));
				}
				item.behaviorContent = behaviorContent;
				item.residenceTime = secondsVal;
				this.saveBehavior(behaviorType, item);
			});
	}
	
	// 收藏房源 behaviorType = 23(收藏) || 24(取消);
	// houseInfo = 例如： 1室 85㎡ 108万
	static collectHouse(isCollect) {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = isCollect ? 23 : 24;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName + " " + item.houseInfo
			},
			{
				key: "【】",
				val: houseTypeText
			}
		]);
	}
	
	// 房价评估 behaviorType = 15
	static housePricePingGu() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 15;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName + " " + item.houseInfo + houseTypeText
			},
		]);
	}
	
	// 小区查看更多 behaviorType = 17
	static villageMore() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 17;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName + " " + item.houseInfo + houseTypeText
			},
		]);
	}
	
	// 特权找房 behaviorType = 28
	static teQuanFindeHouse() {
		let item = this.getHouseItemVal("houseCacheKey");
		if (!item) return;
	
		let behaviorType = 28;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [{
				key: "【】",
				val: this.getUserName()
			},
			{
				key: "【】",
				val: item.houseName + " " + item.houseInfo
			},
			{
				key: "【】",
				val: houseTypeText
			},
		]);
	}
	
}
