

// 设置临时id
import {CompStoreCityIdModel} from "../model/CompStoreModel";
import {GpsInfoModel} from "../../model/GpsInfoModel";
import {UserInfoModel} from "../../model/UserInfoModel";
import {AccessStatistics, ReceiveUserBehavior} from "../net/CompStoreNet";

class UpShortTimeUserId {
    static storageKey = "ShortTimeUserId";
    static expireTime = 1 * 60 * 60 * 1000; // 过期时间

    static getCurrentTimeStr() {
        return new Date().getTime();
    }

    // from => 来源， 例如：优优小程序（uu_wxApp），最新优选好房（store_wxApp），
    // 微店小程序（wd_wxApp），微店公众号（wd_h5）
    static setId(from = "uu") {
        uni.setStorageSync(this.storageKey, JSON.stringify({
            userId: from + "_" + this.getCurrentTimeStr(),
            expireTime: this.expireTime + this.getCurrentTimeStr()
        }));
    }

    static getId(from = "uu") {
        let info = uni.getStorageSync(this.storageKey) || "";
        info = info ? JSON.parse(info) : {};
        if (!info.expireTime || info.expireTime <= this.getCurrentTimeStr()) {
            this.setId(from);
            info = uni.getStorageSync(this.storageKey) || "";
            info = info ? JSON.parse(info) : {};
        }
        return (info.userId || "");
    }
}


class StatisticsReportDefault {
    scanSceneMap = [1011, 1012, 1013, 1025, 1031, 1032, 1047, 1048, 1049];  // 扫码进入场景值
    shareSceneMap = [1007, 1008, 1096];  // 分享进入场景值

    constructor() {
    }

    getUserId() {
        return "";
    }

    getCityId() {
        return "";
    }

    // 发送请求
    send(requestItem = this.getRequestItem()) {}

    // 返回请求接口所需的字段
    getRequestItem() {
        class RequestItem {
            // 0=未知 1=uuapp 3=掌上好房通 4=erp门店版 5=erp精英版 6=crm
            // 7=置业顾问 8=新盘paid 9=微店小程序 10=微店公众号 11=最新优选好房小程序
            // 12=优优小程序(百度，支付宝,头条) 13=优优小程序(微信) 14=优优Wap站 15=优优PC站"
            aty = 0;

            // 渠道主要用c端分享活动使用 0=未知 1=个人名片分享，2=微店分享，
            // 3=税费打印，4=标贴打印，5=营销推广微信问候，
            // 6=营销锦囊分享统计 || 7=分享房源链接 8=房源推广分享快消海报
            // 9=房源推广房源多图分享 10=房源推广拓客分享楼书 11=营销推广个人微店海报
            //  12.新盘海报分享 13.新盘拓客楼书分享 14.新盘多图分享 15.新盘链接分享",
            channel = 0;
            cityId = "";
            ext = {}; // (object)扩展元素字段 json 对象 eg:{"archiveId":123}"
            uty = 0;  // 用户类型 1=登陆用户 0=临时用户
            uid = "";  // 用户id 如果有则用userId否则生成一个即可
            ot = ""; //  客户端时间发生时间戳13位ms
            pfm = "";  // 平台类型 1=安卓 2=ios 3=浏览器 4=pc
            dty = "";  // 设备类型 华为、苹果6...
        }

        return new RequestItem();
    }

    // 获取设备信息
    getSystemInfo() {
        let res = uni.getSystemInfoSync();
        return res || {};
    }

    // 获取当前页面存在个数
    getCurrentPages() {
        return (getCurrentPages() || []);
    }

    // 过滤无效参数
    dealParams(params = {}) {
        let newParams = {};
        for (let key in params) {
            if (params[key] !== 0 && !params[key]) {
                continue;
            }

            newParams[key] = params[key];
        }
        return newParams;
    }

