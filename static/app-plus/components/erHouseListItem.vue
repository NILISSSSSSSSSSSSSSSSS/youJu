<template>
  <div @click="erHouseDetail(item)" class="er_house_item f_r_s" :style="{width: width+'rpx'}">
    <div class="er_house_img_view">
      <image :placeholder="defaultHouseImg" resize="cover" class="er_house_img" :src="houseImgUrl"></image>
      <div v-if="item.hasVr" class="vr_img"></div>
      <div v-if="!item.hasVr && item.hasVideo" class="small_video_img"></div>
    </div>

    <div class="er_house_cont" :style="{width: (width-216)+'rpx'}">
      <text class="er_house_title" :style="{width: (width-216)+'rpx'}">{{ item.houseTitle }}</text>

      <div class="er_house_des" v-if="item.houseUseage == 1">
        <text v-if="item.houseTing" class="er_house_ting er_house_des_text">{{ item.houseTing }}</text>
        <text v-if="!item.houseTing" class="er_house_ting er_house_des_text">{{ item.houseUseageCn }}</text>
        <text v-if="item.houseArea" class="er_house_area er_house_des_text">{{ item.houseArea }}{{ item.houseAreaUnit }}</text>
        <text class="er_house_addr er_house_des_text">{{ item.houseName }}</text>
      </div>
      <div class="f_r_s er_house_des" :style="{maxWidth: (width-216)+'rpx'}" v-else>
        <text :style="{maxWidth: (width-216)+'rpx'}" class="er_house_addr er_house_des_text">{{ item.houseUseageCn }}</text>
      </div>

      <div v-if="!(!item.trueHouse && (!item.houseTags || item.houseTags.length == 0))" class="er_house_tag_info f_r_s">
        <image src="http://cdn.haofang.net/static/wxPlusApp/yjk/home/true_house.png"
               class="er_house_true" v-if="item.trueHouse"></image>
        <block v-for="(tagInfo, index) in item.houseTags" :key="index">
          <text v-if="tagInfo == '房租月付'" class="er_house_tag f_r_c">{{ tagInfo }}</text>
          <text v-else-if="tagInfo == '业主房源'" class="er_house_tag f_r_c">{{ tagInfo }}</text>
          <text v-else-if="tagInfo && tagInfo.length > 1" class="er_house_tag f_r_c">{{ tagInfo }}</text>
        </block>
      </div>

      <div class="er_house_price_view f_r_s" v-if="item.houseTotalPrice && item.houseTotalPrice != 0">
        <div class="er_house_price main_color f_r_s">
          <text class="er_house_price_text">{{ item.houseTotalPrice }}</text>
          <text class="er_house_price_text" style="font-weight: normal;">{{ item.houseTotalPriceUnit }}</text>
        </div>

        <text class="er_house_unit_price">{{ item.housePriceOfArea }}{{ item.housePriceOfAreaUnit }}</text>
      </div>
      <div class="er_house_price_view f_r_s" v-else>
        <text class="er_house_unit_price gray_color">价格面议</text>
      </div>
    </div>

    <text v-if="item.isTopHouse" class="isTopHouse_view">广告</text>
  </div>
</template>

<script>
  import {GpsInfoModel} from "@/model/GpsInfoModel.js";
  import {Const} from "../../../utils/Const";

  export default {
    computed: {
      houseImgUrl() {
        let url = this.item.houseImg || "";
        if (url.indexOf("?x-oss-process=image") >= 0) {
          return url;
        }

        return (url ? url + "?x-oss-process=image/resize,m_fill,h_120,w_180" : "");
      },
      defaultHouseImg() {
        return Const.houseDefaultImg;
      }
    },

    props: ["item", "width"],

    methods: {
      erHouseDetail(item) {
        let cityId = item.cityId || new GpsInfoModel().getModel("cityInfo").cityId || "";
        let caseId = item.houseId || "";
        let caseType = item.caseType || "";
        let resource = item.reSource || "1";
        let houseName = item.houseName || "";
        uni.navigateTo({
          url: "/pagesHouse/erHouseDetail/erHouseDetail?cityId=" + cityId
            + "&caseId=" + caseId
            + "&caseType=" + caseType + "&resource=" + resource + "&houseName=" + houseName
            + "&pageFrom=" + item.pageFrom + "&archiveId=" + (item.archiveId || "")
            + "&compId=" + (item.compId || "") + "&buildId=" + (item.buildId || "")
        });
      }
    },
  }
