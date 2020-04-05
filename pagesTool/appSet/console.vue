<template>
    <view class="console_view">
        <view class="no_data f_c_c" v-if="checkList && checkList.length === 0">
            <image class="no_data_img" src="/static/app-plus/images/console_no_data.png"></image>
            <view class="no_data_text">暂无日志</view>
        </view>

        <checkbox-group v-show="checkList && checkList.length > 0" class="f_c_s list_view"
                        @change="checkBoxChange">
            <label class="f_c_s console_item" v-for="(item, index) in checkList" :key="item.id">
                <view class="f_r_s">
                    <checkbox :value="item.id" :checked="chooseIdMap[item.id]" color="#ab7f2e"/>
                    <view class="f_c_c item_title">{{index + 1}}. {{item.name}}</view>
                </view>

                <text @longtap="longtap(item.value)" class="f_r_s item_cont">{{item.key}}: {{item.value}}</text>
            </label>
        </checkbox-group>

        <view class="bottom_empty"></view>

        <view class="f_r_b all_choose">
            <view class="f_r_s" @click="allChoose">
                <image class="all_choose_icon" :src="allChooseMap[isAllChoose].url"></image>
                <view>{{ allChooseMap[isAllChoose].text }}</view>
            </view>

            <view class="f_r_e">
                <!--<view @click="saveFile">保存</view>-->
                <view class="remove_btn" v-if="showDeal" @click="removeItem">删除</view>
            </view>
        </view>
    </view>
</template>

<script>
    import {ConsoleModel} from "../../model/ConsoleModel";
    class ConsoleItem {
        id = 0;  // 时间戳
        name = "";  // 时间戳转的年月日
        key = "";
        value = "";
        checked = false;  // 是否选中
    }

    export default {
        data() {
            return {
                chooseIdMap: {}, // 选中的
                checkList: null,  // 日志列表
                allChooseMap: {
                    1: {
                        // url: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/calculator/calculate_btn_normal.png",
                        url: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/calculate_btn_normal.png",
                        text: "全选"
                    },
                    2: {
                        // url: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/calculator/calculate_btn_selected.png",
                        url: "http://cdn.haofang.net/static/wxPlusApp/yjk/checked.png",
                        text: "全不选"
                    }
                },
                isAllChoose: 1, // 是否是全选  1: false  2: true
                canvasHeight: "100%",
                showDeal: false,  // 是否显示删除按钮
            }
        },

        onLoad() {
            this.initData();
        },

        methods: {
            initData() {
                this.checkList = new ConsoleModel().getModel() || [];
            },

            // 全选
            allChoose() {
                if (this.checkList.length === 0) return;

                this.isAllChoose = this.isAllChoose === 1 ? 2 : 1;
                let chooseIdMap = {};
                let haveChecked = false;
                for (let item of (this.checkList)) {
                    chooseIdMap[item.id] = !!(this.isAllChoose == 2);
                    if (!haveChecked && chooseIdMap[item.id]) {
                        haveChecked = true;
                    }
                }
                this.showDeal = haveChecked;
                this.chooseIdMap = chooseIdMap;
            },

            // checkbox
            checkBoxChange(e) {
                let ids = e.detail.value || [];
                let chooseIdMap = {};
                for (let key in (this.chooseIdMap || {})) {
                    chooseIdMap[key] = false;
                }
                for (let id of ids) {
                    chooseIdMap[id] = true;
                }
                this.chooseIdMap = chooseIdMap;
                if (ids.length === 0) {
                    this.showDeal = false;
                } else {
                    this.showDeal = true;
                }
                if(ids.length !== this.checkList.length && this.isAllChoose === 2) {
                    this.isAllChoose = 1;
                    return;
                }

                if (ids.length === this.checkList.length && this.isAllChoose === 1) {
                    this.isAllChoose = 2;
                }
            },

            // 删除
            removeItem() {
                let chooseIdMap = this.chooseIdMap || {};
                let haveChecked = false;
                let list = new ConsoleModel().getModel() || [];
                let newList = [];
                for (let item of list) {
                    if (chooseIdMap[item.id]) {
                        haveChecked = true;
                        continue;
                    }

                    newList.push(item);
                }
                new ConsoleModel().setModel(newList);
                if (!haveChecked) {
                    uni.showToast({title: "请选择删除的内容", icon: "none"});
                    return;
                }

                let checkList = [];
                for (let item of (this.checkList || [])) {
                    if (chooseIdMap[item.id]) {
                        continue;
                    }

                    checkList.push(item);
                }
                this.checkList = checkList;
                this.chooseIdMap = {};
                if(checkList.length === 0) {
                    this.isAllChoose = 1;
                    this.showDeal = false;
                }
                plus.nativeUI.toast("删除成功");
            },

            // 保存文件
            saveFile() {
                let systemInfo = uni.getSystemInfoSync();
                let windowHeight = systemInfo.windowHeight;
                let windowWidth = systemInfo.windowWidth;

                let context = uni.createCanvasContext("save_id");
                let temp = "";
                let row = [];
                let checkList = this.checkList;
                context.setFontSize(18);
                context.setFillStyle("#000");
                for (let a = 0; a < checkList.length; a++) {
                    let name = checkList[a].name.split("");
                    let info = (checkList[a].key + ": " + checkList[a].value).split("");
                    let readyPushName = false;
                    let readyPushInfo = false;
                    for (let m = 0;m<name.length;m++) {
                        if (context.measureText(temp).width < windowWidth*1.5) {
                            readyPushInfo = false;
                            temp += name[m];
                            continue;
                        }

                        readyPushName = true;
                        m--; //添加a--,防止字符丢失
                        row.push(temp);
                        temp = "";
                    }
                    if (!readyPushName) {
                        row.push(temp);
                        temp = "";
                    }
                    for (let k = 0;k<info.length;k++) {
                        if (context.measureText(temp).width < windowWidth*1.5) {
                            readyPushInfo = false;
                            temp += info[k];
                            continue;
                        }

                        readyPushInfo = true;
                        k--; //添加a--,防止字符丢失
                        row.push(temp);
                        temp = "";
                    }
                    if (!readyPushInfo) {
                        row.push(temp);
                        temp = "";
                    }
                }
                console.error("--row--", row);
                for (let b = 0; b < row.length; b++) {
                    context.fillText(row[b], 10, 30 + b * 30, windowWidth*1.3);
                }
                this.canvasHeight = (row.length + 3) * 30;
                context.draw(true, function () {
                    uni.canvasToTempFilePath({
                        width: windowWidth,
                        height: (row.length + 1) * 30,
                        canvasId: 'save_id',
                        success(res) {
                            uni.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success(res) {
                                    uni.showToast({
                                        title: '保存成功',
                                        icon: 'success'
                                    });
                                }
                            });
                        }
                    })
                });
            },

            // 长按
            longtap(text) {
                uni.vibrateLong({
                    success: () => {
                        uni.showActionSheet({
                            itemList: ['复制'],
                            success: (res) => {
                                console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
                                if (res.tapIndex === 0) {
                                    uni.setClipboardData({data: text});
                                }
                            }
                        });
                    }
                });
            },
        }
    }
