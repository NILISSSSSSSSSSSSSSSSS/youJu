<template>
    <view class="process_top">
        <view class="f_r_b process_name_address">
            <view class="f_c_s process_top_left">
                <view class="process_top_text f_r_s">
                    <view class="process_top_name">{{ item.buildName }}</view>
                    <view class="process_top_area">{{ area }} {{ price }}</view>
                </view>

                <view class="process_top_address">
                    <image class="process_top_icon" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/marker_new_white.png"></image>

                    <text class="process_address_text">{{ item.propertyAddress }}</text>
                </view>
            </view>

            <view @click.stop="lookContractDetail" v-if="contractStatus && contractStatus == 1" class="look_contract_btn">查看合同</view>
        </view>

        <view class="f_r_b process_info_list">
            <block v-for="(list, index) in infoList" :key="index">
                <view class="f_c_s process_info_view">
                    <block v-for="(item, infoIndex) in list" :key="infoIndex">
                        <view class="f_r_s process_info_item">
                            <view class="process_info_title f_r_b">
                                <block v-for="(text, textIndex) in item.title" :key="textIndex">
                                    <view>{{ text }}</view>
                                </block>
                            </view>:
                            <view class="process_info_val">{{ item.val || "--" }}</view>
                        </view>
                    </block>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
    import {
        ContractCityIdModel,
        ContractDealIdModel,
        ContractIdModel,
        ContractPdfUrlModel
    } from "../../../model/ContractModel";

    class ProcessTopItem {
        buildName = "";  // 小区名称 String
        propertyAddress = "";  // 产权地址
        houseArea = "";  // 面积 Int
        houseTotalPrice = "";  // 总价 Int
        saleHouseName = ""; // 卖方姓名
        buyHouseName = "";  // 买方姓名
        archiveName = ""; // 经纪人姓名
        archiveDeptName = ""; // 经纪人门店名字
        signTime = "";  // 签约时间  处理之后的

        getAreaUnit() {
            return "㎡";
        }

        getPriceUnit() {
            return "万";
        }
    }

    export default {
        data() {
            return {

            }
        },

        props: {
            item: {
                default() {
                    return new ProcessTopItem();
                },
                type: Object
            },
            contractStatus: {
                default() {
                    return "";
                },
                type: String
            },
            cityId: {
                default() {
                    return "";
                },
                type: String
            }
        },

        computed: {
            area() {
                if(!this.item.houseArea) return "";

                return this.item.houseArea + new ProcessTopItem().getAreaUnit();
            },
            price() {
                if(!this.item.houseTotalPrice) return "";

                return this.item.houseTotalPrice;
            },
            infoList() {
                return [
                    [
                        {title: "卖方", val: this.item.saleHouseName},
                        {title: "经纪人", val: this.item.archiveName+"-"+this.item.archiveDeptName}
                    ],
                    [
                        {title: "买方", val: this.item.buyHouseName},
                        {title: "签约日期", val: this.item.signTime}
                    ]
                ];
            }
        },

        methods: {
            // 查看合同
            lookContractDetail() {
                if(!new ContractCityIdModel().getModel()) {
                    uni.showToast({title: "暂无合同创建城市信息", icon: "none"});
                    return;
                }

                if(!new ContractDealIdModel().getModel()) {
                    uni.showToast({title: "暂无合同id", icon: "none"});
                    return;
                }

                uni.navigateTo({
                    url: "/pagesShare/contractShare/contactInfo"
                });
            }
        }
    }
</script>

<style scoped>
    .process_top{
        background:-webkit-linear-gradient(top, #ff7626, #fe8a11);
        padding: 0 30upx 33upx 36upx;
        box-sizing: border-box;
    }
    .process_name_address{
        width: 100%;
        padding-top: 28upx;
        box-sizing: border-box;
    }
    .process_top_left{
        width: 100%;
    }
    .process_top_text{
        line-height: 55upx;
        text-align: left;
        color: #ffffff;
        font-size: 36upx;
        font-weight: bold;
    }
    .process_top_name{
        margin-right: 14upx;
    }
    .process_top_address{
        line-height: 40upx;
        margin-top: 5upx;
        text-align: left;
    }
    .process_top_icon{
        width: 21upx;
        height: 27upx;
        flex-shrink: 0;
        margin: 7upx 10upx auto 0;
        display: inline-block;
        position: relative;
        top: 3upx;
    }
    .process_address_text{
        font-size: 26upx;
        color: #ffffff;
        text-align: left;
        line-height: 40upx;
    }
    .look_contract_btn{
        background: #ffffff;
        width: 154upx;
        height: 54upx;
        line-height: 54upx;
        border-radius: 27upx;
        box-sizing: border-box;
        text-align: center;
        margin-top: 24upx;
        flex-shrink: 0;
        color: #ff7823;
        font-size: 28upx;
        margin-left: 15upx;
    }
    .process_info_list{
        width: 100%;
        margin-top: 30upx;
    }
    .process_info_view{
        width: 50%;
    }
    .process_info_item{
        height: 46upx;
        line-height: 46upx;
        color: #ffffff;
        font-size: 26upx;
        text-align: left;
        width: 100%;
    }
    .process_info_title{
        width: 110upx;
        text-align:justify;
        text-justify:distribute-all-lines;
        text-align-last:justify;
        flex-shrink: 0;
    }
    .process_info_val{
        width: 100%;
        text-align: left;
        margin-left: 16upx;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>