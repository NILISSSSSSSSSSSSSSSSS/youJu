<template>
  <view class="message_view">
    <scrollLoading v-if="!chartList" :isScrollIng="true" :haveMoreData="true"></scrollLoading>
    <view>
      <!--系统消息-->
      <view @click="goSysMsg" class="f_r_s message_item">
        <view class="head_img_view">
          <image mode="aspectFill" src="http://cdn.haofang.net/static/uuminiapp/im/icon_systeminformation.png"></image>

          <view v-if="sysMsgItem.haveNewMsg" class="point_red"></view>
        </view>

        <view class="f_c_c message_cont">
          <view class="f_r_b message_top">
            <view class="massage_name">系统消息</view>

            <view class="message_last_time">{{ sysMsgItem.timeText || "" }}</view>
          </view>

          <view class="f_r_b msg_text_view">
            <view class="msg_text">{{ sysMsgItem.contents && sysMsgItem.contents.length > 0 ? sysMsgItem.contents[0] :
              "" }}
            </view>
          </view>
        </view>
      </view>

      <!--其他消息-->
      <view :class="{message_left: item.isShowBtn}" class="f_r_s message_item"
            v-for="(item, index) in chartList" :key="index"
            @click.stop="getChartDetail(item, index)"
            @touchstart="touchStart($event, index, item)"
            @touchend="touchEnd($event, index, item)">
        <view @click.stop="getChartDetail(item, index)" class="head_img_view">
          <image mode="aspectFill" @error="imgError(item, index)" :src="item.headImg"></image>
          <view v-if="item.unRead && item.unRead > 99" class="point">99+</view>
          <view v-if="item.unRead && item.unRead <= 99" class="point">{{ item.unRead }}</view>
        </view>

        <view class="f_c_c message_cont">
          <view @click.stop="getChartDetail(item, index)" class="f_r_b message_top">
            <view class="f_r_s massage_name_view">
              <view class="massage_name">{{ item.name }}</view>
              <view v-if="item.compName" class="massage_compName">{{ item.compName }}</view>
            </view>

            <view class="message_last_time">{{ item.lastTime }}</view>
          </view>

          <view @click.stop="getChartDetail(item, index)" class="f_r_b msg_text_view">
            <view class="msg_text">{{ item.msg }}</view>

            <view v-if="item.isShield == 1" class="ping_bi_icon"></view>
          </view>
        </view>

        <view class="f_r_e right_btn_view">
          <view @click.stop="blockMsg(item, index)"
                class="ping_bi_btn">{{ item.isShield == 1 ? "解除屏蔽" : "屏蔽" }}
          </view>
          <view class="del_btn" @click.stop="delMsg(item, index)">删除</view>
        </view>
      </view>
    </view>

    <view class="empty_view"></view>

    <loginView></loginView>
  </view>
</template>