</script>

<style>
  .isTopHouse_view {
    position: absolute;
    bottom: 30rpx;
    right: 0;
    color: #c8c8c9;
    font-size: 22rpx;
    text-align: right;
  }
  .er_house_item {
    padding-top: 40rpx;
    padding-right: 0rpx;
    padding-bottom: 40rpx;
    padding-left: 0;
    box-sizing: border-box;
    background: #FFFFFF;
    border-bottom-width: 2rpx;
    border-bottom-color: #F5F5F5;
  }
  .er_house_img_view {
    position: relative;
    width: 216rpx;
    height: 164rpx;
    flex-shrink: 0;
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png");
    background-color: #f8f8f8;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    border-top-right-radius: 4rpx;
    border-top-left-radius: 4rpx;
    border-bottom-left-radius: 4rpx;
    border-bottom-right-radius: 4rpx;
    box-sizing: border-box;
  }
  .er_house_img {
    width: 216rpx;
    height: 164rpx;
  }
  .vr_img {
    position: absolute;
    left: 20rpx;
    bottom: 10rpx;
    z-index: 20;
    background-image: url("http://cdn.haofang.net/static/uuminiapp/pageNewUi/house_list_sprites.png");
    background-size: 179px 24px;
    background-repeat: no-repeat;
    height: 28px;
    width: 25px;
    background-position: -39px 0;
  }
  .small_video_img {
    position: absolute;
    left: 20rpx;
    bottom: 10rpx;
    z-index: 20;
    background-image: url("http://cdn.haofang.net/static/uuminiapp/pageNewUi/house_list_sprites.png");
    background-repeat: no-repeat;
    background-size: 179px 24px;
    height: 28px;
    width: 25px;
    background-position: -15px 0;
  }
  .er_house_cont {
    padding-left: 30rpx;
    box-sizing: border-box;
  }
  .er_house_title {
    font-size: 32rpx;
    font-weight: bold;
    color: #101d36;
    line-height: 42rpx;
    margin-bottom: 12rpx;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-top: -4rpx;
  }
  .er_house_des {
    height: 30rpx;
    font-size: 26rpx;
    line-height: 30rpx;
    color: #101d37;
    font-size: 26rpx;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 15rpx;
  }
  .er_house_des_text{
    color: #101d37;
    font-size: 26rpx;
  }
  .er_house_des_text::after {
    content: "|";
    font-size: 16rpx;
    color: #babfc5;
    margin-left: 10rpx;
    margin-right: 10rpx;
    position: relative;
    top: -2rpx;
  }
  .er_house_des text:last-child::after {
    content: ''
  }
  .er_house_area {
    text-align: left;
    max-width: 6em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .er_house_tag_info {
    height: 30rpx;
    overflow: hidden;
    margin-bottom: 15rpx;
  }
  .er_house_true {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 10rpx;
    margin-left: 0;
    flex-shrink: 0;
    height: 30rpx;
    width: 96rpx;
  }
  .er_house_tag {
    white-space: nowrap;
    font-size: 22rpx;
    flex-direction: column;
    justify-content: center;
    color: #7991a6 !important;
    background-color: #edf0f3 !important;
    padding-left: 6rpx;
    padding-right: 6rpx;
    padding-top: 0;
    padding-bottom: 0;
    border-bottom-right-radius: 2rpx;
    border-bottom-left-radius: 2rpx;
    border-top-left-radius: 2rpx;
    border-top-right-radius: 2rpx;
    margin-right: 10rpx;
    box-sizing: border-box;
  }
  .er_house_price_view {
    line-height: 30rpx;
    height: 30rpx;
    align-items: center;
  }
  .er_house_price {
    font-size: 30rpx;
    font-weight: bold;
    margin-right: 20rpx;
    align-items: center;
  }
  .er_house_price_text{
    font-size: 30rpx;
  }
  .er_house_unit_price {
    color: #8E94A1;
    font-weight: normal;
    font-size: 22rpx;
    flex-direction: column;
    justify-content: flex-end;
    line-height: initial;
  }
  .er_house_addr {
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
