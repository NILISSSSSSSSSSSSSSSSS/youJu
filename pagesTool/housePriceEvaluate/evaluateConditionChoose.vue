<template>
	<view class="condition_view">
		<!-- 小区 -->
		<view @click="chooseBuild" class="f_r_b condition_item">
			<view class="condition_title">小区</view>

			<view class="f_r_e">
				<view :class="{ condition_no_val : !item.buildName }"
					class="condition_val">{{ item.buildName || '请选择' }}</view>

				<image class="right_arrow" mode="aspectFill" :src="rightArrow"></image>
			</view>
		</view>

		<!-- 用途 -->
		<view class="f_r_b condition_item">
			<view class="condition_title">用途</view>

			<radio-group class="f_r_e" @change="houseTypeRadioChange">
				<label class="house_type_label" v-for="(info,index) in typeArr" :key="index">
					<radio class="house_type_radio"
						:value="info.value"
						:checked="item.type == info.value" />
					<view v-show="item.type == info.value" class="f_r_s house_type_radio_view">
						<view class="radio_active"></view>
						<view class="radio_text">{{ info.text }}</view>
					</view>

					<view v-show="item.type != info.value" class="f_r_s house_type_radio_view">
						<view class="radio_no_active"></view>
						<view class="radio_text">{{ info.text }}</view>
					</view>
				</label>
			</radio-group>
		</view>

		<!-- 面积 -->
		<view class="f_r_b condition_item">
			<view style="flex-shrink: 0;" class="condition_title">面积</view>

			<view style="width: 100%;" class="f_r_e area_input">
				<input type="number"
					class="input_condition"
					placeholder="请输入"
                    maxlength="5"
					:value="item.area || ''"
					@input="areaInput"
					placeholder-class="input_placeholder_area" />

				<view style="flex-shrink: 0;" class="condition_val">㎡</view>
			</view>
		</view>

		<!-- 户型 -->
		<view @click="chooseCondition('room')" class="f_r_b condition_item">
			<view class="condition_title">户型</view>

			<view class="f_r_e">
				<view :class="{ condition_no_val : !item.roomText }"
					class="condition_val">{{ item.roomText || "请选择" }}</view>

				<image class="right_arrow" mode="aspectFill" :src="rightArrow"></image>
			</view>
		</view>

		<!-- 朝向 -->
		<view @click="chooseCondition('chaoXiang')" class="f_r_b condition_item">
			<view class="condition_title">朝向</view>

			<view class="f_r_e">
				<view :class="{ condition_no_val : !item.chaoXiangText }"
					class="condition_val">{{ item.chaoXiangText || "请选择" }}</view>

				<image class="right_arrow" mode="aspectFill" :src="rightArrow"></image>
			</view>
		</view>

		<!-- 楼层 -->
		<view @click="chooseCondition('louCeng')" class="f_r_b condition_item">
			<view class="condition_title">楼层</view>

			<view class="f_r_e">
				<view :class="{ condition_no_val : !item.louCengText }"
					class="condition_val">{{ item.louCengText || "请选择" }}</view>

				<image class="right_arrow" mode="aspectFill" :src="rightArrow"></image>
			</view>
		</view>

		<!-- 提交 -->
		<view class="submit_btn_view">
			<view @click="submitEvent" class="submit_btn global-confirm-btn">提交</view>
		</view>

		<!-- picker弹窗 -->
		<view v-if="toastViewShow && toastMap[clickToastType]" @click="cancelToast" class="calculatorToast">
			<view class="calculator_toast_view">
				<view class="calculator_toast_title">
				  <view @click="cancelToast">取消</view>
				  <view @click="confirmToast" class="calculator_toast_confirm global-font-color">确定</view>
				</view>

				<picker-view indicator-class="calculator_toast_picker_item"
							 class="calculator_picker"
							 indicator-style="height: 50px;"
							 :value="clickToastType != 'louCeng' ? [toastMap[clickToastType].currentIndex] : [toastMap[clickToastType].currentIndex,toastMap[clickToastType].allCurrentIndex]"
							 @change="toastPickerChange">
				  <picker-view-column v-if="clickToastType != 'louCeng'">
						<view v-for="(info,index) in toastMap[clickToastType].list" :key="index"
							  @click.stop="confirmToast"
							class="calculator_toast_item">{{info.text}}</view>
				  </picker-view-column>

				  <block v-else>
						<picker-view-column>
							<view v-for="(info,index) in toastMap[clickToastType].currentList"
								  :key="index"
								  @click.stop="confirmToast"
								class="calculator_toast_item">{{info.text}}</view>
						</picker-view-column>

						<picker-view-column>
							<view v-for="(info,index) in toastMap[clickToastType].allList"
								  :key="index"
								  @click.stop="confirmToast"
								class="calculator_toast_item">{{info.text}}</view>
						</picker-view-column>
				  </block>
				</picker-view>
			</view>
		</view>

		<!-- 搜索 -->
		<form v-if="showSearchBuildList" report-submit @submit="formSubmit">
			<view class="search_condition_view">
				<!-- 搜索 -->
				<view class="sarch_box">
					<view class="search_view f_r_b">
						<view class="f_r_s input_view">
							<image class="input_icon" src="http://uu.haofang.net/Public/images/wap/search-icon.png"></image>
							<view class="inout_box f_c_c">
								<input class="input"
									placeholder-class="input_placeholder"
									confirm-type="search"
									adjust-position="false"
									:value="inputValue"
									@input="searchInput"
									placeholder="请输入小区名称" />
							</view>
						</view>

						<view @click="clearInput" v-if="inputValue" class="clear_btn"></view>
					</view>
				</view>

				<!-- 搜索定位后的空站位 -->
				<view class="empty_search_box"></view>

				<!-- 列表 -->
				<view v-if="houseList && houseList.length > 0" class="house_list">
					<block v-for="(item, index) in houseList" :key="index">
						<view @click="listBtn(item)" class="house_item f_r_b">
							<view class="house_name">{{ item.houseName }}</view>

							<view class="house_addr">{{ item.houseAddress }}</view>
						</view>
					</block>
				</view>

				<view v-if="houseList && houseList.length == 0" class="no_search_list">抱歉没有找到合适的房源</view>

				<!-- ios底部设置padding和margin撑篙无效 -->
				<view style="height: 60upx;"></view>
			</view>
		</form>
	</view>
