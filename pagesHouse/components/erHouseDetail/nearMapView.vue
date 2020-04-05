<template>
  <form report-submit @submit="formSubmit">
    <view class="">
      <button form-type="submit" hover-class="none" class="near_map"
              @click="tapMap">
        <image :src="mapImgUrl" mode="aspectFill"></image>

        <view class="map_center_view">
          <view class="map_center_name">{{ item.buildName }}</view>
        </view>

        <view class="map_center_icon"></view>
      </button>

      <mapBtnView :currentIndex='-1'></mapBtnView>
    </view>
  </form>
</template>

<script>
  import {Notification} from "@/utils/Notification.js";
  import {Notify} from "@/utils/Notify.js";

  export class NearMapItem {
    lng = "";
    lat = "";
    buildName = "";
  }

  import mapBtnView from "./mapBtnView.vue";

  export default {
    data() {
      return {
        mapImgUrl: ""
      };
    },

    props: ["item"],

    components: {
      mapBtnView
    },

    watch: {
      item(newValue, oldValue) {
        this.initMarkers();
      }
    },

    mounted() {
      this.initMarkers();
      new this.InitFormSubmit(this);
    },

    methods: {
      initMarkers() {
        if (!this.item.lat) return;

        this.mapImgUrl = "https://apis.map.qq.com/ws/staticmap/v2/?center="
          + this.item.lat + "," + this.item.lng + "&zoom=16&scale=2&markers=size:large|icon:https://cd.haofang.net/Public/images/wap/icon_mylocation.png|"
          + this.item.lng + "," + this.item.lat + "&key=DGFBZ-3IFW2-PDEUL-CBLCE-XOSYK-K5B5I&size=375*320"
      },

      tapMap() {
        new Notification().postNotification(Notify.NearInfoMapBtnChanged.Name
          , {item: {type: "transit", text: "公交"}, index: 0});
      }
    }
  }
</script>

<style scoped>
  .near_map {
    width: 100%;
    height: 320upx;
    position: relative;
  }

  .near_map > image {
    width: 100%;
    height: 100%;
  }

  .map_view {
    width: 100%;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
  }

  .map_center_view {
    position: absolute;
    height: 80upx;
    line-height: 80upx;
    text-align: center;
    font-size: 32upx;
    color: #101d36;
    background-color: #ffffff;
    padding: 0 30upx;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4upx;
    z-index: 20;
  }

  .map_center_view::after {
    display: none;
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: -15upx;
    border-left: 20upx solid transparent;
    border-right: 20upx solid transparent;
    border-top: 20upx solid #ffffff;
    z-index: 20;
  }

  .map_center_icon {
    position: absolute;
    left: 50%;
    top: calc(50% + 45upx);
    transform: translate(-50%, 0);
    width: 52upx;
    height: 52upx;
    border-radius: 50%;
    border: none;
    background-color: inherit;
    /* border: solid 3upx #005aff; */
    /* background-color: #adcef1; */
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/house/icon_dian.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto 0;
    z-index: 1;
  }
</style>
