<template>
    <view>
        <view class="title">您的委托信息如下</view>

        <view class=" g-perfect-center pad50">
            <view class=" g-houses">{{entrustInfo.regionName}} {{entrustInfo.buildName}}</view>
            <view class=" g-house-info">
                <text>{{entrustInfo.houseUseageCn}}</text>
                <text>{{!!entrustInfo.houseRoof?(entrustInfo.houseRoof+'栋'):''}}{{!!entrustInfo.houseUnit?(entrustInfo.houseUnit+'单元'):''}}{{!!entrustInfo.houseFloor?(entrustInfo.houseFloor+'楼'):''}}{{!!entrustInfo.houseNum?(entrustInfo.houseNum+'号'):''}}</text>
                <text>{{!!entrustInfo.houseArea?(entrustInfo.houseArea+'㎡'):''}}</text>
            </view>
            <view class="g-house-Price">{{entrustInfo.houseTotalPrice}}<text class=" g-house-unit">{{entrustInfo.priceUnitCn}}</text></view>
        </view>

        <view class="g-tips-seat g-perfect-info">完善以下信息，有助高效沟通，避免打扰</view>

        <!-- 楼盘信息选择 -->
        <view class="g-info-select">
            <!--价格-->
            <view class="g-info-item">
                <view class="fl">价格</view>
                <view class="g-right-box fr">
                    <input class="w94 price-input"
                           placeholder="请输入价格"
                           type="number"
                           maxlength="9"
                           data-long="6"
                           @blur="blurPrice"
                           :value="housePrice"/>
                    <text>{{entrustInfo.priceUnitCn}}</text>
                </view>
            </view>

            <!--户型-->
            <view class="g-info-item" v-if="entrustInfo.houseUseageCn != '商铺'">
                <view class="fl">户型</view>
                <view class="g-right-box fr">
                    <input class="w70" placeholder="几室" type="number"
                           :value="room + (roomMax==3 && !!room?'室':'')"
                           :maxlength="roomMax" data-long="3"  data-val="room"
                           data-type="室" @focus="focusApartment"
                           @blur="blurApartment" disabled/>
                    <text class="g-divid-line">|</text>
                    <input class="w70" placeholder="几厅" type="number"
                           :value="hall + (hallMax==3 && !!hall?'厅':'')"
                           :maxlength="hallMax" data-long="3" data-val="hall"
                           data-type="厅" @focus="focusApartment"
                           @blur="blurApartment"/>
                    <text class="g-divid-line">|</text>
                    <input class="w70" placeholder="几卫" type="number"
                           :value="wei + (weiMax==3 && !!wei?'卫':'')"
                           :maxlength="weiMax" data-long="3" data-val="wei"
                           data-type="卫" @focus="focusApartment"
                           @blur="blurApartment"/>
                    <text class="g-divid-line">|</text>
                    <input class="w94" placeholder="几阳台" type="number"
                           :value="balcony + (balconyMax==4 && !!balcony?'阳台':'')"
                           :maxlength="balconyMax" data-long="4" data-val="balcony"
                           data-type="阳台" @focus="focusApartment"
                           @blur="blurApartment"/>
                </view>
            </view>

            <!--建筑年代-->
            <view class="g-info-item">
                <view class="fl">建筑年代 <text class="s-select-fill">(选填)</text></view>

                <view class="fr">
                    <picker class="s-copy-more" mode="date" fields="year"
                            :start="startYear" :end="endYear"
                            @change="yearBuilt">
                        <view class="picker" :class="!!yearsVal?'s-select-color':''">{{!!yearsVal?(yearsVal+'年'):'请选择建筑年代'}}</view>
                    </picker>
                    <image class="g-more-img" src="http://cdn.haofang.net/static/uuminiapp/property/more.png"></image>
                </view>
            </view>

            <!--朝向-->
            <view class="g-info-item">
                <view class="fl">朝向 <text class="s-select-fill">(选填)</text></view>

                <view class="fr">
                    <picker class="s-copy-more" mode="selector"
                            @change="orientation"
                            :range="aspectArr" range-key="name">
                        <view class="picker" :class="aspectArr[aspectArrI] && (aspectArr[aspectArrI].id || aspectArr[aspectArrI].id == '')?'s-select-color':''">{{aspectArr[aspectArrI] && (aspectArr[aspectArrI].id || aspectArr[aspectArrI].id == '')?aspectArr[aspectArrI].name:'请选择房屋朝向'}}</view>
                    </picker>
                    <image class="g-more-img" src="http://cdn.haofang.net/static/uuminiapp/property/more.png"></image>
                </view>
            </view>

            <!--装修情况-->
            <view class="g-info-item">
                <view class="fl">装修情况 <text class="s-select-fill">(选填)</text></view>
                <view class="fr">
                    <picker class="s-copy-more " mode="selector" @change="decoration"
                           :range="decorArr" range-key="name">
                        <view class="picker" :class="decorArr[decorArrI] && (decorArr[decorArrI].id || decorArr[decorArrI].id == '')?'s-select-color':''">{{decorArr[decorArrI] && (decorArr[decorArrI].id || decorArr[decorArrI].id == '')?decorArr[decorArrI].name:'请选择装修情况'}}</view>
                    </picker>
                    <image class="g-more-img" src="http://cdn.haofang.net/static/uuminiapp/property/more.png"></image>
                </view>
            </view>
        </view>

        <!-- 备注 -->
        <view class="g-gray-blank"></view>
        <view class=" g-perfect-center pad35">
            <view class="g-title">备注<text class="s-subText">（选填）</text></view>
            <view class="g-remark-box">
                <textarea class="g-remark-text"
                          placeholder-class="g-remark-placeholder"
                          :value="remark" @input="remarkNum"
                          placeholder="详细的描述，会帮您更快出手哦！（限200字以内）"
                          maxlength="200"></textarea>
                <view class="g-remark-length">{{remark.length}}/200</view>
            </view>
        </view>

        <!-- 房源图片  -->
        <view class="g-gray-blank"></view>
        <view class="g-perfect-center pad3550">
            <view class="g-title">房源图片<text class="s-subText">（限12张，共{{houseImages.length}}张）</text></view>
            <view class="s-hous-tips">长按拖动到最前面即可设置首图</view>
            <!-- 拖动区域 -->
            <view class="g-housImgs-box">
                <view class='outer' >
                    <view class='inner'>
                        <movable-area>
                            <block v-for="(item,index) in houseImages" :key="index">
                                <view class='item g-housImgs-item'
                                      :id="index"
                                      @longpress='_longtap' @touchstart='touchs($event, index)'
                                      @touchend='touchend' @touchmove='touchm'>
                                    <image class="g-first-img" v-if="index == 0"
                                           src="http://cdn.haofang.net/static/uuminiapp/property/first_picture.png"></image>
                                    <image class="f-delete-img"
                                           src="http://cdn.haofang.net/static/uuminiapp/property/delete.png"
                                           @click="deleteImg(index, item)"></image>
                                    <image class="g-houseImg" mode="aspectFill" :src="item.picUrl"></image>
                                </view>
                            </block>

                            <view class="itembox g-housImgs-item"
                                  v-if="houseImages.length < 12" @click="chooseImg">
                                <image class="g-houseImg" src="http://cdn.haofang.net/static/uuminiapp/property/add_img.png"></image>
                            </view>

                            <movable-view :x="x" :y="y" direction="all"
                                          damping="5000" friction="1" :disabled="disabled">
                            </movable-view>
                        </movable-area>
                    </view>
                </view>
            </view>
        </view>

        <!-- 保存 -->
        <view class="g-gray-blank"></view>
        <view class=" g-perfect-center pad20">
            <view @click="submitInfo" class="g-foot-submit">提交信息</view>
        </view>
    </view>