</template>

<script>
	import { GetBuildByKeyWord } from "../../net/GetBuildByKeyWord.js";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";

	class ConditionItem {
		buildName = "";  // 小区名称
		buildId = "";  // 小区id
		type = "";  // 用途  1: 住宅, 2: 别墅
		area = "";  // 面积
		roomText = "";  // 户型  例如： 1 室
		roomVal = ""; // 户型  例如： 1 代表 1 室
		chaoXiangText = "";  // 朝向 例如：东
		chaoXiangVal = "";  // 朝向 例如：1
		louCengText = ""; // 楼层 例如：1层 共三层
		currentLouCengVal = "";  // 楼层 例如：1 代表 1 层
		aLLLouCengVal = "";  // 楼层 例如：3 代表 3 层
	}

	let privateMap = {
		louCengAgoLeftIndex: 0,
		louCengAgoRightIndex: 0
	};

	class SearchInput {
	    static timeOut = null;
	    static time = 500;
	    static cityId = "1";
	    static caseType = "1";

	    // 默认二手房，成都市
	    static init(keyWord = "", noKeyWord = true) {
	        return new Promise((resolve, reject) => {
	            let item = {caseType: this.caseType, cityId: this.cityId, pageNum:1, pageSize:10};
                if(noKeyWord) {
                    item["keyWord"] = keyWord;
                }
	            clearTimeout(this.timeOut);
	            this.timeOut = null;

	            if(!item.caseType) {
	                throw new Error("请配置caseType");
	            }

	            if(!item.keyWord && noKeyWord) {
	                resolve([]);
	                return;
	            }

	            this.timeOut = setTimeout(() => {
	               if(!this.timeOut) return;

	               new GetBuildByKeyWord(item).send()
	                    .then(res => {
	                        resolve((res && res.DATA ? res.DATA.list || [] : []));
	                    })
	                    .catch(err => {
	                        uni.showModal({
	                            title: "请求失败",
	                            content: "搜索失败啦！请稍后重试。",
	                            showCancel: false
	                        });
	                    });
	            }, this.time);
	        });
	    }
	}

	class ListItem {
	    houseName = "";
	    houseAddress = "";
	    houseId = "";
	}

	export default {
		data() {
			return {
				inputPlaceholderStyle: "",
				rightArrow: "http://cdn.haofang.net/static/uuminiapp/evaluate/right.jpg",
				item: new ConditionItem(),
				typeArr: [
					{text:'住宅',value:'1'},
					{text:'别墅',value:'2' }
				],
				toastViewShow: false,
				clickToastType: "",
				toastMap: {
					room: {
						list: [
							{text: '1室',value: '1'},
							{text: '2室',value: '2'},
							{text: '3室',value: '3'},
							{text: '4室',value: '4'},
							{text: '5室',value: '5'}
						],
						currentIndex: 0
					},
					chaoXiang: {
						list: [
							{value: 1,text: '东'},
							{value: 2,text: '南'},
							{value: 3,text: '西'},
							{value: 4,text: '北'},
							{value: 5,text: '东南'},
							{value: 6,text: '东北'},
							{value: 7,text: '西南'},
							{value: 8,text: '西北'}
						],
						currentIndex: 0
					},
					louCeng: {
						currentList: [],
						allList: [],
						currentIndex: 0,
						allCurrentIndex: 0
					}
				},

				inputValue: "",
				houseList: null,
				showSearchBuildList: false,
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad(params = {}) {
			new this.InitFormSubmit(this);
			this.initLoucengList();
			this.initParams(params);

			if(!this.item.buildId && !this.item.buildName) {
				this.showSearchBuildList = true;
			}
            this.searchInput({detail: {value: ""}}, false);
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		methods: {
			areaInput(e) {
				this.item.area = e.detail.value;
			},

			initParams(params = {}) {
				for(let key in params) {
					if(params[key] && this.item[key] != undefined) {
						this.item[key] = params[key];
					}
				}
				if(this.item.roomVal) {
					this.item.roomText = this.item.roomVal + "室";
					this.toastMap.room.currentIndex = (Number(this.item.roomVal) - 1);
				}
				if(this.item.chaoXiangText) {
					let haveChaoXiang = false;
					for(let chaoXiangInfo of this.toastMap.chaoXiang.list) {
						if(chaoXiangInfo.text == this.item.chaoXiangText) {
							this.item.chaoXiangVal = chaoXiangInfo.value;
							this.toastMap.room.currentIndex = (Number(chaoXiangInfo.value) - 1);
							haveChaoXiang = true;
							break;
						}
					}
					if(!haveChaoXiang) {
						this.item.chaoXiangText = "";
					}
				}
				if(this.item.currentLouCengVal && this.item.aLLLouCengVal) {
					this.item.louCengText = this.item.currentLouCengVal + "层 共" + this.item.aLLLouCengVal + "层";
					this.toastMap.louCeng.currentIndex = Number(this.item.currentLouCengVal) - 1;
					this.toastMap.louCeng.allCurrentIndex = Number(this.item.aLLLouCengVal) - 1;
				}
			},

			initLoucengList() {
				let currentList = [];
				let allList = [];
				for (let i = 1;i < 51;i++) {
					currentList.push({
						value: i,
						text: i + "层"
					});
					allList.push({
						value: i,
						text: "共" + i + "层"
					});
				};
				this.toastMap.louCeng.currentList = currentList;
				this.toastMap.louCeng.allList = allList;
			},

			chooseBuild() {
				this.showSearchBuildList = true;
			},

			// 房屋用途radio
			houseTypeRadioChange(e) {
				this.item.type = e && e.detail ? e.detail.value : "";
			},

			cancelToast() {
				this.toastViewShow = false;
			},

			confirmToast() {
				this.cancelToast();
				if(!this.clickToastType || !this.toastMap[this.clickToastType]) return;

				if(this.clickToastType != 'louCeng') {
					let text = this.clickToastType + "Text";
					let val = this.clickToastType + "Val";
					let index = this.toastMap[this.clickToastType].currentIndex;
					this.item[val] =
						this.toastMap[this.clickToastType].list[index].value;
					this.item[text] =
						this.toastMap[this.clickToastType].list[index].text;
					return;
				}

				let leftIndex = this.toastMap[this.clickToastType].currentIndex;
				let rightIndex = this.toastMap[this.clickToastType].allCurrentIndex;
				let currentList = this.toastMap[this.clickToastType].currentList;
				let allList = this.toastMap[this.clickToastType].allList;
				this.item.louCengText = currentList[leftIndex].text + "  " + allList[rightIndex].text;
				this.item.currentLouCengVal = currentList[leftIndex].value;
				this.item.aLLLouCengVal = currentList[rightIndex].value;
			},

			// 点击选择
			chooseCondition(type) {
				this.clickToastType = type;
				this.toastViewShow = true;
			},

			// picker 选择
			toastPickerChange(e) {
				if(this.clickToastType != 'louCeng') {
					this.toastMap[this.clickToastType].currentIndex = e && e.detail && e.detail.value ? e.detail.value[0] : 0;
					return;
				}

				let currentIndex = e.detail.value[0];
				let allCurrentIndex = e.detail.value[1];
				if(currentIndex > allCurrentIndex) {
					this.toastMap[this.clickToastType].currentIndex = currentIndex;
					this.toastMap[this.clickToastType].allCurrentIndex = currentIndex;
				}else{
					this.toastMap[this.clickToastType].currentIndex = currentIndex;
					this.toastMap[this.clickToastType].allCurrentIndex = allCurrentIndex;
				}
			},

			submitEvent() {
				let keyArr = [
					{
						key: "buildName",
						errMsg: "请选择小区"
					},
					{
						key: "buildId",
						errMsg: "请选择小区"
					},
					{
						key: "type",
						errMsg: "请选择用途"
					},
					{
						key: "area",
						errMsg: "请输入面积"
					},
					{
						key: "roomVal",
						errMsg: "请选择户型"
					},
					{
						key: "chaoXiangVal",
						errMsg: "请选择朝向"
					},
					{
						key: "currentLouCengVal",
						errMsg: "请选择楼层"
					},
					{
						key: "aLLLouCengVal",
						errMsg: "请选择楼层"
					}
				];
				for(let i = 0;i<keyArr.length;i++) {
					let info = keyArr[i] || {};
					if(this.item[info.key] != undefined && !this.item[info.key]) {
						uni.showToast({
							icon:"none",
							title: info.errMsg
						});
						return;
					}
				}

				if(Number(this.item.aLLLouCengVal) < Number(this.item.currentLouCengVal)) {
					uni.showToast({
						icon:"none",
						title: "当前楼层不能高于总楼层"
					});
					return;
				}

				uni.navigateTo({
					url: "./priceTrend?buildName=" + this.item.buildName + "&buildId=" + this.item.buildId
						+ "&area=" + this.item.area + "&room=" + this.item.roomVal + "&currentFloor="
						+ this.item.currentLouCengVal + "&allFloor=" + this.item.aLLLouCengVal
				});
			},

			searchInput(e, noKeyWord = true) {
			    let value = e.detail.value;
			    this.inputValue = value;
				let item = new GpsInfoModel().getModel("cityInfo");
			    SearchInput.cityId = item.cityId || "1";
			    SearchInput.caseType = 1;
				if(!value && noKeyWord) {
					this.houseList = null;
					return;
				}

			    SearchInput.init(value, noKeyWord)
			        .then(res => {
			            let houseList = [];
			            for(let i = 0;i<res.length;i++) {
			                let item = new ListItem();
			                let dataItem = res[i] || {};
			                if(!dataItem.buildId) continue;

			                item.houseName = dataItem.buildName || "暂无姓名";
			                item.houseAddress = dataItem.regName || "暂无区域";
			                item.houseId = dataItem.buildId || "";
			                houseList.push(item);
			            }
			            this.houseList = houseList;
			        });
			},

			clearInput() {
				this.item.buildId = "";
				this.item.buildName = "";
				this.searchInput({detail: {value: ""}});
			},

			listBtn(item) {
				this.item.buildId = item.houseId;
				this.item.buildName = item.houseName;
				this.showSearchBuildList = false;
			}
		},
	}
</script>

<style>
	.condition_view{
		padding: 0 0 0 40upx;
		box-sizing: border-box;
		background: #FFFFFF;
	}
	.condition_item{
		line-height: 120upx;
		border-bottom: 1upx solid #F5F5F5;
		box-sizing: border-box;
		padding-right: 40upx;
	}
	.condition_title{
		font-size: 32upx;
		color: #101D36;
		font-weight: bold;
	}
	.condition_item .condition_no_val{
		font-size: 28upx;
		color: #c6cacf;
	}
	.condition_val{
		font-size: 32upx;
		color: #101D36;
	}
	.right_arrow{
		width: 14upx;
		height: 26upx;
		margin: auto 0 auto 22upx;
		flex-shrink: 0;
	}

	.house_type_radio{
		position: absolute;
		left: -9999px;
	}
	.house_type_label{
		display: flex;
		font-weight: normal;
	}
	.house_type_radio_view{
		margin-left: 35upx;
	}
	.radio_active{
		position: relative;
		height: 32upx;
		width: 32upx;
		box-sizing: border-box;
		border-radius: 100%;
		border: 2upx solid #ffd900;
		margin: auto 10upx auto 0;
	}
	.radio_no_active{
		position: relative;
		height: 32upx;
		width: 32upx;
		box-sizing: border-box;
		border-radius: 100%;
		border: 2upx solid #bec1c9;
		margin: auto 10upx auto 0;
	}
	.radio_active::after{
		content: "";
		height: 12upx;
		width: 12upx;
		box-sizing: border-box;
		border-radius: 100%;
		background-color: #ffd900;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	.radio_text{
		font-size: 32upx;
		color: #101D36;
        line-height: 120upx;
	}

    .input_condition::-webkit-input-placeholder {
        line-height: 40upx;
    }
    .input_condition:-moz-placeholder {
        line-height: 40upx;
    }
    .input_condition:-ms-input-placeholder {
        line-height: 40upx;
    }
    .input_condition:input-placeholder{
        line-height: 40upx;
    }
	.input_condition{
		line-height: 40upx;
		height: 40upx;
        margin: auto 0;
		padding-right: 12upx;
		box-sizing: border-box;
		text-align: right;
		font-size: 32upx;
		color: #101D36;
        width: 80%;
	}

	.submit_btn_view{
		width: 100%;
		padding-right: 40upx;
		box-sizing: border-box;
		height: 90upx;
		line-height: 90upx;
		margin-top: 50upx;
	}
	.submit_btn{
		width: 100%;
		text-align: center;
		line-height: 90upx;
		height: 90upx;
		background: -webkit-linear-gradient(left, #fe8e0d , #ff6f2e);
		color: #FFFFFF;
		border-radius: 10upx;
		box-sizing: border-box;
	}

	/*弹窗*/
	.calculatorToast{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
		font-family: '微软雅黑';
		z-index: 99999;
	}
	.calculator_toast_view{
		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 0;
		left: 0;
		top: 50%;
		background-color: #FFFFFF;
		z-index: 999999;
		right: 0;
	}
	.calculator_toast_title{
		height: 100upx;
		line-height: 100upx;
		background: #fff;
		font-size:32upx;
		border-bottom: 1upx solid #e5e5e5;
		box-sizing: border-box;
		flex-shrink: 0;
		padding: 0 40upx;
		display: flex;
		color: #101d36;
		flex-direction: row;
		justify-content: space-between;
	}
	.calculator_toast_title .calculator_toast_confirm{
		color: #ab7f2e;
	}
	.calculator_picker{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 32upx;
		background: #fff;
		border-color: #ab7f2e;
	}
	.calculator_toast_picker_item{
		color: #ab7f2e;
		height: 50px;
		line-height: 50px;
	}
	.uni-picker-view-indicator{
		height: 50px!important;
	}
	.calculator_toast_item{
		color: #101d36;
		font-size: 32upx;
		text-align: center;
		height: 50px;
		line-height: 50px;
	}

	.search_condition_view{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		overflow-y: auto;
		z-index: 999;
	}
	/* #ifdef H5 */
	.search_condition_view{
		top: 88upx;
	}
	/* #endif */

	/* 搜索顶部 */
	.sarch_box{
	    background:#fff;
	    padding:26upx 40upx 26upx;
	    position: fixed;
	    box-sizing: border-box;
	    top: 0;
	    z-index: 9999;
	    left: 0;
	    width: 100%;
	}
    /* #ifdef MP-ALIPAY */
    .sarch_box .input{
        padding: 0;
        margin: 0;
    }
    /* #endif */
	/* #ifdef H5 */
	.sarch_box{
	    top: 44px;
	}
	/* #endif */

    .input_placeholder_area{
        color: #c4cbce;
        line-height: 120upx;
        height: 120upx;
    }
	.input_placeholder{
		color: #c4cbce;
		line-height: 82upx;
		height: 82upx;
        margin: auto 0;
	}
    /* #ifdef MP-ALIPAY */
    .input_placeholder{
        padding-left: 0;
        margin-left: 0;
    }
    /* #endif */
	.empty_search_box{
	    height: 134upx;
	}
	.search_view{
	    width: 100%;
	    height: 82upx;
	    line-height: 82upx;
	    background-color:#F8F8F9;
	    border-radius: 41upx;
		overflow: hidden;
	    position:relative;
	    box-sizing: border-box;
	    color:#666666;
	}
	.input_view{
	    width: 100%;
	}
	.input_icon{
	    height: 30upx;
	    width: 30upx;
	    box-sizing: border-box;
	    margin: auto 20upx auto 30upx;
	    flex-shrink: 0;
	}
	.inout_box{
	    width:100%;
	    height:40upx;
	    line-height: 40upx;
		margin: auto 0;
	    box-sizing:border-box;
	    font-size:28upx;
	    color:#666666;
	    border:0;
	    outline:none;
	    background-color:#F8F8F9;
	}
	.input{
	    width:100%;
	    height:40upx;
        margin: auto 0;
	    line-height: 40upx;
	    box-sizing:border-box;
	    font-size:28upx;
	    color:#666666;
	    border:0;
	    outline:none;
	    background-color:#F8F8F9;
	}
	.input:focus{
		background: #F8F8F9;
	}
	.input input{
	    width:100%;
        margin: auto 0;
	    height: 40upx!important;
	    line-height: 40upx!important;
	    box-sizing:border-box;
	    font-size:28upx;
	    color:#666666;
	    border:0;
	    outline:none;
	    background-color:#F8F8F9;
	}
	.clear_btn{
	    width:82upx;
	    height: 82upx;
	    background: url(http://cdn.haofang.net/static/uuminiapp/search/clear.png) no-repeat center center;
	    background-size: 34upx 34upx;
	    flex-shrink: 0;
	}

	/* 列表 */
	.house_list{
	    padding: 0 40upx;
	    box-sizing: border-box;
	}
	.house_item{
		font-size:32upx;
		color:#101d36;
		border-bottom:1px solid #F5F5F5;
		height:112upx;
		line-height:112upx;
		position:relative;
		letter-spacing:1px;
		box-sizing:border-box;
		width: 100%;
	}
	.house_name{
	    text-align: left;
	    max-width: 75%;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
        font-weight: normal;
        font-size: 32upx;
        color: #101D36;
	}
	.house_addr{
	    text-align: right;
	    max-width: 25%;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	    color:#8e94a1;
	    flex-shrink: 0;
		font-weight: normal;
	}
	.clear_local{
	    width: 100%;
	    padding-right: 30upx;
	    box-sizing: border-box;
	    height:100upx;
	    line-height:100upx;
	    text-align:center;
	    margin:0 auto;
	    font-size:24upx;
	    color:#606060;
	}

	/* 暂无搜索结果 */
	.no_search_list{
		margin-top: 40upx;
		line-height:60upx;
		font-size:28upx;
		color:#999999;
		text-align:center;
		width: 100%;
	}
</style>
