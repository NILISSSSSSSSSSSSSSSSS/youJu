<template>
    <view class="dept_map_view">
        <map class="dept_map" v-if="lng && lat" :longitude="lng" :latitude="lat"
             :subkey="mapKey" show-location="true" :scale="scale" layer-style="3"
             @callouttap="bindCalloutTap" @regionchange="bindRegionChange"
             @end="bindRegionChange" @begin="bindRegionChange"
             id="deptMapId" :markers="makerList" v-show="!isInputStatus">
            <!--回到定位处-->
            <cover-image @click="backLocation" class="back_location" :src="locationImg"></cover-image>

            <!--输入框-->
            <cover-view @click="inputClick" class="top_input">
                <cover-view class="top_city_name">{{ cityName }}</cover-view>
                <cover-view class="top_line"></cover-view>
                <cover-image class="top_search_icon" :src="searchIcon"></cover-image>
                <cover-view v-show="!keyWord" class="top_input_pla">请输入区域、门店名称搜索</cover-view>
                <cover-view v-show="keyWord" class="top_input_val">{{ keyWord }}</cover-view>
                <cover-image v-show="keyWord" @click="clearInput"
                             class="top_clear_icon" src="http://cdn.haofang.net/static/uuminiapp/search/clear.png"></cover-image>
            </cover-view>
        </map>
    </view>
</template>

