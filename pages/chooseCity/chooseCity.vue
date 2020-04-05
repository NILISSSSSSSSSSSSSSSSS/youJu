<template>
	<form report-submit @submit="formSubmit">
		<view class="choose_city" :style="{height: pageHeight}">
			<scroll-view :scroll-with-animation="scrollAnimate" enable-back-to-top :scroll-into-view="scrollIntoId"
				class="choose_city_scroll" scroll-y>
				<view class="choose_city_cont">
					<view class="choose_title">当前定位城市</view>

				   <button form-type="submit" hover-class="none" class="gps_city f_r_s" @click="cityBtn(gpsCityInfo)">
					   <image class="gps_city_icon"
							  v-if="gpsCityInfo.cityName != '定位中...'"
							  src="https://zdzfapi.haofang.net/PublicC/images/icon_mylocation.png"></image>
					   <view class="gps_city_text">{{ gpsCityInfo.cityName }}</view>
				   </button>

				   <view class="choose_title">热门城市</view>

				   <view class="hot_city_list f_r_s">
					   <block v-for="(item, hotIndex) in hotCityList" :index="hotIndex" :key="hotIndex">
						   <button form-type="submit" hover-class="none" @click="cityBtn(item)" 
								class="hot_city_item">{{ item.cityNameLess }}</button>
					   </block>
				   </view>

				  <block v-for="(item, cityIndex) in cityList" :index="cityIndex" :key="cityIndex">
					   <view class="choose_title" :id="item.title.id">{{ item.title.text }}</view>

					   <block v-for="(info, cityInfoIndex) in item.list" :index="cityInfoIndex" :key="info.cityName">
						   <button form-type="submit" hover-class="none" @click="cityBtn(info)"
								class="city_item">{{ info.cityName }}</button>
					   </block>
				   </block>
				</view>
			</scroll-view>

			<view class="letter_list f_c_c">
				<block v-for="(item, letterIndex) in letterList" :index="letterIndex" :key="letterIndex">
					<button form-type="submit" hover-class="none" @click="letterBtn(item)"
						class="f_r_c letter_item" :id="item.id">{{ item.text }}</button>
				</block>
			</view>
		</view>
	</form>
</template>

