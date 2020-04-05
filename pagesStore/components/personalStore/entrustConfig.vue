

<template>
  <view class="entrust-config">
    <view class="entrust-config-cont f_r_s">
      <block v-for="(item, index) in entrustBtnList" :key="index">
        <view @click.stop="clickEntrustBtn(item)" class="f_c_s entrust-config-item">
          <view class="f_r_c">
            <view class="entrust-config-img" :class="item.className"></view>
          </view>
          <view class="entrust-config-text">{{ item.text }}</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      archiveId: {
        type: String|Number,
        default() {
          return "";
        }
      },
      agentInfo: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        // 委托btn list
        entrustBtnList: [
          {
            text: "我的委托",
            event: "myEntrust",
            className: "icon_my_entrust_config",
          },
          {
            text: "有房出售",
            event: "entrustHouseSale",
            className: "icon_sale_entrust_config",
          },
          {
            text: "有房出租",
            event: "entrustHouseLease",
            className: "icon_buy_entrust_config",
          },
          {
            text: "我要买房",
            event: "entrustHouseWantBuy",
            className: "icon_lease_entrust_config",
          },
          {
            text: "我要租房",
            event: "entrustHouseWantLease",
            className: "icon_rent_entrust_config",
          }
        ],
      }
    },

    methods: {
      clickEntrustBtn(item) {
        this[item.event](item);
      },
      // 我的委托
      myEntrust() {
        uni.navigateTo({
          url: "/pagesEntrust/trustList/trustList"
        });
      },
      // 有房出售
      entrustHouseSale() {
        uni.navigateTo({
          url: "/pagesEntrust/registration/registration?archiveId=" + this.archiveId
            + "&caseType=1" + "&isVip=1"
        });
      },
      // 有房出租
      entrustHouseLease() {
        uni.navigateTo({
          url: "/pagesEntrust/registration/registration?archiveId=" + this.archiveId
            + "&caseType=2" + "&isVip=1"
        });
      },
      // 我要买房
      entrustHouseWantBuy() {
        uni.navigateTo({
          url: "/pagesEntrust/entrust/entrust?archiveId=" + this.archiveId
            + "&caseType=3" + "&isVip=1" + "&step=4" + "&isEdit=1"
            + "&regionId=" + this.agentInfo.serviceReg + "&regionName="
            + "&zhuangXiuStatusId=" + "&zhuangXiuStatusName="
            + "&roomId=" + "&roomName=" + "&firstEnter=1"
            + "&archiveName=" + this.agentInfo.agentName
            + "&archiveHeadImg=" + this.agentInfo.agentHead
        });
      },
      // 我要租房
      entrustHouseWantLease() {
        uni.navigateTo({
          url: "/pagesEntrust/entrust/entrust?archiveId=" + this.archiveId
            + "&caseType=4" + "&isVip=1" + "&step=4" + "&isEdit=1"
            + "&regionId=" + this.agentInfo.serviceReg + "&regionName="
            + "&zhuangXiuStatusId=" + "&zhuangXiuStatusName="
            + "&roomId=" + "&roomName=" + "&firstEnter=1"
            + "&archiveName=" + this.agentInfo.agentName
            + "&archiveHeadImg=" + this.agentInfo.agentHead
        });
      },
    }
  }
</script>

<style scoped>
  .entrust-config{
    width: 90%;
    margin: 0 auto;
    box-shadow: 0upx 4upx 30upx 0upx rgba(0, 0, 0, 0.2);
    border-radius: 14upx;
  }
  .entrust-config-cont{
    background-color: #fff;
    padding-top: 70upx;
    border-radius: 14upx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .entrust-config-item{
    width: 33%;
    display: block;
    background-color: #fff;
    font-size: 30upx;
    position: relative;
    color: #282828;
    margin-bottom: 70upx;
  }
  .entrust-config-text{
    font-size: 26upx;
    text-align: center;
    color: #101d36;
  }
  .entrust-config-img{
    width: 46upx;
    height: 46upx;
    margin-bottom: 10upx;
    background-size: 100% 100%;
  }
  .icon_my_entrust_config{
    background-image: url(https://cdn.haofang.net/static/weidian-uniapp/static/images/entrust/btn_weituo@2x.png);
  }
  .icon_sale_entrust_config{
    background-image: url(https://cdn.haofang.net/static/weidian-uniapp/static/images/entrust/btn_chushou@2x.png);
  }
  .icon_buy_entrust_config{
    background-image: url(https://cdn.haofang.net/static/weidian-uniapp/static/images/entrust/btn_chuzu@2x.png);
  }
  .icon_lease_entrust_config{
    background-image: url(https://cdn.haofang.net/static/weidian-uniapp/static/images/entrust/btn_maifang@2x.png);
  }
  .icon_rent_entrust_config{
    background-image: url(https://cdn.haofang.net/static/weidian-uniapp/static/images/entrust/btn_zufang@2x.png);
  }
</style>