</template>

<script>
    import {GetHouseEntrustDetail, UpLeaseEntrustDetail, UpSaleEntrustDetail} from "../../net/entrust/PushEntrust";
    import {GpsInfoModel} from "../../model/GpsInfoModel";
    import {DealHousePhoto} from "../../net/entrust/DealHousePhoto";
    import {Config} from "../../utils/config";
    import {UploadFile} from "../../utils/common";

    let privateData = {
        vipCaseId: "", // 房源id
        caseType: "",
        buildId: "",
        userId: "",
        layer: "",
        allLayer: "",
        layerMaxLong: "",
        allLayerMaxLong: "",

        beginIndex: "",
        uploadingFlag: false,
        canvote: true,
        requesting: false,

        //需要用于对比字段变更的原始数据
        private: {
            houseDirect: '',
            houseFitment: '',
            houseYear: '',
            houseHall: '',
            houseWei: '',
            yang: '',
            price: '',
            descp: '',
        }
    };
    // 房源信息item
    class EntrustInfoItem {
        regionName = "";  // 区域
        buildName = "";   // 小区
        houseUseageCn = "";  // 用途
        houseRoof = "";  // 栋
        houseUnit = "";  // 单元
        houseFloor = "";  // 楼
        houseNum = ""; // 号
        houseArea = "";  // 面积㎡
        houseTotalPrice = "";  // 总价
        priceUnitCn = "";   // 单位
    }

    export default {
        data() {
            return {
                photoTopId: '',
                photoTopUrl: '',
                entrustInfo: new EntrustInfoItem(),
                housePrice: "", // 房源价格
                roomMax: "", // 室
                room: "",
                hallMax: "",  // 厅
                hall: "",
                weiMax: "", // 卫
                wei: "",
                balconyMax: "",  // 阳台
                balcony: "",
                startYear: 1971,  // 建筑年代
                endYear: new Date().getFullYear(),
                yearsVal: '',
                // 房屋朝向数组
                aspectArr: [
                    {id: '', name: '不限'},
                    {id: 4, name: '北'},
                    {id: 3, name: '西'},
                    {id: 2, name: '南'},
                    {id: 1, name: '东'},
                    {id: 8, name: '东北'},
                    {id: 7, name: '东南'},
                    {id: 10, name: '西北'},
                    {id: 9, name: '西南'},
                    {id: 5, name: '东西'},
                    {id: 6, name: '南北'},

                ],
                aspectArrI: '',
                aspectIndex: "",
                //房屋装修情况数组:
                // 物业版的豪装ID是6  优优的豪装ID 是5
                // 物业版的精装ID是3  优优的精装ID 是4
                decorArr: [
                    { id: '', name: "不限" },
                    { id: 6, name: "豪装" },
                    { id: 3, name: "精装" },
                    { id: 2, name: "普通" },
                    { id: 1, name: "毛坯" },
                ],
                decorArrI: '',

                // 图片
                initHouseImages: [],
                houseImages: [],

                remark: "", // 备注

                hidden: true,
                flag: false,
                x: 0,
                y: 0,
                disabled: true,
                elements: [],
            }
        },

        onLoad(params) {
            this.initParams(params);
            this.initData();
        },

        methods: {
            // 更新数据方法
            setData(obj = {}) {
                for (let key in obj) {
                    this[key] = obj[key];
                }
            },

            // 初始化进入参数
            initParams(params = {}) {
                for(let key in params) {
                    if(privateData[key] !== undefined && params[key]) {
                        privateData[key] = params[key];
                    }
                }
            },

            // 初始化数据
            initData() {
                if(!new GpsInfoModel().getModel("cityInfo")
                    || !new GpsInfoModel().getModel("cityInfo").cityId) {
                    return Promise.resolve("暂无cityId");
                }

                return new GetHouseEntrustDetail({
                    vipCaseId: privateData.vipCaseId,
                    caseType: privateData.caseType,
                    cityId: new GpsInfoModel().getModel("cityInfo").cityId
                }).send()
                    .then(res => {
                        if(res.STATUS != 1) {
                            uni.showModal({
                                title: "",
                                content: "获取数据失败啦！请稍后重试。",
                                showCancel: false,
                                confirmText: "我知道了",
                                confirmColor: this.Const.confirmColor
                            });
                            return;
                        }

                        let data = res.DATA || {};
                        let entrustInfo = new EntrustInfoItem();
                        entrustInfo.regionName = data.regionName || "";
                        entrustInfo.buildName = data.buildName || "";
                        entrustInfo.houseUseageCn = data.houseUseageCn || "";
                        entrustInfo.houseRoof = data.houseRoof || "";
                        entrustInfo.houseUnit = data.houseUnit || "";
                        entrustInfo.houseFloor = data.houseFloor || "";
                        entrustInfo.houseNum = data.houseNum || "";
                        entrustInfo.houseArea = data.houseArea || "";
                        entrustInfo.houseTotalPrice = data.houseTotalPrice || "";
                        entrustInfo.priceUnitCn = data.priceUnitCn || "";
                        this.entrustInfo = entrustInfo;

                        privateData.buildId = data.buildId || "";
                        privateData.userId = data.wxId || "";
                        privateData.layer = data.houseFloor == '0' ?  '': data.houseFloor;
                        privateData.allLayer = data.houseFloors == '0' ?  '': data.houseFloors;

                        this.remark = data.houseDesc ? decodeURI(data.houseDesc) : '';
                        this.room = data.houseRoom == '-' ? '': data.houseRoom;
                        this.hall = data.houseHall == '-' ? '': data.houseHall;
                        this.wei = data.houseWei == '-' ? '': data.houseWei;
                        this.houseImages = data.photoList || [];
                        this.initHouseImages = data.photoList || [];
                        this.yearsVal = data.houseYear ? data.houseYear : '';
                        this.housePrice = data.houseTotalPrice || "";
                        this.balcony = data.houseYang == '-' ? '' : data.houseYang;

                        // 朝向
                        this.aspectArr.forEach((item,index)=>{
                            if(item.id == data.houseDirect){
                                this.aspectArrI = index;
                            }
                        });
                        // 装修情况
                        this.decorArr.forEach((item,index)=>{
                            if(item.id == data.houseFitment){
                                this.decorArrI = index;
                            }
                        });

                        privateData.layerMaxLong = privateData.layer ? '6' : '2';
                        privateData.allLayerMaxLong = privateData.allLayer ? '6' : '2';
                        this.roomMax = this.room ? '3': '2';
                        this.hallMax = this.hall ? '3': '2';
                        this.weiMax = this.wei ? '3': '2';
                        this.balconyMax = this.balcony ? '4': '2';

                        //存储一份老数据，用于提交时对比有无修改变动
                        let oldEntrustInfo = {
                            houseDirect: data.houseDirect || '',
                            houseFitment: data.houseFitment || '',
                            houseYear: data.houseYear || '',
                            houseHall: data.houseHall == '-' ? '' : data.houseHall,
                            houseWei: data.houseWei == '-' ? '' : data.houseWei,
                            yang: data.houseYang == '-' ? '' : data.houseYang,
                            price: data.houseTotalPrice,
                            descp: data.houseDesc || '',
                        };
                        let privateItem = privateData.private;
                        // 合并数据
                        Object.assign(privateItem,oldEntrustInfo);
                        privateData.private = privateItem;

                        setTimeout(() => {
                            let that = this;
                            let query = this.DifferenceApi.createSelectorQuery(this);
                            let nodesRef = query.selectAll(".itembox");
                            nodesRef.fields({
                                dataset: true,
                                rect: true
                            }, (result) => {
                                result[0].dataset = {
                                    index: 0
                                };
                                that.elements = result;
                            }).exec();
                        }, 100);
                    })
                    .catch((err) => {
                        uni.showModal({
                            title: "",
                            content: "获取数据失败啦！请稍后重试。",
                            showCancel: false,
                            confirmText: "我知道了",
                            confirmColor: this.Const.confirmColor
                        });
                    });
            },

            // 价格blur
            blurPrice(e) {
                this.housePrice = e.detail.value;
            },
            // 建筑年代change
            yearBuilt(e) {
                this.yearsVal = e.detail.value;
            },
            // 朝向change
            orientation(e) {
                this.aspectArrI = e.detail.value;
            },
            // 装修change
            decoration(e) {
                this.decorArrI = e.detail.value;
            },
            // 聚焦
            focusApartment(e) {
                let val = e.detail.value.replace(/[\u4E00-\u9FA5]/g,'');
                let num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
                if (e.currentTarget.dataset.val == 'room'){
                    this.setData({
                        room: val,
                        roomMax: num,
                    });
                }
                if (e.target.dataset.val == 'hall'){
                    this.setData({
                        hall: val,
                        hallMax: num,
                    })
                }
                if (e.target.dataset.val == 'wei'){
                    this.setData({
                        wei: val,
                        weiMax: num,
                    })
                }
                if (e.target.dataset.val == 'balcony'){
                    this.setData({
                        balcony: val,
                        balconyMax: num,
                    })
                }
            },
            // 失去聚焦
            blurApartment(e) {
                let val = e.detail.value.replace(/[^\d]/g, "");
                let num = e.currentTarget.dataset.long;
                if (val == '') {
                    num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
                }
                if (val > 10){
                    uni.showToast({
                        title: '请输入小于10的' + e.target.dataset.type,
                        icon: 'none',
                    });
                    val = 10
                }
                if (e.target.dataset.val == 'room'){
                    this.setData({
                        room: val,
                        roomMax: num,
                    })
                }
                if (e.target.dataset.val == 'hall'){
                    this.setData({
                        hall: val,
                        hallMax: num,
                    })
                }
                if (e.target.dataset.val == 'wei'){
                    this.setData({
                        wei: val,
                        weiMax: num,
                    })
                }
                if (e.target.dataset.val == 'balcony'){
                    this.setData({
                        balcony: val,
                        balconyMax: num,
                    })
                }
            },
            // 备注
            remarkNum(e) {
                this.setData({
                    remark: e.detail.value,
                });
            },

            //长按
            _longtap(e) {
                this.setData({
                    x: e.currentTarget.offsetLeft,
                    y: e.currentTarget.offsetTop,
                    hidden: false,
                    flag: true
                });
            },
            //触摸开始
            touchs(e, index) {
                privateData.beginIndex = index;
            },
            //触摸结束
            touchend(e) {
                if (!this.flag) {
                    return;
                }

                let changedTouches = e.changedTouches || e.mp.changedTouches || [];
                let x = changedTouches[0].pageX;
                let y = changedTouches[0].pageY;
                let list = this.elements;
                let data = this.houseImages;
                for (let j = 0; j < list.length; j++) {
                    let item = list[j];

                    if (x > item.left && x < item.right && y < item.bottom) {
                        let endIndex = item.dataset.index;
                        let beginIndex = privateData.beginIndex;
                        //向后移动
                        if (beginIndex < endIndex) {
                            let obj = {};
                            for (let k in data[endIndex]) {
                                obj[k] = data[endIndex][k];
                            }
                            data[endIndex] = this.movePicture(data[beginIndex]);
                            data[beginIndex] = this.movePicture(obj);
                        }

                        //向前移动
                        if (beginIndex > endIndex) {
                            let obj = {};
                            for (let k in data[endIndex]) {
                                obj[k] = data[endIndex][k];
                            }
                            data[endIndex] = this.movePicture(data[beginIndex]);
                            data[beginIndex] = this.movePicture(obj);
                        }

                        let saveName = data[0].saveName?data[0].saveName:'';
                        let photoId = data[0].photoId?data[0].photoId:'';
                        this.setData({
                            houseImages: data,
                            photoTopId: photoId,
                            photoTopUrl: saveName,
                        });
                    }
                }
                this.setData({
                    hidden: true,
                    flag: false
                })
            },
            // 移动图片删除
            movePicture(obj){
                let imgObj = obj;
                if(obj.photoId != ''){
                    new DealHousePhoto({
                        cityId: new GpsInfoModel().getModel("cityInfo").cityId,
                        photoId: obj.photoId
                    }).then(res => {});
                    imgObj = {
                        photoId: '',
                        saveName: obj.picUrl.split('http://pic.myfun7.com/')[1],
                        picUrl: obj.picUrl
                    }
                }
                return imgObj
            },
            //滑动
            touchm(e) {
                if (this.flag) {
                    let x = e.touches[0].pageX;
                    let y = e.touches[0].pageY;
                    this.setData({
                        x: x - 75,
                        y: y - 45
                    });
                }
            },
            // 删除
            deleteImg(index, item) {
                let _this = this;
                let arr = this.houseImages;
                if (item.photoid != '') {
                    new DealHousePhoto({
                        cityId: new GpsInfoModel().getModel("cityInfo").cityId,
                        photoId: item.photoId || item.photoid || ""
                    }).send();
                } else {
                    arr.splice(index,1);
                    _this.setData({ houseImages: arr });
                }
                arr.splice(index,1);
                if(arr.length == 0){
                    arr = []
                }
                if(index == 0 && arr.length > 0){
                    this.setData({
                        photoTopId: arr[0].photoId?arr[0].photoId:'',
                        photoTopUrl: arr[0].saveName?arr[0].saveName:'',
                    })
                }
                this.setData({
                    houseImages: arr,
                    initHouseImages: arr
                });
            },
            // chooseImg
            chooseImg() {
                let _that = this, housImgs = _that.houseImages || [],
                    imgUrlArr = _that.imgUrlArr || [];
                privateData.uploadingFlag = true;
                uni.chooseImage({
                    count: 12 - _that.houseImages.length,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                    success: function (res) {
                        var tempFilePaths = res.tempFilePaths;
                        var count = res.tempFilePaths.length;
                        for (var i = 0; i < tempFilePaths.length; i++) {
                            (function (j) {
                                new UploadFile(tempFilePaths[j]).send().then(json => {
                                    if (json.STATUS == 1) {
                                        var fullUrl = json.data[0].fullUrl;
                                        var saveName = json.data[0].saveName;
                                        count--;
                                    }
                                    housImgs.push({
                                        photoId: '',
                                        picUrl: tempFilePaths[j],
                                        saveName:saveName
                                    });
                                    _that.setData({
                                        houseImages: housImgs,
                                    });
                                    if (count == 0) {
                                        privateData.uploadingFlag = false;
                                    }
                                });
                            })(i)
                        }
                    },
                    fail: function (res) {
                        privateData.uploadingFlag = false;
                    }
                })
            },

            // 提交
            submitInfo() {
                if(!privateData.canvote) return;

                // 如果价格和户型中的几室没有填写不能提交
                if(!this.housePrice || this.housePrice == 0){
                    uni.showToast({
                        title: '请输入价格',
                        icon: 'none'
                    });
                    return;
                }

                if(!this.room && this.entrustInfo.houseUseageCn != '商铺') {
                    uni.showToast({
                        title: '请输入户型',
                        icon: 'none'
                    });
                    return;
                }

                privateData.canvote = false;
                var aspectArrI = this.aspectArrI == '' ? 0 : this.aspectArrI;
                var decorArrI = this.decorArrI == '' ? 0 : this.decorArrI;
                // 提交所需参数
                var obj = {
                    cityId: new GpsInfoModel().getModel("cityInfo").cityId,
                    buildId: privateData.buildId,
                    caseType: privateData.caseType,
                    youyouUserId: privateData.youyouUserId,
                    dataCityId: new GpsInfoModel().getModel("cityInfo").cityId,
                    vipCaseId: privateData.vipCaseId,
                    houseFloor: privateData.layer,      //所在楼层
                    houseFloors: privateData.allLayer,     //总楼层
                    houseRoom: this.room,      //几室
                    houseHall: this.hall,      //几厅
                    houseWei: this.wei,       //几卫
                    yang: this.balcony,      //几阳台
                    houseYear: this.yearsVal,      //房屋年代
                    price:  this.housePrice,
                    houseArea:  this.entrustInfo.houseArea,
                    houseDirect: this.aspectArr[aspectArrI].id,     //朝向
                    houseFitment: this.decorArr[decorArrI].id,   //装修情况
                    descp: this.remark,  //备注
                    fileAddrs: '',
                    photoTopUrl: this.photoTopUrl,
                    photoTopId: this.photoTopId
                };
                // 图片数据处理
                if(this.initHouseImages.length === 0 && this.houseImages.length > 0){
                    obj.photoTopUrl = this.houseImages[0].saveName;
                    obj.photoTopId = this.houseImages[0].photoId;
                }
                var arrImgs = this.houseImages;
                if(arrImgs.length > 0){
                    for(var i = 0; i < arrImgs.length; i++){
                        // 无photoId
                        if (arrImgs[i].photoId == '') {
                            // 这是已经上传的图片
                            if(arrImgs[i].saveName == undefined){
                                obj.fileAddrs += encodeURI(arrImgs[i].picUrl)+',';
                                continue;
                            }
                            obj.fileAddrs += encodeURI(arrImgs[i].saveName)+',';
                        }
                    }
                }

                // 对比数据 是否变动判断是否需要请求接口，（字段未变动或 只有图片删除，不请求接口）
                //先判断关键字段是否修改
                if(!this.isChangeHouseInfo(obj)){
                    uni.showToast({ title: '提交成功', icon: 'none', duration: 2000 });
                    setTimeout(n=> {
                        uni.navigateBack({
                            delta: 1
                        });
                    }, 2000);
                    privateData.canvote = true;
                    return;
                }

                var url = "";
                var that = this;
                if (privateData.requesting) {
                    uni.showToast({ title: '数据提交中...', icon: 'loading' });
                    return;
                }

                uni.showLoading({ title: '数据提交中...', mask: true });
                var casetype = privateData.caseType;
                // 更新出售数据
                if(casetype == 1){
                    new UpSaleEntrustDetail(obj).send()
                        .then(res => {
                            that.successCallback(res);
                        })
                }
                // 更新出租数据
                if(casetype == 2){
                    new UpLeaseEntrustDetail(obj).send()
                        .then(res => {
                            that.successCallback(res);
                        })
                }
            },

            successCallback(res) {
                privateData.canvote = true;
                if(res.STATUS !== 1){
                    uni.showToast({ title: res.INFO, icon: 'none', duration: 2000 });
                    privateData.canvote = true;
                    return;
                }

                uni.showToast({ title: res.DATA, icon: 'none', duration: 2500 });
                setTimeout(n=> {
                    uni.navigateBack({
                        delta: 1
                    })
                }, 2500);
            },

            // 判断是否有编辑信息产生改动（删除图片除外）
            isChangeHouseInfo(submitData){
                //有新增图片
                if(submitData.fileAddrs != '') return true;

                for (const key in privateData.private) {
                    if (privateData.private[key] != submitData[key]) {
                        return true;
                    }
                }

                return false;
            }
        }
    }
