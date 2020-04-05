<template>
	<view style="background: #FFFFFF;">
		<!-- 搜索 -->
		<view class="sarch_box">
			<!-- 来源 不是首页 -->
			<view class="search_view f_r_b" v-if="from != 'index'">
				<view class="f_r_s input_view">
					<image class="input_icon" src="http://uu.haofang.net/Public/images/wap/search-icon.png"></image>
					<view class="inout_box f_c_c">
						<input class="input"
							   placeholder-class="input_placeholder"
							   confirm-type="search"
							   adjust-position="false"
							   :value="inputValue"
							   focus
							   @input="searchInput"
							   @confirm="searchConfirm"
							   placeholder="请输入小区或商圈名称" />
					</view>
				</view>

				<view @click="clearInput" v-if="inputValue" class="clear_btn"></view>
			</view>

			<!-- 来源  首页(index) -->
			<view class="f_r_s sarch_box_index" v-if="from == 'index'">
				<button form-type="submit" hover-class="none" class="search_choose f_r_c" @click="searchTypeBtn">
					<view class="search_choose_text">{{ searchChooseText }}</view>
					<view class="search_choose_arrow"></view>
				</button>

				<view class="search_view f_r_b">
					<view class="f_r_s input_view">
						<image class="input_icon" src="http://uu.haofang.net/Public/images/wap/search-icon.png"></image>
						<view class="inout_box f_c_c">
							<input class="input"
								   placeholder-class="input_placeholder"
								   confirm-type="search"
								   adjust-position="false"
								   :value="inputValue"
								   focus
								   @input="searchInput"
								   @confirm="searchConfirm"
								   placeholder="请输入小区或商圈名称" />
						</view>
					</view>

					<view @click="clearInput" v-if="inputValue" class="clear_btn"></view>
				</view>
			</view>
		</view>

		<!-- 首页选择来源的弹窗 -->
		<view @click="searchTypeItemModel" class="search_type_tc" v-if="searchTypesTcShow">
			<view class="search_type_item_view">
				<view :class="{ 'search_type_item_active global-font-color' : item.text == searchChooseText }"
					  class="search_type_item f_r_c"
					  v-for="(item, index) in (searchChooseListMap[from] || [])"
					  :key="index"
					  @click.stop="searchTypeItemBtn(index)">
					{{ item.text }}
				</view>
			</view>
		</view>

		<!-- 搜索定位后的空站位 -->
		<view class="empty_search_box"></view>

		<!-- 列表 -->
		<view v-if="houseList && houseList.length > 0" class="house_list">
			<block v-for="(item, index) in houseList" :key="index">
				<button form-type="submit" hover-class="none" @click="listBtn(item)" class="house_item f_r_b">
					<view class="house_name">{{ item.houseName }}</view>

					<view class="house_addr">{{ item.houseAddress }}</view>
				</button>
			</block>
		</view>

		<!--抱歉没有找到合适的房源-->
		<view v-if="houseList && houseList.length == 0" class="no_search_list"></view>

		<!-- 历史记录 -->
		<view v-if="!houseList && localList && localList.length > 0" class="house_list">
			<block v-for="(item, index) in localList" :key="index">
				<button form-type="submit" hover-class="none" @click="listBtn(item)" class="house_item f_r_b">
					<view style="width: 100%;" class="f_r_s">
						<view class="house_name">{{ item.houseName }}</view>
					</view>

					<view class="house_addr">{{ item.houseAddress == "关键字" ? '关键字' :'小区' }}</view>
				</button>
			</block>

			<button form-type="submit" hover-class="none" @click="clearLocal" class="clear_local">删除历史记录</button>
		</view>

		<!-- 暂无历史记录 -->
		<view class="no_local_list" v-if="!houseList && localList && localList.length == 0"></view>

		<!-- ios底部设置padding和margin撑篙无效 -->
		<view style="height: 60upx;"></view>
	</view>
</template>

