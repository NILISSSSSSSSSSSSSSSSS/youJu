<template>
	<form report-submit @submit="formSubmit">
		<view>
			<view class="screen_view">
				<!-- 二手房/租房用这个 -->
				<view class="screen_list f_r_b" v-if="enterType == 'erHouse'">
					<view hover-class="none" form-type="submit" @click="screenBtn('region')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.erHouse.region.show || screenFormData.erHouse.region.text != '区域' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.erHouse.region.text }}</view>
						<image :class="{screen_icon_active : screenFormData.erHouse.region.show}"
							class="screen_icon" :src="screenFormData.erHouse.region.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('price')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.erHouse.price.show || screenFormData.erHouse.price.text != priceApiDataMap[from].defaultText ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.erHouse.price.text }}</view>
						<image :class="{screen_icon_active: screenFormData.erHouse.price.show}"
							class="screen_icon" :src="screenFormData.erHouse.price.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('room')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.erHouse.room.show || screenFormData.erHouse.room.text != '户型' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.erHouse.room.text }}</view>
						<image :class="{screen_icon_active: screenFormData.erHouse.room.show}"
							class="screen_icon" :src="screenFormData.erHouse.room.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('more')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.erHouse.more.show || screenFormData.erHouse.more.text != '更多' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.erHouse.more.text }}</view>
						<image :class="{screen_icon_active: screenFormData.erHouse.more.show}"
							class="screen_icon" :src="screenFormData.erHouse.more.show ? topIcon : downIcon"></image>
					</view>
				</view>

				<!-- 新房用这个 -->
				<view class="screen_list f_r_b" v-if="enterType == 'newHouse'">
					<view hover-class="none" form-type="submit"
						@click="screenBtn('region')" class="screen_item f_r_c">
						<view :style="{color: screenFormData[enterType].region.show || screenFormData[enterType].region.text != '区域' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData[enterType].region.text }}</view>
						<image :class="{screen_icon_active : screenFormData.newHouse.region.show}"
							class="screen_icon" :src="screenFormData.newHouse.region.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('price')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.newHouse.price.show || screenFormData.newHouse.price.text != priceApiDataMap[from].defaultText ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.newHouse.price.text }}</view>
						<image :class="{screen_icon_active: screenFormData.newHouse.price.show}"
							class="screen_icon" :src="screenFormData.newHouse.price.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('type')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.newHouse.type.show || screenFormData.newHouse.type.text != '用途' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.newHouse.type.text }}</view>
						<image :class="{screen_icon_active: screenFormData.newHouse.type.show}"
							class="screen_icon" :src="screenFormData.newHouse.type.show ? topIcon : downIcon"></image>
					</view>
				</view>

				<!-- 公寓用这个 -->
				<view class="screen_list f_r_b" v-if="enterType == 'apartment'">
					<view hover-class="none" form-type="submit" @click="screenBtn('region')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.apartment.region.show || screenFormData.apartment.region.text != '区域' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.apartment.region.text }}</view>
						<image :class="{screen_icon_active : screenFormData.apartment.region.show}"
							class="screen_icon" :src="screenFormData.apartment.region.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('price')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.apartment.price.show || screenFormData.apartment.price.text != priceApiDataMap[from].defaultText ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.apartment.price.text }}</view>
						<image :class="{screen_icon_active: screenFormData.apartment.price.show}"
							class="screen_icon" :src="screenFormData.apartment.price.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('chuZuType')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.apartment.chuZuType.show || screenFormData.apartment.chuZuType.text != '出租方式' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.apartment.chuZuType.text }}</view>
						<image :class="{screen_icon_active: screenFormData.apartment.chuZuType.show}"
							class="screen_icon" :src="screenFormData.apartment.chuZuType.show ? topIcon : downIcon"></image>
					</view>

					<view hover-class="none" form-type="submit" @click="screenBtn('more')" class="screen_item f_r_c">
						<view :style="{color: screenFormData.apartment.more.show || screenFormData.apartment.more.text != '更多' ? '#ff5a1f' : '#494949'}"
							class="screent_text f_c_c">{{ screenFormData.apartment.more.text }}</view>
						<image :class="{screen_icon_active: screenFormData.apartment.more.show}"
							class="screen_icon" :src="screenFormData.apartment.more.show ? topIcon : downIcon"></image>
					</view>
				</view>

				<view @click="screenClose" :style="{height: fixedContHeight, top: fixedTcTop}"
					class="screen_fixed_list" v-if="listTcShow">
					<!-- 区域 -->
					<view :style="{height: contHeight}" @click.stop="screenContBtn"
						v-if="currentClickType == 'region'" class="region_list_view f_r_b">
						<scroll-view class="region_scroll_left" scroll-y>
							<block v-for="(item, index) in regionLeftList" :key="index">
								<view hover-class="none" form-type="submit" :class="{region_left_active: regionLeftIndex == index}"
									@click="regionLeftBtn(item, index)" class="region_list_item">{{ item.text }}</view>
							</block>
						</scroll-view>

						<scroll-view class="region_scroll_right" scroll-y>
							<block v-for="(item, index) in regionRightMap[screenFormData[enterType].region.leftId]" :key="index">
								<view hover-class="none" form-type="submit" :class="{screen_active: regionRightIndex == index}"
									@click="regionRightBtn(item, index)" class="region_list_item">{{ item.text }}</view>
							</block>
						</scroll-view>
					</view>

					<!-- 价格 -->
					<view :style="{height: contHeight}" @click.stop="screenContBtn"
						v-if="currentClickType == 'price' && enterType != 'newHouse'" class="region_list_view f_r_b">
						<scroll-view class="scroll_view_list price_scroll_list" scroll-y>
							<block v-for="(item, index) in erHousePriceList" :key="index">
								<view hover-class="none" form-type="submit" :class="{screen_active: erHousePriceIndex == index}"
									@click="priceBtn(item, index)" class="region_list_item">{{ item.text }}</view>
							</block>
						</scroll-view>

						<view class="price_bottom_view f_r_b">
							<view class="f_r_s">
								<input :value="minPriceVal" @blur="minPriceBlur" class="price_input_val" placeholder="最低价格" />
								<input :value="maxPriceVal" @blur="maxPriceBlur" class="price_input_val" placeholder="最高价格" />
							</view>

							<view hover-class="none" form-type="submit" @click="confirmPrice" class="price_bottom_confirm">确定</view>
						</view>
					</view>

					<!-- 户型 -->
					<view :style="{height: contHeight}" @click.stop="screenContBtn"
						v-if="currentClickType == 'room'" class="region_list_view f_r_b">
						<scroll-view class="scroll_view_list" scroll-y>
							<view class="region_new_title">户型选择</view>
							<view class="region_new_cont f_r_s">
								<block v-for="(item, index) in roomList" :key="index">
									<view hover-class="none" form-type="submit" :class="{screen_active: roomListIndex == index}"
										v-if="item.id"
										@click="roomBtn(item, index)" class="region_new_list_item">{{ item.text }}</view>
								</block>
							</view>
						</scroll-view>

						<view class="room_new_btn_view">
							<view hover-class="none" form-type="submit" @click='roomBtn({text:"不限", id: ""}, 0)'>不限条件</view>
							<view hover-class="none" form-type="submit" @click='roomBtn(roomItem, 0)' class="room_new_btn_confirm">确认</view>
						</view>
					</view>

					<!-- 更多 -->
					<view :style="{height: contHeight}" @click.stop="screenContBtn"
						v-if="currentClickType == 'more'" class="region_list_view f_r_b">
						<scroll-view class="scroll_view_list" scroll-y>
							<view class="more_list_cont" v-if="enterType == 'apartment'">
								<!-- 入住时间 -->
								<view class="more_list">
									<view class="more_title">入住时间</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in aparmentMoreMap['ruZhuTime'].list" :key="index">
											<view hover-class="none" form-type="submit"
												:class="{ more_item_active: index == aparmentMoreMap['ruZhuTime'].index }"
												@click="aparmentMoreBtn(item, index, 'ruZhuTime')"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 户型 -->
								<view class="more_list">
									<view class="more_title">户型</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in aparmentMoreMap['room'].list" :key="index">
											<view hover-class="none" form-type="submit"
												:class="{ more_item_active: index == aparmentMoreMap['room'].index }"
												@click="aparmentMoreBtn(item, index, 'room')"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 面积 -->
								<view class="more_list">
									<view class="more_title">面积</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in aparmentMoreMap['area'].list" :key="index">
											<view hover-class="none" form-type="submit"
												:class="{ more_item_active: index == aparmentMoreMap['area'].index }"
												@click="aparmentMoreBtn(item, index, 'area')"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 性别 -->
								<view class="more_list">
									<view class="more_title">性别</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in aparmentMoreMap['sex'].list" :key="index">
											<view hover-class="none" form-type="submit"
												:class="{ more_item_active: index == aparmentMoreMap['sex'].index }"
												@click="aparmentMoreBtn(item, index, 'sex')"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 特色 -->
								<view class="more_list">
									<view class="more_title">特色</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in aparmentMoreMap['specail'].list" :key="index">
											<view hover-class="none" form-type="submit"
												:class="{ more_item_active: index == aparmentMoreMap['specail'].index }"
												@click="aparmentMoreBtn(item, index, 'specail')"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>
							</view>

							<view class="more_list_cont" v-else>
								<!-- 来源 -->
								<view class="more_list">
									<view class="more_title">来源</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in sourceLsit" :key="index">
											<view hover-class="none" form-type="submit" :class="{ more_item_active: index == sourceLsitIndex }"
												@click="sourceBtn(item, index)"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 面积 -->
								<view class="more_list">
									<view class="more_title">面积</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in areaLsit" :key="index">
											<view hover-class="none" form-type="submit" :class="{ more_item_active: index == areaLsitIndex }"
												@click="areaBtn(item, index)"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 类型 -->
								<view class="more_list">
									<view class="more_title">类型</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in typeLsit" :key="index">
											<view hover-class="none" form-type="submit" :class="{ more_item_active: index == typeLsitIndex }"
												@click="typeBtn(item, index)"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>

								<!-- 特色 -->
								<view v-if="from == 'erHouse'" class="more_list">
									<view class="more_title">特色</view>

									<view class="more_cont f_r_s">
										<block v-for="(item, index) in specialList" :key="index">
											<view hover-class="none" form-type="submit" :class="{ more_item_active: index == specialListIndex }"
												@click="specialBtn(item, index)"
												class="more_item">{{ item.text }}</view>
										</block>
									</view>
								</view>
							</view>
						</scroll-view>

						<view class="f_r_b more_btn_view">
							<view hover-class="none" form-type="submit" @click="resetBtn" class="resetBtn">重置</view>
							<view hover-class="none" form-type="submit" @click="confirmBtn" class="confirmBtn">确定</view>
						</view>
					</view>

					<!-- 新房的用途 -->
					<view :style="{height: '55%'}" @click.stop="screenContBtn"
						v-if="currentClickType == 'type' && enterType == 'newHouse'"
						class="region_list_view f_r_b">
						<scroll-view class="scroll_view_list price_scroll_list"
							scroll-y
							style="padding-bottom: 0;">
							<block v-for="(item, index) in newHouseTypeList" :key="index">
								<view hover-class="none" form-type="submit" :class="{screen_active: newHouseTypeListIndex == index}"
									@click="newHouseTypeBtn(item, index)" class="region_list_item">{{ item.text }}</view>
							</block>
						</scroll-view>
					</view>

					<!-- 新房的价格 -->
					<view :style="{height: contHeight}" @click.stop="screenContBtn"
						v-if="currentClickType == 'price' && enterType == 'newHouse'"
						class="region_list_view f_r_b">
						<view class="new_house_price_change_view">
							<view @click="newHousePriceTab(0)" :class="{ new_price_tab_active : newHousePriceTabIndex == 0 }">均价</view>
							<view @click="newHousePriceTab(1)" :class="{ new_price_tab_active : newHousePriceTabIndex == 1 }">总价</view>
						</view>
						<scroll-view style="background: #F8F8F9;" class="scroll_view_list price_scroll_list" scroll-y>
							<block v-for="(item, index) in newHousePriceListMap[newHousePriceTabIndex]" :key="index">
								<view hover-class="none" form-type="submit"
									:class="{screen_active: newHousePriceListIndexMap[newHousePriceTabIndex] == index}"
									@click="newHousePriceBtn(item, index)" class="region_list_item">{{ item.text }}</view>
							</block>
						</scroll-view>

						<view class="price_bottom_view f_r_b">
							<view class="f_r_s">
								<input :value="minPriceVal" @blur="minPriceBlur" class="price_input_val"
									:placeholder="newHousePriceTabIndex == 0 ? '最低均价':'最低总价'" />
								<input :value="maxPriceVal" @blur="maxPriceBlur" class="price_input_val"
									:placeholder="newHousePriceTabIndex == 0 ? '最高均价':'最高总价'" />
							</view>

							<view hover-class="none" form-type="submit" @click="confirmPrice" class="price_bottom_confirm">确定</view>
						</view>
					</view>


					<!-- 公寓出租方式 -->
					<view :style="{height: '35%'}" @click.stop="screenContBtn"
						v-if="currentClickType == 'chuZuType' && enterType == 'apartment'"
						class="region_list_view f_r_b">
						<scroll-view class="scroll_view_list price_scroll_list"
							scroll-y
							style="padding-bottom: 0;">
							<block v-for="(item, index) in aparmentChuZuTypeList" :key="index">
								<view hover-class="none" form-type="submit" :class="{screen_active: aparmentChuZuTypeListIndex == index}"
									@click="aparmentChuZuTypeBtn(item, index)" class="region_list_item">{{ item.text }}</view>
							</block>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
    import { Notification } from "../utils/Notification.js";
    import { Notify } from "../utils/Notify.js";
    import { GetScreenList } from "../net/GetScreenList.js";
    import { GpsInfoModel } from "../model/GpsInfoModel.js";
	import { Const } from "../utils/Const.js";
	import { SearchHouseModel } from "../model/SearchHouseModel.js"
	let privateData = {
		room: {
			height: ""
		},
		price: {
			height: ""
		},
		more: {
			height: ""
		},
		region: {
			height: ""
		}
	};

	export default {
		data() {
			return {
				fixedContHeight: "100%", // 弹窗的高度
				isRequestIng: false,

                downIcon: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/list/filter_btn_nomal.png",
                topIcon: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/down-active.png",

				screenFormData: {
                    erHouse: {
                        region: {
                            text: "区域",
                            leftText: "区域",
                            leftId: "",
                            show: false,
                            rightId: "",
                            key_1: "regionId",
                            key_2: "sectionId"
                        },
                        price: {
                            text: "价格",
                            id: "",
                            show: false,
                            key: "price"
                        },
                        room: {
                            text: "户型",
                            id: "",
                            show: false,
                            key: "room"
                        },
                        more: {
                            text: "更多",
                            id: "",
                            show: false,
                            key: "more"
                        },
                        source: {
                            text: "来源",
                            id: "",
                            key: "reSource"
                        },
                        area: {
                            text: "面积",
                            id: "",
                            key: "area"
                        },
                        type: {
                            text: "类型",
                            id: "",
                            key: "houseUseage"
                        },
                        specail: {
                            text: "特色",
                            id: "",
                            key: "tagId"
                        }
                    },
					newHouse: {
						region: {
						    text: "区域",
						    leftText: "区域",
						    leftId: "",
						    show: false,
						    rightId: "",
						    key_1: "buildRegion",
						    key_2: "sectionId"
						},
						price: {
						    text: "价格",
						    id: "",
						    show: false,
							key_1: "price", // 总价
							key_2: "priceUnit"  // 单价
						},
						type: {
						    text: "用途",
							show: false,
						    id: "",
						    key: "useageType"
						},
					},
					apartment: {
					    region: {
					        text: "区域",
					        leftText: "区域",
					        leftId: "",
					        show: false,
					        rightId: "",
					        key_1: "regionId",
					        key_2: "sectionId"
					    },
					    price: {
					        text: "租金",
					        id: "",
					        show: false,
					        key: "price"
					    },
					    chuZuType: {
					        text: "出租方式",
					        id: "",
					        show: false,
					        key: "rentType"
					    },
					    more: {
					        text: "更多",
					        id: "",
					        show: false,
					        key: "more"
					    },
					    ruZhuTime: {
					        text: "入住时间",
					        id: "",
					        key: "checkInTime"
					    },
					    room: {
					        text: "户型",
					        id: "",
					        key: "room"
					    },
					    area: {
					        text: "面积",
					        id: "",
					        key: "area"
					    },
						sex: {
							text: "性别",
							id: "",
							key: "sexNow"
						},
					    specail: {
					        text: "特色",
					        id: "",
					        key: "tagId"
					    },
					}
                },

                // 区域筛选
                regionLeftList: [],
                regionRightMap: {},
                regionLeftIndex: 0,
                regionRightIndex: 0,

                // 二手房价格
                erHousePriceList: [],
                erHousePriceIndex: 0,

                // 户型筛选
                roomList: Const.roomList,
                roomListIndex: 0,

                // 来源
                sourceLsit: Const.sourceLsit,
                sourceLsitIndex: -1,

                // 面积
                areaLsit: Const.areaList,
                areaLsitIndex: -1,

                // 类型
                typeLsit: Const.typeLsit,
                typeLsitIndex: -1,

                // 特色
                specialList: Const.specialList,
                specialListIndex: -1,


				// 新房类型
				newHouseTypeList: Const.newHouseTypeList,
				newHouseTypeListIndex: 0,


				// 新房价格
				newHousePriceListMap: {
					0: [],
					1: []
				},
				newHousePriceTabIndex: 0,
				newHousePriceListIndexMap: {
					0: 0,
					1: 0
				},


				// 公寓出租方式
				aparmentChuZuTypeList: Const.aparmentChuZuTypeList,
				aparmentChuZuTypeListIndex: 0,

				// 公寓更多
				aparmentMoreMap: {
					ruZhuTime: {
						list: Const.aparmentRuZhuTimeList,
						index: -1
					},
					room: {
						list: Const.apartmentRoomList,
						index: -1
					},
					area: {
						list: Const.apartmentAreaList,
						index: -1
					},
					sex: {
						list: Const.aparmentSexList,
						index: -1
					},
					specail: {
						list: Const.apartmentSpecialList,
						index: -1
					}
				},


                listTcShow: false,
                currentClickType: "region",

                fixedTcTop: "103px",

                contHeight: "70%",   // 内容区的高度


				roomItem: {text:"不限", id: ""},
				priceItem: {text:"不限", id: ""},
				newHouseTypeItem: {text:"不限", id: ""},
				aparmentChuZuTypeItem: {text:"不限", id: ""},

				// 价格输入
				minPriceVal: "",
				maxPriceVal: "",

				cityId: "1",

				// 价格列表的map
				priceApiDataMap: {
					"erHouse": {
						apiKey: "SALE_PRICE_DATA",
						unit: "万",
						defaultText: "价格"
					},
					"lease": {
						apiKey: "LEASE_PRICE_DATA",
						unit: "元",
						defaultText: "租金"
					},
					"newHouse": {
						apiKey: "NEW_HOUSE_PRICE",
						unit: "万",
						defaultText: "价格"
					},
					"apartment": {
						apiKey: "APARTMENT_PRICE_DATA",
						unit: "元",
						defaultText: "租金"
					}
				}
			};
		},

        props: {
        	enterType: {
        		type: String,
        		default: "erHouse"
        	},
			from: {
				type: String,
				default: "erHouse"
			},
            regId: {
                type: String,
                default: ""
			},
            city: {
                type: String,
                default: ""
            }
        },

		watch: {
			form(newValue, oldValue) {
				if(this.priceApiDataMap[this.from]) {
					this.screenFormData.erHouse.price.text = this.priceApiDataMap[this.from].defaultText;
				}
			}
		},

        mounted(params) {
			if(this.priceApiDataMap[this.from]) {
				this.screenFormData.erHouse.price.text = this.priceApiDataMap[this.from].defaultText;
			}
            this.upGpsInfo();
            this.setTabNodeInfo();

            // 监听gps变化
            new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
             // 监听搜索结果
            new Notification().addObserver(this, "SearchResChanged", Notify.SearchResChanged.Name);
			new this.InitFormSubmit(this);
        },

        destroyed() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
            // 弹窗点击关闭()
            screenClose() {
                this.listTcShow = false;
                new Notification().postNotification(Notify.ScreenShowChanged.Name
                   , this.listTcShow);

                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                let moreIds = ["source", "area", "type", "specail"];
				if(enterType == 'apartment') {
					moreIds = ["ruZhuTime","room","area","sex","specail"];
				}
                for(let key in (screenFormData[enterType] || {})) {
                    let item = screenFormData[enterType][key];
                    if(key === "region" && !item.rightId) {
                        screenFormData[enterType][key].show = false;
                        continue;
                    }

                    if(key === "more") {
                        let moreNotIdNum = 0;
                        for(let i = 0;i<moreIds.length;i++) {
                            if(!screenFormData[enterType][moreIds[i]].id) {
                                moreNotIdNum++;
                            }
                        }
                        if(moreNotIdNum === moreIds.length) {
                            screenFormData[enterType][key].show = false;
                            screenFormData[enterType][key].text = "更多";
                        }
                        continue;
                    }

                    if(!item.rightId) {
                        screenFormData[enterType][key].show = false;
                    }
                }
                this.screenFormData = screenFormData;
            },
            screenContBtn() {},

            // 设置顶部tab的位置
            setTabNodeInfo() {
                setTimeout(() => {
                    this.DifferenceApi.boundingClientRect(".screen_list", this)
						.then(data => {
                            let res = uni.getSystemInfoSync();
                            this.fixedContHeight = res.windowHeight - (data ? data.top || 0 : 0) + "px";
                            let h5TitleHeight = 0;
                            h5TitleHeight = 44;
                            if(data && data.height) {
                                this.fixedTcTop = data.top + h5TitleHeight + 1 + "px";
                            }else{
                                // #ifdef MP-ALIPAY
                                this.fixedTcTop = 103 + "px";
                                // #endif
                            }
						});
                }, 1000);
            },


            // 设置内容区域的高度
            setContHeight() {
                let contHeightMap = {
                    price: {
                        erHouse: this.erHousePriceList,
                        newHouse: this.erHousePriceList,
                    },
                    room: {
                        erHouse: this.roomList,
                        newHouse: this.roomList,
						event: "setRoomHeight"
                    }
                };
                let currentClickType = this.currentClickType;
				if(contHeightMap[currentClickType] && contHeightMap[currentClickType].event) {
					this[contHeightMap[currentClickType].event]();
					return;
				}

				if(privateData[currentClickType] && privateData[currentClickType].height) {
					this.contHeight = privateData[currentClickType].height;
					return;
				}

                setTimeout(() => {
                    let view = this.DifferenceApi.createSelectorQuery(this).select(".region_list_item");
                    view.boundingClientRect(data => {
                        if(currentClickType === "more" || currentClickType === "price") {
							this.contHeight = "70%";
							privateData[currentClickType].height = "70%";
                            return;
                        }

                        if(!data) return;


                        if(!contHeightMap[currentClickType]) {
                            this.contHeight = "70%";
                            return;
                        }

                        this.contHeight = data.height
                            ? data.height * contHeightMap[currentClickType][this.enterType].length + "px"
                            : "70%";
						privateData[currentClickType].height = this.contHeight;
                    }).exec();
                }, 50);
            },
			// 获取户型的高度
			setRoomHeight() {
				let that = this;
				if(privateData['room'].height) {
					that.contHeight = privateData['room'].height;
					return;
				}

				setTimeout(() => {
				    let view = this.DifferenceApi.createSelectorQuery(this).select(".region_new_title");
					let btnView = this.DifferenceApi.createSelectorQuery(this).select(".room_new_btn_view");
					let contView = this.DifferenceApi.createSelectorQuery(this).select(".region_new_cont");
					let contHeight = 0;
				    view.boundingClientRect(data => {
						contHeight += (data.height || 0);
						btnView.boundingClientRect(btnData => {
						   contHeight += (btnData.height || 0);
						   contView.boundingClientRect(contData => {
							  contHeight += (contData.height || 0);
							  privateData['room'].height = contHeight + 20 + "px";
							  that.contHeight = privateData['room'].height;
						   }).exec();
						}).exec();
				    }).exec();
				}, 50);
			},


            // 更新定位信息
            upGpsInfo() {
                if(!new GpsInfoModel().getModel("cityInfo")) return;

                let item = new GpsInfoModel().getModel("cityInfo");
                let needNc = !(this.regId == item.regId);
                this.cityId = this.city || item.cityId || "1";
                item.regId = this.regId || item.regId || "";
                this.initData().then(() => {
					if(this.regId || (new GpsInfoModel().getModel("cityInfo") && !new SearchHouseModel().getModel()
                        && this.enterType != 'newHouse' && this.enterType != 'apartment')) {
						let index = -1;
						for (let leftInfo of this.regionLeftList) {
							index++;
							if(leftInfo.id == item.regId) {
                                item.regName = leftInfo.text || item.regName || "";
								break;
							}
						}
						if(this.isRequestIng) return;

						this.isRequestIng = true;
						this.regionLeftBtn({id: item.regId, text: item.regName}, index, false);
						this.regionRightBtn({id: "", text: "不限"}, 0, needNc);
						this.regionLeftIndex = index;
						this.regionRightIndex = 0;
					}
				});
            },

            // gps change 回调
            GpsChanged(name, item) {
                this.upGpsInfo();
            },

            // 初始化列表
            initData() {
			    return new GetScreenList({cityId: this.cityId}).send()
				   .then(res => {
						let data = res.DATA;
						this.drawRegionLeftList(data.REG_DATA || []);
						this.drawRegionRightList(data.SECTION_DATA || {});
						if(this.enterType == 'newHouse') {
							this.drawNewHousePriceList((data.NEW_HOUSE_PRICE || []), (data.NEW_HOUSE_TOTAL_PRICE || []));
						}else{
							let priceList = data[this.priceApiDataMap[this.from].apiKey] || [];
							if(this.enterType == 'apartment') {
								priceList = data[this.priceApiDataMap[this.from].apiKey]
									? data[this.priceApiDataMap[this.from].apiKey].split(",") : [];
							}
							this.drawErHousePriceList(priceList || []);
						}
						return res;
				   })
				   .catch(err => {
						uni.showModal({
							title: "请求失败",
							content: "获取筛选列表失败啦！请稍后重试。",
							showCancel: false
						});
						return err;
				   });
            },
            // 初始化区域
            drawRegionLeftList(apiData = []) {
                let regionLeftList = [{id: "", text: "不限"}];
                for(let i = 0;i<apiData.length;i++) {
                    let dataItem = apiData[i] || {};
                    if(!dataItem.REG_ID || !dataItem.REG_NAME) continue;

                    regionLeftList.push({
                       id: dataItem.REG_ID,
                       text: dataItem.REG_NAME
                    });
                }
                this.regionLeftList = regionLeftList;
            },
            drawRegionRightList(apiData = {}) {
                let regionRightMap = {"": [{id: "", text: "不限"}]};
                for(let key in apiData) {
                    let dataItem = apiData[key] || [];
                    if(!key) continue;

                    let list = [{id: "", text: "不限"}];
                    for(let j = 0;j<dataItem.length;j++) {
                        let infoItem = dataItem[j];
                        if(!infoItem || infoItem.length < 2) continue;

                        list.push({
                           id: infoItem[1],
                           text: infoItem[0]
                        });
                    }
                    regionRightMap[key] = list;
                }
                this.regionRightMap = regionRightMap;
            },
            // 初始化二手房价格
            drawErHousePriceList(apiData = [], unit = this.priceApiDataMap[this.from].unit) {
                let erHousePriceList = [{ text: '不限', id: '' }];
                for(let i = 0;i<apiData.length;i++) {
                    if(i === 0) {
                        erHousePriceList.push({
                            text: apiData[i] + unit + "以下",
                            id: "0:" + apiData[i]
                        });
                        continue;
                    }

                    erHousePriceList.push({
                        text: apiData[i - 1] + "-" + apiData[i] + unit,
                        id: apiData[i - 1] + ":" + apiData[i]
                    });

					if(i === apiData.length - 1) {
					    erHousePriceList.push({
					        text: apiData[i] + unit + "以上",
					        id: apiData[i] + ":9999"
					    });
					}
                }
                this.erHousePriceList = erHousePriceList;
				return erHousePriceList;
            },
            // 初始化新房价格
			drawNewHousePriceList(junJiaData = [], zongJiaData = []) {
				this.newHousePriceListMap = {
					0: this.drawErHousePriceList(junJiaData, "元"),
					1: this.drawErHousePriceList(zongJiaData, "")
				};
			},

            // 筛选按钮点击
        	screenBtn(type) {
				this.setTabNodeInfo();
                this.currentClickType = type;
        		let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                if(!screenFormData[enterType][type]) {
                    throw new Error("参数配置错误，请检查screenFormData中是否有对应的key");
                }

                this.setContHeight();
                screenFormData[enterType][type].show = !screenFormData[enterType][type].show;
                for(let key in screenFormData[enterType]) {
                    if(screenFormData[enterType][key].show !== undefined && key !== type) {
                        screenFormData[enterType][key].show = false;
                    }
                }
                this.listTcShow = screenFormData[enterType][type].show;
                new Notification().postNotification(Notify.ScreenShowChanged.Name
                    , this.listTcShow);
                this.screenFormData = screenFormData;
        	},

            // getParams
            getParams() {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                let data = screenFormData[enterType];
                let params = {};
                for(let key in data) {
                    let item = data[key] || {};
					if(enterType == "newHouse" && key == "price" && item.id) {
						if(this.newHousePriceTabIndex == 0) {
							params[item["key_2"]] = item.id;
							params[item["key_1"]] = "";
						}
						if(this.newHousePriceTabIndex == 1) {
							params[item["key_2"]] = "";
							params[item["key_1"]] = item.id;
						}
					}

                    if(key !== "region" && item.id && item["key"] != undefined) {
                        params[item["key"]] = item.id;
                        continue;
                    }

                    if(key !== "region" && !item.id) continue;

                    if(item.leftId != undefined) {
                        params[item["key_1"]] = item.leftId;
                    }
                    if(item.rightId != undefined && (item.leftId !== item.rightId || !item.rightId)) {
                        params[item["key_2"]] = item.rightId;
                    }
                }
                return params;
            },

            // 推送筛选结果
            ncScreenRes() {
                new Notification().postNotification(Notify.ScreenResultChanged.Name
                   , this.getParams());
                new Notification().postNotification(Notify.ScreenShowChanged.Name
                   , this.listTcShow);
            },

            // 区域选择
            regionLeftBtn(item, index, needNc = true) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                let regionRightMap = this.regionRightMap;
                screenFormData[enterType].region.leftText = item.text;
                screenFormData[enterType].region.leftId = item.id;
                if(!regionRightMap[item.id] || regionRightMap[item.id].length <= 1) {
                    // screenFormData[enterType].region.rightId = item.id;
					screenFormData[enterType].region.rightId = "";
                    screenFormData[enterType].region.show = false;
                    screenFormData[enterType].region.text = "区域";
                    if(!item.id) {
                        screenFormData[enterType].region.rightId = "";
                    }
                    this.listTcShow = false;
					if(needNc) {
						this.ncScreenRes();
					}
                }
                this.regionRightIndex = 0;
                this.regionLeftIndex = index;
                this.screenFormData = screenFormData;
            },
            regionRightBtn(item, index, needNc = true) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                let regionRightMap = this.regionRightMap;
                screenFormData[enterType].region.rightId = screenFormData[enterType].region.leftId;
                screenFormData[enterType].region.show = false;
                screenFormData[enterType].region.text = screenFormData[enterType].region.leftText;
                if(item.id) {
                    screenFormData[enterType].region.text = item.text;
                }
				screenFormData[enterType].region.rightId = item.id;
                if(!screenFormData[enterType].region.leftId) {
                    screenFormData[enterType].region.text = "区域";
                    screenFormData[enterType].region.show = false;
                }
                this.listTcShow = false;
                this.regionRightIndex = index;
                this.screenFormData = screenFormData;
                if(needNc) {
                	this.ncScreenRes();
                }
            },

            // 价格选择
            priceBtn(item, index, isInput = false) {
				if(!isInput) {
					this.minPriceVal = "";
					this.maxPriceVal = "";
				}
				this.priceItem = item;
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                screenFormData[enterType].price.id = item.id;
                screenFormData[enterType].price.show = false;
                screenFormData[enterType].price.text = item.text;
                if(!item.id) {
                    screenFormData[enterType].price.text = this.priceApiDataMap[this.from].defaultText;
                }
                this.listTcShow = false;
                this.erHousePriceIndex = index;
                this.screenFormData = screenFormData;
                this.ncScreenRes();
            },
			// 价格输入
			minPriceBlur(e) {
				this.minPriceVal = e.detail.value;
			},
			maxPriceBlur(e) {
				this.maxPriceVal = e.detail.value;
			},
			confirmPrice() {
				if(!this.minPriceVal || !this.maxPriceVal) {
					uni.showToast({
						title: "请输入价格",
						icon: "none"
					});
					return;
				}

				let unitText = "价格";
				let priceUnit = "";
				if(this.enterType == "newHouse" && this.newHousePriceTabIndex == 1) {
					unitText = "总价";
					priceUnit = "万";
				}
				if(this.enterType == "newHouse" && this.newHousePriceTabIndex == 0) {
					unitText = "均价";
					priceUnit = "元";
				}
				if(Number(this.minPriceVal) > Number(this.maxPriceVal)) {
					uni.showToast({
						title: `最高${unitText}应该大于最低${unitText}`,
						icon: "none"
					});
					return;
				}
				if(this.enterType == "newHouse") {
					this.newHousePriceBtn({text: `${this.minPriceVal}-${this.maxPriceVal}${priceUnit}`,
						id: `${this.minPriceVal}:${this.maxPriceVal}`}, -1, true);
				}else{
					this.priceBtn({text: `${this.minPriceVal}-${this.maxPriceVal}${this.priceApiDataMap[this.from].unit}`,
						id: `${this.minPriceVal}:${this.maxPriceVal}`}, -1, true);
				}
			},

			// 新房用途筛选
			newHouseTypeBtn(item, index) {
				this.newHouseTypeItem = item;
				let screenFormData = this.screenFormData;
				let enterType = this.enterType;
				screenFormData[enterType].type.id = item.id;
				screenFormData[enterType].type.show = false;
				screenFormData[enterType].type.text = item.text;
				if(!item.id) {
				    screenFormData[enterType].type.text = "用途";
				}
				this.listTcShow = false;
				this.newHouseTypeListIndex = index;
				this.screenFormData = screenFormData;
				this.ncScreenRes();
			},

			// 新房价格筛选
			newHousePriceTab(index) {
				this.newHousePriceTabIndex = index;
			},

			// 新房价格选择
			newHousePriceBtn(item, index, isInput = false) {
				if(!isInput) {
					this.minPriceVal = "";
					this.maxPriceVal = "";
				}
				this.priceItem = item;
				let screenFormData = this.screenFormData;
				let enterType = this.enterType;
				screenFormData[enterType].price.id = item.id;
				screenFormData[enterType].price.show = false;
				screenFormData[enterType].price.text = item.text;
				if(!item.id) {
				    screenFormData[enterType].price.text = this.priceApiDataMap[this.from].defaultText;
				}
				this.listTcShow = false;
				if(this.newHousePriceTabIndex == 0) {
					this.newHousePriceListIndexMap[this.newHousePriceTabIndex] = index;
					this.newHousePriceListIndexMap["1"] = 0;
				}
				if(this.newHousePriceTabIndex == 1) {
					this.newHousePriceListIndexMap[this.newHousePriceTabIndex] = index;
					this.newHousePriceListIndexMap["0"] = 0;
				}

				this.screenFormData = screenFormData;
				this.ncScreenRes();
			},


			// 公寓出租方式
			aparmentChuZuTypeBtn(item, index) {
				this.aparmentChuZuTypeItem = item;
				let screenFormData = this.screenFormData;
				let enterType = this.enterType;
				screenFormData[enterType].chuZuType.id = item.id;
				screenFormData[enterType].chuZuType.show = false;
				screenFormData[enterType].chuZuType.text = item.text;
				if(!item.id) {
				    screenFormData[enterType].chuZuType.text = "出租方式";
				}
				this.listTcShow = false;
				this.aparmentChuZuTypeListIndex = index;
				this.screenFormData = screenFormData;
				this.ncScreenRes();
			},


            // 户型选择
            roomBtn(item, index) {
				this.roomItem = item;
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                screenFormData[enterType].room.id = item.id;
                screenFormData[enterType].room.show = false;
                screenFormData[enterType].room.text = item.text;
                if(!item.id) {
                    screenFormData[enterType].room.text = "户型";
                }
                this.listTcShow = false;
                this.roomListIndex = index;
                this.screenFormData = screenFormData;
                this.ncScreenRes();
            },

            // 来源选择
            sourceBtn(item, index) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                if (this.sourceLsitIndex === index) {
                    this.sourceLsitIndex = -1;
                    screenFormData[enterType].source.id = "";
                    screenFormData[enterType].source.text = "来源";
                    return;
                }

                this.sourceLsitIndex = index;
                screenFormData[enterType].source.id = item.id;
                screenFormData[enterType].source.text = item.text;
            },

            // 面积选择
            areaBtn(item, index) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                if (this.areaLsitIndex === index) {
                    this.areaLsitIndex = -1;
                    screenFormData[enterType].area.id = "";
                    screenFormData[enterType].area.text = "面积";
                    return;
                }

                this.areaLsitIndex = index;
                screenFormData[enterType].area.id = item.id;
                screenFormData[enterType].area.text = item.text;
            },

            // 类型选择
            typeBtn(item, index) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                if (this.typeLsitIndex === index) {
                    this.typeLsitIndex = -1;
                    screenFormData[enterType].type.id = "";
                    screenFormData[enterType].type.text = "类型";
                    return;
                }

                this.typeLsitIndex = index;
                screenFormData[enterType].type.id = item.id;
                screenFormData[enterType].type.text = item.text;
            },

            // 特色选择
            specialBtn(item, index) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                if (this.specialListIndex === index) {
                    this.specialListIndex = -1;
                    screenFormData[enterType].specail.id = "";
                    screenFormData[enterType].specail.text = "特色";
                    return;
                }

                this.specialListIndex = index;
                screenFormData[enterType].specail.id = item.id;
                screenFormData[enterType].specail.text = item.text;
            },


			// 公寓更多选择
			aparmentMoreBtn(item, index, type) {
				let screenFormData = this.screenFormData;
				let enterType = this.enterType;
				let aparmentMoreMap = this.aparmentMoreMap;
				if (aparmentMoreMap[type].index === index) {
				    aparmentMoreMap[type].index = -1;
				    screenFormData[enterType][type].id = "";
				    screenFormData[enterType][type].text = "";
				    return;
				}

				aparmentMoreMap[type].index = index;
				this.aparmentMoreMap = aparmentMoreMap;
				screenFormData[enterType][type].id = item.id;
				screenFormData[enterType][type].text = item.text;
			},



            // 重置
            resetBtn() {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;

                screenFormData[enterType].more.text = "更多";
                screenFormData[enterType].more.show = true;

                this.specialListIndex = -1;
                screenFormData[enterType].specail.id = "";
                screenFormData[enterType].specail.text = "特色";

                this.typeLsitIndex = -1;
                screenFormData[enterType].type.id = "";
                screenFormData[enterType].type.text = "类型";

                this.areaLsitIndex = -1;
                screenFormData[enterType].area.id = "";
                screenFormData[enterType].area.text = "面积";

                this.sourceLsitIndex = -1;
                screenFormData[enterType].source.id = "";
                screenFormData[enterType].source.text = "来源";

                this.screenFormData = screenFormData;
            },

            // 确定
            confirmBtn() {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
                screenFormData[enterType].more.text = "更多 ";
                screenFormData[enterType].more.show = false;
                let ids = ["source", "area", "type", "specail"];
				if(enterType == 'apartment') {
					ids = ["ruZhuTime","room","area","sex","specail"];
				}
                let emptyNum = 0;
                for(let i = 0;i<ids.length;i++) {
                    if(!screenFormData[enterType][ids[i]].id) {
                        emptyNum++;
                    }
                }
                if(ids.length === emptyNum) {
                    screenFormData[enterType].more.text = "更多";
                }
                this.screenFormData = screenFormData;
                this.listTcShow = false;
                this.ncScreenRes();
            },

            // 搜索结果回调
            SearchResChanged(name, item) {
                let screenFormData = this.screenFormData;
                let enterType = this.enterType;
				screenFormData[enterType] = {
				    region: {
				        text: "区域",
				        leftText: "区域",
				        leftId: "",
				        show: false,
				        rightId: "",
				        key_1: "regionId",
				        key_2: "sectionId"
				    },
				    price: {
				        text: this.priceApiDataMap[this.from].defaultText,
				        id: "",
				        show: false,
				        key: "price"
				    },
				    room: {
				        text: "户型",
				        id: "",
				        show: false,
				        key: "room"
				    },
				    more: {
				        text: "更多",
				        id: "",
				        show: false,
				        key: "more"
				    },
				    source: {
				        text: "来源",
				        id: "",
				        key: "reSource"
				    },
				    area: {
				        text: "面积",
				        id: "",
				        key: "area"
				    },
				    type: {
				        text: "类型",
				        id: "",
				        key: "houseUseage"
				    },
				    specail: {
				        text: "特色",
				        id: "",
				        key: "tagId"
				    }
				};
				if(enterType == "newHouse") {
					screenFormData[enterType] = {
					    region: {
					        text: "区域",
					        leftText: "区域",
					        leftId: "",
					        show: false,
					        rightId: "",
					        key_1: "regionId",
					        key_2: "sectionId"
					    },
						price: {
						    text: "价格",
						    id: "",
						    show: false,
							key_1: "price", // 总价
							key_2: "priceUnit"  // 单价
						},
						type: {
						    text: "用途",
							show: false,
						    id: "",
						    key: "useageType"
						}
					}
				}
				if(enterType == "apartment") {
					screenFormData[enterType] = {
					    region: {
					        text: "区域",
					        leftText: "区域",
					        leftId: "",
					        show: false,
					        rightId: "",
					        key_1: "regionId",
					        key_2: "sectionId"
					    },
					    price: {
					        text: "租金",
					        id: "",
					        show: false,
					        key: "price"
					    },
					    chuZuType: {
					        text: "出租方式",
					        id: "",
					        show: false,
					        key: "rentType"
					    },
					    more: {
					        text: "更多",
					        id: "",
					        show: false,
					        key: "more"
					    },
					    ruZhuTime: {
					        text: "入住时间",
					        id: "",
					        key: "checkInTime"
					    },
					    room: {
					        text: "户型",
					        id: "",
					        key: "room"
					    },
					    area: {
					        text: "面积",
					        id: "",
					        key: "area"
					    },
					    sex: {
					    	text: "性别",
					    	id: "",
					    	key: "sexNow"
					    },
					    specail: {
					        text: "特色",
					        id: "",
					        key: "tagId"
					    }
					};
				}

				this.aparmentMoreMap = {
					ruZhuTime: {
						list: Const.aparmentRuZhuTimeList,
						index: -1
					},
					room: {
						list: Const.apartmentRoomList,
						index: -1
					},
					area: {
						list: Const.apartmentAreaList,
						index: -1
					},
					sex: {
						list: Const.aparmentSexList,
						index: -1
					},
					specail: {
						list: Const.apartmentSpecialList,
						index: -1
					}
				};
				this.aparmentChuZuTypeListIndex = 0;

				this.newHousePriceTabIndex = 0;
				this.newHousePriceListIndexMap = {0:0,1:0};
				this.newHouseTypeListIndex = 0;

                this.screenFormData = screenFormData;
				// this.regionLeftBtn({id: "", text: "不限"}, 0, false);
				// this.regionRightBtn({id: "", text: "不限"}, 0, false);
                this.regionLeftIndex = 0;
                this.regionRightIndex = 0;
                this.erHousePriceIndex = 0;
                this.roomListIndex = 0;
                this.sourceLsitIndex = -1;
                this.areaLsitIndex = -1;
                this.typeLsitIndex = -1;
                this.specialListIndex = -1;
				this.minPriceVal = "";
				this.maxPriceVal = "";
				setTimeout(() => {
					this.ncScreenRes();
				}, 200);
            }
        },
	}