</script>

<style scoped>
    .title{
        background-color:#f6f6f6;
        color:#999999;
        height:70upx;
        line-height:70upx;
        padding-left:30upx;
        font-size:26upx;
    }
    #perfectInfo{
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .g-perfect-center{
        width: 690upx;
        height: auto;
        padding: 0 30upx;
        position: relative;
    }
    .g-title{
        font-size: 30upx;
        color: #333333;
    }
    .s-subText{
        font-size: 24upx;
        color: #999999;
    }
    .pad20{
        padding-top: 20upx;
        padding-bottom: 20upx;
    }
    .pad35{
        padding-top: 35upx;
        padding-bottom: 35upx;
    }
    .pad3550{
        padding-top: 35upx;
        padding-bottom: 50upx;
    }
    .pad50{
        padding-top: 30upx;
        padding-bottom: 50upx;
    }
    .g-gray-blank{
        width: 100%;
        height: 30upx;
        background-color: #f6f6f6;
    }
    .g-tips-seat{
        width: 720upx;
        height: 70upx;
        line-height: 70upx;
        padding-left: 30upx;
        font-size: 26upx;
    }
    .g-entrust-info{
        background-color: #f6f6f6;
        color: #999999;
    }
    .g-perfect-info{
        background-color: #f0f6ff;
        color: #4d72af;
    }

    .g-houses{
        height: 40upx;
        font-size: 40upx;
        color: #333333;
        font-weight: 600;
    }
    .g-house-info{
        width: 480upx;
        height: auto;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 28upx;
        color: #666666;
        margin-top: 30upx;
    }
    .g-house-info text{
        padding-right: 19upx;
    }
    .g-house-Price{
        width: 230upx;
        height: 50upx;
        line-height: 50upx;
        font-size: 50upx;
        color: #ab7f2e;
        position: absolute;
        right: 33upx;
        bottom: 49upx;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        font-weight: 600;
        position: absolute;
        top: 87upx;
        right: 30upx;
    }
    .g-house-unit{
        font-size: 26upx;
    }
    /* 楼盘信息选择 */
    .g-info-select{
        width: 720upx;
        height: auto;
        padding-left: 30upx;
    }
    .g-info-item{
        height: 110upx;
        line-height: 110upx;
        border-bottom: 1upx solid #ededed;
        font-size: 30upx;
        color: #333333;
    }
    .g-info-item:last-child{
        border-bottom: none;
    }
    .g-right-box{
        height: 44upx;
        display:flex;
        align-items:center;
        margin-top: 30upx;
    }
    .g-right-box input{
        display: inline-block;
        height: 44upx;
        color: #333333;
    }
    .s-select-color{
        color: #333333;
    }
    .g-divid-line{
        display: block;
        height: 70%;
        line-height: 100%;
        width: 5upx;
        margin: 0 24upx;
        color: #e7e7e7;
    }

    .w94{
        width: 94upx;
    }
    .w74{
        width: 74upx;
    }
    .w70{
        width: 70upx;
    }
    .w60{
        width: 60upx;
    }

    .fl{float: left;}
    .fr{float: right;padding-right: 30upx;}

    .s-select-fill{
        line-height: 100upx;
        font-size: 24upx;
        display: inline-block;
        color: #999999;
    }
    .s-copy-more{
        width: 300upx;
        text-align: right;
        color: #cccccc;
        float: left;
        margin-right: 20upx;
    }
    .g-more-img{
        width: 14upx;
        height: 24upx;
    }
    /* 备注 */
    .g-remark-box{
        width: 648upx;
        height: 134upx;
        background-color: #f6f6f6;
        border-radius: 4upx;
        border: solid 1upx #eeeeee;
        margin-top: 36upx;
        padding: 21upx;
        position: relative;
    }
    .g-remark-text{
        width: 100%;
        font-size: 24upx;
    }
    .g-remark-placeholder{
        font-size: 24upx;
        color: #cccccc;
    }
    .g-remark-length{
        position: absolute;
        right: 20upx;
        bottom: 20upx;
        font-size: 20upx;
        color: #cccccc;
    }



    /* 保存 */
    .g-foot-submit{
        width: 690upx;
        height: 80upx;
        background-image: linear-gradient(-90deg,
        #fe8e0d 0%,
        #ff6f2e 100%),
        linear-gradient(
                #00ca85,
                #00ca85);
        background-blend-mode: normal,
        normal;
        border-radius: 40upx;
        font-size: 32upx;
        line-height: 81upx;
        text-align: center;
        color: #ffffff;

    }


    /* 房源图片 */
    .s-hous-tips{
        font-size: 22upx;
        color: #999999;
        padding-top: 10upx;
    }

    .g-housImgs-box{
        width: 100%;
        height: auto;
        padding: 15upx 0 0 0;


    }

    .g-first-img{
        width: 45upx;
        height: 26upx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .f-delete-img{
        width: 30upx;
        height: 30upx;
        position: absolute;
        top: -10upx;
        right: -10upx;
        z-index: 99;
    }

    .g-houseImg{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .g-itemImg{}
    /* test/test.wxss */
    .outer{
        width: 100%;
        height: auto;
        margin: 0 auto;
        position: relative;
    }

    movable-area{
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .g-housImgs-item{
        width: 156upx;
        height: 156upx;
        position: relative;
        margin-top: 15upx;
        margin-right: 22upx;
    }
    .g-housImgs-item:nth-child(4n){ margin-right: 0upx;}
    .index-first{
        display: inline-block;
        width: 15upx;
        height: 150upx;
    }

    /* 添加埋点样式 */
    .cont-box-item{
        display: inline-block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
    .cont-box-item button{
        width: 100%;
        height: 100%;
    }
    .price-input{
        width: 170upx;
        padding-right: 10upx;
        text-align: right;
    }
</style>
