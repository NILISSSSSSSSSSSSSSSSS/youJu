

import { GetUserBehavior } from "../net/GetUserBehavior.js";
import { SaveUserBehavior } from "../net/SaveUserBehavior.js";
import { UserBehaviorModel } from "../model/UserBehaviorModel.js";
import { BehaviorPageConfigModel } from "../model/BehaviorPageConfigModel.js";
import { GpsInfoModel } from "../model/GpsInfoModel.js";
import { UserInfoModel } from "../model/UserInfoModel.js";
import { InitEnterStoreCount } from "../net/InitEnterStoreCount.js";
import { StoreCountModel } from "../model/StoreCountModel.js";
import { PushStoreMsg } from "@/net/personalStore/PushStoreMsg.js";

// 进入时间储存
class TimeMap {
	static map = new Map();
	
	static setTime(id, time) {
		if(time === undefined) {
			time = new Date().getTime();
		}
		this.map.set(id, time);
	}
	
	static getTime(id) {
		let time = 0;
		if(this.map.has(id)) {
			time = this.map.get(id);
		}
		return time;
	}
	
	// 获取停留时间
	static getInterval(id) {
		let currentTime = new Date().getTime();
		let secondTime = parseInt(currentTime - this.getTime(id));   // 毫秒
		secondTime = parseInt(secondTime / 1000);   // 秒
		return this.formData(secondTime)
	}
	
