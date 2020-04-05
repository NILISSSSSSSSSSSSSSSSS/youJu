import {Const} from "../../utils/Const";
import { GetUserBehavior } from "../../net/GetUserBehavior.js";
import { SaveUserBehavior } from "../../net/SaveUserBehavior.js";
import { InitEnterStoreCount } from "../../net/InitEnterStoreCount.js";
import {UserInfoModel} from "../../model/UserInfoModel";


export class behavi{
  // 请求后台文案模板
  constructor() {
  }
  getBehaviorConfig(){
    return new Promise((resolve, reject) => {
      if(uni.getStorageSync('behavShipiorConfig')){
        resolve(uni.getStorageSync('behavShipiorConfig'));
        return;
      }

      new GetUserBehavior({behaviorType: ""}).send().then((res) => {
        let list = res ? res.data || [] : [];
        uni.setStorageSync('behavShipiorConfig', list);
        resolve(list);
      });
    });
  };
  // 第N次访问
  getInStoreCount(data){
    var that = this;
    new InitEnterStoreCount({
      archiveId:data.params.archiveId,
      caseId:'',
      caseType:'',
      userId:data.params.userId,
      flagshipStore: data.params.flagshipStore,
    }).send().then(res => {
      let inStoreCount =  res && res.data && res.data.inStoreCount
          ? res.data.inStoreCount+1 : 0;
      let inStoreResidenceTime =  res && res.data && res.data.inStoreCount
          ? res.data.inStoreResidenceTime : 0;
      uni.setStorageSync("inStoreCount", inStoreCount);
      uni.setStorageSync("inStoreResidenceTime", inStoreResidenceTime);
      if(inStoreCount>0){
        data.index = '56';
        data.text.push(inStoreCount);
        that.formatConfig(data);
      }else{
        data.index = '55';
        that.formatConfig(data);
      }
    })
  };
  // 格式化文案信息并组织保存
  formatConfig(data){
    if(!data){return}
    this.getBehaviorConfig()
      .then(res => {
        var havifig = null;
        for (var i = 0; i < res.length;i++){
          if (res[i].behaviorType == data.index){
            havifig = res[i];
            break;
          }
        }
        if (!havifig){return;}
        //调整替换统计 去除用户名字，单独加字段传 behaviorNickName (2018-02-11)
        let userInfo = new UserInfoModel().getModel("userInfo")
            ? new UserInfoModel().getModel("userInfo").userInfo || {} : {};
        let userName = userInfo.nickName ? userInfo.nickName : userInfo.wxNickname;
        if (!userInfo || !userName) {
          return;
        }

        if (!!data.text[0] && data.text[0] == userName) {
          data.text[0] = '';
        }

        let me = new UserInfoModel().getModel("me") || {};
        if(!me.userId) return;

        var retext = this.repString(data.text,havifig.behaviorContent);
        var saveParams = {
          behaviorType:data.index,
          intentionalityScore:havifig.intentionalityScore,
          cUserId: me.userId,
          shareArchiveId:data.params.archiveId,
          cityId:data.params.cityid,
          behaviorContent:retext,
          sourceType:'2',
          caseType:data.params.caseType,
        };
        this.saveCustBehavior(saveParams);
      });
  }
  // 替换字符串
  repString(data,haviorConfig){
    haviorConfig = haviorConfig.replace(/N/g, '【】');
    data.forEach((item,index) => {
      haviorConfig = haviorConfig.replace('【】', item);
    });
    // 需要处理特殊字符，都可放入这里替换
    haviorConfig = haviorConfig.replace('以上㎡','㎡以上').replace('以下㎡','㎡以下');
    return haviorConfig;
  }
  // 保存信息
  saveCustBehavior(params){
    //调整替换统计 去除用户名字，单独加字段传 behaviorNickName (2018-02-11)
    //统一新增用户昵称字段 和行为类型字段（暂时不传）
    let userInfo = new UserInfoModel().getModel("userInfo")
        ? new UserInfoModel().getModel("userInfo").userInfo || {} : {};
    let userName = userInfo.nickName ? userInfo.nickName : userInfo.wxNickname;
    params['behaviorStyle'] = '';
    if (typeof (userName) != 'undefined') {
      //避免重复出现用户名
      if(params.behaviorContent.indexOf(userName) == -1){
        params['behaviorNickName'] = userName;
      }
    }

    if (!params.behaviorContent || params.behaviorContent.indexOf("undefined") >= 0) {
      return;
    }

    params["cPlateType"] = Const.cPlateType_zdzfstore;
    new SaveUserBehavior(params).send();
  }

  getExitCount(data) {
    if (!uni.getStorageSync("enterCompStoreTime")) return;

    let inStoreCount = uni.getStorageSync("inStoreCount") || 0;
    let type = "62";
    if (inStoreCount > 0) {
      type = "63";
    }
    data.index = type;
    let residenceTime = parseInt((new Date().getTime() - Number(uni.getStorageSync("enterCompStoreTime")))/1000);
    data.text.push(inStoreCount == 0 ? "1" : inStoreCount);
    data.text.push(this.formatTimeData(residenceTime));
    let formatDateInfo = this.formatTimeData(residenceTime+Number(uni.getStorageSync("inStoreResidenceTime")));
    if (type == "63") {
      data.text.push(formatDateInfo);
    }
    data.params.residenceTime = residenceTime;
    this.exitFormatConfig(data);
  }
  exitFormatConfig(data){
    if(!data){return}
    this.getBehaviorConfig()
      .then(res => {
        let havifig = null;
        for (var i = 0; i < res.length;i++){
          if (res[i].behaviorType == data.index){
            havifig = res[i];
            break;
          }
        }
        if (!havifig){return;}
        let retext = this.repString(data.text,havifig.behaviorContent);
        let me = new UserInfoModel().getModel("me") || {};
        let saveParams = {
          behaviorType:data.index,
          intentionalityScore:havifig.intentionalityScore,
          cUserId:me.userId || "",
          shareArchiveId:data.params.archiveId,
          cityId:data.params.cityid,
          behaviorContent:retext,
          sourceType:'2',
          caseType:data.params.caseType,
          residenceTime: data.params.residenceTime
        };
        this.saveCustBehavior(saveParams);
      });
  }

  formatTimeData(timer){
    if(!timer){
      return false;
    }

    var secondTime = parseInt(timer);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if(minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    var result = "" + parseInt(secondTime);

    if(minuteTime > 0) {
      result = "" + parseInt(minuteTime) + "分" + result;
    }
    if(hourTime > 0) {
      result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
  }
}