<script>
    import { GetAllCityList } from "../../net/GetAllCityList.js";
    import { CityListModel } from "../../model/CityListModel.js";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import { GpsInfoModel } from "../../model/GpsInfoModel.js";

	export default {
		data() {
			return {
				cityList: [],
                letterList: [],
                scrollIntoId: "",
                gpsCityInfo: {
                    cityName: "定位中..",
                    cityId: "1"
                },
                pageHeight: "100%",
                hotCityList: [
                    { cityId: "7", cityNameLess: "北京" },
                    { cityId: "8", cityNameLess: "上海" },
                    { cityId: "12", cityNameLess: "广州" },
                    { cityId: "11", cityNameLess: "深圳" },
                    { cityId: "1", cityNameLess: "成都" },
                    { cityId: "10", cityNameLess: "杭州" },
                    { cityId: "83", cityNameLess: "南京" },
                    { cityId: "369", cityNameLess: "天津" },
                    { cityId: "176", cityNameLess: "武汉" },
                    { cityId: "307", cityNameLess: "西安" },
                    { cityId: "9", cityNameLess: "重庆" },
                    { cityId: "48", cityNameLess: "大连" }
                ],

                scrollAnimate: true
			};
		},

        onLoad() {
        	this.initCityList();
			new this.InitFormSubmit(this);
        },

		onShow() {
			// 监听gps变化
			new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
		},

        onHide() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        onReady() {
        	this.getPhoneInfo();

            // 支付宝小程序由于设置滚动条动画移动太慢,故取消动画
            // #ifdef MP-ALIPAY
            this.scrollAnimate = false;
            // #endif
        },

        onShow() {
        	this.upGpsInfo();
        },

        methods: {
            // 更新定位信息
            upGpsInfo() {
                if(!new GpsInfoModel().getModel("gpsInfo")) return;

                let item = new GpsInfoModel().getModel("gpsInfo");
                this.gpsCityInfo = {
                    cityName: item.cityName || "成都",
                    cityId: item.cityId || "1"
                };
            },

            // 获取设备信息
            getPhoneInfo() {
                let res = uni.getSystemInfoSync();
                this.pageHeight = res.screenHeight + "px";
            },

            // 城市列表初始化
        	initCityList() {
        		return new Promise((resolve, reject) => {
                    if (new CityListModel().getModel("cityList") && new CityListModel().getModel("letterList")) {
                        this.cityList = JSON.parse(new CityListModel().getModel("cityList"));
                        this.letterList = JSON.parse(new CityListModel().getModel("letterList"));
                    }

                    new GetAllCityList({}).send()
                       .then(res => {
                           this.drawCityList(res.DATA || {});
                           resolve("");
                       })
                       .catch(err => {
                           uni.showModal({
                                title: "请求失败",
                                content: "获取城市列表失败啦!请稍后重试"
                           });
                           reject("");
                       });
                });
        	},
            drawCityList(apiData = {}) {
                let cityList = [];
                let letterList = [];
                for(let key in apiData) {
                    if(!apiData[key]) continue;

                    let itemObj = {};
                    itemObj = {title: {text: key, id: key}};
                    letterList.push({text: key, id: key+"_key"});
                    let list = [];
                    for(let i = 0;i<apiData[key].length;i++) {
                        let info = apiData[key][i];
                        if(!info.CITY_ID || !info.POSITION_X || !info.POSITION_Y) continue;

                        let item = {
                            cityId: info.CITY_ID || "",
                            cityName: info.CITY_NAME || "",
                            cityNameLess: info.C_CITY_NAME || "",
                            lat: info.POSITION_X || "",
                            lng: info.POSITION_Y || ""
                        };
                        list.push(item);
                    }
                    itemObj["list"] = list;
                    cityList.push(itemObj);
                }
				cityList.sort(function(a, b){
					if(a.title.id<b.title.id) return -1;
					
					if(a.title.id>b.title.id) return 1;
					
					return 0;
				});
				letterList.sort(function(a, b){
					if(a.id<b.id) return -1;
					
					if(a.id>b.id) return 1;
					
					return 0;
				});
                this.cityList = cityList;
                this.letterList = letterList;
                new CityListModel().setModel(JSON.stringify(cityList), "cityList");
                new CityListModel().setModel(JSON.stringify(letterList), "letterList");
            },

            // 字母事件
            letterBtn(item) {
                this.scrollIntoId = item.id.replace("_key", "");
            },

            // 城市点击事件
            cityBtn(item) {
                uni.navigateBack({
                    delta: 1
                });

                new GpsInfoModel().setModel({
                    lng: null,
                    lat: null,
                    cityId: item.cityId,
                    cityName: item.cityNameLess
                }, "cityInfo");
                new Notification().postNotification(Notify.CityInfoChanged.Name, item);
            },

            // gps change 回调
            GpsChanged(name, item) {
                this.upGpsInfo();
            }
        }
	}
</script>

<style>
    /* 城市列表 */
    .choose_city{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
    }
    .choose_city_scroll{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
    .choose_city_cont{
        padding-right: 60upx;
        box-sizing: border-box;
    }
    /* #ifdef  MP-ALIPAY*/
    .choose_city_scroll .choose_city_cont{
        padding-right: 0;
    }
    /* #endif */

    .choose_title{
        height:60upx;
        line-height:60upx;
        font-size:24upx;
        color:#8a8a8a;
        padding-left: 30upx;
        background:#f2f2f2;
        box-sizing: border-box;
    }
    .gps_city{
        padding-left: 30upx;
        position:relative;
        height:80upx;
        line-height:84upx;
        font-size:27upx;
        color:#0f0f0f;
    }
    .gps_city_icon{
        width: 35upx;
        height: 35upx;
        margin: auto 10upx auto 0;
    }
    .city_item{
        padding-left: 30upx;
        border-bottom:1rpx solid #e5e5e5;
        height:90upx;
        line-height:90upx;
        color:#636363;
        font-size:28upx;
    }

    /* 城市首字母 */
    .letter_list{
        width: 40upx;
        height: 100%;
        position:fixed;
        right:0;
        top:0;
        background:#ffffff;
        z-index:2;
        box-sizing:border-box;
        padding-top: 140upx;
    }
    .letter_item{
        color:#8c8c8c;
        line-height:38upx;
        text-align:center;
        font-size:18upx;
    }

    /* 热门城市 */
    .hot_city_list{
        flex-wrap: wrap;
        background-color: #FFFFFF;
        padding-left: 30upx;
        padding-top: 30upx;
        padding-bottom: 10upx;
        box-sizing: border-box;
    }
    .hot_city_item{
        width:186upx;
        height:60upx;
        line-height:60upx;
        font-size:27upx;
        color:#0f0f0f;
        letter-spacing:1upx;
        text-align:center;
        border-radius:6upx;
        border:1upx solid #e1e1e1;
        margin-right:30upx;
        margin-bottom:20upx;
        box-shadow:#ededed 0 3upx 5upx 1upx;
    }
</style>