<script>
    import { GetBuildByKeyWord } from "../../net/GetBuildByKeyWord.js";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import { GpsInfoModel } from "../../model/GpsInfoModel.js";
    import { SearchListModel } from "../../model/SearchListModel.js";
	import { SearchHouseModel } from "../../model/SearchHouseModel.js"

    class SearchInput {
        static timeOut = null;
        static time = 500;
        static cityId = "1";
        static caseType = "1";

        // 默认二手房，成都市
        static init(keyWord = "") {
            return new Promise((resolve, reject) => {
                let item = {caseType: this.caseType, cityId: this.cityId, keyWord: keyWord, pageNum:1, pageSize:10}
                clearTimeout(this.timeOut);
                this.timeOut = null;

                if(!item.caseType) {
                    throw new Error("请配置caseType");
                }

                if(!item.keyWord) {
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
				caseType: "1",

				inputValue: "",
                cityId: "1",
                houseList: null,
                localList: null,

				// 搜索类型弹窗
				searchTypesTcShow: false,

				// 来源  首页是index
				from: "index",

				// 存储缓存的四个房源的key
                keyMap: {
                    1: "erHouse",
					5: "apartment",
					4: "newHouse",
					2: "leaseHouse"
                },

				// 首页进入的搜索条件筛选
				searchChooseListMap: {
					"index": [
						{ text: "二手房", apiCaseType: "1",pageTo: "/pagesHouse/erHouseList/erHouseList"},
						{ text: "整租", apiCaseType: "2", pageTo: "/pagesHouse/leaseList/leaseList?caseType=2"},
						{ text: "合租", apiCaseType: "2", pageTo: "/pagesHouse/leaseList/leaseList?caseType=3"},
						{ text: "新房", apiCaseType: "4", pageTo: "/pagesHouse/newHouseList/newHouseList"},
						{ text: "公寓", apiCaseType: "5", pageTo: "/pagesHouse/apartmentList/apartmentList"}
					]
				},
				searchChooseText: "",
				searchChoosePageTo: ""
			};
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

        onLoad(parames) {
			this.from = parames.from || "index";
			this.upSearchChooseListMap();
			if(parames.caseType != undefined) {
				this.caseType = parames.caseType || "1";
			}
            this.upGpsInfo();
            this.initList();
        },

		onShow() {
            new this.SetMetaInfo().initDefault();
			// 监听gps变化
			new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
		},

        onHide() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
			upSearchChooseListMap() {
				if(this.from && this.searchChooseListMap[this.from]) {
					this.searchChooseText = this.searchChooseListMap[this.from][0].text;
					this.searchChoosePageTo = this.searchChooseListMap[this.from][0].pageTo;
				}
			},

            initList() {
                this.localList = new SearchListModel().getModel(this.keyMap[this.caseType]) || [];
            },

        	searchInput(e) {
                let value = e.detail.value;
                this.inputValue = value;
                SearchInput.cityId = this.cityId;
                SearchInput.caseType = this.caseType;
				if(!value) {
					this.houseList = null;
					return;
				}

                SearchInput.init(value)
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
				this.searchInput({detail: {value: ""}});
			},

			searchConfirm(e) {
				let val = e.detail ? e.detail.value || "" : "";
				if (!val) return;

				let item = new ListItem();
				item.houseName = val;
				item.houseAddress = "关键字";
				item.houseId = "";
				this.listBtn(item);
			},

             // 更新定位信息
            upGpsInfo() {
                if(!new GpsInfoModel().getModel("cityInfo")) return;

                let item = new GpsInfoModel().getModel("cityInfo");
                this.cityId = item.cityId || "1";
				if(this.inputValue) {
					this.searchInput({detail: {value: this.inputValue}});
				}
            },

            // gps change 回调
            GpsChanged(name, item) {
                this.upGpsInfo();
            },

            listBtn(item) {
                let list = new SearchListModel().getModel(this.keyMap[this.caseType]) || [];
				let haveHouse = false;
                for(let i = 0;i<list.length;i++) {
                    if(list[i].houseId === item.houseId && list[i].houseName === item.houseName) {
                        haveHouse = true;
                    }
                }
                if(!haveHouse) {
                    list.unshift(item);
                }
                if(list.length > 10) {
                    list = list.slice(0, 10);
                }
                new SearchListModel().setModel(list, this.keyMap[this.caseType]);
				new SearchHouseModel().setModel(item);
				do{
					if(this.searchChooseListMap[this.from] && this.searchChoosePageTo) {
						uni.navigateTo({
							url: this.searchChoosePageTo+"?pageFrom=" + this.from
						});
						break;
					}

					uni.navigateBack({
					    delta: 1
					});
				}while(false);
				new Notification().postNotification(Notify.SearchResChanged.Name, item);
            },

            // 清空记录
            clearLocal() {
                new SearchListModel().setModel([], this.keyMap[this.caseType]);
                this.initList();
            },

			// 搜索类型切换
			searchTypeItemBtn(index) {
				let item = this.searchChooseListMap[this.from]
						? this.searchChooseListMap[this.from][index] || {}
						: {};
				this.caseType = item.apiCaseType;
				this.searchChooseText = item.text;
				this.searchChoosePageTo = item.pageTo;
				this.searchTypeItemModel();
				this.initList();
				this.searchInput({detail: {value: this.inputValue}});
			},
			searchTypeBtn() {
				this.searchTypesTcShow = !this.searchTypesTcShow;
			},
			searchTypeItemModel() {
				this.searchTypesTcShow = false;
			}
        },
	}
</script>

<style>
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
    /* #ifdef H5 */
    .sarch_box{
        top: 44px;
    }
    /* #endif */

	.input_placeholder{
		color: #c4cbce;
		line-height: 82upx;
		height: 82upx;
	}
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

	/* 首页搜索 */
	.sarch_box_index .search_view{
		border-radius: 0 41upx 41upx 0;
	}
    swan-button.swan-button-radius-ios{
        border-radius: 41upx 0 0 41upx;
    }
	.search_choose{
		width: 170upx;
		flex-shrink: 0;
		height: 82upx;
		line-height: 82upx;
		position: relative;
		background: #F8F8F9;
		border-radius: 41upx 0 0 41upx;
	}
	.search_choose_text{
		height:82upx;
		line-height:82upx;
		font-size:28upx;
		color:#101d36;
		z-index:30;
		width:90upx;
		text-align:center;
		padding-right:15upx;
	}
	.search_choose_arrow{
		width:0;
		height: 0;
		border:8upx solid #101D36;
		border-color:#101D36 transparent transparent transparent;
		margin: auto 0;
	}
	.search_choose::after{
		content: "";
		position: absolute;
		left: 166upx;
		top: 50%;
		transform: translateY(-50%);
		background: #dadce1;
		height: 30upx;
		width: 2upx;
	}

	/* 搜索类型切换弹窗 */
	.search_type_tc{
		position:fixed;
		width:100%;
		height:100%;
		z-index:99999;
		top:0;
		left:0;
	}
	.search_type_item_view{
		background:#ffffff;
		border:1px solid #F5F5F5;
		border-radius:7upx;
		position:absolute;
		top:96upx;
		left:38upx;
	}
	/* #ifdef H5 */
	.search_type_item_view{
	    top: 184upx;
	}
	/* #endif */
	.search_type_item_view::after{
		content:'';
		position: absolute;
		width:20upx;
		height: 20upx;
		background: #ffffff;
		border-top:1px solid #e2e2e2;
		border-left:1px solid #e2e2e2;
		left:0;
		right:0;
		margin: auto;
		top:-11upx;
		transform: rotate(45deg);
	}
	.search_type_item{
		width:207upx;
		height:82upx;
		line-height:82upx;
		color:#101D36;
		font-size:28upx;
		letter-spacing:1px;
		text-align:center;
		border-bottom:1px solid #F5F5F5;
	}
	/* .search_type_item_view .search_type_item_active{
		color: #ab7f2e;
	} */

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
    }
    .house_item.swan-button-radius-ios{
        border-radius: 0;
    }
    .house_name{
        text-align: left;
        max-width: 75%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 32upx;
        font-weight: normal;
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

    /* 暂无记录 */
    .no_local_list{
        position:fixed;
        width:100%;
        height:220upx;
        background:url(http://cdn.haofang.net/static/uuminiapp/new_images/no_hostory.png?t=20180427) no-repeat center center;
        background-size:contain;
        top: 35%;
        left: 50%;
        transform: translate(-50%, 0);
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