    // 获取场景值 返回 0=未知 1=微信分享 2=识别二维码
    getScene() {
        let res = {scene: 0};
        // #ifdef MP-WEIXIN
        res = {scene: getApp().globalData.scene};
        // #endif
        if(!res.scene) return 0;

        if (this.scanSceneMap.includes(res.scene)) return 2;

        if(this.shareSceneMap.includes(res.scene)) return 1;

        return 0;
    }
}

// java埋点
export class StatisticsReport extends StatisticsReportDefault {
    scanEnterErHouseDetail = 8;    // 扫码进入二手房和租房详情channel
    shareEnterErHouseDetail = 7;   // 分享进入二手房和租房详情channel
    defaultChannel = 0;             // 未知channel
    scanEnterStore = 11;            // 扫码进入微店channel
    shareEnterStore = 2;            // 分享进入微店channel
    scanEnterNewHouseDetail = 12;  // 扫码进入新房详情channel
    shareEnterNewHouseDetail = 15; // 分享进入新房详情channel

    aty = 11; // 产品
    from = "store";  // 来源

    constructor(props) {
        super(props);
    }

    getUserId() {
        return (new UserInfoModel().getModel("me")
            ? new UserInfoModel().getModel("me").userId || "" : "");
    }

    getCityId() {
        return new CompStoreCityIdModel().getModel() ||
            ( new GpsInfoModel().getModel("cityInfo")
                ? new GpsInfoModel().getModel("cityInfo").cityId || "" : "");
    }

    // 旗舰店首页参数字段
    getCompInfo() {
        class CompInfo {
            compId = ""; // 公司id
            compName = "";  // 公司名称
            buildId = "";  // 楼盘id
            buildName = "";  // 楼盘名称
        }
        return new CompInfo();
    }

    send(channel, archiveId, pfm = "", compInfo = this.getCompInfo()) {
        if (!archiveId && !compInfo.compId) return;

        let sysInfo = this.getSystemInfo();
        let requestItem = this.getRequestItem();
        requestItem.aty = this.aty;
        requestItem.channel = this.getScene();
        requestItem.cityId = this.getCityId();
        requestItem.ext = {archiveId: archiveId};
        requestItem.uid = this.getUserId()
            ? this.getUserId()
            : UpShortTimeUserId.getId(this.from);
        requestItem.uty = this.getUserId() ? 1: 0;
        requestItem.ot = UpShortTimeUserId.getCurrentTimeStr();
        requestItem.dty = sysInfo.model || "";
        requestItem.pfm = pfm ? pfm : !sysInfo.system
            ? "" :  sysInfo.system.indexOf("iOS") >= 0 ? 2 : 1;
        for (let key in compInfo) {
            if(!compInfo[key]) continue;

            requestItem.ext[key] = compInfo[key];
        }
        // console.error("--requestItem---", this.dealParams(requestItem));
        return this.request(this.dealParams(requestItem));
    }

    request(requestItem = {}) {
        return new Promise((resolve, reject) => {
            new ReceiveUserBehavior({data: JSON.stringify([requestItem])}).send();
        });
    }
}



/* ------------- 实时统计 ----------- */
// 实时统计default
class RealTimeStatisticsDefault extends StatisticsReportDefault {
    constructor(props) {
        super(props);
    }

    getRequestItem() {
        class RequestItem {
            // 产品
            // 0=未知 1=优优小程序(微信) 2=微店小程序 3=微店公众号 4=最新优选好房小程序
            // 5=优优小程序(百度，支付宝,头条) 6=优优Wap站 7=优优PC站
            aty = 0;
            // 来源渠道途径
            // 0=未知 1=微信分享 2=识别二维码
            channel = 0;
            cityId = "";  // 城市id
            pageUrl = "";  // 页面路径
            pageDesc = "";  // 页面描述
            uid = "";  // 用户id，未登陆用户用uuid 如果是经纪人用archiveId
            uty = 0;  // 用户类型 1=登陆用户 0=临时用户
            /* ------以上是必填项------- */

            compId = "";  // admin库公司Id
            erpCompId = "";  // erp库公司Id
            deptId = "";  // 门店Id
            archiveId = "";  // 经纪人Id
            buildId = "";  // 楼盘Id
            buildName = ""; // 楼盘名称
            dty = ""; // 设备类型 华为、苹果6...
            ext = null; // 扩展元素字段 json 对象 eg:{'archiveId':123}
            osv = "";  // 操作系统版本（win7 ios12 安卓4.0...）
            ot = "";  // 客户端时间发生时间戳13位ms
            pfm = "";  // 平台类型 1=安卓 2=ios 3=浏览器 4=pc
        }

        return new RequestItem();
    }
}

