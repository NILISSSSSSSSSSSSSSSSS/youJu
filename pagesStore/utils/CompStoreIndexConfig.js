import {GetCompStoreConfig} from "../net/CompStoreNet";
import {CompStoreCityIdModel} from "../model/CompStoreModel";

export class CompStoreIndexConfigItem {
    // 默认的背景图
    indexBg = "";
    // 旗舰店名称
    name = "";
    // logo
    logo = "";
    // 导航栏配置
    navInfo = null;  // [{text: "租房",index: 3,event: "initRentingHouseData",behavi: "60"}]
    // 推荐信息
    recommendInfo = {
        erHouse: {
            show: true, //  动态修改
            text: "推荐二手房", //  动态修改
            event: "moreErHouse", // 恒定不变
            listKey: "indexErHouseList",  // 恒定不变
            index: 6  // 动态修改根据navInfo中的位置
        },
        newHouse: {
            show: true, //  动态修改
            text: "推荐新房", //  动态修改
            event: "moreNewHouse", // 恒定不变
            listKey: "indexNewHouseList", // 恒定不变
            index: 6 // 动态修改根据navInfo中的位置
        },
        zuHouse: {
            show: true,  //  动态修改
            text: "推荐租房", //  动态修改
            event: "moreZuHouse", // 恒定不变
            listKey: "indexZuHouseList", // 恒定不变
            index: 6 // 动态修改根据navInfo中的位置
        }
    };
    // 推荐列表排序
    recommendListSort = null;  // ["erHouse", "newHouse", "zuHouse"]
    // 分享信息
    shareInfo = {
        imgSrc: "",
        text: ""
    };
    // 渐变背景
    linearGradientBg = "";
    // title 背景
    titleBg = "";
}

export class CompStoreIndexConfig {
    navConfigMap = new Map()
        .set("home", {
            text: "首页"
            ,index: 0
            ,event: "initHomeData"
            ,behavi: ""
            ,haveData: true
        })
        .set("erHouse", {
            text: "二手房"
            ,index: 1
            ,event: "initErHouseData"
            ,behavi: "58"
            ,haveData: false
        })
        .set("newHouse", {
            text: "新房"
            ,index: 2
            ,event: "initNewHouseData"
            ,behavi: "59"
            ,haveData: false
        })
        .set("zuHouse", {
            text: "租房"
            ,index: 3
            ,event: "initRentingHouseData"
            ,behavi: "60"
            ,haveData: false
        });
    // 页面跳转 1 二手房 2 租房 6 新房
    navKeyMap = new Map()
        .set("1", "erHouse")
        .set("2", "zuHouse")
        .set("6", "newHouse");
    eventKeyMap = new Map()
        .set("initHomeData", "home")
        .set("initErHouseData", "erHouse")
        .set("initRentingHouseData", "zuHouse")
        .set("initNewHouseData", "newHouse");
    archiveId = "";  // 经纪人id
    compId = "";   // 公司id

    constructor(archiveId, compId) {
        this.archiveId = archiveId;
        this.compId = compId;
    }

    getConfig(callback = function () {}) {
        new GetCompStoreConfig({
          archiveId: this.archiveId
          , compId: this.compId
          , fromSource:'1'
          , cityId: new CompStoreCityIdModel().getModel() || ""
          }).send()
            .then((res) => {
                if (!res || res.status !== 200) {
                    callback({});
                    return;
                }

                let data = res.data || {};
                let NAVIGATION = data.NAVIGATION ? JSON.parse(data.NAVIGATION) : {};
                let RECOMMENDED_BAR = data.RECOMMENDED_BAR ? JSON.parse(data.RECOMMENDED_BAR) : {};
                let item = new CompStoreIndexConfigItem();
                item.indexBg = data.BACKGROUND || "";
                item.name = data.SHOP_NAME || "";
                item.logo = data.SHOP_LOGO || "";
                item.titleBg = data.HEADER_COLOR_RGB && data.HEADER_COLOR
                    ? data.HEADER_COLOR : "";
                item.linearGradientBg = data.HEADER_COLOR_RGB && data.HEADER_COLOR
                    ? `linear-gradient(rgba(${data.HEADER_COLOR_RGB},1),rgba(${data.HEADER_COLOR_RGB},0))`
                    : "";
                let recommendInfo = item.recommendInfo || {};
                let navInfo = [{
                    text: "首页"
                    ,index: 0
                    ,event: "initHomeData"
                    ,behavi: ""
                    ,haveData: true
                }];
                let navIndex = 0;
                for (let navKey in NAVIGATION) {
                    let navKeyVal = NAVIGATION[navKey] || {};
                    if (!navKeyVal.NAV_JUMP) continue;

                    if (!this.navKeyMap.has(navKeyVal.NAV_JUMP)) continue;

                    if (!this.navConfigMap.has(this.navKeyMap.get(navKeyVal.NAV_JUMP))) continue;

                    if (navKeyVal.IS_SELECT !== undefined && navKeyVal.IS_SELECT === false) continue;

                    let navKeyMapVal = this.navKeyMap.get(navKeyVal.NAV_JUMP);
                    navIndex++;
                    let navInfoItem = this.navConfigMap.get(navKeyMapVal) || {};
                    navInfoItem.text = navKeyVal.NAV_NAME || navInfoItem.text || navInfoItem.event;
                    navInfoItem.index = navIndex;

                    recommendInfo[navKeyMapVal].index = navIndex;
                    navInfo.push(navInfoItem);
                }

                navInfo.map((val, index) => {
                    let key = this.eventKeyMap.get(val.event);
                    if (recommendInfo[key]) {
                        recommendInfo[key].index = index;
                    }
                });

                let recommendListSort = [];
                for (let recommendKey in RECOMMENDED_BAR) {
                    let recommendKeyVal = RECOMMENDED_BAR[recommendKey] || {};
                    if (!recommendKeyVal.SHOW_CONTENT) continue;

                    if (!this.navKeyMap.has(recommendKeyVal.SHOW_CONTENT)) continue;

                    if (recommendKeyVal.IS_SELECT !== undefined && recommendKeyVal.IS_SELECT === false) continue;

                    let navKey = this.navKeyMap.get(recommendKeyVal.SHOW_CONTENT);
                    // 如果推荐的再导航中没有则不显示该推荐
                    if (recommendInfo[navKey].index === 6) continue;

                    recommendListSort.push(navKey);
                    recommendInfo[navKey].text = recommendKeyVal.BAR_NAME
                        || recommendInfo[navKey].text || recommendInfo[navKey].listKey;
                }

                let shareInfo = item.shareInfo || {};
                if (data.SHARE_TITLE) {
                    shareInfo.text = data.SHARE_TITLE;
                }
                if (data.SHARE_IMG) {
                    shareInfo.imgSrc = data.SHARE_IMG;
                }

                item.navInfo = navInfo;
                item.recommendListSort = recommendListSort;
                item.recommendInfo = recommendInfo;
                item.shareInfo = shareInfo;
                callback(item);
            })
            .catch(err => {
                console.error("---err---", err);
                callback({});
            });
    }
}

export function UpNavListInfo(page, eventKey, haveData = false, privateData = {}) {
    let navInfo = privateData.changeButtonArr || [];
    let item = {};
    for (let i = 0;i<navInfo.length;i++) {
        if (eventKey === navInfo[i].event) {
            navInfo[i].haveData = haveData;
            item = navInfo[i];
            break;
        }
    }
    privateData.changeButtonArr = navInfo;
    // page.setData({changeButtonArr: navInfo});
}