	// secondTime 单位是秒， 返回转化后的时间
	static formData(secondTime) {
		let minuteTime = 0;// 分
		let hourTime = 0;// 小时
		if(secondTime > 60) {
			minuteTime = parseInt(secondTime / 60);
			secondTime = parseInt(secondTime % 60);
			if(minuteTime > 60) {
				hourTime = parseInt(minuteTime / 60);
				minuteTime = parseInt(minuteTime % 60);
			}
		}
		let result = "" + parseInt(secondTime);
		if(minuteTime > 0) {
			result = "" + parseInt(minuteTime) + "分" + result;
		}
		if(hourTime > 0) {
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
	sourceType = 2; // 1 : 个人微店  2： 小程序
	caseId = "";  // 房源id
	caseType = "";  // 房源类型 1：二手房 9: 新房？ 4: 合租？
	intentionalityRegionName = "";  // 区域名称
	intentionalityRoom = "";  // 房子的户型  例如：3室
	intentionalityHousePrice = "";  // 房源总价
	priceUnit = "";  // 单价  (新房用这个)
	cacheKeyTime = "";  // 暂时不知道 (不用传 底层实现)
	cacheKey = "";   // 暂时不知道 (不用传 底层实现)
}

// 行为统计次数的参数
class StoreCountConfig {
	inStoreCount = 0;   // 统计次数
	inStoreResidenceTime = "";  // 时间
	inStoreShareCount = 0;  // 分享次数 
}


export class PlatformUserBehavior {
	// 推出小程序时需要处理的key
	static leaveKeys = ["inStoreTime", "inDetailTime"]
	
	constructor() {
	    
	}
	
	// 用户行为列表, Map对象的格式返回
	static getBehaviorList() {
		return new Promise((resolve, reject) => {
			if(new UserBehaviorModel().getModel()) {
				resolve(new UserBehaviorModel().getModel());
				return;
			}
			
			new GetUserBehavior().send()
				.then(res => {
					let list = res ? res.data || [] : [];
					let behaviorMap = {};
					for(let item of list) {
						if(item.behaviorType === undefined) continue;
						
						behaviorMap[item.behaviorType] = item;
					}
					// console.log("---behaviorMap----", behaviorMap);
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
					if(behaviorType === undefined) {
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
// 	static leave() {
// 		// 推出小程序时需要处理的key
// 		let pageInfo = new BehaviorPageConfigModel().getModel();
// 	}
	
	static getUserName() {
		let userInfo = new UserInfoModel().getModel("userInfo") || {};
		return (userInfo.userInfo ? userInfo.userInfo.nickName : "");
	}
	static getUserId() {
		let me = new UserInfoModel().getModel("me") || {};
		return (me.userId || "");
	}
	static getCityId() {
		return new GpsInfoModel().getModel("cityInfo") 
			? new GpsInfoModel().getModel("cityInfo").cityId || "" 
			: "";
	}
	
	// 获取caseType 对应的文案：例如：出售
	static getCaseTypeText(caseType) {
		caseType = caseType ? Number(caseType) : "";
		let map = new Map()
			.set(1, "出售")
			.set(2, "出租")  // 整租
			.set(3, "出租")  // 合租
			.set(4, "新房")
			.set(5, "公寓")
			.set(6, "新房")
			.set(9, "新房");
		if(!map.has(caseType)) return "";
		
		return map.get(caseType);
	}
	
	// 保存 调用接口
	// sourceType: 2 || 1 : 个人微店  2： 小程序
	// enterStatus: 1 其他 2 微店
	static saveBehavior(behaviorType, oldParams = {}, enterStatus = 1) {
		oldParams["cityId"] = oldParams.cityId || this.getCityId();
		oldParams["cUserId"] = this.getUserId();
		let needDealKey = ["cUserId", "cityId", "behaviorContent"];
		if(enterStatus == 2) {
			needDealKey = ["cUserId", "behaviorContent"];
		}
		let params = {};
		return this.getBehavior(behaviorType)
			.then(res => {
				oldParams.intentionalityScore = res.intentionalityScore;
				for(let key in oldParams) {
					if(needDealKey.toString().indexOf(key) >= 0 
						&& (oldParams[key] == undefined && oldParams[key] != 0 
							&& !oldParams[key])) {
						throw new Error("api必填项的值有问题"+key);
						return Promise.reject("api必填项的值有问题"+key);
					}
					
					if(!oldParams[key] && typeof oldParams[key] !== 'number') continue;
						
					params[key] = oldParams[key];
				}
				
				if(Object.keys(params).length === 0) {
					throw new Error("当前接口请求参数为空，不满足");
					return Promise.reject("当前接口请求参数为空，不满足");
				}
				
				// console.error(params, "---埋码的api request---");
				
				// 合租不用推送
				if(params.caseType == 3) return Promise.resolve("不需要");
				
				// 经纪人id都不存在
				if(!params.shareArchiveId && !params.ownerArchiveId) return Promise.resolve("没有经纪人id");

				params["cPlateType"] = 6;
				return new SaveUserBehavior(params).send();
			});
	}
	
	// 获取统计次数
	// flagshipStore: 旗舰店是传 1 微店传 1 其他传 0
	static getStoreCount(archiveId, caseId, caseType, flagshipStore = 0) {
		return new Promise((resolve, reject) => {
			if(!archiveId || caseType === undefined || caseId === undefined) {
				reject("参数有undefined");
				return;
			}
			
			new InitEnterStoreCount({
				archiveId: archiveId,
				caseId: caseId,
				caseType: caseType,
				userId: this.getUserId(),
				flagshipStore: flagshipStore
			}).send().then(res => {
				resolve(res.data || {});
			});
		});
	}
	
	// replaceCont = [{key: '【】': "val": "军安卫士"}]
	static houseDetailReplace(behaviorType, replaceCont = []) {
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!cacheKey) return;
		
		let item = DataLocalMap.getVal(cacheKey);
		if(!item) return;
		
		let newItem = {};
		for(let key in item) {
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
		for(let info of replaceCont) {
			behaviorContent = behaviorContent.replace(info.key, info.val);
		}
		return behaviorContent;
	}
	
	// 获取houseCacheKey的val
	static getHouseItemVal(key = "houseCacheKey") {
		let cacheKey = DataLocalMap.getVal(key);
		if(!cacheKey) return null;
		
		let item = DataLocalMap.getVal(cacheKey);
		if(!item) return null;
		
		return item;
	}
	// --------------- 上面的方法view都不需要使用，都是底层调用的，下面是view需要调用的方法 -----------------
	
	
	
	
	
	// 初始化会清楚用为缓存，原因：防止后台数据更新后前端一直使用缓存数据而不变化
	// App启动时执行
	static init() {
		new UserBehaviorModel().removeModel();
		return this.getBehaviorList();
	}
	
	
	// -------------------------- 二手/租房房源相关 -----------------------------------
	// 进入房源 behaviorType = 12(首次进入) || 13(多次进入);
	// houseInfo = 例如： 1室 85㎡ 108万
	static enterHouse(item = new HouseDetailParamsItem(), info = {houseName: "", houseInfo: ""}) {
		let behaviorType = 12;
		// 测试的经纪人id black的
		// item.ownerArchiveId = "1265761";
		// 原来的是这么写的 cacheKeyTime 和 cacheKey
		item.cacheKeyTime = item.ownerArchiveId + "" + this.getUserId() + "_inDetailTime";
		item.cacheKey = item.caseId + "" + item.ownerArchiveId + this.getUserId() + "_inDetailCount";
		this.getStoreCount(item.ownerArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				if(data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}
				
				if(data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 13;
				}
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data ,item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let houseTypeText = this.getCaseTypeText(item.caseType);
				if(behaviorContent && behaviorType == 12) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', info.houseName);
					behaviorContent = behaviorContent.replace('【】', info.houseInfo + houseTypeText);
					behaviorContent = behaviorContent.replace('【】', item.caseType == 1 ? '购房' : '租房');
				}
				if(behaviorContent && behaviorType == 13) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', info.houseName);
					behaviorContent = behaviorContent.replace('【】', info.houseInfo + houseTypeText);
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
	// behaviorType = 29(首次离开) || 30(多次离开);
	static leaveHouse() {
		let behaviorType = 29;
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!cacheKey) return;
		
		let item = DataLocalMap.getVal(cacheKey);
		if(!item) return;
		
		let inStoreResidenceTime = 0;
		this.getStoreCount(item.ownerArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				inStoreResidenceTime = data.inStoreResidenceTime ? Number(data.inStoreResidenceTime) : 0;
				if(data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}
				
				if(data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 30;
				}
				new StoreCountModel().setModel(data ,item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let intervalVal = TimeMap.getInterval(cacheKey);
				let houseTypeText = this.getCaseTypeText(item.caseType);

				let secondsVal = parseInt((new Date().getTime() - TimeMap.getTime(cacheKey)) / 1000 + inStoreResidenceTime);
				if(behaviorContent && behaviorType == 29) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', item.houseName);
					behaviorContent = behaviorContent.replace('【】', item.houseInfo + houseTypeText);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
				}
				if(behaviorContent && behaviorType == 30) {
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
		if(!item) return;
		
		let behaviorType = isCollect ? 23 : 24;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName + " " + item.houseInfo},
			{key: "【】",val: houseTypeText}
		]);
	}
	
	// 房价评估 behaviorType = 15
	static housePricePingGu() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 15;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName + " " + item.houseInfo + houseTypeText},
		]);
	}
	
	// 小区查看更多 behaviorType = 17
	static villageMore() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 17;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName + " " + item.houseInfo + houseTypeText},
		]);
	}

	// 查看房源图片 behaviorType = 14
	static lookHousePhoto() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 14;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
			{key: "【】",val: item.houseInfo + houseTypeText},
			{key: "【】",val: (item.caseType == 1 ? '购房' : '租房')}
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

	// 在线咨询 behaviorType = 19
	static onlineChart() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 19;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
			{key: "【】",val: item.houseInfo + houseTypeText},
		]);
	}

	// 特权找房 behaviorType = 28
	static teQuanFindeHouse() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 28;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName + " " + item.houseInfo},
			{key: "【】",val: houseTypeText},
		]);
	}

	// 分享 behaviorType = 25
	static shareAppMessage() {
		let behaviorType = 25;
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.getStoreCount(item.ownerArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				if(data.inStoreShareCount === undefined) {
					return Promise.reject("inStoreShareCount 是 undefined");
				}
				
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data ,item.cacheKey);
				this.houseDetailReplace(behaviorType, [
					{key: "【】",val: this.getUserName()},
					{key: "N", val: data.inStoreShareCount ? data.inStoreShareCount + 1 : 1},
					{key: "【】",val: item.houseName + " " + item.houseInfo},
					{key: "【】",val: houseTypeText},
				]);
			});
	}

	// 查看vr behaviorType = 14
	static lookVr() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 14;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
			{key: "【】",val: item.houseInfo + houseTypeText},
			{key: "【】",val: item.houseInfo + (item.caseType == 1 ? '购房' : '租房')}
		]);
	}
	
	
	
	// ---------------------- 新房详情/新房楼书埋码 -----------------------
	// 进入房源 behaviorType = 36(首次进入) || 37(多次进入);
	static enterNewHouse(item = new HouseDetailParamsItem(), info = {houseName: "", houseInfo: ""}) {
		let behaviorType = 36;
		// 原来的是这么写的 cacheKeyTime 和 cacheKey
		item.cacheKeyTime = item.shareArchiveId + "" + this.getUserId() + "_inDetailTime";
		item.cacheKey = item.caseId + "" + item.shareArchiveId + this.getUserId() + "_inDetailCount";
		this.getStoreCount(item.shareArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				if(data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}
				
				if(data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 37;
				}
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data ,item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let houseTypeText = this.getCaseTypeText(item.caseType);
				if(behaviorContent && behaviorType == 36) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', info.houseName);
				}
				if(behaviorContent && behaviorType == 37) {
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
		if(!cacheKey) return;
		
		let item = DataLocalMap.getVal(cacheKey);
		if(!item) return;
		
		let inStoreResidenceTime = 0;
		this.getStoreCount(item.shareArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				inStoreResidenceTime = data.inStoreResidenceTime ? Number(data.inStoreResidenceTime) : 0;
				if(data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}
				
				if(data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 47;
				}
				new StoreCountModel().setModel(data ,item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let intervalVal = TimeMap.getInterval(cacheKey);
				let houseTypeText = this.getCaseTypeText(item.caseType);
	
				let secondsVal = parseInt((new Date().getTime() - TimeMap.getTime(cacheKey)) / 1000 + inStoreResidenceTime);
				if(behaviorContent && behaviorType == 46) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', item.houseName);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
				}
				if(behaviorContent && behaviorType == 47) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('N', countInfo.inStoreCount ? countInfo.inStoreCount : 1);
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
		if(!item) return;
		
		let behaviorType = 38;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
		]);
	}

	// 户型介绍 behaviorType = 40
	static newHouseHuXingInfo() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 40;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
		]);
	}

	// 分享 behaviorType = 41
	static newHouseShareAppMessage() {
		let behaviorType = 41;
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.getStoreCount(item.shareArchiveId, item.caseId, item.caseType, 0)
			.then(data => {
				if(data.inStoreShareCount === undefined) {
					return Promise.reject("inStoreShareCount 是 undefined");
				}
				
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data ,item.cacheKey);
				this.houseDetailReplace(behaviorType, [
					{key: "【】",val: this.getUserName()},
					{key: "N", val: data.inStoreShareCount ? data.inStoreShareCount + 1 : 1},
					{key: "【】",val: item.houseName},
				]);
			});
	}

	// 地图导航 behaviorType = 39
	static newHouseMapGps() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 39;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
		]);
	}
	
	// 浏览周边 behaviorType = 43
	static newHouseLookNearInfo() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 43;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
		]);
	}




	// ---------------------- 微店埋码 -----------------------
	// 进入微店 behaviorType = 0
	static enterStore(archiveId = "") {
		let behaviorType = 0;
		let item = new HouseDetailParamsItem();
		// 原来的是这么写的 cacheKeyTime 和 cacheKey
		item.shareArchiveId = archiveId;
		item.sourceType = 1;
		item.cacheKeyTime = archiveId + this.getUserId() + "_inStoreTime";
		item.cacheKey = archiveId + this.getUserId() + "_inStoreCount";
		this.getStoreCount(archiveId, "", "", 1)
			.then(data => {
				if(data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}
				
				if(data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 1;
				}
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data ,item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let houseTypeText = this.getCaseTypeText(item.caseType);
				if(behaviorContent && behaviorType == 0) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
				}
				if(behaviorContent && behaviorType == 1) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('N', countInfo.inStoreCount ? countInfo.inStoreCount + 1 : 1);
				}
				item.behaviorContent = behaviorContent;
				DataLocalMap.setVal(item.cacheKey, item);
				DataLocalMap.setVal("houseCacheKey", item.cacheKey);
				TimeMap.setTime(item.cacheKey);
				return this.saveBehavior(behaviorType, item);
			})
			.then(res => {
				this.storePushMsg(archiveId);
			});
	}
	
	// 推送消息
	static storePushMsg(archiveId) {
		if(!archiveId || !this.getUserId()) return;
		
		new PushStoreMsg({userId: this.getUserId(), archiveId: archiveId}).send();
	}

	// 出租/出售 筛选面积 behaviorType = 10
	// textOne ? "出售" : "出租"  textTwo ? "购房" : "租房"
	static storeChooseArea(area, textOne, textTwo) {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item || !area || !textOne || !textTwo) return;
		
		let behaviorType = 10;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: area},
			{key: "【】",val: textOne},
			{key: "【】",val: textTwo},
		]);
	}
	
	// 出租/出售 筛选用途 behaviorType = 11
	// textOne ? "出售" : "出租"  textTwo ? "购房" : "租房"
	static storeChooseHouseUsage(houseUsage, textOne, textTwo) {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item || !houseUsage || !textOne || !textTwo) return;
		
		let behaviorType = 11;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: houseUsage},
			{key: "【】",val: textOne},
			{key: "【】",val: textTwo},
		]);
	}

	// 出租/出售 商圈筛选 behaviorType = 7
	// textOne ? "出售" : "出租"  textTwo ? "购房" : "租房"
	static storeHouseSection(regionId, regionName, caseType, textOne, textTwo) {
		let item = this.getHouseItemVal("houseCacheKey");
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!item || !regionName || !regionId || !caseType || !textOne || !textTwo) return;
		
		item.caseType = caseType;
		item.intentionalityRegionId = regionId;
		item.intentionalityRegionName = regionName;
		DataLocalMap.setVal(cacheKey, item);
		let behaviorType = 7;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: regionName},
			{key: "【】",val: textOne},
			{key: "【】",val: textTwo},
		]);
	}

	// 出租/出售 户型筛选 behaviorType = 9
	// textOne ? "出售" : "出租"  textTwo ? "购房" : "租房"
	// roomId = 2:2 roomText = 2室
	static storeHouseRoom(roomId, roomText, caseType, textOne, textTwo) {
		let item = this.getHouseItemVal("houseCacheKey");
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!item || !roomText || !roomId || !caseType || !textOne || !textTwo) return;
		
		item.caseType = caseType;
		item.intentionalityRoom = roomId;
		DataLocalMap.setVal(cacheKey, item);
		let behaviorType = 9;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: roomText},
			{key: "【】",val: textOne},
			{key: "【】",val: textTwo},
		]);
	}
	
	//  出租/出售 价格 behaviorType = 8
	static storeHousePrice(price, priceText, caseType, textOne, textTwo) {
		let item = this.getHouseItemVal("houseCacheKey");
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!item || !price || !priceText || !caseType || !textOne || !textTwo) return;
		
		item.caseType = caseType;
		item.intentionalityHousePrice = price;
		DataLocalMap.setVal(cacheKey, item);
		let behaviorType = 8;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: priceText},
			{key: "【】",val: textOne},
			{key: "【】",val: textTwo},
		]);
	}
	

	// 新房区域筛选 behaviorType = 48
	static storeNewHouseRegion(regionId, regionName) {
		let item = this.getHouseItemVal("houseCacheKey");
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!item || !regionName || !regionId) return;
		
		item.caseType = 6;
		item.intentionalityRegionId = regionId;
		item.intentionalityRegionName = regionName;
		DataLocalMap.setVal(cacheKey, item);
		let behaviorType = 48;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: regionName},
		]);
	}
	
	// 新房价格 behaviorType = 49
	static storeNewHousePrice(price, priceText) {
		let item = this.getHouseItemVal("houseCacheKey");
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!item || !price || !priceText) return;
		
		item.caseType = 6;
		item.intentionalityHousePrice = price;
		DataLocalMap.setVal(cacheKey, item);
		let behaviorType = 48;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: priceText},
		]);
	}
	
	// 新房用途 behaviorType = 50
	static storeNewHouseUsage(houseUsage) {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item || !houseUsage) return;
		
		let behaviorType = 50;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: houseUsage},
		]);
	}

	
	// 在线聊天 behaviorType = 2
	static storeOnlineChart() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 2;
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
		]);
	}
	
	// 拨打电话 behaviorType = 3
	static storeMakePhone() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 3;
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
		]);
	}

	// 分享 behaviorType = 4
	static storeShareAppMessage() {
		let behaviorType = 4;
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		this.getStoreCount(item.shareArchiveId, "", "", 1)
			.then(data => {
				if(data.inStoreShareCount === undefined) {
					return Promise.reject("inStoreShareCount 是 undefined");
				}
				
				item.behaviorType = behaviorType;
				new StoreCountModel().setModel(data ,item.cacheKey);
				this.houseDetailReplace(behaviorType, [
					{key: "【】",val: this.getUserName()},
					{key: "N", val: data.inStoreShareCount ? data.inStoreShareCount + 1 : 1},
				]);
			});
	}

	// 离开房源，key = houseCacheKey
	// behaviorType = 5(首次离开) || 6(多次离开);
	static leaveStore() {
		let behaviorType = 5;
		let cacheKey = DataLocalMap.getVal("houseCacheKey");
		if(!cacheKey) return;
		
		let item = DataLocalMap.getVal(cacheKey);
		if(!item) return;
		
		let inStoreResidenceTime = 0;
		this.getStoreCount(item.shareArchiveId, "", "", 1)
			.then(data => {
				inStoreResidenceTime = data.inStoreResidenceTime 
					? Number(data.inStoreResidenceTime) : 0;
				if(data.inStoreCount === undefined) {
					return Promise.reject("inStoreCount 是 undefined");
				}
				
				if(data.inStoreCount && data.inStoreCount > 0) {
					behaviorType = 6;
				}
				new StoreCountModel().setModel(data ,item.cacheKey);
				return this.getBehavior(behaviorType);
			})
			.then(res => {
				let countInfo = new StoreCountModel().getModel(item.cacheKey) || {};
				item.behaviorType = behaviorType;
				let behaviorContent = res.behaviorContent || "";
				let intervalVal = TimeMap.getInterval(cacheKey);
				let houseTypeText = this.getCaseTypeText(item.caseType);
	
				let secondsVal = parseInt((new Date().getTime() - TimeMap.getTime(cacheKey)) / 1000 + inStoreResidenceTime);
				if(behaviorContent && behaviorType == 5) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', intervalVal);
				}
				if(behaviorContent && behaviorType == 6) {
					behaviorContent = behaviorContent.replace('【】', this.getUserName());
					behaviorContent = behaviorContent.replace('【】', countInfo.inStoreCount ? countInfo.inStoreCount + 1 : 1);
					behaviorContent = behaviorContent.replace('【】', intervalVal);
					behaviorContent = behaviorContent.replace('【】', TimeMap.formData(secondsVal));
				}
				item.behaviorContent = behaviorContent;
				item.residenceTime = secondsVal;
				this.saveBehavior(behaviorType, item);
			});
	}



	// ---------------------- 新房楼书埋码 -----------------------
	// 楼书预约看房 behaviorType = 45
	static buildBookYuYue() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 45;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
		]);
	}
	
	// 楼书咨询置业顾问 behaviorType = 44
	static buildBookChart() {
		let item = this.getHouseItemVal("houseCacheKey");
		if(!item) return;
		
		let behaviorType = 44;
		let houseTypeText = this.getCaseTypeText(item.caseType);
		this.houseDetailReplace(behaviorType, [
			{key: "【】",val: this.getUserName()},
			{key: "【】",val: item.houseName},
		]);
	}
}	