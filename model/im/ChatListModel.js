import {DefaultModel} from "../DefaultModel";
import {Notification} from "../../utils/Notification";
import {Notify} from "../../utils/Notify";
import {Const} from "../../utils/Const";
import {ImChart, UpUnReadNumTab} from "../../utils/ImChart";
import {GetBrokerContactInfo, InitImChart} from "../../net/im/InitImChart";
import {UserInfoModel} from "../UserInfoModel";
import {GpsInfoModel} from "../GpsInfoModel";


// IM列表model
export class ChatListModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ChatListModel"
    }

    getIsLocal() {
        return true;
    }
}

// 处理本地列表
export class DealChartListModel {
    // 会话的 messageId 指的就是 archiveId
    messageId = "";

    constructor(messageId) {
        this.messageId = messageId;
    }

    // 发送会话列表改变的通知
    sendMsgListNc() {
        setTimeout(() => {
            new Notification().postNotification(Notify.UpChartListChanged.Name);
        }, 100);
    }

    // 获取当前会话map
    getMessageMap() {
        if(!this.messageId) return {};

        let map = new ChatListModel().getModel() || {};
        return map[this.messageId] || {};
    }

    // 更新当前会话map
    upMessageMap(item = {}) {
        if(!this.messageId) return;

        let map = new ChatListModel().getModel() || {};
        if(Object.keys(item).length === 0) return;

        map[this.messageId] = item;
        new ChatListModel().setModel(map);
    }

    // 获取聊天列表
    getMsgList() {
        let listModel = new ChatListModel().getModel() || {};
        if (Object.keys(listModel).length > 0) {
            let list = Object.keys(listModel).map(key=> listModel[key]);
            // 将优优好房替换悠居客 消息列表
            list.forEach((item,index)=>{
                if(item.accid == ImChart.serviceId && typeof item.body == 'string'){
                    item.body = item.body.replace('优优好房',Const.platformTitle);
                    item.body = item.body.replace("小优", "");
                    if(item.body && item.body.indexOf("成交还可抽取4999元现金补贴") >= 0) {
                        item.body = item.body.replace('成交还可抽取4999元现金补贴', "成交还能抽取户购房佣金全返奖励");
                    }
                    if(item.body && item.body.indexOf("如何才能拿4999元补贴") >= 0) {
                        item.body = item.body.replace('如何才能拿4999元补贴', "如何才能拿购房佣金全返奖励");
                    }
                    if(item.body && item.body.indexOf("补贴4999元") >= 0) {
                        item.body = item.body.replace('补贴4999元', "获得购房佣金全返奖励");
                    }
                }
            });
            return list;
        }

        return [];
    }

    // 屏蔽和解除屏蔽
    // blockUserId 屏蔽的id
    // status == true ? 屏蔽 : 解除屏蔽
    blockMsg(status) {
        let obj = this.getMessageMap();
        obj.isShield = status ? 1 : 0;
        obj.isShowBtn = false;
        this.upMessageMap(obj);
        this.sendMsgListNc();
    }

    // 删除消息
    // removeId 删除id
    deleteMsg() {
        if(!this.messageId) return;

        let map = new ChatListModel().getModel() || {};
        if(!map[this.messageId]) return;

        delete map[this.messageId];
        // 同时删除对应的未读数
        UpUnReadNumTab.removeReadNum(this.messageId);
        new ChatListModel().setModel(map);
        this.sendMsgListNc();
    }

    // 接受新消息
    newMsg(item) {
        let map = new ChatListModel().getModel() || {};
        if(!item.messageId) return;

        let obj = map[item.messageId] || {};
        obj.msg_timestamp = item.msg_timestamp;
        obj.msg_type = item.msg_type;
        obj.body = item.msg;
        if(!map[item.messageId]) {
            obj["accid"] = item.messageId;
            obj["name"] = item.name || "";
            obj["isShield"] = 0;
            obj["id"] = item.messageId;
            obj["from_account"] = item.messageId;
            obj["to"] = item.to;
            obj["msg_timestamp"] = item.msg_timestamp;
            let me = new UserInfoModel().getModel("me") || {userId: "219977"};
            let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
            let promiseArr = [
                new InitImChart({
                    accid: "uu_" + me.userId,
                    toUserId: item.messageId,
                    cityId: cityInfo.cityId || "1",
                    isRefresh: 0
                }).send()
            ];
            if(ImChart.serviceId != item.messageId) {
                promiseArr.push(
                    new GetBrokerContactInfo({
                        archiveId: item.messageId
                    }).send()
                );
            }
            Promise.all(promiseArr).then(responseData => {
                let res = responseData[0] || {};
                let otherInfo = res && res.data ? res.data.toUserInfo : {};
                if(ImChart.serviceId == otherInfo.accid){
                    otherInfo.icon = Const.platformIcon;
                }
                let otherHeadImg = otherInfo.icon || Const.imDefaultHeadImg;
                obj.icon = otherHeadImg;
                if(responseData.length > 1) {
                    let compInfo = responseData[1].DATA || {};
                    if(compInfo.brokerArchiveId) {
                        obj.compName = compInfo.compCname || "";
                    }
                }
                map[item.messageId] = obj;
                new ChatListModel().setModel(map);
                this.sendMsgListNc();
            });
            return;
        }

        if(obj.accid == ImChart.getServiceId()) {
            obj["name"] = "专属客服";
            obj["icon"] = Const.platformIcon+'?t=20190716';
        }
        map[item.messageId] = obj;
        new ChatListModel().setModel(map);
        this.sendMsgListNc();
    }
}