// 实时统计
export class RealTimeStatistics extends RealTimeStatisticsDefault {
    scanEnter = 2;         // 扫码进入channel
    shareEnter = 1;        // 分享进入channel
    defaultChannel = 0;   // 未知channel

    aty = 4; // 产品
    from = "store_wxApp";  // 来源

    constructor(props) {
        super(props);
        this.getScene();
    }

    getUserId() {
        return (new UserInfoModel().getModel("me")
            ? new UserInfoModel().getModel("me").userId || "" : "");
    }

    getCityId() {
        return new CompStoreCityIdModel().getModel() ||
            (new GpsInfoModel().getModel("cityInfo")
                ? new GpsInfoModel().getModel("cityInfo").cityId || "" : "");
    }

    // 旗舰店首页参数字段
    getCompInfo() {
        class CompInfo {
            compId = "";  // admin库的公司公司Id
            erpCompId = ""; // erp库的公司id
            deptId = "";  // 门店Id
            archiveId = "";  // 经纪人Id
            buildId = "";  // 楼盘Id
            buildName = ""; // 楼盘名称
            pfm = "";  // 平台类型 1=安卓 2=ios 3=浏览器 4=pc
            pageDesc = "";  // 页面title
        }
        return new CompInfo();
    }

    send(compInfo = this.getCompInfo(), channel) {
        let pages = this.getCurrentPages();
        let sysInfo = this.getSystemInfo();
        let requestItem = this.getRequestItem();
        requestItem.channel = channel === undefined ? this.getScene() : channel;
        requestItem.aty = this.aty;
        requestItem.cityId = this.getCityId();
        requestItem.uid = this.getUserId()
            ? this.getUserId()
            : UpShortTimeUserId.getId(this.from);
        requestItem.pageUrl = pages.length > 0 ? pages[pages.length - 1].route || "" : "";
        requestItem.uty = this.getUserId() ? 1: 0;
        requestItem.ot = UpShortTimeUserId.getCurrentTimeStr();
        requestItem.dty = sysInfo.model || "";
        requestItem.osv = sysInfo.system || "";
        requestItem.pfm = compInfo.pfm ? compInfo.pfm : !sysInfo.system
            ? "" :  sysInfo.system.indexOf("iOS") >= 0 ? 2 : 1;
        for (let key in compInfo) {
            if(compInfo[key] !== 0 && !compInfo[key]) continue;

            // 底层配置的字段中如果没有这个key则不要（瞎传的key不要）
            if(requestItem[key] === undefined) continue;

            // 底层已经赋值的上层传了也不要（免得瞎传）
            if(requestItem[key] === 0 || requestItem[key]) continue;

            requestItem[key] = compInfo[key];
        }

        let dealResult = this.dealParams(requestItem);
        // 检查必填项
        let mustKeys = ["channel", "aty", "cityId", "pageUrl", "pageDesc", "uid", "uty"];
        for (let key of mustKeys) {
            if(dealResult[key] !== 0 && !dealResult[key]){
                console.error("必填项" + key + "不完整");
                return Promise.resolve("必填项" + key + "不完整");
            }
        }

        return this.request(dealResult);
    }

    request(requestItem = {}) {
        return;

        return new Promise((resolve, reject) => {
            new AccessStatistics(requestItem).send();
        });
    }
}
