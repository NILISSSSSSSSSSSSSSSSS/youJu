<template>
    <!-- 合同查询 -->
    <view class="wrap">
        <view class="content-frame">
            <view class="title-h6">合同查询进度</view>
            <view class="input-content">
                <input type="text" class="search" :value="searchValue" @input="inputValue"
                       placeholder="请输入房源编号/客源编号/合同编号" />
            </view>
            <view class="query-btn" @click="query">查 询</view>
        </view>
    </view>
</template>

<script>
    import {Config} from "../../utils/config";
    import {GpsInfoModel} from "../../model/GpsInfoModel";
    import {CompStoreArchiveIdModel, CompStoreCompIdModel} from "../model/CompStoreModel";
    import {QueryContract} from "../net/CompStoreNet";

    export default {
        data() {
            return {
                searchValue: "", // 合同编号
            }
        },

        methods: {
            // 更新数据方法
            setData(obj = {}) {
                for (let key in obj) {
                    this[key] = obj[key];
                }
            },

            inputValue(e){
                this.setData({
                    searchValue: e.detail.value
                });
            },

            // 查询合同
            query(){
                let searchValue = this.searchValue;  //查找的合同编号
                let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
                let cityId = cityInfo.cityId || "1";
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                if(!searchValue){
                    uni.showToast({title: '请输入合同编号', icon: 'none'});
                    return;
                }

                new QueryContract({
                    query_no: searchValue,  //合同编号
                    cityId: cityId,    //城市ID
                    compId: new CompStoreCompIdModel().getModel() || "",  //公司ID
                    archiveId: archiveId,
                }).send().then(res=> {
                    if(res.status != 200 && res.status != 1){
                        uni.showToast({title: res.msg || "查询失败", icon: 'none'});
                        return;
                    }

                    uni.navigateTo({
                        url:`/pagesStore/contractTcDetail/contractTcDetail?&query_no=${searchValue}&comp_id=${new CompStoreCompIdModel().getModel()}`
                    });
                })
            }
        }
    }
</script>

<style>
    page{
        background: #F6F6F6;
        width: 100%;
        height: 100%;
    }
    .wrap{
        width: 100%;
        margin: 0 auto;
        padding: 0 40upx;
        box-sizing: border-box;
    }
    .wrap .content-frame{
        font-size: 28upx;
        background: white;
        text-align: center;
        border: 1px solid #E7E2E2;
        border-radius: 8upx;
        margin: 0 auto;
        margin-top: 40upx;
    }
    .wrap .title-h6{
        padding: 40upx 50upx 30upx 50upx;
        text-align: left;
        font-size: 30upx;
        color: #666;
        font-weight: 600;
    }
    .wrap .input-content{
        height: 80upx;
        line-height: 80upx;
        border: 1px solid #E7E2E2;
        border-radius: 4upx;
        width: 90%;
        margin: 0 auto;
        display: flex;
        align-items: center;
    }
    .wrap .input-content .search{
        border: none;
        width: 95%;
        height: 60upx;
        line-height: 60upx;
        outline: none;
        font-size: 28upx;
        text-align: left;
        padding-left: 20upx;
    }
    .query-btn{
        padding: 40upx 0;
        border-top: 1px solid #ab7f2e;
        margin-top: 40upx;
        color: #ab7f2e;
        font-size: 32upx;
    }
</style>