</script>

<style scoped>
    .screen_view{
        height:80upx;
        border-bottom:1upx solid #f6f6f6;
        box-sizing: border-box;
        line-height: 80upx;
    }
    .screen_list{
        width: 100%;
        height: 100%;
    }
    .screen_item{
        width: 100%;
        height: 100%;
        position:relative;
		overflow: inherit;
    }
   /* .screen_item:not(:last-child)::before{
        content:'';
        position: absolute;
        width:1px;
        height: 30upx;
        background: #d1d1d1;
        right:0;
        top:0;
        bottom:0;
        margin: auto;
    } */
    .screent_text{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        text-align:center;
        font-size:30upx;
        color:#494949;
		flex-shrink: 0;
    }
	.screen_item .screen_icon_active{
		width: 16upx;
		height: 10upx;
		margin: auto 10upx auto 15upx;
		flex-shrink: 0;
	}
    .screen_icon{
        width: 20upx;
        height: 18upx;
        margin: auto 10upx auto 11upx;
		flex-shrink: 0;
    }

    /* 弹窗 */
    .screen_fixed_list{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 99999;
        font-size: 30upx;
    }
	/* #ifdef H5 */
	.screen_fixed_list{
		max-width: 640px;
		width: 100%;
		transform: translateX(-50%);
		left: 50%;
	}
	/* #endif */
    .region_list_view{
        height: 70%;
        background: #FFFFFF;
        width: 100%;
        position: relative;
    }
    .region_scroll_left{
        width: 35%;
		/* width: 45%; */
        height: 100%;
        /* background: #f4f4f4; */
		background: #FFFFFF;
        box-sizing: border-box;
    }
    .region_scroll_right{
        width: 65%;
		/* width: 55%; */
        height: 100%;
        background: #F8F8F9;
        padding-left: 30upx;
        box-sizing: border-box;
    }
    .scroll_view_list{
        width: 100%;
        height: 100%;
        background: #FFFFFF;
        box-sizing: border-box;
        position: relative;
    }
    .region_scroll_right .region_list_item{
        padding-left: 0;
    }
    .region_list_item{
		text-align: left;
        padding-left: 30upx;
        width:100%;
        box-sizing:border-box;
        height:100upx;
        line-height:100upx;
        /* border-bottom:1upx solid #eee; */
        box-sizing: border-box;
        font-size: 30upx;
    }
    .screen_fixed_list .region_left_active{
        background:#fff;
        color:#ab7f2e;
    }
	.price_scroll_list .screen_active{
		color:#ab7f2e;
		border: none;
		color:#ab7f2e;
	}
	.region_scroll_right .screen_active{
		background: #F8F8F9;
		border: none;
		color:#ab7f2e;
	}
	.region_new_cont .screen_active{
		color:#ab7f2e;
		border: 1upx solid #ab7f2e;
		background: #FFFFFF;
	}
    .room_list_view{
        width: 100%;
    }

    /* 更多 */
    .more_list_cont{
        padding-left: 30upx;
        box-sizing: border-box;
        padding-bottom: 190upx;
    }
    .more_list{
        /* border-bottom:1px solid #f3f3f3; */
    }
    .more_title{
        height:90upx;
        line-height:90upx;
        color:#2d2c2c;
        letter-spacing:1upx;
        font-family:'黑体';
		font-size:36upx;
		font-weight:600;
    }
    .more_cont{
        flex-wrap: wrap;
    }
    .more_item{
		width:150upx;
		height:62upx;
		background:#f1f3f6;
		line-height:62upx;
		text-align:center;
		color:#101d36;
		border-radius:6upx;
		font-size:26upx;
		margin-right:20upx;
		margin-bottom:20upx;
		letter-spacing:1px;
		box-sizing:border-box;
		/* overflow: hidden; */
    }
    .more_list .more_item_active{
        background:#FFFFFF;
        color:#ab7f2e;
        border-color:#ab7f2e;
		border: 1upx solid #ab7f2e;
    }
    .more_btn_view{
		width:100%;
		height:156upx;
		position:absolute;
		bottom:0;
		align-items:center;
		background:#ffffff;
		z-index:99;
		padding:0 39upx 0 39upx;
		box-sizing:border-box;
    }
	.more_btn_view view{
		width:48%;
		height:80upx;
		border-radius:6upx;
		background:#f1f3f6;
		text-align:center;
		line-height:85upx;
		font-size:30upx;
		color:#7999b5;
		letter-spacing:10upx;
		border-radius:40upx;
		opacity:0.8;
	}
    .resetBtn{}
    .more_btn_view .confirmBtn{
        background:-webkit-linear-gradient(left, rgb(255,132,0) , rgb(255,84,0));
		color:#fff;
    }

	.region_new_title{
		font-size:36upx;
		font-weight:600;
		color:#101d36;
		margin-top:20upx;
		padding-left: 30upx;
		box-sizing: border-box;
		margin-bottom: -10upx;
	}
	.region_new_list_item{
		width:150upx;
		height:62upx;
		background-color:#f1f3f6;
		border-radius:6upx;
		float:left;
		margin-right:23upx;
		text-align:center;
		line-height:62upx;
		color:#101d36;
		font-size:24upx;
		margin-top:24upx;
	}
	.region_new_cont{
		padding-left: 30upx;
		box-sizing: border-box;
		flex-wrap: wrap;
	}
	.room_new_btn_view{
		display:flex;
		justify-content:space-between;
		width:100%;
		height:156upx;
		position:absolute;
		bottom:0;
		align-items:center;
		background:#ffffff;
		z-index:99;
		padding:0 39upx 0 39upx;
		box-sizing:border-box;
	}
	.room_new_btn_view view, .room_new_btn_view view, .room_new_btn_view button{
		width:48%;
		height:80upx;
		border-radius:40upx;
		background:#f1f3f6;
		text-align:center;
		line-height:85upx;
		font-size:30upx;
		color:#7999b5;
		opacity:0.8;
	}
	.room_new_btn_view .room_new_btn_confirm{
		background:-webkit-linear-gradient(left, rgb(255,132,0) , rgb(255,84,0));
		color:#fff;
	}

	.screen_view .price_scroll_list{
		padding-bottom: 140upx;
		box-sizing: border-box;
	}
	.price_bottom_view{
		position:absolute;
		bottom: 0;
		left: 0;
		height:140upx;
		width:100%;
		box-sizing:border-box;
		padding:0 40upx 0;
		background-color:#ffffff;
	}
	.price_bottom_view .price_input_val{
		width:160upx;
		height:60upx;
		line-height: 60upx;
		text-align:center;
		border:1px solid #cccccc;
		border-radius:6upx;
		font-size:24upx;
		margin: auto 0;
	}
	.price_bottom_view .price_input_val:last-child{
		margin-left: 50upx;
	}
	.price_bottom_confirm{
		width:200upx;
		height:74upx;
		background-image:linear-gradient(246deg, #ab7f2e 0%, #ff8400 100%), linear-gradient( #eeeff5, #eeeff5);
		border-radius:37upx;
		color:#ffffff;
		font-size:28upx;
		line-height:74upx;
		text-align:center;
		margin: auto 0;
	}


	/* 新房价格切换 */
	.new_house_price_change_view{
		width: 28%;
		flex-shrink: 0;
		background: #FFFFFF;
	}
	.new_house_price_change_view>view{
		text-align: center;
		line-height: 100upx;
	}
	.new_house_price_change_view>.new_price_tab_active{
		color: #ab7f2e;
	}
</style>
