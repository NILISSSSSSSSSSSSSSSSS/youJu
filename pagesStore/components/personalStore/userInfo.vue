

<template>
  <view class="user-info-view">
    <view class="user-view f_r_b">
      <view class="user-left f_c_c">
        <view class="user-name">{{ myName }}</view>

        <!--#ifdef MP-WEIXIN-->
        <button @getuserinfo="upMyData"hover-class="none"
                open-type="getUserInfo" class="up-info f_r_c">
          <view class="up-des">点击更新用户资料</view>
          <image class="up-icon" src="https://cdn.haofang.net/static/weidian-uniapp/static/images/personal/btn_shuaxin@2x.png"></image>
        </button>
        <!--#endif-->
      </view>

      <image class="header-img" mode="aspectFit" :src="headerImg"></image>
    </view>
  </view>
</template>

<script>
  import {Notification} from "../../../utils/Notification";
  import {Notify} from "../../../utils/Notify";
  import {UserInfoModel} from "../../../model/UserInfoModel";
  import {DealUserInfoFromLogin} from "../../../utils/common";

  const headerDefaultImg = "https://zdzfapi.haofang.net/Public/wxApp/images/mine/fang_default.png";

  export default {
    data() {
      return {
        myName: "",
        headerImg: headerDefaultImg,
      }
    },
    mounted() {
      this.initData();
      // 监听用户信息授权
      new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
    },
    destroyed() {
      // 反注册通知
      new Notification().removeObserverAllNotification(this);
    },
    methods: {
      UserInfoChanged() {
        this.drawMyData();
      },
      initData() {
        this.drawMyData();
      },
      drawMyData() {
        if(!new UserInfoModel().getModel("userInfo")) return;

        let res = new UserInfoModel().getModel("userInfo");
        if(res && res.userInfo && res.userInfo.avatarUrl) {
          setTimeout(() => {
            this.headerImg = res.userInfo.avatarUrl;
          }, 0);
        }
        setTimeout(() => {
          this.myName = (res && res.userInfo) ? res.userInfo.nickName || "" : "";
        }, 0);
      },
      upMyData(e = {}) {
        if(!e || !e.detail) return;

        let that = this;
        DealUserInfoFromLogin.init(e.detail || {}, false)
          .then(res => {
            uni.showToast({title: "更新成功", icon: "none"});
            that.drawMyData();
          });
      },
    }
  }
</script>

<style scoped>
  .user-info-view{
    padding: 20upx 0;
    box-sizing: border-box;
  }
  .user-view{
    width: 80%;
    margin: auto;
    background-color: #fff;
    box-shadow: 0upx 4upx 30upx 0upx rgba(0, 0, 0, 0.2);
    border-radius: 14upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40upx 5%;
  }
  .user-name{
    font-size: 46upx;
    color: #101d36;
  }
  .up-info{
    color: #8e94a1;
    font-size: 24upx;
    display: inline-flex;
    align-items: center;
    margin-top: 10upx;
  }
  .up-icon{
    width: 30upx;
    height: 30upx;
    margin-left: 8upx;
  }
  .header-img{
    position: relative;
    width: 115upx;
    height: 115upx;
    border-radius: 50%;
  }
</style>