</script>

<style>
    .remove_btn{
        width: 120upx;
        height: 70upx;
        line-height: 70upx;
        text-align: center;
        border-radius: 8upx;
        overflow: hidden;
        margin: auto 0;
        background-color: #ab7f2e;
        font-size: 30upx;
        color: #ffffff;
    }
    /*暂无数据*/
    .no_data{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #ffffff;
        z-index: 200;
        padding: 40upx;
        box-sizing: border-box;
    }
    .no_data_img{
        width: 336upx;
        height: 200upx;
        margin: 0 auto;
        flex-shrink: 0;
    }
    .no_data_text{
        text-align: center;
        margin-top: 10upx;
    }

    page{
        width: 100%;
        background-color: #ffffff;
    }
    .console_view{
        width: 100%;
        background-color: #ffffff;
        padding: 30upx 40upx 40upx;
        box-sizing: border-box;
    }
    .all_choose{
        height: 120upx;
        line-height: 120upx;
        position: fixed;
        z-index: 100;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0px -1upx 32upx 0upx  rgba(97, 97, 97, 0.11);
        padding: 0 40upx;
        box-sizing: border-box;
    }
    .list_view{
        width: 100%;
    }
    .console_item{
        margin-top: 30upx;
    }
    .item_title{
        margin: auto 0 auto 8upx;
        color: #2C405A;
        font-size: 32upx;
    }
    .item_cont{
        color: #000000;
        margin-top: 10upx;
        line-height: 40upx;
        font-size: 34upx;
        flex-wrap: wrap;
        word-break: break-word;
    }
    .bottom_empty{
        width: 100%;
        height: 120upx;
    }
    .all_choose_icon{
        width: 46upx;
        height: 46upx;
        flex-shrink: 0;
        margin: auto 10upx auto 0;
    }
</style>
