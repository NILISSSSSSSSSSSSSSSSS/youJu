import {Const} from "./Const";
import {Config} from "./config.js";

class RequestTimeOut {
  timeoutFun = null;
  
  constructor() {
    this.timeoutTime = 100000;
  }
  
  send() {
    return new Promise((resolve, reject) => {
      this.timeoutFun = setTimeout(() => {
        this.claer();
        reject("超时");
      }, this.timeoutTime);
    });
  }
  
  claer() {
    if (this.timeoutFun) {
      clearTimeout(this.timeoutFun);
      this.timeoutFun = null;
    }
  }
}


export class RequestApiItem {
  method = "get"; // 默认get
  domain = "uuweb";  // 域名
  data = {};
}

export class RequestApi {
  url = "";
  
  constructor(item = new RequestApiItem()) {
    this.request = item;
    this.url = Config[item.domain] + this.getUrl();
    if (this.getUrl().indexOf("http") >= 0) {
      this.url = this.getUrl();
    }
  }
  
  factoryMap() {
    let map = new Map([
      ["get", "getRequest"]
      , ["post", "postRequest"]
    ]);
    if (!map.has(this.request.method)) return "nullRequest";
    
    // // 没有c端用户
    // if(this.request.data.userId != undefined && this.request.data.userId == ''){
    // 	return "nullRequest";
    // }
    
    return map.get(this.request.method);
  }
  
  send() {
    return new Promise((resolve, reject) => {
      if (!this.url) {
        throw new Error("请配置请求的url");
      }
      
      if (typeof this.request.data === "object"
        && this.request.data instanceof Array) {
        throw new Error("data类型是对象");
      }
      
      this.request.data = this.request.data || {};
      
      let cPlateType4List = [
        "/api/elses/getBrokerCallType",
        "/api/index/index",
        "/api/index/updateFavoriteStatus",
        "/api/house/getBuildDetail",
        "/api/house/getHouseList",
        "/api/house/getHotList",
        "/api/house/querBuildTrend"
      ];
      if (!this.request.data["cPlateType"]) {
        this.request.data["cPlateType"] = 6;  // 6代表子单找房平台
        if (this.request.domain === "kaidanbao") {
          for (let info of cPlateType4List) {
            if (this.url.indexOf(info) >= 0) {
              this.request.data["cPlateType"] = 4;  // 4代表子单找房
            }
          }
        }
      }
      
      let timeoutVal = new RequestTimeOut();
      Promise.race([this[this.factoryMap()](), timeoutVal.send()])
        .then((res) => {
          timeoutVal.claer();
          resolve(res);
        })
        .catch(err => {
          timeoutVal.claer();
          reject(err)
        });
    });
  }
  
  getRequest() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: this.url,
        data: this.request.data,
        header: {
          "U-FS": "zdzfmini"
        },
        method: "GET",
        success: (res) => {
          if (res.status && res.status !== Const.success) {
            reject(res);
            return;
          }
          
          if (res.statusCode && res.statusCode !== Const.success) {
            reject(res);
            return;
          }
          
          let info = res.data || {};
          if (info.DATA && info.data === undefined) {
            info.data = info.DATA;
          }
          if (info.DATA === undefined && info.data) {
            info.DATA = info.data;
          }
          if (info.code && info.code === Const.success
            && (info.STATUS === undefined || info.status === undefined)) {
            info.STATUS = 1;
            info.status = 1;
          }
          if (info.code && info.code !== Const.success
            && (info.STATUS === undefined || info.status === undefined)) {
            info.STATUS = 0;
            info.status = 0;
          }
          if (info.code && info.code === Const.success
            && (info.ERROR_CODE === undefined)) {
            info.ERROR_CODE = 0;
          }
          if (info.code && info.code === Const.success
            && (info.errCode === undefined)) {
            info.errCode = Const.success;
          }
          if (info.msg) {
            info.INFO = info.msg;
            info.errMsg = info.msg;
          }
          if (info.INFO) {
            info.msg = info.INFO;
            info.errMsg = info.msg;
          }
          resolve(info);
        },
        fail: (res) => {
          reject(res);
        }
      });
    });
  }
  
  postRequest() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: this.url,
        data: this.request.data,
        method: "POST",
        header: {
          "content-type": this.request.header || "application/x-www-form-urlencoded",
          "U-FS": "zdzfmini"
        },
        success: (res) => {
          if (res.status && res.status !== Const.success) {
            reject(res);
            return;
          }
          
          if (res.statusCode && res.statusCode !== Const.success) {
            reject(res);
            return;
          }
          
          let info = res.data || {};
          if (info.DATA === undefined && info.data) {
            info.DATA = info.data;
          }
          if (info.code && info.code === Const.success
            && (info.STATUS === undefined || info.status === undefined)) {
            info.STATUS = 1;
            info.status = 1;
          }
          resolve(info);
        },
        fail: (res) => {
          reject(res);
        }
      });
    });
  }
  
  nullRequest() {
    return new Promise((resolve, reject) => {
      reject("");
      throw new Error("请求method不是get/post");
    });
  }
  
  getUrl() {
    return ""
  }
}
