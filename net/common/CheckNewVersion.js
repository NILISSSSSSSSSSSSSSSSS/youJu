

import {RequestApi, RequestApiItem} from "../../utils/RequestApi";
import {Const} from "../../utils/Const";

// 检查更新 java
class CheckNewVersionApi extends RequestApi{
  constructor(responseData) {
    let item = new RequestApiItem();
    item.domain = "java";
    item.data = responseData;
    super(item);
  }
  
  getUrl() {
    return "/uuhfWeb/userLonginManager/initAppAction";
  }
}
export class CheckNewVersion {
  // deviceType 1 安卓  2 ios
  constructor(request = {}) {
    this.request = request;
  }
  
  send() {
    return new CheckNewVersionApi(this.request).send()
      .then(res => {
        if (res.STATUS != 1) {
          return Promise.reject(res);
        }
        
        let data = res.DATA || {};
        let androidVersion = data.androidVersion || {};
        let iosVersion = data.iosVersion || {};
        let response = {
          status: 1,
          code: 200,
          errCode: 200,
          data: {
            force: 0, // 是否强制更新 1是 0否
            upgradeDesc: "",
            upgradeUrl: "",
            versionName: "",
          }
        };
        let info = this.request.deviceType == 1
          ? androidVersion
          : this.request.deviceType == 2
            ? iosVersion
            : {};
        response.data.force = info.force || 0;
        response.data.upgradeDesc = info.updateContent || "";
        response.data.upgradeUrl = info.updateUrl || "";
        response.data.versionName = info.version || "";
        return response;
      });
  }
}
