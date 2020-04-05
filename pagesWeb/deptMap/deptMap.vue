<template>
  <view class="web_view">
    <web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
  </view>
</template>

<script>
  import {CompStoreCityIdModel, CompStoreCompIdModel} from "../../pagesStore/model/CompStoreModel";

  export default {
    data() {
      return {
        webviewStyles: {
          progress: {
            color: '#ff5a1f'
          }
        },
        src: ""
      }
    },

    onShow() {
      new this.SetMetaInfo().initDefault();
    },

    onLoad() {
      let cityId = new CompStoreCityIdModel().getModel() || "";
      let compId = new CompStoreCompIdModel().getModel() || "";
      this.src = 'https://zdzfapi.haofang.net/Mini/FlagshipMiniApp/flagShipStoreDeptMap?cityId='
              + cityId + '&compId=' + compId;
    }
  }
</script>

<style scoped>
  .web_view{
    background: #FFFFFF;
  }
  .web{
    background: #FFFFFF;
  }
</style>