<script>
    import {
        CompStoreCompIdModel,
        DeptMapFinishSearch,
        DeptMapSearchKeyWord
    } from "../../pagesStore/model/CompStoreModel";
    import {GpsInfoModel} from "../../model/GpsInfoModel";
    import { GetDeptList } from "../net/WebNet.js";
    import { SetMap } from "../utils/qqMap/SetMap.js";

    let privateData = {
        // 初始化地图后的map实例化对象
        mapClassVal: null,
        // 地图加载后的上下文
        mapContext: null,
        windowHeight: 600,
        windowWidth: 400,
        // 视野变化的事延迟事件值
        regionTimeOut: null,
        leavePage: false,
        makerList: []
    };

    export default {
        data() {
            return {
                cityId: "",
                compId: "",
                cityName: "",
                // 回到定位图片
                locationImg: "https://zdzfapi.haofang.net/Public/images/store/store_map_locbtn_new.png",
                searchIcon: "https://zdzfapi.haofang.net/Public/images/store/store_map_search_icon.png",
                // 静态地图图片
                staticImgSrc: "",
                // 是否是输入状态
                isInputStatus: false,

                lng: null,
                lat: null,
                // 地图key
                mapKey: "",
                // 地图maker点数组
                makerList: [],
                scale: 12,
                keyWord: "",
            }
        },

        onLoad(options) {
            this.getSystemInfo();
            privateData.mapClassVal = new SetMap();
            this.setData({
                mapKey: privateData.mapClassVal.getKey()
            });
            this.initParams(options);
            this.initMap();
            this.initDeptList();
        },

        onShow() {
            privateData.leavePage = false;
            this.setData({
                keyWord: new DeptMapSearchKeyWord().getModel() || ""
            });
            if(new DeptMapFinishSearch().getModel() && new DeptMapSearchKeyWord().getModel()) {
                new DeptMapSearchKeyWord().setModel(false);
                this.initDeptList();
            }
        },

        onHide() {
            privateData.leavePage = true;
        },

        methods: {
            // 更新数据方法
            setData(obj = {}) {
                for (let key in obj) {
                    this[key] = obj[key];
                }
            },

            // 获取手机信息
            getSystemInfo() {
                let info = uni.getSystemInfoSync();
                privateData.windowHeight = info.windowHeight;
                privateData.windowWidth = info.windowWidth;
            },

            // 初始化参数
            initParams(options) {
                let keyMap = new Map()
                    .set("cityId", "cityId")
                    .set("compId", "compId");
                let obj = {};
                for (let key in options) {
                    if(options[key] && keyMap.has(key)) {
                        obj[keyMap.get(key)] = options[key];
                    }
                }
                let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
                obj["cityName"] = cityInfo.cityName || "成都";
                if(Object.keys(obj).length > 0) {
                    this.setData(obj);
                }
            },

            // 初始化地图经纬度
            initMap() {
                let that = this;
                uni.getLocation({
                    type: 'wgs84',
                    success(res) {
                        that.setData({
                            lng: res.longitude,
                            lat: res.latitude
                        });
                        that.getStaticMapImg(res.latitude, res.longitude);
                        privateData.mapContext = uni.createMapContext("deptMapId", that);
                    }
                });
            },

            // 初始化门店列表
            initDeptList() {
                let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
                let compId = this.compId || new CompStoreCompIdModel().getModel() || "12001";
                let cityId = this.cityId || cityInfo.cityId || "1";
                this.setData({
                    cityId: cityId,
                    compId: compId,
                    makerList: []
                });
                let keyword = new DeptMapSearchKeyWord().getModel() || "";
                new GetDeptList({compId: compId, cityId: cityId, keyword: keyword}).send()
                    .then(res => {
                        this.dealDeptList(res ? res.data || [] : []);
                    })
                    .catch(err => {
                        uni.showModal({
                            title: "温馨提示",
                            content: "获取门店列表失败啦！请稍后重试。",
                            showCancel: false,
                            confirmText: "我知道了",
                            confirmColor: "#315591"
                        });
                    });
            },
            // 处理经纬度
            dealDeptList(list = []) {
                let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
                let that = this;
                let index = -1;
                let makerPromise = [];
                let cityName = cityInfo.cityName || "成都";
                if(privateData.leavePage) return;

                if(privateData.makerList && privateData.makerList.length > 0
                    &&!new DeptMapSearchKeyWord().getModel()) {
                    this.setData({
                        makerList: privateData.makerList
                    });
                    return;
                }

                let makerList = this.makerList || [];
                let listIndex = -1;
                let needDealList = [];
                // 先更新有经纬度的
                for (let info of list) {
                    if(!info.DEPT_ADDR || !info.DEPT_NAME || !info.DEPT_CONTACT
                        || !info.DEPT_ID) continue;

                    let address = info.DEPT_ADDR || "";
                    if(address.indexOf(cityName) === -1) {
                        address = cityName + address;
                    }

                    if(!info.POSITION_X || !info.POSITION_Y) {
                        needDealList.push(info);
                        continue;
                    }

                    listIndex++;
                    makerList.push(that.getMarkerItem(info.DEPT_ID, info.POSITION_Y,
                        info.POSITION_X, info.DEPT_NAME, info.DEPT_TELE, listIndex));
                }
                that.setData({
                    makerList: makerList
                });

                if(needDealList.length === 0) return;

                // 处理没有经纬度的消息
                for (let info of needDealList) {
                    if(!info.DEPT_ADDR || !info.DEPT_NAME || !info.DEPT_CONTACT
                        || !info.DEPT_ID) continue;

                    let address = info.DEPT_ADDR || "";
                    if(address.indexOf(cityName) === -1) {
                        address = cityName + address;
                    }
                    index++;
                    makerPromise.push(that.drawMaker(index, info, address));
                }
                Promise.all(makerPromise)
                    .then((list) => {
                        if(!new DeptMapSearchKeyWord().getModel()) {
                            privateData.makerList = list[list.length - 1];
                        }
                    });
            },
            drawMaker(i, val, addr) {
                return privateData.mapClassVal.getGpsFromAddress(addr, i * 500,
                    privateData.leavePage)
                    .then(res => {
                        let makerList = this.makerList || [];
                        if(res && res.lat && res.lng) {
                            makerList.push(this.getMarkerItem(val.DEPT_ID, res.lat, res.lng,
                                val.DEPT_NAME, val.DEPT_TELE, i));
                            this.setData({
                                makerList: makerList
                            });
                            return makerList;
                        }

                        return makerList;
                    });
            },

            // 获取maker item
            getMarkerItem(DEPT_ID, lat, lng, DEPT_NAME, DEPT_TELE, i) {
                return  {
                    id: DEPT_ID,
                    latitude: lat,
                    longitude: lng,
                    title: DEPT_NAME,
                    iconPath: "../../../images/map/redmarker_new.png",
                    width: 1,
                    zIndex: 100 + i,
                    height: 1,
                    callout: {
                        content: DEPT_NAME + "\n" + DEPT_TELE,
                        bgColor: "#ab7f2e",
                        color: "#ffffff",
                        fontSize: 14,
                        borderRadius: 4,
                        padding: 10,
                        display: "ALWAYS",
                        textAlign: "center"
                    },
                    // label: {
                    //     content: val.DEPT_NAME,
                    //     color: "#ffffff",
                    //     fontSize: 16,
                    //     bgColor: "#ab7f2e",
                    //     padding: 10,
                    //     textAlign: "center",
                    //     anchorX: -40,
                    //     anchorY: -80
                    // }
                };
            },

            // 返回到当前位置
            backLocation() {
                privateData.mapContext.moveToLocation();
            },

            // 点击标记点
            bindCalloutTap(e) {
                if(!e.markerId) {
                    uni.showToast({
                        title: "暂无公司id",
                        icon: "none"
                    });
                    return;
                }

                uni.navigateTo({
                    url: "/packageBrokers/pages/moreAgent/moreAgent?compCityId="
                        + this.cityId + "&deptId=" + e.markerId
                });
            },

            // 生成静态图片
            getStaticMapImg(lat, lng) {
                this.setData({
                    staticImgSrc: "https://apis.map.qq.com/ws/staticmap/v2/?center="
                        +lat+","+lng+"&zoom=16&scale=2&markers=size:large|icon:https://cd.haofang.net/Public/images/wap/icon_mylocation.png|"
                        +lng+","+lat+"&key=DGFBZ-3IFW2-PDEUL-CBLCE-XOSYK-K5B5I&size="
                        +privateData.windowWidth+"*"+privateData.windowHeight
                });
            },

            // 视野发生变化
            bindRegionChange() {
                let that = this;
                if(!privateData.mapContext || !privateData.mapContext.getCenterLocation) {
                    return;
                }

                clearTimeout(privateData.regionTimeOut);
                privateData.regionTimeOut = null;
                privateData.regionTimeOut = setTimeout(() => {
                    if(!privateData.regionTimeOut) return;

                    privateData.mapContext.getCenterLocation({
                        success: res => {
                            if (res && res.latitude &&  res.longitude) {
                                that.getStaticMapImg(res.latitude, res.longitude);
                            }
                        }
                    });
                }, 500);
            },

            // 点击输入框
            inputClick() {
                uni.navigateTo({
                    url: "/packageTool/pages/deptMapSearch/deptMapSearch"
                });
            },

            // 清空
            clearInput() {
                this.setData({
                    keyWord: ""
                });
                new DeptMapSearchKeyWord().setModel("");
                new DeptMapFinishSearch().setModel(false);
                this.initDeptList();
            }
        }
    }