<script>
  import {UserInfoModel} from "../../model/UserInfoModel.js";
  import {formatTimeNew, compare} from "../../utils/common.js";
  import {ChartListItem, UpUnReadNumTab} from "../../utils/ImChart.js";
  import {Notify} from "../../utils/Notify.js";
  import {Notification} from "../../utils/Notification.js";
  import {UnReadMsgModel} from "../../model/im/UnReadMsgModel.js";
  import {DealChartListModel} from "../../model/im/ChatListModel";
  import {GetSysMessageAction} from "../../net/im/InitImChart";

  // 系统消息item
  class SysMsgItem {
    title = ""; // 内容的标题
    timeText = ""; // 格式化后的时间
    timeStr = 0;  // 时间戳
    contents = [];  // 内容数组[String]
    isTimeout = 0;  // 是否失效 ? 1失效 : 0未失效
    readFlag = 1;  // 1 已读 0未读
    showDetail = 0;  // 是否展示详情 ? 1显示 : 其他不显示
    caseType = "";
    entrustId = ""; // 委托id
    wfId = "";  // 	系统消息主键id
    haveNewMsg = false;
  }

  class TouchMove {
    static startClientX = 0;
    static startClientY = 0;
    static endClientX = 0;
    static endClientY = 0;
    static page = null;  // vue 的作用域
    static index = 0;  // 当前的index

    static init() {
      this.hideAll();
      let yCha = Math.abs(this.endClientY - this.startClientY);
      let xCha = Math.abs(this.endClientX - this.startClientX);
      if (yCha >= xCha) {
        this.hide();
        return;
      }

      if (xCha <= 40) return;

      if (this.endClientX - this.startClientX < 0) {
        this.show();
        return;
      }

      if (this.endClientX - this.startClientX > 0) {
        this.hide();
      }
    }

    static hideAll() {
      this.page.chartList.map(item => {
        item.isShowBtn = false;
      });
    }

    static hide(i = this.index) {
      if (!this.page.chartList) return;

      let item = this.page.chartList[this.index] || {};
      item.isShowBtn = false;
      this.page.$set(this.page.chartList, this.index, item);
    }

    static show() {
      if (!this.page.chartList) return;

      let item = this.page.chartList[this.index] || {};
      item.isShowBtn = true;
      this.page.$set(this.page.chartList, this.index, item);
    }
  }

  export default {
    data() {
      return {
        chartList: null,
        defaultHead: "http://cdn.haofang.net/static/uuminiapp/mine/fang_default.png",
        serviceId: this.ImChart.getServiceId(),
        sysMsgItem: new SysMsgItem(),  // 系统消息
      };
    },

    onShareAppMessage() {
      return new this.ShareAppMessage().init();
    },

    onShow() {
      UpUnReadNumTab.setTab();
      new this.SetMetaInfo().initDefault();
      this.initData();
    },

    onLoad() {
      this.initSysMsg();
      // 更新列表NC
      new Notification().addObserver(this, "UpChartListChanged", Notify.UpChartListChanged.Name);
      // 更新消息体NC(不用这个了)
      new Notification().addObserver(this, "UpChartMsgChanged", Notify.UpChartMsgChanged.Name);
      // 监听用户信息事件
      new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
      // 监听委托新消息
      new Notification().addObserver(this, "NewMsgChanged", Notify.NewMsgChanged.Name);
    },

    onUnload() {
      // 反注册通知
      new Notification().removeObserverAllNotification(this);
    },

    methods: {
      // 委托消息回调
      NewMsgChanged(name, item) {
        // 委托类型在执行
        if (item.type === Notify.NewMsgChanged.Type_entrust) {
          this.initSysMsg();
        }
      },

      // 初始化系统消息
      initSysMsg() {
        let me = new UserInfoModel().getModel("me") || {};
        if (!me.userId) return;

        return new GetSysMessageAction({
          pageNum: 1,
          pageSize: 1,
          youyouUserId: me.userId
        }).send().then(res => {
          if (res.STATUS != 1) {
            return;
          }

          let sysMsgList = [];
          let list = res.DATA ? res.DATA.list || [] : [];
          let haveNewMsg = false;
          for (let info of list) {
            if (!info.title) continue;

            let item = new SysMsgItem();
            item.title = info.title || "";
            item.timeText = info.createTime.replace(".", "/");
            item.timeText = item.timeText.replace(".", "/");
            item.contents = [];
            for (let i = 1; i <= 4; i++) {
              if (!info["kwd" + i]) continue;

              item.contents.push(info["kwd" + i]);
            }
            item.isTimeout = info.isTimeout || 0;
            item.readFlag = info.readFlag;
            item.showDetail = info.showDetail || 0;
            item.caseType = info.caseType || "";
            item.entrustId = info.pushLogId || "";
            item.wfId = info.wfId || "";
            if (item.readFlag != 1) {
              haveNewMsg = true;
            }
            sysMsgList.push(item);
          }
          let sysMsgItem = sysMsgList && sysMsgList.length > 0 ? sysMsgList[0] : new SysMsgItem();
          if (sysMsgList && sysMsgList.length > 0) {
            sysMsgItem.haveNewMsg = haveNewMsg;
          }
          if (sysMsgItem.contents.length === 0) {
            sysMsgItem.contents = ["暂无系统消息"];
          }
          this.sysMsgItem = sysMsgItem;
        });
      },

      // 用户消息回调
      UserInfoChanged() {
        UpUnReadNumTab.setTab();
        this.initData();
        this.initSysMsg();
      },

      initData() {
        this.drawChartList();
      },

      // 跳转到系统消息
      goSysMsg() {
        uni.navigateTo({
          url: "/pagesTool/messageDetail/systemMessage"
        });
      },

      // 渲染列表
      drawChartList() {
        let serviceId = this.ImChart.getServiceId();
        let res = new DealChartListModel(serviceId).getMsgList();
        let userInfo = new UserInfoModel().getModel("userInfo") || {};
        userInfo = userInfo["userInfo"] || {};
        let userName = userInfo.nickName || "";
        let me = new UserInfoModel().getModel("me") || {};
        if (!me.userId) return;

        let firstItem = {
          messageId: serviceId,
          headImg: this.Const.platformIcon + '?t=20190716',
          name: '专属客服',
          lastTime: formatTimeNew(new Date().getTime()),
          msg: '很高兴为您服务!',
          sendtime: formatTimeNew(new Date().getTime()),
          lastTime_stamp: new Date().getTime(),
          unRead: 0,// 未读数
          isShield: 0,
          isShowBtn: false
        };

        if (!me.userId) {
          uni.showToast({
            title: "请先授权",
            icon: "none"
          });
          return;
        }

        let chartList = [];
        res = res || [];
        if (res.length > 0) {
          res.map(item => {
            if (typeof item.msg_timestamp === "string") {
              item.msg_timestamp = item.msg_timestamp.replace(/-/g, "/");
            }
            if (serviceId == item.accid
              || item == ("p2p-" + serviceId)) {
              firstItem.msg = item.body
                ? item.body
                : userName
                  ? userName + ",欢迎使用悠居客!"
                  : "很高兴为您服务!";
              firstItem.unRead = new UnReadMsgModel().getModel(serviceId) || 0;
              firstItem.lastTime_stamp = new Date(item.msg_timestamp).getTime();
              firstItem.lastTime = formatTimeNew(item.msg_timestamp);
              firstItem.sendtime = formatTimeNew(item.msg_timestamp);
            } else {
              let chartItem = new ChartListItem();
              chartItem.messageId = item.accid || "";
              chartItem.headImg = item.icon
                ? item.icon
                : this.defaultHead;
              chartItem.name = item.name || "";
              chartItem.lastTime = formatTimeNew(item.msg_timestamp);
              chartItem.msg = item.msg_type && item.msg_type === "VIDEO"
                ? "[视频]" : item.body || "";
              chartItem.sendtime = formatTimeNew(item.msg_timestamp);
              chartItem.unRead = new UnReadMsgModel().getModel(item.accid) || 0;
              chartItem.lastTime_stamp = new Date(item.msg_timestamp).getTime();
              chartItem.isShield = item.isShield || "";
              chartItem.isShowBtn = false;
              chartItem.compName = item.compName || "";
              chartList.push(chartItem);
            }
          });
        } else {
          firstItem.unRead = new UnReadMsgModel().getModel(serviceId) || 0;
        }
        chartList = chartList.sort(new compare("lastTime_stamp").maxToMin());
        chartList.unshift(firstItem);
        setTimeout(() => {
          this.chartList = chartList;
        }, 10);
      },

      initChartList() {
        let that = this;
        let serviceId = this.ImChart.getServiceId();
        let userInfo = new UserInfoModel().getModel("userInfo") || {};
        userInfo = userInfo["userInfo"] || {};
        let userName = userInfo.nickName || "";
        let me = new UserInfoModel().getModel("me") || {};
        if (!me.userId) return;

        let firstItem = {
          messageId: serviceId,
          headImg: this.Const.platformIcon + '?t=20190716',
          name: '专属客服',
          lastTime: formatTimeNew(new Date().getTime()),
          msg: '很高兴为您服务!',
          sendtime: formatTimeNew(new Date().getTime()),
          lastTime_stamp: new Date().getTime(),
          unRead: 0,// 未读数
          isShield: 0,
          isShowBtn: false
        };

        if (!me.userId) {
          uni.showToast({
            title: "请先授权",
            icon: "none"
          });
          return;
        }

        this.ImChart.getChartList((res) => {
          that.drawChartList();
        }, (err) => {
          uni.showModal({
            title: "温馨提示",
            content: "获取消息列表失败啦!请稍后重试。",
            confirmColor: "#ab7f2e",
            confirmText: "我知道了",
            showCancel: false
          });
        });
      },

      imgError(item, index) {
        item.headImg = this.defaultHead;
        this.$set(this.chartList, index, item);
      },

      touchStart(e, index, item) {
        let changedTouches = e.changedTouches || e.mp.changedTouches || [];
        if (!e || !changedTouches[0]) return;

        TouchMove.startClientX = changedTouches[0].clientX || 0;
        TouchMove.startClientY = changedTouches[0].clientY || 0;
      },

      touchEnd(e, index, item) {
        let changedTouches = e.changedTouches || e.mp.changedTouches || [];
        if (item.messageId == this.ImChart.getServiceId()) return;

        TouchMove.endClientX = changedTouches[0].clientX || 0;
        TouchMove.endClientY = changedTouches[0].clientY || 0;
        TouchMove.index = index;
        TouchMove.page = this;
        TouchMove.init();
      },

      // 屏蔽/解除
      blockMsg(item, index) {
        this.ImChart.blockMsg(item.messageId, !(item.isShield == 1));
      },

      // 删除消息
      delMsg(item, index) {
        this.ImChart.DeleteMsg(item.messageId);
      },

      // 查看详情
      getChartDetail(item, index) {
        let me = new UserInfoModel().getModel("me") || {};
        item.unRead = 0;
        UpUnReadNumTab.removeReadNum(item.messageId);
        let url = "/pagesTool/messageDetail/messageDetail";
        let accid = this.ImChart.getUuAccid();
        uni.navigateTo({
          url: url + "?messageId=" + item.messageId
            + "&name=" + item.name + "&isShield=" + item.isShield
            + "&userId=" + (me.userId || "") + "&openId=" + (me.openId || "")
            + "&accid=" + accid
        });
      },

      // 更新列表回调
      UpChartListChanged() {
        this.initData();
      },

      // 更新消息体回调
      UpChartMsgChanged(name, item) {
        // console.error(item, "--item--");
        // 不用了
        return;

        let chartListMap = new Map();
        let newChartList = [];
        this.chartList.map(info => {
          chartListMap.set(info.messageId, info);
        });
        if (chartListMap.has(item.messageId)) {
          let chartItem = chartListMap.get(item.messageId);
          chartItem.lastTime_stamp = item.lastTime_stamp;
          chartItem.lastTime = item.lastTime;
          chartItem.sendtime = item.sendtime;
          chartItem.msg = item.msg;
          chartItem.unRead++;
          chartItem.isShowBtn = false;
          chartItem.isShield = 0;
        } else {
          chartListMap.set(item.messageId, item);
        }
        chartListMap.forEach(val => {
          if (val.messageId != this.ImChart.getServiceId()) {
            newChartList.push(val);
          }
        });
        newChartList.sort(new compare("lastTime_stamp").maxToMin());
        newChartList.unshift(chartListMap.get(this.ImChart.getServiceId()));
        this.chartList = newChartList;
      }
    }
  }
