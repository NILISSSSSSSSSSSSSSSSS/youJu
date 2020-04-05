<template>
	<view class="top_name_view">
		<!-- 收藏和title -->
		<view class="name_view f_r_b">
			<view class="house_name">{{ item.houseDes }}</view>

			<view style="flex-shrink: 0;" class="f_r_e" v-if="pageFrom != 'entrust' && pageFrom != 'jk'">
				<button v-if="(item.houseUseageCn == '住宅' || item.houseUseageCn == '别墅') && item.caseType == 1"
						form-type="submit" hover-class="none" @click="pingGuHousePrice" class="ping_gu f_c_s">
					<view class="ping_gu_img"></view>
					<view class="ping_gu_text">估价</view>
				</button>

				<button form-type="submit" hover-class="none"
						@click="collectBtn" class="collect_view f_c_s">
					<view v-if="collectMap[isCollected]" class="collect_img"
						  :class="isCollected ? 'collect_img_active' : ''"></view>
					<view v-if="collectMap[isCollected]"
						  class="collect_text">{{ collectMap[isCollected].text }}</view>
				</button>
			</view>
		</view>

		<!-- 核验码 -->
		<button v-if="item.checkCodeFun" class="check_code_view" form-type="submit" hover-class="none" @click="checkCode">
			{{ item.checkCodeCityName }}{{ item.checkCodeFun }}
		</button>

		<!-- 房源标签 -->
		<view class="tags_view f_r_s">
			<view class="f_c_c" v-if="item.isHeZu == 1">合租</view>
			<view class="f_c_c" v-for="(info, index) in item.houseTags" :key="info">{{info}}</view>
		</view>

		<!-- 售价+户型+面积 -->
		<view class="price_view f_r_b">
			<view class="f_c_e price_view_item">
				<view v-if="item.totalPrice"
					  class="totalPrice main_color">{{ item.totalPrice }}{{ item.priceUnitCn }}</view>

				<view class="gray_color" v-else>价格面议</view>

				<view class="totalPrice_text">售价</view>
			</view>

			<view class="f_c_e price_view_item">
				<view class="totalPrice main_color" v-if="item.houseInfo && item.houseUseageCn =='住宅'">{{ item.houseInfo }}</view>
				<view class="totalPrice main_color" v-if="item.houseUseageCn !='住宅' && item.houseUseageCn">{{ item.houseUseageCn }}</view>

				<view class="totalPrice_text">户型</view>
			</view>

			<view class="f_c_e price_view_item">
				<view class="totalPrice main_color">{{ item.houseArea || '--' }}</view>

				<view class="totalPrice_text">面积</view>
			</view>
		</view>

		<!-- 真房源图标 -->
		<button form-type="submit" hover-class="none" @click="trueHouseBtn"
				v-if="item.isTrueHouse && pageFrom != 'jk'" class="true_house f_r_s">
			<view class="true_house_icon_view f_r_c">
				<view class="true_house_icon"></view>
			</view>

			<view class="f_r_b true_hous_cont">
				<view class="true_hous_cont_text">本人承诺房源真实有效，点击查看详细规则</view>

				<view class="true_hous_arrow"></view>
			</view>
		</button>

		<!-- 单价+楼层+装修+朝向+年代+类型+小区 二手房详情使用 -->
		<view style="padding-left: 0;padding-right: 0;" class="f_r_s house_other" v-if="item.caseType == 1">
			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">单价:</view>
				<view class="">{{ item.unitPrice || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">楼层:</view>
				<view class="">{{ item.louCeng || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">装修:</view>
				<view class="">{{ item.zhaungXiu || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">朝向:</view>
				<view class="">{{ item.houseChao || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">年代:</view>
				<view class="">{{ item.nianDai || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">类型:</view>
				<view class="">{{ item.houseUseageCn || "--" }}</view>
			</view>

			<view style="width: 100%;" class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">小区:</view>
				<view class="">{{ item.buildName || "--" }}</view>
			</view>
		</view>

		<!-- 单价+楼层+装修+朝向+年代+类型+小区 二手房详情使用 -->
		<view class="f_r_s house_other" v-else-if="item.caseType == 3">
			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">房间:</view>
				<view class="">{{ item.fangJian && houseTypeMap[item.fangJian] ? houseTypeMap[item.fangJian] : "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">装修:</view>
				<view class="">{{ item.zhaungXiu || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">楼层:</view>
				<view class="">{{ item.louCeng || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">朝向:</view>
				<view class="">{{ item.houseChao || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">性别:</view>
				<view class="">{{ item.sex && sexLimitMap[item.sex] ? sexLimitMap[item.sex] : "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">付款:</view>
				<view class="">{{ item.fuKuan || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">押金:</view>
				<view class="">{{ item.yaJin || "--" }}</view>
			</view>
		</view>

		<!-- 单价+楼层+装修+朝向+年代+类型+小区 租房详情使用-->
		<view class="f_r_s house_other" v-else>
			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">装修:</view>
				<view class="">{{ item.zhaungXiu || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">楼层:</view>
				<view class="">{{ item.louCeng || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">年代:</view>
				<view class="">{{ item.nianDai || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">朝向:</view>
				<view class="">{{ item.houseChao || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">付款:</view>
				<view class="">{{ item.fuKuan || "--" }}</view>
			</view>

			<view class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">押金:</view>
				<view class="">{{ item.yaJin || "--" }}</view>
			</view>

			<view style="width: 100%;" class="f_r_s house_other_item">
				<view class="f_r_b house_other_title">小区:</view>
				<view class="">{{ item.buildName || "--" }}</view>
			</view>
		</view>
	</view>
</template>

<script>
    class TopNameItem {
        isHeZu = 0;  // 是否是合租  1是合租
        houseDes = "";  // 简介
        isCollected = false;  // 是否收藏 true
		isShow = false;
        totalPrice = "";  // 总价
		priceUnitCn = "万"; // 总价单位
        unitPrice = "";  // 单位价格 例如：10000元/㎡
        houseInfo = "";  // 描述  例如：1室1厅1卫
		houseRoom = "";  // 几室 例如： 1
        houseArea = "";  // 面积  例如：60㎡
		houseAreaNumber = ""; // 面积  例如：60
        houseChao = "";  // 朝向  例如：朝东
		houseChaoText = ""; // 朝向 例如：东
        houseTags = "";  // 标签  例如：["text"]
        zhaungXiu = "";  // 装修 例如： 毛坯
        louCeng = "";   // 楼层
		maxFloor = "";  // 总楼层数
		currentFloor = "";  // 例如：高层
        nianDai = "";  // 年代
		caseId = "";  // 房源id
		cityId = "";
		archiveId = "";
		reSource = ""; // 来源
		checkCodeFun = "";  // 真房源核验码， 通过是否存在判断是否是真房源
		checkCodeFunUrl = "";  // 真房源核验码点击跳转路径
		checkCodeCityName = "";  // 真房源核验码的名字
		houseUseageCn = ""; // 房源类别的文案 例如：住宅
		houseUseage = ""; // 房源类别的表示  例如： 1 代表住宅
		caseType = ""; // 房源类型  例如：1 二手房
		buildName = "";  // 小区名称
		buildId = "";  // 小区id

		// ---- 以下是租房专用 -----
		fuKuan = "";  // 付款
		yaJin = ""; // 押金

		// ---- 以下是合租专用 ----
		sex = "";  // 性别
		fangJian = ""; // 房间
    }

	import {AddOrDeleteCollect} from "@/net/houseApi/AddOrDeleteCollect.js";
	import {UserInfoModel} from "@/model/UserInfoModel.js";

	export default {
		data() {
			return {
				collectMap: {
                    true: {
                        text: "收藏",
                        src: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/detail_btn_collect_selected.png"
                    },
                    false: {
                        text: "收藏",
                        src: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/detail_btn_collect_nomal.png"
                    }
                },
				isClickCollectIng: false,
				houseTypeMap: {
					"0": '类型不限',
					"1": '类型不限',
					"2": '次卧',
					"3": '主卧',
					"4": '单间',
				},
				sexLimitMap: {
					"1": '男',
					"2": '女',
					"3": '男女不限',
				},
				isCollected: this.item ? this.item.isCollected || false : false,
			};
		},

		props: {
			pageFrom: {
				type: String,
				default: ""
			},
			item: {
				type: Object,
				default: {}
			}
		},

		mounted() {
			this.initCollectStatus();
		},

		watch: {
			item: {
				handler() {
					this.initCollectStatus();
				},
				deep: true
			}
		},

        methods: {
			initCollectStatus() {
				this.isCollected = this.item ? this.item.isCollected || false : false;
			},

			getFloor(houseFloor, totalFloorNum) {
				let highFloor = 40;
				let floor = 0;
				if (houseFloor == '低楼层' || houseFloor == '低层') {
					floor = (totalFloorNum > highFloor ? highFloor : totalFloorNum) * 1 / 6 + 1
				}
				if (houseFloor == '中楼层' || houseFloor == '中层') {
					floor = (totalFloorNum > highFloor ? highFloor : totalFloorNum) * 3 / 6 + 1
				}
				if (houseFloor == '高楼层' || houseFloor == '高层') {
					floor = (totalFloorNum > highFloor ? highFloor : totalFloorNum) * 5 / 6 + 1
				}
				if (houseFloor == '超高层') {
					floor = totalFloorNum - abs(totalFloorNum - 40) / 2
				}
				if (houseFloor == '其它') {
					floor = totalFloorNum
				}
				return Math.round(floor)
			},

            pingGuHousePrice() {
				this.PlatformUserBehavior.housePricePingGu();
				let item = this.item || {};
                uni.navigateTo({
					url: "/pagesTool/housePriceEvaluate/evaluateConditionChoose?buildName=" + (item.buildName || "")
					+ "&buildId=" + (item.buildId || "") + "&type=" + (item.houseUseage || "")
					+ "&area=" + (item.houseAreaNumber || "") + "&roomVal=" + (item.houseRoom || "")
					+ "&chaoXiangText=" + item.houseChaoText + "&currentLouCengVal=" + this.getFloor(item.currentFloor,item.maxFloor)
					+ "&aLLLouCengVal=" + item.maxFloor
				});
            },

			checkCode() {
				let that = this;
				if (!that.item.checkCodeFunUrl) return;

				let title = this.item.checkCodeCityName.replace('：', '');
				uni.navigateTo({
					url: "/pages/webView/webView?title=" + title +"&url=" + that.item.checkCodeFunUrl
				});
			},


            trueHouseBtn() {
                uni.navigateTo({
                	url: "/pagesHouse/fakeHouse/fakeHouse?archiveId=" + this.item.archiveId
						+ "&caseId=" +  this.item.caseId + "&caseType=" + this.item.caseType
                });
            },

            collectBtn() {
                let that = this;
                if(this.isClickCollectIng) return;

				if (!new UserInfoModel().getModel("me")) return;

				if (!new UserInfoModel().getModel("me").userId) return;

				this.isClickCollectIng = true;
				new AddOrDeleteCollect({caseId: this.item.caseId, caseType: this.item.caseType,
					cityId: this.item.cityId, reSource: this.item.reSource, userId: new UserInfoModel().getModel("me").userId,
					archiveId: this.item.archiveId}).send()
					.then(res => {
						if(res.STATUS != 1) {
							this.isClickCollectIng = false;
							return;
						}

						let toastText = "";
						do{
							if(this.isCollected) {
							    this.isCollected = false;
								toastText = "已取消";
							    break;
							}

							this.isCollected = true;
							toastText = "收藏成功";
							this.$emit("OnCollectChanged", true);
						}while(false);

						this.PlatformUserBehavior.collectHouse(this.isCollected);
						uni.showToast({
						    title: toastText,
						    icon: "none",
						    success: function() {
						        that.isClickCollectIng = false;
						    }
						});
					});
            }
        }
	}
</script>

<style scoped>
    .top_name_view{
        padding: 0 40upx;
        box-sizing: border-box;
        background-color: #FFFFFF;
    }
    .name_view{
        color:#101D36;
        font-size:48upx;
        width:100%;
        box-sizing:border-box;
        margin-top: 40upx;
    }
    .house_name{
		font-weight: bold;
        -webkit-box-flex:1;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:normal;
        font-weight:bold;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        -webkit-box-pack:center;
        box-sizing:border-box;
		font-size:48upx;
		color: #101D36;
		padding-right: 20upx;
    }
    .collect_view{
        flex-shrink: 0;
        position:relative;
        font-size:28upx;
        color:#101D36;
        text-align:center;
    }
    .collect_img{
        margin:2px auto 10upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png)  no-repeat;
		background-size: 219px 37px;
		background-position: -84px 0;
		height: 20px;
		width: 21px;
    }
	.collect_img_active{
		background-position:-62px 0;
	}
    .collect_text{
        color:#101D36;
        font-size:22upx;
		line-height: 33upx;
        text-align:center;
    }

	 /* 售价+户型+面积 */
    .price_view{
        background:#ffffff;
        color:#89909d;
        box-sizing: border-box;
        width: calc(100% + 80upx);
		margin-left: -40upx;
        margin-top: 55upx;
		text-align: left;
    }
	.price_view_item{
		padding-left: 40upx;
		box-sizing: border-box;
		width: 100%;
		text-align: left;
		position: relative;
		height: 70upx;
		padding-right: 10upx;
		font-family: PingFang-SC-Heavy;
	}
	.price_view_item::after{
		content: "";
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 2upx;
		background: #EEEEEE;
	}
	.price_view>.price_view_item:last-child::after{
		content: "";
		width: 0;
		display: none;
	}
    .totalPrice{
        font-size: 40upx;
		line-height: 44upx;
		font-weight: bold;
        white-space: nowrap;
    }
	.totalPrice_text{
		font-size: 24upx;
		color: #89909D;
	}
     /* #ifdef  MP-ALIPAY */
    .totalPrice_text{
        margin-top: 8upx;
    }
    /* #endif */


    .total_unit{
        color:#fd5438;
        margin-left:4upx;
        font-size: 26upx;
        line-height: 1;
        position: relative;
        top: -6upx;
    }
    .unit_price{
        color:#444444;
        font-size:26upx;
        margin-right:20upx;
        margin-left: 40upx;
    }

    .ping_gu{
		flex-shrink: 0;
		position:relative;
		font-size:28upx;
		color:#101D36;
		text-align:center;
		margin-right: 30upx;
    }
    .ping_gu_img{
       margin:4px auto 8upx;
	   background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png)  no-repeat;
	   background-size:242px 40px;
	   height:19px;
	   width:20px;
	   background-position:-49px 0;
    }
    .ping_gu_text{
       color:#101D36;
       font-size:22upx;
       line-height: 33upx;
       text-align:center;
    }

    .house_info{
        background:#ffffff;
        color:#333333;
        font-size:36upx;
        font-weight:bold;
        margin: 20upx 0;
    }
    .house_info view{
        margin-right: 44upx;
    }

    .tags_view{
        background:#ffffff;
        color:#7991a6;
        font-size:22upx;
		flex-wrap: wrap;
		margin-top: 15upx;
    }
    .tags_view view{
			height: 30upx;
			white-space: nowrap;
			font-size:22upx;
			display:flex;
			flex-direction: row;
			justify-content: center;
			color:#7991a6;
			background: #edf0f3;
			padding:0 10upx;
			border-radius:2upx;
			will-change: transform;
			margin-right: 8upx;
			box-sizing: border-box;
			 margin-bottom: 10upx;
			align-items: center;
    }
    /* #ifdef MP-ALIPAY */
    .tags_view view{
        padding:6upx 10upx 4upx!important;
		}
		/* #endif */

	/* 单价+楼层+装修+朝向+年代+类型+小区 */
    .house_other{
        width:100%;
        box-sizing:border-box;
        background:#fff;
        flex-wrap: wrap;
        box-sizing: border-box;
        margin-top: 30upx;
        font-size: 30upx;
		color: #121c34;
    }
    .house_other_item{
        width:50%;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
		text-align: left;
		line-height: 66upx;
    }
    .house_other_title{
        color: #8E94A1;
        font-size: 32upx;
        margin-right: 17upx;
		flex-shrink: 0;
    }

    button.true_house{
			margin-top: 40upx;
			height:60upx;
			background:#f7f7f7;
			font-size:24upx;
			line-height: 60upx;
			border-radius: 6upx;
			overflow: hidden;
			align-items: center;
    }
	.true_house_icon_view{
		width: 121upx;
		height: 60upx;
		flex-shrink: 0;
		border-radius: 20upx 2upx 20upx 2upx;
	}
    .true_house_icon{
		flex-shrink: 0;
		margin: auto;
		background:url('http://cdn.haofang.net/static/wxPlusApp/yjk/detail_house_icon.png')  no-repeat;
		background-size: contain;
		height: 60upx;
		width: 121upx;
    }
    .true_hous_cont{
		width: 100%;
		padding-left: 13upx;
		box-sizing: border-box;
		font-size: 24upx;
		color: #101D36;
		line-height: 60upx;
	}
    .true_hous_cont_text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 40upx;
        margin: auto 0;
    }
    /* #ifdef MP-ALIPAY */
    .true_hous_cont_text{
        /* position: relative; */
        /* top: 4upx; */
    }
    /* #endif */
	.true_hous_arrow{
        margin: auto 20upx auto 10upx;
        flex-shrink: 0;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png)  no-repeat;
		background-size:242px 40px;
		height:10px;width:5px;
		background-position:0 0;
    }

	/* 核验码 */
	.check_code_view{
		position: relative;
		color: #999;
		padding-left: 30upx;
		font-size: 24upx;
		line-height: 24upx;
		margin-top: 10upx;
	}
	.check_code_view::before{
		content: '';
		position: absolute;
		width: 22upx;
		height: 24upx;
		left: 0;
		top: 50%;
		margin-top: -12upx;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFEODRGODcyODhEQzExRThBNzlDOTBBODJGODVENzlCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFEODRGODczODhEQzExRThBNzlDOTBBODJGODVENzlCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUQ4NEY4NzA4OERDMTFFOEE3OUM5MEE4MkY4NUQ3OUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUQ4NEY4NzE4OERDMTFFOEE3OUM5MEE4MkY4NUQ3OUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Ik1TtAAACKklEQVR42qzVS0hUURzH8ekqhWVmUYsWIghBbTOxogekkKvMAhdSUGkEUuBQtLJNtuhF+CBkCtyFIG1cmRD0UJKiIkl89NCNplZSZok1UH7/8Bs5HO5MDzvwYYb7+N1zzv2fc9NjsVjEayuwHbtRiI1Yi1/4iFd4jh48wZh7c7p+16NMdmGp95DPSEOOFDnnBtGBO3hoga0oR6ALvqAdXXiEAczq3HJsQL56X6QRmCgmLHAP4mhR0D38iIQ3C+6VFh3LQzGuIMN6lY1JVKMzRViyNowbmt+sQPMVjyy+fcOSwBnKv7S92OIeCBbRoxN6u9H/EXgczehHjVO/8UAvIfMvwioRUzlZhXxwanrWAqe9wMu4rZrz2zHcVDFb2Hv/gkCFnOUc+4qDmh/3+FGFDSls0suya2cSPVzm9Og8LmgJ3sUaHFHYa4VNeGF27yobvo37LTZrOXXpgnPq6UU80/p9o7DxkKnYYTWIPuvhAx3c5110CSeRq4da2LskL2q/fjstsA3fUaVl6Lbr2IatKcLW4bB2pPZAr71ZYU0hNzzGpxRldE1V0mjTlCjsWs3RIf3/03ZK94xoihZWii3sA5hCnU6m/SbsDBq0D5Qn9gN36b1EiUriLO5rM/WbfQ5uaf+zjpTiabK1bCcK0K1S6MNVrFad1WqVVGgd71StptwcRvWBimoYp/UhGtd0rFTvrG5fhC29sPYT9RpyvYLnVA2bNCVzYTfOCzAA4T2EuxNcb7cAAAAASUVORK5CYII=) center no-repeat;
		background-size: 100% 100%;
	}
</style>