</script>

<style>
    page{
        width: 100%;
        height: 100%;
    }
    .dept_map_view{
        width: 100%;
        height: 100%;
    }
    .dept_map{
        width: 100%;
        height: 100%;
    }
    .back_location{
        position: fixed;
        left: 40upx;
        bottom: 60upx;
        width: 80upx;
        height: 80upx;
    }
    .top_input{
        position: fixed;
        text-align: left;
        left: 30upx;
        top: 30upx;
        right: 30upx;
        height: 80upx;
        line-height: 80upx;
        box-sizing: border-box;
        background-color: rgba(255,255,255,.9);
        box-shadow: 0 2upx 20upx rgba(0,0,0,.15);
        border-radius: 6upx;
        display: flex;
    }
    .top_city_name{
        color: #101d36;
        font-size: 30upx;
        display: inline-block;
        white-space: nowrap;
        height: 80upx;
        line-height: 80upx;
        padding-left: 30upx;
        box-sizing: border-box;
    }
    .top_line{
        display: inline-block;
        margin: auto 30upx;
        width: 3upx;
        height: 30upx;
        background-color: #dddddd;
    }
    .top_search_icon{
        height: 26upx;
        width: 26upx;
        margin: auto 0;
        display: inline-block;
    }
    .top_clear_icon{
        position: absolute;
        top: 23.5upx;
        height: 35upx;
        width: 35upx;
        right: 30upx;
    }
    .top_input_pla{
        color: #bbbbbb;
        font-size: 30upx;
        margin-left: 20upx;
        height: 80upx;
        line-height: 80upx;
    }
    .top_input_val{
        color: #101d36;
        font-size: 30upx;
        margin-left: 20upx;
        height: 80upx;
        line-height: 80upx;
    }

    .content_view{
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
    }
</style>