</script>

<style>
  .message_view {
    padding-left: 40upx;
    box-sizing: border-box;
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
  }

  .message_item {
    height: 160upx;
    box-sizing: border-box;
    transition: 0.5s;
    transform: translateX(0);
    position: relative;
  }

  .message_left {
    transform: translateX(-270upx);
  }

  .right_btn_view {
    position: absolute;
    right: -270upx;
    top: 0;
    height: 100%;
    width: 270upx;
    background: #FFFFFF;
    border-bottom: 1upx solid #F5F5F5;
    line-height: 160upx;
  }

  .ping_bi_btn {
    color: #FFFFFF;
    text-align: center;
    width: 160upx;
    letter-spacing: 1px;
    background-color: #989898;
    font-size: 28upx;
    flex-shrink: 0;
  }

  .del_btn {
    color: #FFFFFF;
    font-size: 28upx;
    float: right;
    width: 100%;
    text-align: center;
    letter-spacing: 1px;
    background-color: #ff5400;
  }

  .head_img_view {
    width: 100upx;
    height: 100upx;
    border-radius: 100%;
    background: #FFFFFF;
    border: 1upx solid #F5F5F5;
    box-sizing: border-box;
    margin: auto 16upx auto 0;
    flex-shrink: 0;
    position: relative;
  }

  .point_red {
    position: absolute;
    top: 7upx;
    right: -9upx;
    width: 16upx;
    height: 16upx;
    background: #ff5400;
    border-radius: 100%;
  }

  .point {
    position: absolute;
    top: 10upx;
    right: -12upx;
    min-width: 40upx;
    height: 40upx;
    line-height: 40upx;
    margin-top: -22upx;
    font-weight: bold;
    font-size: 22upx;
    color: #FFFFFF;
    text-align: center;
    background: #ff5400;
    border: none;
    border-radius: 40upx;
  }

  .empty_view {
    height: 30upx;
    flex-shrink: 0;
  }

  .head_img_view image {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  .message_cont {
    margin: auto 0;
    border-bottom: 1upx solid #F5F5F5;
    box-sizing: border-box;
    text-align: left;
    width: calc(100% - 116upx);
    padding-right: 40upx;
    height: 160upx;
  }

  .message_top {
    line-height: 46upx;
  }

  .massage_name_view {
    width: 75%;
  }

  .massage_name {
    text-align: left;
    color: #101d36;
    font-weight: bold;
    font-size: 32upx;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .massage_compName {
    background: #edf0f3;
    color: #9ba7b1;
    font-size: 22upx;
    text-align: center;
    height: 32upx;
    line-height: 32upx;
    padding: 0 10upx;
    margin: auto 0 auto 10upx;
    border-radius: 4upx;
    box-sizing: border-box;
    max-width: 46%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 0;
  }

  .message_last_time {
    text-align: right;
    font-size: 22upx;
    color: #7A8190;
    flex-shrink: 0;
  }

  .msg_text_view {
    margin-top: 6upx;
    line-height: 40upx;
    width: 100%;
    min-height: 40upx;
  }

  .msg_text {
    width: 100%;
    color: #7A8190;
    font-size: 26upx;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ping_bi_icon {
    width: 110upx;
    height: 40upx;
    border: 1upx #fb0a00;
    background: url(http://cdn.haofang.net/static/uuweb/shield.png) center no-repeat;
    background-size: 100%;
    margin: auto 0 auto 15upx;
    flex-shrink: 0;
  }
</style>
