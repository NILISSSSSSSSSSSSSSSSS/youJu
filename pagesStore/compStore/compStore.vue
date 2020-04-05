<template>
    <view>
        <view v-if="!isInitIng">
            <view v-show="currentClickTopBarIndex == 0" class="pageViewFixed"></view>

            <!--顶部背景-->
            <view class="topBgView" v-if="!isInitIng"
                  :style="{backgroundImage: 'url('+ topBgSrc +')'}">
                <image class="topBgImgView" :src="topBgImgSrc"></image>
                <view class="topBgMarkView"></view>
                <view :style="{background: linearGradientBg}" class="topBgColorView"></view>
            </view>
            <view v-if="!isInitIng" class="topBgMarkBgColor"></view>

            <!--内容区-->
            <view v-if="!isInitIng" class="homeView">
                <!--公司信息-->
                <view class="f_r_s titleInfoView">
                    <image class="logoImgSrcView" :src="titleInfo.logoImgSrc"></image>

                    <view class="flexColumnSpaceBetween titleInfoTextView">
                        <view class="titleInfoName">{{ titleInfo.name }}</view>
                        <!--将旗舰店三个字去掉，2018.12.17-->
                        <view class="flexRowStart titleInfoHouseAgent">
                            <block v-if="titleInfo.houseCnt > 0">{{ titleInfo.houseCnt }}套房源、</block>
                            <block v-if="titleInfo.agentCnt > 0">{{ titleInfo.agentCnt }}名经纪人</block>
                        </view>
                    </view>

                    <view v-if="!isInitIng" class="shop" @click="toDeptMap">门店分布</view>
                </view>

                <!--顶部切换 ios-->
                <view style="height: 40upx;width: 100%;flex-shrink: 0;"></view>
                <block v-if="isIosPhone">
                    <view id="changeButtonArrView"
                          class="flexRowStart section-header changeButtonArrView">
                        <!-- search -->
                        <view v-if="!isInitIng" class="search-info" @click="searchBtn">
                            <view class="search-box"></view>
                            <view class="search-icon"></view>
                            <view class="search-text">搜索</view>
                        </view>

                        <!-- 至少有二手房，租房，或新房，才展示tab栏 -->
                        <block v-if="(changeButtonArr[1] && changeButtonArr[1].haveData) || (changeButtonArr[2] && changeButtonArr[2].haveData) || (changeButtonArr[3] && changeButtonArr[3].haveData)">
                            <view v-if="changeButtonArr[0] && changeButtonArr[0].haveData" @click="changeButtonClick(changeButtonArr[0])"
                                  :class="changeButtonArr[0].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                  class="changeButtonClickView flexRowCenter">
                                <text>{{ changeButtonArr[0].text }}</text>
                            </view>

                            <view v-if="changeButtonArr[1] && changeButtonArr[1].haveData" @click="changeButtonClick(changeButtonArr[1])"
                                  :class="changeButtonArr[1].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                  class="changeButtonClickView flexRowCenter">
                                <text>{{ changeButtonArr[1].text }}</text>
                            </view>

                            <view v-if="changeButtonArr[2] && changeButtonArr[2].haveData" @click="changeButtonClick(changeButtonArr[2])"
                                  :class="changeButtonArr[2].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                  class="changeButtonClickView flexRowCenter">
                                <text>{{ changeButtonArr[2].text }}</text>
                            </view>

                            <view v-if="changeButtonArr[3] && changeButtonArr[3].haveData" @click="changeButtonClick(changeButtonArr[3])"
                                  :class="changeButtonArr[3].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                  class="changeButtonClickView flexRowCenter">
                                <text>{{ changeButtonArr[3].text }}</text>
                            </view>
                        </block>
                    </view>

                    <view class="compStoreTopEmptyView"></view>
                </block>
                <!--顶部切换 非ios-->
                <view class="changeButtonArrViewSticky"
                      :style="{position:(isIosPhone?'relative':'relative'),zIndex:isIosPhone?'2':'82'}">
                    <view v-if="!isIosPhone" class="changeButtonArrViewStickyTab">
                        <view id="changeButtonArrView" class="flexRowStart section-header changeButtonArrView">
                            <!-- search -->
                            <view v-if="!isInitIng" class="search-info" @click="searchBtn">
                                <view class="search-box"></view>
                                <view class="search-icon"></view>
                                <view class="search-text">搜索</view>
                            </view>

                            <!-- 至少有二手房，租房，或新房，才展示tab栏 -->
                            <block v-if="(changeButtonArr[1] && changeButtonArr[1].haveData) || (changeButtonArr[2] && changeButtonArr[2].haveData) || (changeButtonArr[3] && changeButtonArr[3].haveData)">
                                <view v-if="changeButtonArr[0].haveData" @click="changeButtonClick(changeButtonArr[0])"
                                      :class="changeButtonArr[0].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                      class="changeButtonClickView flexColumnStart">
                                    <text>{{ changeButtonArr[0].text }}</text>
                                </view>

                                <view v-if="changeButtonArr[1].haveData" @click="changeButtonClick(changeButtonArr[1])"
                                      :class="changeButtonArr[1].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                      class="changeButtonClickView flexColumnStart">
                                    <text>{{ changeButtonArr[1].text }}</text>
                                </view>

                                <view v-if="changeButtonArr[2].haveData" @click="changeButtonClick(changeButtonArr[2])"
                                      :class="changeButtonArr[2].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                      class="changeButtonClickView flexColumnStart">
                                    <text>{{ changeButtonArr[2].text }}</text>
                                </view>

                                <view v-if="changeButtonArr[3].haveData" @click="changeButtonClick(changeButtonArr[3])"
                                      :class="changeButtonArr[3].index == currentClickTopBarIndex ? 'changeButtonClickViewActive': ''"
                                      class="changeButtonClickView flexColumnStart">
                                    <text>{{ changeButtonArr[3].text }}</text>
                                </view>
                            </block>
                        </view>
                    </view>
                </view>

                <!--筛选按钮-->
                <block v-if="currentClickTopBarEventName != 'initHomeData'">
                    <view class="compStoreChooseTabNoFixedView">
                        <view class="flexRowCenter compStoreChooseTabNoFixedContentView">
                            <block v-for="(item, index) in compStoreChooseTabConfig[currentClickTopBarEventName].content" :key="index">
                                <view @click="compStoreChooseTab(item, index)"
                                      :style="{borderRight: compStoreChooseTabConfig[currentClickTopBarEventName].content.length == index + 1 ?'none':'1px solid #e6e6e6' }"
                                      class="flexRowCenter compStoreChooseTabNoFixedInfoView">
                                    <view :style="{color: compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex == index || item.text !== item.moRenText ? '#ff5a1f':'#494949'}"
                                          class="compStoreChooseTabNoFixedInfoTextView">{{ item.text }}</view>

                                    <image class="compStoreChooseTabInfoImg"
                                           v-show="compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex == index"
                                           src="http://cdn.haofang.net/static/uuminiapp/new_images/down_ac_icon.png"></image>

                                    <image class="compStoreChooseTabInfoImg"
                                           v-show="compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex != index"
                                           src="http://cdn.haofang.net/static/uuminiapp/new_images/down.png"></image>
                                </view>
                            </block>
                        </view>
                    </view>
                </block>

                <!--首页内容渲染-->
                <view class="indexContentView"
                      :class="{'indexContentView_height': recommendListSort && recommendListSort.length > 0 && ((indexNewHouseList && indexNewHouseList.length == 0) && (indexErHouseList && indexErHouseList.length == 0) && (indexZuHouseList && indexZuHouseList.length == 0)),'phoneX-bottom': botTab.isIphoneX}"
                      v-show="currentClickTopBarIndex == 0">
                    <view class="compStoreIndexView" >
                        <!-- 头部 -->
                        <view v-if="compStoreInfo.agentInfo && compStoreInfo.agentInfo.archiveId"
                              class="flexColumnStart compStoreIndexYXAgentView">
                            <view class="flexRowSpaceBetween compStoreIndexAgentView">
                                <view class="flexRowStart compStoreIndexAgentViewTitleView">
                                    <view class="compStoreIndexLineRed flexColumnCenter"></view>
                                    <view class="compStoreIndexAgentTitle flexColumnCenter">优秀经纪人</view>
                                </view>
                            </view>

                            <view class="compStoreIndexAgentInfoView flexRowStart" @click="toBrokers">
                                <view class="compStoreIndexAgentHeaderImgView">
                                    <image class="compStoreIndexAgentHeaderImg"
                                           v-if="compStoreInfo.agentInfo.headerImg"
                                           :src="compStoreInfo.agentInfo.headerImg"></image>
                                </view>

                                <view class="flexColumnStart" style="width: 100%;">
                                    <view class="flexRowSpaceBetween compStoreIndexAgentInfoTopView">
                                        <view class="compStoreIndexAgentInfoTopLeftView">
                                            <view class="compStoreIndexAgentInfoName">{{ compStoreInfo.agentInfo.name }}</view>

                                            <view class="compStoreIndexAgentInfoStarView flexRowStart">
                                                <view class="compStoreIndexAgentInfoStarImgSrcView flexRowStart">
                                                    <block :key="index" v-for="(item, index) in compStoreInfo.agentInfo.starArr">
                                                        <image class="compStoreIndexAgentInfoStarImgSrc" :src="item"></image>
                                                    </block>
                                                </view>

                                                <view class="compStoreIndexAgentInfoStarNum">{{ compStoreInfo.agentInfo.starNum }}</view>
                                            </view>
                                        </view>
                                    </view>

                                    <view class="compStoreIndexAgentInfoService">服务区域: {{ compStoreInfo.agentInfo.serviceLocation }}</view>
                                </view>
                            </view>
                        </view>

                        <!--又要显示新房了-->
                        <view v-if="recommendListSort && recommendListSort.length > 0 && ((indexNewHouseList && indexNewHouseList.length > 0) || (indexErHouseList && indexErHouseList.length > 0) || (indexZuHouseList && indexZuHouseList.length > 0))"
                              class="compStoreIndexHouseListView">
                            <block v-for="(item, index_1) in recommendListSort" :key="index_1">
                                <block v-if="item == 'erHouse'">
                                    <block v-if="recommendInfo.erHouse.show && indexErHouseList && indexErHouseList.length > 0">
                                        <view class="flexRowSpaceBetween compStoreIndexAgentView">
                                            <view class="flexRowStart compStoreIndexAgentViewTitleView">
                                                <view class="compStoreIndexLineRed flexColumnCenter"></view>
                                                <view class="compStoreIndexAgentTitle flexColumnCenter">{{ recommendInfo.erHouse.text }}</view>
                                            </view>

                                            <view class="compStoreIndexMoreAgent" @click="lookMore(recommendInfo.erHouse.event)">
                                                更多
                                                <image class="" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/more_icon.png" mode="aspectFit|aspectFill|widthFix"/>
                                            </view>
                                        </view>

                                        <view class="compStoreIndexHouseContentView">
                                            <view style="height: 250upx;" v-if="!indexErHouseList || indexErHouseList.length == 0"></view>

                                            <block class="compStoreIndexHouseItemView flexRowStart"
                                                   v-for="(List, index) in indexErHouseList"
                                                   :key="index">
                                                <erHouseListItem :item="List"></erHouseListItem>
                                            </block>
                                        </view>

                                        <view class="compStoreIndexEnterOtherTab"
                                              @click="moreErHouse">进入二手房频道</view>
                                    </block>
                                </block>

                                <block v-if="item == 'newHouse' && (isProperty != 1 || compId == '279104' || compId == '56273')">
                                    <block v-if="recommendInfo.newHouse.show && indexNewHouseList && indexNewHouseList.length > 0">
                                        <view class="flexRowSpaceBetween compStoreIndexAgentView"
                                              :style="{marginTop:(indexErHouseList.length > 0 || indexZuHouseList.length > 0 ) ? '80rpx' : '0'}">
                                            <view class="flexRowStart compStoreIndexAgentViewTitleView">
                                                <view class="compStoreIndexLineRed flexColumnCenter"></view>
                                                <view class="compStoreIndexAgentTitle flexColumnCenter">{{ recommendInfo.newHouse.text }}</view>
                                            </view>

                                            <view class="compStoreIndexMoreAgent"
                                                  @click="lookMore(recommendInfo.newHouse.event)">
                                                更多
                                                <image class="" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/more_icon.png" mode="aspectFit|aspectFill|widthFix" lazy-load="false"/>
                                            </view>
                                        </view>

                                        <view class="compStoreIndexHouseContentView">
                                            <view style="height: 250upx;"
                                                  v-if="!indexNewHouseList || indexNewHouseList.length == 0"></view>
                                            <blcok class="compStoreIndexHouseItemView flexRowStart"
                                                   v-for="(item, index) in indexNewHouseList"
                                                   :key="index">
                                                <newHouseListItem :item="item"></newHouseListItem>
                                            </blcok>
                                        </view>

                                        <view class="compStoreIndexEnterOtherTab"
                                              @click="moreNewHouse">进入新房频道</view>
                                    </block>
                                </block>

                                <block v-if="item == 'zuHouse'">
                                    <block v-if="recommendInfo.zuHouse.show && indexZuHouseList && indexZuHouseList.length > 0">
                                        <view class="flexRowSpaceBetween compStoreIndexAgentView">
                                            <view class="flexRowStart compStoreIndexAgentViewTitleView">
                                                <view class="compStoreIndexLineRed flexColumnCenter"></view>
                                                <view class="compStoreIndexAgentTitle flexColumnCenter">{{ recommendInfo.zuHouse.text }}</view>
                                            </view>

                                            <view class="compStoreIndexMoreAgent" @click="lookMore(recommendInfo.zuHouse.event)">
                                                更多
                                                <image src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/more_icon.png" mode="aspectFit|aspectFill|widthFix" lazy-load="false"/>
                                            </view>
                                        </view>

                                        <view class="compStoreIndexHouseContentView">
                                            <view style="height: 250upx;"
                                                  v-if="!indexZuHouseList || indexZuHouseList.length == 0"></view>

                                            <block v-for="(item, index) in indexZuHouseList"
                                                   :key="index">
                                                <er-house-list-item :item="item"></er-house-list-item>
                                            </block>
                                        </view>

                                        <view class="compStoreIndexEnterOtherTab" @click="lookMore(recommendInfo.zuHouse.event)">
                                            进入租房频道</view>
                                    </block>
                                </block>
                            </block>
                        </view>

                        <view v-if="recommendListSort && recommendListSort.length > 0 && ((indexNewHouseList && indexNewHouseList.length == 0) && (indexErHouseList && indexErHouseList.length == 0) && (indexZuHouseList && indexZuHouseList.length == 0))" class="no_data_index">
                            <view class="sale_no_data" style="height:auto;top:100upx;">
                                <view class='noDataView'></view>
                            </view>
                        </view>
                    </view>
                </view>

                <!--二手房内容渲染-->
                <view :class="{'phoneX-bottom': botTab.isIphoneX}" class="indexContentView"
                      v-show="currentClickTopBarEventName == 'initErHouseData'">
                    <view class="compStoreErHouse">
                        <view class="compStoreIndexHouseContentView compStoreErHouseContentView">
                            <block v-if="erHouseList"
                                   v-for="(item, index) in (erHouseList)"
                                   :key="index">
                                <er-house-list-item :item="item"></er-house-list-item>
                            </block>

                            <view class="pullUp"
                                  v-if="compStoreInfo.erHouseData && compStoreInfo.erHouseData.isLoading"
                                  style="transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);">
                                <text class="pullUpIcon"></text>
                                <text class="pullUpLabel">努力加载中...</text>
                            </view>

                            <view class="no-more-data"
                                  v-if="compStoreInfo.erHouseData && compStoreInfo.erHouseData.isNoMoreData">
                                没有更多数据了！</view>

                            <view class="sale_no_data"
                                  v-if="compStoreInfo.erHouseData && compStoreInfo.erHouseData.noData">
                                <view class='no-pic'></view>
                            </view>
                        </view>
                    </view>
                </view>

                <!--新房渲染-->
                <view class="indexContentView" :class="{'phoneX-bottom' : botTab.isIphoneX}"
                      v-show="currentClickTopBarEventName == 'initNewHouseData'">
                    <view class="compStoreErHouse">
                        <view class="compStoreIndexHouseContentView compStoreErHouseContentView">
                            <block v-for="(item, index) in (newHouseList)"
                                   :key="index">
                                <new-house-list-item :item="item"></new-house-list-item>
                            </block>

                            <view class="pullUp"
                                  v-if="compStoreInfo.newHouseData && compStoreInfo.newHouseData.isLoading"
                                  style="transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);">
                                <text class="pullUpIcon"></text>
                                <text class="pullUpLabel">努力加载中...</text>
                            </view>

                            <view class="no-more-data"
                                  v-if="compStoreInfo.newHouseData && compStoreInfo.newHouseData.isNoMoreData">
                                没有更多数据了！</view>

                            <view class="sale_no_data"
                                  v-if="compStoreInfo.newHouseData && compStoreInfo.newHouseData.noData">
                                <view class='no-pic'></view>
                            </view>
                        </view>
                    </view>
                </view>

                <!--租房渲染-->
                <view :class="{'phoneX-bottom' : botTab.isIphoneX}" class="indexContentView"
                      v-show="currentClickTopBarEventName == 'initRentingHouseData'">
                    <view class="compStoreErHouse">
                        <view class="compStoreIndexHouseContentView compStoreErHouseContentView">
                            <block v-for="(item, index) in (zuHouseList)"
                                   :key="index">
                                <er-house-list-item :item="item"></er-house-list-item>
                            </block>

                            <view class="pullUp"
                                  v-if="compStoreInfo.rentingHouseData && compStoreInfo.rentingHouseData.isLoading"
                                  style="transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);">
                                <text class="pullUpIcon"></text>
                                <text class="pullUpLabel">努力加载中...</text>
                            </view>

                            <view class="no-more-data"
                                  v-if="compStoreInfo.rentingHouseData && compStoreInfo.rentingHouseData.isNoMoreData">
                                没有更多数据了！</view>
                        </view>

                        <view class="sale_no_data"
                              v-if="compStoreInfo.rentingHouseData && compStoreInfo.rentingHouseData.noData">
                            <view class='no-pic'></view>
                        </view>
                    </view>
                </view>

                <view class="compStoreTopEmptyView"></view>
            </view>

            <!--悬停-->
            <view class="topLine" :style="{background: linearGradientBg}"></view>
            <block v-if="isIosPhone">
                <view v-show="showFixed" class="FixedViewView"
                      :style="{zIndex: showFixed ? '99': '-5',opacity:showFixed ? '1': '0'}">
                    <image class="topBgImgSrcFixedView" :src="topBgImgSrc"></image>
                    <view style="height: 88upx;z-index: 99;" class="topBgMarkView"></view>
                    <view style="padding-top: 0;" :style="{background: linearGradientBg}"
                          class="topBgColorView"></view>
                </view>

                <view :style="{zIndex: showFixed ? '99': '-5',opacity: showFixed ? '1': '0'}"
                      class="FixedView" v-show="showFixed">
                    <view :style="{background: linearGradientBg}"
                          class="section-header showChangeFixedView flexRowStart changeButtonArrView">
                        <view v-if="changeButtonArr[0] && changeButtonArr[0].haveData"
                              @click="changeButtonClick(changeButtonArr[0])"
                              :class="{'changeButtonClickViewActive': changeButtonArr[0] && changeButtonArr[0].index == currentClickTopBarIndex}"
                              class="changeButtonClickView flexColumnStart">
                            <text>{{ changeButtonArr[0].text || "" }}</text>
                        </view>

                        <view v-f="changeButtonArr[1] && changeButtonArr[1].haveData"
                              @click="changeButtonClick(changeButtonArr[1])"
                              :class="{'changeButtonClickViewActive': changeButtonArr[1] && changeButtonArr[1].index == currentClickTopBarIndex}"
                              class="changeButtonClickView flexColumnStart">
                            <text>{{ changeButtonArr[1] ? changeButtonArr[1].text || "" : '' }}</text>
                        </view>

                        <view v-if="changeButtonArr[2] && changeButtonArr[2].haveData"
                              @click="changeButtonClick(changeButtonArr[2])"
                              :class="{'changeButtonClickViewActive': changeButtonArr[2].index == currentClickTopBarIndex}"
                              class="changeButtonClickView flexColumnStart">
                            <text>{{ changeButtonArr[2].text }}</text>
                        </view>

                        <view v-if="changeButtonArr[3] && changeButtonArr[3].haveData"
                              @click="changeButtonClick(changeButtonArr[3])"
                              :class="{'changeButtonClickViewActive': changeButtonArr[3].index == currentClickTopBarIndex}"
                              class="changeButtonClickView flexColumnStart">
                            <text>{{ changeButtonArr[3].text }}</text>
                        </view>
                    </view>

                    <view class="compStoreTopEmptyView"></view>

                    <block v-if="currentClickTopBarEventName != 'initHomeData'">
                        <view class="compStoreChooseTabNoFixedView">
                            <view class="flexRowCenter compStoreChooseTabNoFixedContentView">
                                <block v-for="(item, index) in compStoreChooseTabConfig[currentClickTopBarEventName].content" :key="index">
                                    <view @click="compStoreChooseTab(item, index)"
                                          :style="{borderRight: compStoreChooseTabConfig[currentClickTopBarEventName].content.length == index + 1 ?'none':'1px solid #e6e6e6' }"
                                          class="flexRowCenter compStoreChooseTabNoFixedInfoView">
                                        <view :style="{color: compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex == index || item.text !== item.moRenText ? '#ff5a1f':'#494949'}"
                                              class="compStoreChooseTabNoFixedInfoTextView">{{ item.text }}</view>

                                        <image class="compStoreChooseTabInfoImg"
                                               v-show="compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex == index"
                                               src="http://cdn.haofang.net/static/uuminiapp/new_images/down_ac_icon.png"></image>

                                        <image class="compStoreChooseTabInfoImg"
                                               v-show="compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex != index"
                                               src="http://cdn.haofang.net/static/uuminiapp/new_images/down.png"></image>
                                    </view>
                                </block>
                            </view>
                        </view>
                    </block>
                </view>
            </block>

            <view style="height: 80upx;"></view>

            <!--筛选fiexed-->
            <view @click="compStoreChooseTabTcMarkClick"
                  v-show="compStoreChooseTabTcShow"
                  @touchmove.stop.prevent="moveHandle"
                  class="compStoreChooseTabTcMarkView"></view>
            <view class="compStoreChooseTabTcView"
                  @touchmove.stop.prevent="moveHandle"
                  :style="{top: chooseTabCurrentTop + 'px'}"
                  @click="compStoreChooseTabTcMarkClick"
                  v-show="compStoreChooseTabTcShow">
                <view class="compStoreChooseTabTcContView">
                    <view class="flexRowCenter compStoreChooseTabNoFixedContentView">
                        <block v-for="(item, index) in compStoreChooseTabConfig[currentClickTopBarEventName].content" :key="index">
                            <view @click.stop="compStoreChooseTab(item, index)"
                                  :style="{borderRight: compStoreChooseTabConfig[currentClickTopBarEventName].content.length == index + 1 ?'none':'1px solid #e6e6e6' }"
                                  class="flexRowCenter compStoreChooseTabNoFixedInfoView">
                                <view :style="{color: compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex == index || item.text !== item.moRenText ? '#ff5a1f':'#494949'}"
                                      class="compStoreChooseTabNoFixedInfoTextView">{{ item.text }}</view>

                                <image class="compStoreChooseTabInfoImg"
                                       v-show="compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex == index"
                                       src="http://cdn.haofang.net/static/uuminiapp/new_images/down_ac_icon.png"></image>

                                <image class="compStoreChooseTabInfoImg"
                                       v-show="compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex != index"
                                       src="http://cdn.haofang.net/static/uuminiapp/new_images/down.png"></image>
                            </view>
                        </block>
                    </view>

                    <view class="compStoreChooseResultView"
                          v-if="compStoreChooseTabTcTemplateName">
                        <!--二手房区域-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseRegionTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChooseRegionTemplateView flexRowStart">
                            <block v-if='compStoreChooseListMap.compStoreChooseRegion.addLeftCurrentIndex != 1'>
                                <scroll-view
                                        scroll-y="true"
                                        :style="{height: screenHeight + 'px', width: '30%'}"
                                        @touchmove.stop.prevent="moveHandle"
                                        class="flexColumnStart compStoreChooseRegionTemplateLeftView">
                                    <view
                                            :key="index"
                                            v-for="(item, index) in compStoreChooseListMap.compStoreChooseRegion.leftArr"
                                            @click.stop="compStoreChooseRegionLeftClick(item, index)"
                                            :style="{backgroundColor: compStoreChooseListMap.compStoreChooseRegion.leftCurrentIndex == index ?'#ffffff':'#f4f4f4', color: compStoreChooseListMap.compStoreChooseRegion.leftCurrentIndex == index ? '#ff5a1f':'#66666'}"
                                            class="compStoreChooseRegionLeftText">{{ item.text }}</view>
                                </scroll-view>

                                <scroll-view
                                        scroll-y="true"
                                        :style="{height: screenHeight + 'px', width: '65%'}"
                                        @touchmove.stop.prevent="moveHandle"
                                        class="flexColumnStart compStoreChooseRegionTemplateRightView flexWidth1">
                                    <view
                                            :key="index"
                                            v-for="(item, index) in compStoreChooseListMap.compStoreChooseRegion.rightArrMap[compStoreChooseListMap.compStoreChooseRegion.leftCurrentCityId]"
                                            @click.stop="compStoreChooseRegionRightClick(item, index)"
                                            :style="{borderBottom: compStoreChooseListMap.compStoreChooseRegion.rightCurrentIndex == index ?'1px solid #ff5a1f':'1px solid #eee', color: compStoreChooseListMap.compStoreChooseRegion.rightCurrentIndex == index ? '#ff5a1f':'#66666'}"
                                            class="compStoreChooseRegionRightText">{{ item.text }}</view>
                                </scroll-view>
                            </block>
                        </view>

                        <!--二手房价格-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChoosePriceTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChoosePriceTemplateView flexColumnStart">
                                <view
                                        :key="index"
                                        v-for="(item, index) in compStoreChooseListMap.compStoreChoosePrice.content"
                                        @click.stop="compStoreChoosePriceClick(item, index)"
                                        :style="{borderBottom: compStoreChooseListMap.compStoreChoosePrice.currentIndex == index ?'1px solid #ff5a1f':'1px solid #eee',color: compStoreChooseListMap.compStoreChoosePrice.currentIndex == index ? '#ff5a1f':'#66666'}"
                                        class="compStoreChoosePriceTemplateViewText">{{ item.text }}</view>
                                <view class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>

                            <view class="flexRowSpaceBetween compStoreChoosePriceTemplateFixedView">
                                <view class="flexRowStart" @touchmove.stop.prevent="moveHandle" @click.stop="moveHandle">
                                    <input class="compStoreChoosePriceTemplateFixedViewInput"
                                           adjust-position="false"
                                           cursor="10"
                                           @blur="compStoreChoosePriceMinInput"
                                           :value="compStoreChooseListMap.compStoreChoosePrice.compStoreChoosePriceMinInputValue"
                                           type="number" placeholder="最小价格" />
                                    <view class="compStoreChoosePriceTemplateFixedViewInputLine flexRowCenter">
                                        -</view>
                                    <input class="compStoreChoosePriceTemplateFixedViewInput"
                                           adjust-position="false"
                                           cursor="10"
                                           @blur="compStoreChoosePriceMaxInput"
                                           :value="compStoreChooseListMap.compStoreChoosePrice.compStoreChoosePriceMaxInputValue"
                                           type="number" placeholder="最大价格" />
                                    <view class="compStoreChoosePriceTemplateFixedViewInputLabel">万元</view>
                                </view>

                                <view @click.stop="compStoreChoosePriceConfirm"
                                      class="compStoreChoosePriceTemplateFixedConfirmView">确定</view>
                            </view>
                        </view>

                        <!--二手房户型-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseHouseTypeTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChoosePriceTemplateView flexColumnStart">
                                <view
                                        :key="index"
                                        v-for="(item, index) in compStoreChooseListMap.compStoreChooseHouseType.content"
                                        @click.stop="compStoreChooseHouseTypeClick(item, index)"
                                        :style="{borderBottom: compStoreChooseListMap.compStoreChooseHouseType.currentIndex == index ?'1px solid #ff5a1f':'1px solid #eee', color: compStoreChooseListMap.compStoreChooseHouseType.currentIndex == index ? '#ff5a1f':'#66666'}"
                                        class="compStoreChoosePriceTemplateViewText">{{ item.text }}</view>
                                <view style="height: 30upx;line-height: 30upx;"
                                      class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>
                        </view>

                        <!--二手房更多-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseMoreTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChooseMoreTemplateView compStoreChoosePriceTemplateView flexColumnStart">
                                <view class="flexColumnStart compStoreChooseMoreTemplateListView">
                                    <view class="compStoreChooseMoreTemplateTitleView flexColumnCenter">
                                        面积(平米)</view>

                                    <view class="flexRowStart compStoreChooseMoreTemplateCheckView">
                                        <view
                                                :key="index"
                                                v-for="(item, index) in compStoreChooseListMap.compStoreChooseMore.areaList"
                                                @click.stop="compStoreChooseMoreAreaClick(item, index)"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseMore.areaValue == item.value ?'#ff5a1f':'#ffffff', color: compStoreChooseListMap.compStoreChooseMore.areaValue == item.value ? '#ffffff':'#6c6c6c',border: compStoreChooseListMap.compStoreChooseMore.areaValue == item.value ?'1px solid #ff5a1f':'1px solid #d6d6d6'}"
                                                class="compStoreChooseMoreTemplateViewText">{{ item.text }}</view>
                                    </view>
                                </view>

                                <view class="flexColumnStart compStoreChooseMoreTemplateListView">
                                    <view class="compStoreChooseMoreTemplateTitleView flexColumnCenter">
                                        类型</view>

                                    <view class="flexRowStart compStoreChooseMoreTemplateCheckView">
                                        <view
                                                :key="index"
                                                v-for="(item, index) in compStoreChooseListMap.compStoreChooseMore.usageList"
                                                @click.stop="compStoreChooseMoreUsageClick(item, index)"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseMore.usageValue == item.value ?'#ff5a1f':'#ffffff', color: compStoreChooseListMap.compStoreChooseMore.usageValue == item.value ? '#ffffff':'#6c6c6c', border: compStoreChooseListMap.compStoreChooseMore.usageValue == item.value ?'1px solid #ff5a1f':'1px solid #d6d6d6'}"
                                                class="compStoreChooseMoreTemplateViewText">{{ item.text }}</view>
                                    </view>
                                </view>


                                <view class="flexColumnStart compStoreChooseMoreTemplateListView">
                                    <view class="compStoreChooseMoreTemplateTitleView flexColumnCenter">
                                        特色</view>

                                    <view class="flexRowStart compStoreChooseMoreTemplateCheckView">
                                        <view
                                                :key="index"
                                                v-for="(item, index) in compStoreChooseListMap.compStoreChooseMore.specialList"
                                                @click.stop="compStoreChooseMoreSpecialClick(item, index)"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseMore.specialValue[0] == item.value || compStoreChooseListMap.compStoreChooseMore.specialValue[1] == item.value || compStoreChooseListMap.compStoreChooseMore.specialValue[2] == item.value ?'#ff5a1f':'#ffffff',color: compStoreChooseListMap.compStoreChooseMore.specialValue[0] == item.value || compStoreChooseListMap.compStoreChooseMore.specialValue[1] == item.value || compStoreChooseListMap.compStoreChooseMore.specialValue[2] == item.value ? '#ffffff':'#6c6c6c',border: compStoreChooseListMap.compStoreChooseMore.specialValue[0] == item.value || compStoreChooseListMap.compStoreChooseMore.specialValue[1] == item.value || compStoreChooseListMap.compStoreChooseMore.specialValue[2] == item.value ?'1px solid #ff5a1f':'1px solid #d6d6d6'}"
                                                class="compStoreChooseMoreTemplateViewText">{{ item.text }}</view>
                                    </view>
                                </view>

                                <view
                                        style="height: 140upx;line-height: 140upx;"
                                        class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>

                            <view
                                    @click.stop="moveHandle"
                                    class="flexRowSpaceBetween compStoreChooseMoreTemplateFixedView">
                                <view
                                        class="compStoreChooseMoreRevertClick"
                                        @click.stop="compStoreChooseMoreRevertClick">重置</view>
                                <view class="compStoreChooseMoreEmptyButton"></view>
                                <view
                                        class="compStoreChooseMoreConfirmClick"
                                        @click.stop="compStoreChooseMoreConfirmClick">确定</view>
                            </view>
                        </view>

                        <!--租房区域-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseRegionRentingHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChooseRegionTemplateView flexRowStart">
                            <block v-if='compStoreChooseListMap.compStoreChooseRegionRentingHouse.addLeftCurrentIndex != 1'>
                                <scroll-view
                                        scroll-y="true"
                                        :style="{height: screenHeight + 'px', width: '35%'}"
                                        @touchmove.stop.prevent="moveHandle"
                                        class="flexColumnStart compStoreChooseRegionTemplateLeftView">
                                    <block :key="index"
                                           v-for="(item, index) in compStoreChooseListMap.compStoreChooseRegionRentingHouse.leftArr">
                                        <view
                                                @click.stop="compStoreChooseRegionLeftClick(item, index)"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseRegionRentingHouse.leftCurrentIndex == index ?'#ffffff':'#f4f4f4', color: compStoreChooseListMap.compStoreChooseRegionRentingHouse.leftCurrentIndex == index ? '#ff5a1f':'#66666'}"
                                                class="compStoreChooseRegionLeftText">{{ item.text }}</view>
                                    </block>
                                </scroll-view>

                                <scroll-view
                                        scroll-y="true"
                                        :style="{height: screenHeight + 'px', width: '65%'}"
                                        @touchmove.stop.prevent="moveHandle"
                                        class="flexColumnStart compStoreChooseRegionTemplateRightView">
                                    <block :key="index"
                                           v-for="(item, index) in compStoreChooseListMap.compStoreChooseRegionRentingHouse.rightArrMap[compStoreChooseListMap.compStoreChooseRegionRentingHouse.leftCurrentCityId]">
                                        <view
                                                @click.stop="compStoreChooseRegionRightClick(item, index)"
                                                :style="{borderBottom: compStoreChooseListMap.compStoreChooseRegionRentingHouse.rightCurrentIndex == index ?'1px solid #ff5a1f':'1px solid #eee', color: compStoreChooseListMap.compStoreChooseRegionRentingHouse.rightCurrentIndex == index ? '#ff5a1f':'#66666'}"
                                                class="compStoreChooseRegionRightText">{{ item.text }}</view>
                                    </block>
                                </scroll-view>
                            </block>
                        </view>

                        <!--租房价格-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChoosePriceRentingHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChoosePriceTemplateView flexColumnStart">
                                <view
                                        :key="index"
                                        v-for="(item, index) in compStoreChooseListMap.compStoreChoosePriceRentingHouse.content"
                                        @click.stop="compStoreChoosePriceClick(item, index)"
                                        :style="{borderBottom: compStoreChooseListMap.compStoreChoosePriceRentingHouse.currentIndex == index ?'1px solid #ff5a1f':'1px solid #eee', color: compStoreChooseListMap.compStoreChoosePriceRentingHouse.currentIndex == index ? '#ff5a1f':'#66666'}"
                                        class="compStoreChoosePriceTemplateViewText">{{ item.text }}</view>
                                <view class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>

                            <view class="flexRowSpaceBetween compStoreChoosePriceTemplateFixedView">
                                <view class="flexRowStart" @click.stop="moveHandle">
                                    <input class="compStoreChoosePriceTemplateFixedViewInput"
                                           @blur="compStoreChoosePriceMinInput"
                                           :value="compStoreChooseListMap.compStoreChoosePriceRentingHouse.compStoreChoosePriceMinInputValue"
                                           type="number" placeholder="最小价格" />
                                    <view class="compStoreChoosePriceTemplateFixedViewInputLine flexRowCenter">
                                        -</view>
                                    <input class="compStoreChoosePriceTemplateFixedViewInput"
                                           @blur="compStoreChoosePriceMaxInput"
                                           :value="compStoreChooseListMap.compStoreChoosePriceRentingHouse.compStoreChoosePriceMaxInputValue"
                                           type="number" placeholder="最大价格" />
                                    <view class="compStoreChoosePriceTemplateFixedViewInputLabel">元</view>
                                </view>

                                <view
                                        @click.stop="compStoreChoosePriceConfirm"
                                        class="compStoreChoosePriceTemplateFixedConfirmView">确定</view>
                            </view>
                        </view>

                        <!--租房户型-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseHouseTypeRentingHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChoosePriceTemplateView flexColumnStart">
                                <view
                                        :key="index"
                                        v-for="(item, index) in compStoreChooseListMap.compStoreChooseHouseTypeRentingHouse.content"
                                        @click="compStoreChooseHouseTypeClick(item, index)"
                                        :style="{borderBottom: compStoreChooseListMap.compStoreChooseHouseTypeRentingHouse.currentIndex == index ?'1px solid #ff5a1f':'1px solid #eee',color: compStoreChooseListMap.compStoreChooseHouseTypeRentingHouse.currentIndex == index ? '#ff5a1f':'#66666'}"
                                        class="compStoreChoosePriceTemplateViewText">{{ item.text }}</view>
                                <view style="height: 30upx;line-height: 30upx;"
                                      class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>
                        </view>

                        <!--租房更多-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseMoreRentingHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChooseMoreTemplateView compStoreChoosePriceTemplateView flexColumnStart">
                                <view class="flexColumnStart compStoreChooseMoreTemplateListView">
                                    <view class="compStoreChooseMoreTemplateTitleView flexColumnCenter">
                                        面积(平米)</view>

                                    <view class="flexRowStart compStoreChooseMoreTemplateCheckView">
                                        <view
                                                :key="index"
                                                v-for="(item, index) in compStoreChooseListMap.compStoreChooseMoreRentingHouse.areaList"
                                                @click.stop="compStoreChooseMoreAreaClick(item, index)"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseMoreRentingHouse.areaValue == item.value ?'#ff5a1f':'#ffffff', color: compStoreChooseListMap.compStoreChooseMoreRentingHouse.areaValue == item.value ? '#ffffff':'#6c6c6c', border: compStoreChooseListMap.compStoreChooseMoreRentingHouse.areaValue == item.value ?'1px solid #ff5a1f':'1px solid #d6d6d6'}"
                                                class="compStoreChooseMoreTemplateViewText">{{ item.text }}</view>
                                    </view>
                                </view>

                                <view class="flexColumnStart compStoreChooseMoreTemplateListView">
                                    <view class="compStoreChooseMoreTemplateTitleView flexColumnCenter">
                                        类型</view>

                                    <view class="flexRowStart compStoreChooseMoreTemplateCheckView">
                                        <view
                                                :key="index"
                                                v-for="(item, index) in compStoreChooseListMap.compStoreChooseMoreRentingHouse.usageList"
                                                @click.stop="compStoreChooseMoreUsageClick(item, index)"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseMoreRentingHouse.usageValue == item.value ?'#ff5a1f':'#ffffff',color: compStoreChooseListMap.compStoreChooseMoreRentingHouse.usageValue == item.value ? '#ffffff':'#6c6c6c', border: compStoreChooseListMap.compStoreChooseMoreRentingHouse.usageValue == item.value ?'1px solid #ff5a1f':'1px solid #d6d6d6'}"
                                                class="compStoreChooseMoreTemplateViewText">{{ item.text }}</view>
                                    </view>
                                </view>

                                <view v-if=" compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialList && compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialList.length > 0"
                                      class="flexColumnStart compStoreChooseMoreTemplateListView">
                                    <view class="compStoreChooseMoreTemplateTitleView flexColumnCenter">
                                        特色</view>

                                    <view class="flexRowStart compStoreChooseMoreTemplateCheckView">
                                        <view
                                                :key="index"
                                                v-for="(item, index) in compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialList"
                                                @click.stop="compStoreChooseMoreSpecialClick"
                                                :style="{backgroundColor: compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[0] == item.value || compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[1] == item.value || compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[2] == item.value ?'#ff5a1f':'#ffffff',color: compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[0] == item.value || compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[1] == item.value || compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[2] == item.value ? '#ffffff':'#6c6c6c' ,border: compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[0] == item.value || compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[1] == item.value || compStoreChooseListMap.compStoreChooseMoreRentingHouse.specialValue[2] == item.value ?'1px solid #ff5a1f':'1px solid #d6d6d6'}"
                                                class="compStoreChooseMoreTemplateViewText">{{ item.text }}</view>
                                    </view>
                                </view>

                                <view
                                        style="height: 140upx;line-height: 140upx;"
                                        class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>

                            <view
                                    @click.stop="moveHandle"
                                    class="flexRowSpaceBetween compStoreChooseMoreTemplateFixedView">
                                <view
                                        class="compStoreChooseMoreRevertClick"
                                        @click.stop="compStoreChooseMoreRevertClick">重置</view>
                                <view class="compStoreChooseMoreEmptyButton"></view>
                                <view
                                        class="compStoreChooseMoreConfirmClick"
                                        @click.stop="compStoreChooseMoreConfirmClick">确定</view>
                            </view>
                        </view>

                        <!--新房区域-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseRegionNewHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChooseRegionTemplateView flexRowStart">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px',width: '35%'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="flexColumnStart compStoreChooseRegionTemplateLeftView">
                                <block :key="index"
                                       v-for="(item, index) in compStoreChooseListMap.compStoreChooseRegionNewHouse.leftArr">
                                    <view
                                            @click.stop="compStoreChooseRegionLeftClick(item, index)"
                                            :style="{backgroundColor: compStoreChooseListMap.compStoreChooseRegionNewHouse.leftCurrentIndex == index ?'#ffffff':'#f4f4f4', color: compStoreChooseListMap.compStoreChooseRegionNewHouse.leftCurrentIndex == index ? '#ff5a1f':'#66666'}"
                                            class="compStoreChooseRegionLeftText">{{ item.text }}</view>
                                </block>
                            </scroll-view>

                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px', width: '65%'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="flexColumnStart compStoreChooseRegionTemplateRightView">
                                <block :key="index"
                                       v-for="(item, index) in compStoreChooseListMap.compStoreChooseRegionNewHouse.rightArrMap[compStoreChooseListMap.compStoreChooseRegionNewHouse.leftCurrentCityId]">
                                    <view
                                            @click.stop="compStoreChooseRegionRightClick(item, index)"
                                            :style="{borderBottom: compStoreChooseListMap.compStoreChooseRegionNewHouse.rightCurrentIndex == index ?'1px solid #ff5a1f':'1px solid #eee',color: compStoreChooseListMap.compStoreChooseRegionNewHouse.rightCurrentIndex == index ? '#ff5a1f':'#66666'}"
                                            class="compStoreChooseRegionRightText">{{ item.text }}</view>
                                </block>
                            </scroll-view>
                        </view>

                        <!--新房价格-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChoosePriceNewHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChoosePriceTemplateView flexColumnStart">
                                <view
                                        :key="index"
                                        v-for="(item, index) in compStoreChooseListMap.compStoreChoosePriceNewHouse.content"
                                        @click="compStoreChoosePriceClick(item, index)"
                                        :style="{borderBottom: compStoreChooseListMap.compStoreChoosePriceNewHouse.currentIndex == index ?'1px solid #ff5a1f':'1px solid #eee',color: compStoreChooseListMap.compStoreChoosePriceNewHouse.currentIndex == index ? '#ff5a1f':'#66666'}"
                                        class="compStoreChoosePriceTemplateViewText">{{ item.text }}</view>
                                <view class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>

                            <view class="flexRowSpaceBetween compStoreChoosePriceTemplateFixedView">
                                <view class="flexRowStart" @click.stop="moveHandle">
                                    <input class="compStoreChoosePriceTemplateFixedViewInput"
                                           @blur="compStoreChoosePriceMinInput"
                                           :value="compStoreChooseListMap.compStoreChoosePriceNewHouse.compStoreChoosePriceMinInputValue"
                                           type="number" placeholder="最小价格" />
                                    <view class="compStoreChoosePriceTemplateFixedViewInputLine flexRowCenter">
                                        -</view>
                                    <input class="compStoreChoosePriceTemplateFixedViewInput"
                                           @blur="compStoreChoosePriceMaxInput"
                                           :value="compStoreChooseListMap.compStoreChoosePriceNewHouse.compStoreChoosePriceMaxInputValue"
                                           type="number" placeholder="最大价格" />
                                    <view class="compStoreChoosePriceTemplateFixedViewInputLabel">元</view>
                                </view>

                                <view @click.stop="compStoreChoosePriceConfirm"
                                      class="compStoreChoosePriceTemplateFixedConfirmView">确定</view>
                            </view>
                        </view>

                        <!--新房用途-->
                        <view v-if="compStoreChooseTabTcTemplateName == 'compStoreChooseUseNewHouseTemplate'"
                              @touchmove.stop.prevent="moveHandle"
                              class="compStoreChoosePriceTemplateContentView">
                            <scroll-view
                                    scroll-y="true"
                                    :style="{height: screenHeight + 'px'}"
                                    @touchmove.stop.prevent="moveHandle"
                                    class="compStoreChoosePriceTemplateView flexColumnStart">
                                <view
                                        :key="index"
                                        v-for="(item, index) in compStoreChooseListMap.compStoreChooseUseNewHouse.content"
                                        @click.stop="compStoreChooseUseNewHouseClick(item, index)"
                                        :style="{borderBottom: compStoreChooseListMap.compStoreChooseUseNewHouse.currentIndex == index ?'1px solid #ff5a1f':'1px solid #eee',color: compStoreChooseListMap.compStoreChooseUseNewHouse.currentIndex == index ? '#ff5a1f':'#66666'}"
                                        class="compStoreChoosePriceTemplateViewText">{{ item.text }}</view>
                                <view style="height: 30upx;line-height: 30upx;"
                                      class="compStoreChoosePriceTemplateViewTextEmpty"></view>
                            </scroll-view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!--授权-->
        <get-user-info></get-user-info>

        <!--底部按钮-->
        <bottomTab :isIphoneX="botTab.isIphoneX" :indexTab="botTab.indexTab" :im="botTab.im"></bottomTab>

        <!--加载中-->
        <view v-if="isInitIng || isInitIng == undefined" class="empty_loading"></view>

        <!-- 抢单优化- 未绑定号码的情况 弹窗优惠券弹窗，引导绑定号码，赠送优惠券 -->
        <giftCouponView ></giftCouponView>
    </view>
</template>

<script>
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import {
        CompStoreAdminCompIdModel,
        CompStoreAdminDeptIdModel,
        CompStoreAgentInfoModel,
        CompStoreArchiveIdModel,
        CompStoreCityIdModel,
        CompStoreComefromSourceModel,
        CompStoreCompBuildIdModel,
        CompStoreCompIdModel,
        CompStoreDeptIdModel,
        CompStoreEnterQueryModel, CompStoreFindDataAgentInfoModel,
        CompStoreIndexAgoArchiveIdModel,
        CompStoreIndexChooseDataResModel,
        CompStoreIndexChooseRegionNewHouseResModel,
        CompStoreIndexHomeDataResModel,
        CompStoreInfoModel,
        CompStoreIsCompStoreParamsModel,
        CompStoreIsOperationModel,
        CompStoreIsPropertyModel,
        CompStoreLeaveCompIndexModel,
        CompStoreParamsModel,
        CompStorePropertyInfoModel,
        CompStoreServiceRegModel, CompStoreUnReadMsgNumMapModel
    } from "../model/CompStoreModel";
    import giftCouponView from "@/components/giftCouponView.vue";
    import {ShareRecord} from "../utils/common";
    import { SaveCclientUserType} from "../../utils/common";
    import {Config} from "../../utils/config";
    import {
        GetCompNewBuildList,
        GetCompStoreHomeData,
        GetJinKeNewBuildList, GetNewBuildListCondition, GetSecondHouseListAction, InitLocalStorage,
        Jscode2Session4FlagShipStore, PushViewMsgStore,
        SaveUserConfig
    } from "../net/CompStoreNet";
    import {CompStoreIndexConfig, UpNavListInfo} from "../utils/CompStoreIndexConfig";
    import {RealTimeStatistics, StatisticsReport} from "../utils/StatisticsReport";
    import {GetStarList,ShareVisiting} from "../../utils/common";
    import { CheckHousePrice } from "../utils/CheckHousePrice";
    import {UserInfoModel} from "../../model/UserInfoModel";
    import erHouseListItem from "@/components/erHouseListItem.vue"
    import newHouseListItem from "@/components/newHouseListItem.vue"
    import {ErHouseListItem, NewHouseListItem} from "../../utils/Const";
    import { Const } from "../../utils/Const";
    import bottomTab from "@/pagesStore/components/compStore/bottomTab.vue";
    import {UnReadMsgModel} from "../../model/im/UnReadMsgModel";
    import { behavi } from '../utils/newBehaviorTool';
    const Behavi = new behavi();
    let privateData = {
        privateQuery: {}
        ,archiveId: '' //11
        , compId: ''  //12001
        , cityId: '' //1
        , adminDeptId: ''
        , adminCompId: ''
        ,listImgParams: "?x-oss-process=image/resize,m_fill,h_120,w_180"
        , alyParams: "?x-oss-process=image/resize,m_fill,h_90,w_90"
        , chooseRegionIsReady: false
        , initDataIsReady: false
        , initDataTimeout: null

        , shareConfig: {
            imageUrl:'http://cdn.haofang.net/static/uuminiapp/flagship/index/flagShipShareDefault.jpg'
        }  // 分享配置


        , sectionTitleTop: 0
        , sectionTitleFixed: false
        , sectionFixed: false
        , compStoreTopEmptyViewHeight: 0
        , sectionHeaderLocationHeight: 0

        , agentMoRenHeaderImg: "http://cd.haofang.net/Public/newPC/images/default/head/90x90.png"
        , topBgImgSrc: "http://cdn.haofang.net/static/uuminiapp/compStore/banner_demo.jpg"
        , moRenLogoImgSrc: "http://cdn.haofang.net/static/uuminiapp/compStore/comp_logo_demo.png"
        , starGrayImgSrc: "http://cdn.haofang.net/static/uuminiapp/compStore/star_empty.png"
        , starHalfImgSrc: "http://cdn.haofang.net/static/uuminiapp/compStore/star_half.png"
        , starFullImgSrc: "http://cdn.haofang.net/static/uuminiapp/compStore/star_full.png"

        , erHouseApiParamsMoRen: {
            pageNum: 1
            , cityId: "null"
            , caseType: 1
            , fromSource: 3
            , pageSize: 10
            , compId: "null"
        }
        , newHouseApiParamsMoRen: {
            archiveId: "null"
            , brokerCityId: "null"
            , isWeiStore: 1
            , pageRows: 10
            , pageOffset: 1
        }
        , rentingHouseApiParamsMoRen: {
            pageNum: 1
            , cityId: "null"
            , caseType: 2
            , fromSource: 3
            , pageSize: 10
            , compId: "null"
        }

        , erHouseApiParams: {
            pageNum: 1
            , cityId: "null"
            , caseType: 1
            , fromSource: 3
            , pageSize: 10
            , compId: "null"
        }
        , newHouseApiParams: {
            archiveId: "null"
            , brokerCityId: "null"
            , isWeiStore: 1
            , pageRows: 10
            , pageOffset: 1
        }
        , rentingHouseApiParams: {
            pageNum: 1
            , cityId: "null"
            , caseType: 2
            , fromSource: 3
            , pageSize: 10
            , compId: "null"
        }

        , changeButtonEventMap: new Map([
            [0, "getMoreHomeData"] // 首页
            , [1, "getMoreErHouseData"]  //二手房
            , [2, "getMoreNewHouseData"]  //新房
            , [3, "getMoreRentingHouseData"]  //租房
        ])

        , dealApiParamsEventMap: new Map([
            ["initHomeData", "dealHomeApiParams"] // 首页
            , ["initErHouseData", "dealErHouseApiParams"]  //二手房
            , ["initNewHouseData", "dealNewHouseApiParams"]  //新房
            , ["initRentingHouseData", "dealRentingHouseApiParams"]  //租房
        ])

        , noFixedChooseTcInfo: {
            chooseTabCurrentTop: 0
            , screenHeight: 300
        }
        , fixedChooseTcInfo: {
            chooseTabCurrentTop: 0
            , screenHeight: 300
        }

        , haveIndexBg: false
        , haveName: false
        , haveLogo: false,
        deptId: '',	//门店Id
        isClickStatus: false, // 是否在点击状态
        isScanEnter: false
    };

    export default {
        components: {
          giftCouponView,
            erHouseListItem,
            newHouseListItem,
            bottomTab
        },

        data() {
            return {
                sourceTypeId: 2101, // 数据采集 - lh
                brokerInfo: {},
                erHouseList: null,
                newHouseList: null,
                zuHouseList: null,
                isInitIng: true,   // 是否是在初始化中
                isIosSystem: false, // 是否是ios

                // 顶部背景配置
                topBgImgSrc: "http://cdn.haofang.net/static/uuminiapp/compStore/banner_demo.jpg",
                topBgSrc: "",
                linearGradientBg: "linear-gradient(rgba(49,85,145,1),rgba(49,85,145,0))",

                // 门店信息配置
                titleInfo: {
                    logoImgSrc: ""
                    , name: " "
                    , houseCnt: " "
                    , agentCnt: " "
                },

                // 底部菜单切换
                botTab:{
                    isIphoneX: null,
                    indexTab: 2,
                    myinfo:{url:'/pagesStore/mine/mine'},
                    compshop:{url:'/pagesStore/compStore/compStore'},
                    im:{url: "/pages/message/message", show: false, unReadMsgNum: 0}
                },

                recommendInfo: {
                    erHouse: {
                        show: true, //  动态修改
                        text: "推荐二手房", //  动态修改
                        event: "moreErHouse", // 恒定不变
                        listKey: "indexErHouseList",  // 恒定不变
                        index: 1  // 动态修改根据recommendListSort中的位置+1
                    },
                    newHouse: {
                        show: true, //  动态修改
                        text: "推荐新房", //  动态修改
                        event: "moreNewHouse", // 恒定不变
                        listKey: "indexNewHouseList", // 恒定不变
                        index: 2 // 动态修改根据recommendListSort中的位置+1
                    },
                    zuHouse: {
                        show: true,  //  动态修改
                        text: "推荐租房", //  动态修改
                        event: "moreZuHouse", // 恒定不变
                        listKey: "indexZuHouseList", // 恒定不变
                        index: 3 // 动态修改根据recommendListSort中的位置+1
                    }
                },

                getColorFinish: true

                , haveNewHouse: false
                , changeButtonArr: [
                    { text: "首页", event: "initHomeData", behavi: "", index: 0, haveData: true }
                ]

                , changeTemplateName: "compStoreIndex"  // 模板名称
                , compStoreInfo: {}
                // 模板信息
                // key: indexData 首页 ，newHouseData 新房, erHouseData 二手房, rentingHouseData 租房

                , indexNewHouseList: null
                , indexErHouseList: null
                , indexZuHouseList: null

                , showFixed: false
                , scrollTop: 0
                , sectionHeaderLocationTop: 0
                , screenHeight: 300
                , chooseTabCurrentTop: 0
                , chooseTabCurrentDataTop: 0

                , isIosPhone: false

                , bottomButtonConfig: {
                    currentClickIndex: 0
                    , textColor: "#BBBBBB"
                    , activeTextColor: "#ff5a1f"
                    , fontSize: "22upx"
                    , backgroundColor: "#ffffff"
                    , content: [
                        {
                            text: "房源"
                            , url: "http://cdn.haofang.net/static/uuminiapp/compStore/tab_comp_gray.png"
                            , active_url: "http://cdn.haofang.net/static/uuminiapp/compStore/tab_comp.png?t=111"
                            , pageTo: ""
                            , style: {
                                width: "40upx"
                                , height: "40upx"
                            }
                        }
                        , {
                            text: "我的"
                            , url: "http://cdn.haofang.net/static/uuminiapp/compStore/tab_mine_gray.png"
                            , active_url: "http://cdn.haofang.net/static/uuminiapp/compStore/tab_mine.png?t=111"
                            , pageTo: ""
                            , style: {
                                width: "40upx"
                                , height: "40upx"
                            }
                        }
                    ]
                }

                , currentClickTopBarIndex: 0
                , currentClickTopBarEventName: "initHomeData"
                , compStoreChooseTabConfig: {
                    "initHomeData": {
                        currentClickIndex: -1
                            , content: []
                    }
                    , "initErHouseData": {
                            currentClickIndex: -1
                                , content: [
                                {
                                    text: "区域", moRenText: "区域"
                                    , leftValue: "", rightValue: ""
                                    , leftApiKey: "regionId"
                                    , rightApiKey: "sectionId"
                                    , buildIdApiKey: "buildId"
                                    , value: "", event: "compStoreChooseRegion"
                                }
                                , {
                                    text: "价格", moRenText: "价格"
                                    , apiKey: "price"
                                    , value: "", event: "compStoreChoosePrice"
                                }
                                , {
                                    text: "户型", moRenText: "户型"
                                    , apiKey: "room"
                                    , value: "", event: "compStoreChooseHouseType"
                                }
                                , {
                                    text: "更多", moRenText: "更多"
                                    , areaValue: "", usageValue: ""
                                    , specialValue: ""
                                    , areaApiKey: "area", houseTypeApiKey: "houseUseage"
                                    , specialApiKey: "tagId"
                                    , value: "", event: "compStoreChooseMore"
                                }
                            ]
                        }
                    , "initNewHouseData": {
                            currentClickIndex: -1
                                , content: [
                                {
                                    text: "区域", moRenText: "区域"
                                    , leftValue: "", rightValue: ""
                                    , leftApiKey: "regionId"
                                    , rightApiKey: "sectionId"
                                    , value: "", event: "compStoreChooseRegionNewHouse"
                                }
                                , {
                                    text: "价格", moRenText: "价格"
                                    , apiKey: "price"
                                    , value: "", event: "compStoreChoosePriceNewHouse"
                                }
                                , {
                                    text: "用途", moRenText: "用途"
                                    , apiKey: "houseUsage"
                                    , value: "", event: "compStoreChooseUseNewHouse"
                                }
                            ]
                        }
                    , "initRentingHouseData": {
                            currentClickIndex: -1
                                , content: [
                                {
                                    text: "区域", moRenText: "区域"
                                    , leftValue: "", rightValue: ""
                                    , leftApiKey: "regionId"
                                    , rightApiKey: "sectionId"
                                    , buildIdApiKey: "buildId"
                                    , value: "", event: "compStoreChooseRegionRentingHouse"
                                }
                                , {
                                    text: "价格", moRenText: "价格"
                                    , apiKey: "price"
                                    , value: "", event: "compStoreChoosePriceRentingHouse"
                                }
                                , {
                                    text: "户型", moRenText: "户型"
                                    , apiKey: "room"
                                    , value: "", event: "compStoreChooseHouseTypeRentingHouse"
                                }
                                , {
                                    text: "更多", moRenText: "更多"
                                    , areaValue: "", usageValue: ""
                                    , specialValue: ""
                                    , areaApiKey: "area", houseTypeApiKey: "houseUseage"
                                    , specialApiKey: "tagId"
                                    , value: "", event: "compStoreChooseMoreRentingHouse"
                                }
                            ]
                        }
                }
                , compStoreChooseTabConfigListMap: {
                    "initHomeData": {}
                    , "initErHouseData": {
                            "region": "compStoreChooseRegion"
                                , "price": "compStoreChoosePrice"
                                , "houseType": "compStoreChooseHouseType"
                                , "more": "compStoreChooseMore"
                        }
                    , "initNewHouseData": {
                            "region": "compStoreChooseRegionNewHouse"
                                , "price": "compStoreChoosePriceNewHouse"
                                , "use": "compStoreChooseUseNewHouse"
                        }
                    , "initRentingHouseData": {
                            "region": "compStoreChooseRegionRentingHouse"
                                , "price": "compStoreChoosePriceRentingHouse"
                                , "houseType": "compStoreChooseHouseTypeRentingHouse"
                                , "more": "compStoreChooseMoreRentingHouse"
                        }
                }
                , compStoreChooseTabTcShow: false
                , compStoreChooseTabTcTemplateName: ""
                , compStoreChooseListMap: {
                // 二手房筛选
                compStoreChooseRegion: {
                    leftCurrentIndex: 0
                        , rightCurrentIndex: 0
                        , leftCurrentCityId: ""
                        , leftArr: []
                        , rightArrMap: {}
                    //新增楼盘选择（物业版）2019-06-04
                , buildId: ""
                        , addLeftCurrentIndex: 0
                        , addLeftArr: [
                        {text:'区域',value:'0'},
                        {text:'楼盘',value:'1'},
                    ]
                        , addRightCurrentIndex: -1 //物业版公司楼盘
                        , addRightArr: []
                }
            , compStoreChoosePrice: {
                    currentIndex: 0
                        , compStoreChoosePriceMinInputValue: ""
                        , compStoreChoosePriceMaxInputValue: ""
                        , content: []
                }
            , compStoreChooseHouseType: {
                    currentIndex: 0
                        , content: [
                        { text: '不限', value: '' }
                        , { text: '1室', value: '1:1' }
                        , { text: '2室', value: '2:2' }
                        , { text: '3室', value: '3:3' }
                        , { text: '4室', value: '4:4' }
                        , { text: '5室', value: '5:5' }
                        , { text: '5室以上', value: '5:100' }
                    ]
                }
            , compStoreChooseMore: {
                    areaList: [
                        { text: '50以下', value: '0:50' }
                        , { text: '50-70', value: '50:70' }
                        , { text: '70-90', value: '70:90' }
                        , { text: '90-110', value: '90:110' }
                        , { text: '110以上', value: '110:999' }
                    ]
                        , usageList: [
                        { text: '住宅', value: 1 }
                        , { text: '别墅', value: 2 }
                        , { text: '商铺', value: 3 }
                        , { text: '写字楼', value: 4 }
                        , { text: '其他', value: 8 }
                    ]
                        , specialList: [
                        { text: '两证齐全', value: 1 }
                        , { text: '满两年', value: 2 }
                        , { text: '免税', value: 3 }
                        , { text: '急售', value: 4 }
                        , { text: '顶楼花园', value: 7 }
                        , { text: '底楼花园', value: 8 }
                        , { text: '带车位', value: 64 }
                        , { text: '地下室', value: 96 }
                    ]

                        , areaValue: ""
                        , usageValue: ""
                        , specialValue: []

                        , areaText: ""
                        , usageText: ""
                        , specialText: []
                }

                // 新方筛选
            , compStoreChooseRegionNewHouse: {
                    leftCurrentIndex: 0
                        , rightCurrentIndex: 0
                        , leftCurrentCityId: ""
                        , leftArr: []
                        , rightArrMap: {}
                }
            , compStoreChoosePriceNewHouse: {
                    currentIndex: 0
                        , compStoreChoosePriceMinInputValue: ""
                        , compStoreChoosePriceMaxInputValue: ""
                        , content: []
                }
            , compStoreChooseUseNewHouse: {
                    currentIndex: 0
                        , content: [
                        { text: '不限', value: '' }
                        , { text: '住宅', value: '1' }
                        , { text: '别墅', value: '2' }
                        , { text: '商铺', value: '3' }
                        , { text: '写字楼', value: '4' }
                    ]
                }

                // 租房
            , compStoreChooseRegionRentingHouse: {
                    leftCurrentIndex: 0
                        , rightCurrentIndex: 0
                        , leftCurrentCityId: ""
                        , leftArr: []
                        , rightArrMap: {}
                    //新增楼盘选择（物业版）2019-06-04
                , buildId: ""
                        , addLeftCurrentIndex: 0
                        , addLeftArr: [
                        {text:'区域',value:'0'},
                        {text:'楼盘',value:'1'},
                    ]
                        , addRightCurrentIndex: -1 //物业版公司楼盘
                        , addRightArr: []
                }
            , compStoreChoosePriceRentingHouse: {
                    currentIndex: 0
                        , compStoreChoosePriceMinInputValue: ""
                        , compStoreChoosePriceMaxInputValue: ""
                        , content: []
                }
            , compStoreChooseHouseTypeRentingHouse: {
                    currentIndex: 0
                        , content: [
                        { text: '不限', value: '' }
                        , { text: '1室', value: '1:1' }
                        , { text: '2室', value: '2:2' }
                        , { text: '3室', value: '3:3' }
                        , { text: '4室', value: '4:4' }
                        , { text: '5室', value: '5:5' }
                        , { text: '5室以上', value: '5:100' }
                    ]
                }
            , compStoreChooseMoreRentingHouse: {
                    areaList: [
                        { text: '50以下', value: '0:50' }
                        , { text: '50-70', value: '50:70' }
                        , { text: '70-90', value: '70:90' }
                        , { text: '90-110', value: '90:110' }
                        , { text: '110以上', value: '110:999' }
                    ]
                        , usageList: [
                        { text: '住宅', value: 1 }
                        , { text: '别墅', value: 2 }
                        , { text: '商铺', value: 3 }
                        , { text: '写字楼', value: 4 }
                        , { text: '其他', value: 8 }
                    ]

                        , areaValue: ""
                        , usageValue: ""

                        , areaText: ""
                        , usageText: ""
                }
            },

                // 推荐列表排序
                recommendListSort: null,
                isFirstEnter: true,

                // 关于用户行为埋点
                userInfo: {},
                archiveId: 11,
                fromSource: 3, //查询来源: 3公司微店  这里不要轻易修改 涉及到行为统计在用，修改请跟雷文军确认下
                archiveInfo: {
                    CITY_ID: 0
                },
                //旗舰店物业版新增判断参数
                isProperty:'',  //
                propertyInfo: '', //
                //扫码等首页来源 ： 用来区分多种不同扫码的进入旗舰店的情况
                comefromSource:'',
                compId: "",
            }
        },

        onLoad(query = {}) {
            this.isInitIng = true;
            this.userInfo = new UserInfoModel().getModel("userInfo")
                ? new UserInfoModel().getModel("userInfo").userInfo || {} : {};

            // 监听用户信息事件
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
            // 监听授权事件
            new Notification().addObserver(this, "AuthonChanged", Notify.AuthonChanged.Name);
            // 筛选回调
            new Notification().addObserver(this, "onCompStoreChooseChanged", Notify.CompStoreChooseChanged.Name);
            new Notification().addObserver(this, "onCompStoreChooseResultParamsChanged", Notify.CompStoreChooseResultParamsChanged.Name);

            const systemInfo = uni.getSystemInfoSync();
            let isIosSystem = false;
            if(systemInfo.system && (systemInfo.system.indexOf("iOS") >= 0
                || systemInfo.system.indexOf("ios") >= 0)) {
                isIosSystem = true;
            }
            this.isIosSystem = isIosSystem;
            //预处理二维码场景值带来的参数
            let scene = query.scene;
            //二维码进入 旗舰店 scene=14&12001&1 ; archiveId compId cityId
            if (scene) {
                // 采集数据 - lh
                uni.setStorageSync('imSourceTypeId', 3102);
                this.sourceTypeId = 2102;

                let sceneArr = decodeURIComponent(scene).split('&');
                if (sceneArr.length >= 3) {
                    //普通的小程序生成码带的是 erp库的 compId
                    query.archiveId = sceneArr[0];
                    query.compId = sceneArr[1];
                    query.erpCompId = sceneArr[1];
                    query.cityId = sceneArr[2];
                    query.comefromSource = 'common';
                }
            }else {
                // 采集数据 - lh
                uni.setStorageSync('imSourceTypeId', 3101);
                this.sourceTypeId = 2101;
                            
                //非二维码进入情况（掌通分享，二次分享）
                //注意掌通分享上的 链接上的 deptId 和 compId 特指 admin的
                if (!query.adminCompId && !!query.compId && !!query.deptId) {
                    query.adminCompId = query.compId;
                    query.compId = ''
                }
                if (!query.adminDeptId && !!query.deptId) {
                    query.adminDeptId = query.deptId;
                    query.deptId = ''
                }
                //用户进入详情页 ERP 统计埋点
                new ShareRecord({
                    archiveId: query.archiveId || "",
                    source: 1, // 1:掌通微店分享
                    classType: 4 // 4 = 一、进入 最新优选好房小程序 - 旗舰店;
                });
            }

            //用 query中是否有 cityId 判断是否传了 query参数 （因为默认cityId是 必传项）
            if (!query.cityId) {
                // 如果访问没有带参数 （各种返回首页处理，那参数从缓存中取）
                query.deptId = new CompStoreDeptIdModel().getModel() || "";
                query.compId = new CompStoreCompIdModel().getModel() || "";
                query.cityId = new CompStoreCityIdModel().getModel() || "";
                query.archiveId = new CompStoreArchiveIdModel().getModel() || "";
                query.adminDeptId = new CompStoreAdminDeptIdModel().getModel() || "";
                query.adminCompId = new CompStoreAdminCompIdModel().getModel() || "";
                query.comefromSource = new CompStoreComefromSourceModel().getModel() || "common";
            } else {
                //通过二维码,掌通分享，二次分享 等带有参数 进入的情况，先清除原先的部分数据缓存
                new CompStoreDeptIdModel().removeModel();
                new CompStoreCompIdModel().removeModel();
                new CompStoreCityIdModel().removeModel();
                new CompStoreArchiveIdModel().removeModel();
                new CompStoreAdminDeptIdModel().removeModel();
                new CompStoreAdminCompIdModel().removeModel();
                new CompStoreComefromSourceModel().removeModel();
                query.comefromSource = query.comefromSource
                    ? query.comefromSource
                    : 'common'; //设置通用的默认来源
            }

            // 如果有经纪人则设置一下缓存
            if(query.archiveId) {
                new CompStoreArchiveIdModel().setModel(query.archiveId);
            }

            // 将进入的参数缓存, 方便后期使用
            new CompStoreEnterQueryModel().setModel(query);

            this.saveParams(query)
                .then(config => {
                    if(config.cityId) {
                        new CompStoreCityIdModel().setModel(config.cityId);
                    }
                    this.initPageParameter(config);
                    this.initDataFromLocal();
                    this.initData()
                        .then(res => {
                            // 设置用户信息
                            // 统计用户访问次数
                            let me = new UserInfoModel().getModel("me") || {};
                            let wxNickname = this.userInfo.nickName;
                            let archiveId = new CompStoreArchiveIdModel().getModel();
                            let cityid = new CompStoreCityIdModel().getModel();
                            let userId = me.userId || "";
                            let pasme = {
                                index: '',
                                text: [wxNickname],
                                params: {
                                    archiveId: archiveId,
                                    cityid: cityid,
                                    caseType: '',
                                    userId: userId,
                                    flagshipStore: 1
                                }
                            };
                            if (wxNickname && (!new CompStoreLeaveCompIndexModel().getModel()
                                || new CompStoreLeaveCompIndexModel().getModel() != 1)) {
                                Behavi.getInStoreCount(pasme);
                            }
                        });
                    this.initOtherChooseData();
                })
                .catch(config => {
                    console.warn("--saveParams--",config);
                    if (config === "noConfig") {
                        uni.hideLoading();
                        setTimeout(() => {
                            uni.reLaunch({
                                url: "/pages/index/index"
                            });
                        }, 1000);
                        return;
                    }

                    this.initPageParameter(config);

                    this.initData();
                });
        },

        onShow() {
            this.upBottomButtonArr();

            if(this.botTab.im.show) {
                // 处理im条数
                this.initUnReadMsgNum();
            }
        },

        onReady() {
            let that = this;
            that.upTitleInfo();
            let getSystemInfoSync = uni.getSystemInfoSync() || {};
            let screenHeight = getSystemInfoSync.screenHeight
                ? getSystemInfoSync.screenHeight * 0.55 : 300;
            let screenFixedHeight = getSystemInfoSync.screenHeight
                ? getSystemInfoSync.screenHeight * 0.55 : 300;
            that.setData({
                isIosPhone: false
            });
            let query = uni.createSelectorQuery();
            query.select(".section-header").boundingClientRect(function (res) {
                if(!res) return;

                let chooseTabCurrentTop = res.top ? res.top + res.height : 0;
                let maxChooseTabTcHeight = getSystemInfoSync.screenHeight - chooseTabCurrentTop;
                if (maxChooseTabTcHeight <= screenHeight) {
                    screenHeight = maxChooseTabTcHeight;
                }

                privateData.sectionHeaderLocationHeight = res.height;
                privateData.noFixedChooseTcInfo = {
                    chooseTabCurrentTop: chooseTabCurrentTop
                    , screenHeight: screenHeight
                };
                privateData.fixedChooseTcInfo = {
                    chooseTabCurrentTop: res.height
                    , screenHeight: screenFixedHeight
                };
                that.setData({
                    sectionHeaderLocationTop: res.top + that.scrollTop
                    , chooseTabCurrentTop: chooseTabCurrentTop
                    , screenHeight: screenHeight
                });
            }).exec();
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        onPageScroll(e) {
            let that = this;
            if (!privateData.sectionFixed) {
                privateData.chooseTabCurrentDataTop = privateData.noFixedChooseTcInfo.chooseTabCurrentTop
                    - e.scrollTop + privateData.compStoreTopEmptyViewHeight;
            }
            do {
                if (e.scrollTop > this.sectionHeaderLocationTop && !this.showFixed) {
                    this.setData({
                        showFixed: true
                    });
                    break;
                }

                if (e.scrollTop <= this.sectionHeaderLocationTop && this.showFixed) {
                    this.setData({
                        showFixed: false
                    });
                }
            } while (false);

            do {
                if (e.scrollTop > privateData.noFixedChooseTcInfo.chooseTabCurrentTop && !privateData.sectionFixed) {
                    privateData.sectionFixed = true;
                    this.setData({
                        screenHeight: privateData.fixedChooseTcInfo.screenHeight
                        , chooseTabCurrentTop: 0
                        // ,chooseTabCurrentTop: that.private.fixedChooseTcInfo.chooseTabCurrentTop
                    });
                    break;
                }

                if (e.scrollTop <= privateData.noFixedChooseTcInfo.chooseTabCurrentTop && privateData.sectionFixed) {
                    privateData.sectionFixed = false;
                    this.setData({
                        screenHeight: privateData.noFixedChooseTcInfo.screenHeight
                    });
                }
            } while (false);

            do {
                if (e.scrollTop > privateData.sectionTitleTop && !privateData.sectionTitleFixed) {
                    privateData.sectionTitleFixed = true;
                    uni.setNavigationBarTitle({ title: this.titleInfo.name });
                    break;
                }

                if (e.scrollTop <= privateData.sectionTitleTop && privateData.sectionTitleFixed) {
                    privateData.sectionTitleFixed = false;
                    uni.setNavigationBarTitle({ title: "" });
                }
            } while (false);
        },

        onReachBottom: function (e) {
            if (privateData.isClickStatus) return;

            this.changeButtonMapEvent();
        },

        onHide() {
            new CompStoreLeaveCompIndexModel().setModel(1);
        },

        onShareAppMessage() {
            //分享区分物业和普通旗舰店
            let shareInfo = privateData.shareConfig;
            //分享路径
            let shareObj = {
                archiveId: new CompStoreArchiveIdModel().getModel() || "",
                compId: new CompStoreCompIdModel().getModel() || "",
                cityId: new CompStoreCityIdModel().getModel() || "",
                deptId: new CompStoreDeptIdModel().getModel() || "",
            };
            shareInfo['path'] = "/pagesStore/compStore/compStore?archiveId="
                + shareObj.archiveId + "&compId=" + shareObj.compId
                + "&cityId=" + shareObj.cityId + "&deptId=" + shareObj.deptId;

            return {
                title: shareInfo.title,
                path: shareInfo.path,
                imageUrl: shareInfo.imageUrl, //分享图片路径
            }
        },

        methods: {
            // 用户信息变化回调
            UserInfoChanged() {
                // this.initData();
                this.userInfo = new UserInfoModel().getModel("userInfo")
                    ? new UserInfoModel().getModel("userInfo").userInfo || {} : {};
            },

            // 授权回调
            AuthonChanged() {
                var that = this;
                if (new UserInfoModel().getModel("userInfo")
                    && new UserInfoModel().getModel("userInfo").userInfo
                    && that.userInfo
                    && Object.keys(that.userInfo).length > 0) {
                    return;
                }

                let userId = new UserInfoModel().getModel("me")
                    ? new UserInfoModel().getModel("me").userId || "" : "";
                let userInfo = new UserInfoModel().getModel("userInfo")
                    ? new UserInfoModel().getModel("userInfo").userInfo || {} : {};
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let cityid = privateData.newHouseApiParams.brokerCityId;
                let pasme = {
                    index: '55',
                    text: [(userInfo.nickName || "")],
                    params: { archiveId: archiveId, cityid: cityid, caseType: '' }
                };
                // 统计用户访问次数
                let pasmeInStore = {
                    index: '',
                    text: [(userInfo.nickName || "")],
                    params: {
                        archiveId: archiveId,
                        cityid: cityid,
                        caseType: '',
                        userId: userId,
                        flagshipStore: 1
                    }
                };
                if (userInfo.nickName) {
                    // 设置用户行为统计
                    Behavi.getInStoreCount(pasmeInStore);
                }

                // 数据采集
                new ShareVisiting().behavior({
                    archiveId: that.brokerInfo.ARCHIVE_ID || '', // 经济人档案id
                    cUserId: new UserInfoModel().getModel("me").userId || '', // c端用户id，分享时无
                    caseId: '', // 房源id
                    caseType: '', // 房源类型：1.出售，2.出租，6.新盘
                    cityId: that.brokerInfo.CITY_ID || '',
                    sourceType: that.sourceTypeId, // 统计子分类
                    statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
                    appSource: 'zdzf-compStore-2'
                }).then(res => {
                    console.log(res)
                });
                //平台用户来源采集(标记) 20191112 IM优化需求
                new SaveCclientUserType().behavior({
                    archiveId: that.brokerInfo.ARCHIVE_ID || '', // 经济人档案id
                    sourceType: 2, //sourceType 1 = 平台， 2 = 私有
                }).then(res => {console.log(res)})
            },

            // 更新数据方法
            setData(obj = {}) {
                for (let key in obj) {
                    this[key] = obj[key];
                }
            },

            // 保存配置
            saveParams(query) {
                let that = this;
                let newQuery = {};
                return new Promise((resolve, reject) => {
                    //物业版只有门店id兼容处理
                    if (query && query.adminDeptId && !query.archiveId) {
                        newQuery = query;
                        that.saveCompStoreInfo(query)
                            .then(() => {
                                resolve(newQuery);
                            })
                            .catch(err => reject(newQuery));
                        return;
                    }

                    if (query && query.archiveId) {
                        newQuery = query;
                        // 是否需要更新参数
                        let needUpApiCompStoreParams = true;
                        let compStoreParamsVal = new CompStoreParamsModel().getModel() || { archiveId: null };
                        if (new CompStoreParamsModel().getModel()
                            && (compStoreParamsVal.archiveId == query.archiveId)
                            && (compStoreParamsVal.cityId == query.cityId)
                            && (compStoreParamsVal.compId == query.compId)) {
                            needUpApiCompStoreParams = false;
                        }
                        new CompStoreParamsModel().setModel(newQuery);
                        return that.saveCompStoreInfo(newQuery, needUpApiCompStoreParams)
                            .then(() => {
                                resolve(newQuery);
                            })
                            .catch(err => reject(newQuery));
                    }

                    //如果是 物业公司推广二维码 ， 则只有 compId 和 cityId
                    if (query && query.adminCompId) {
                        newQuery = query;
                        that.saveCompStoreInfo(query)
                            .then(() => {
                                resolve(newQuery);
                            })
                            .catch(err => reject(newQuery));
                        return;
                    }

                    that.getCompStoreParamsInfo()
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            if (new CompStoreParamsModel().getModel()) {
                                newQuery = new CompStoreParamsModel().getModel();
                                that.saveCompStoreInfo(newQuery)
                                    .then(() => {
                                        resolve(newQuery);
                                    })
                                    .catch(err => reject(newQuery));
                            }
                            reject(err);
                        });
                });
            },

            // 保存旗舰店信息到net
            saveCompStoreInfo(config, needUpApiCompStoreParams = false) {
                let that = this;
                let showImTab = false;
                if(config.archiveId) {
                    showImTab = true;
                }
                let botTab = that.botTab;
                botTab.im.show = showImTab;
                that.botTab = botTab;
                return new Promise((resolve, reject) => {
                    that.getOpenId()
                        .then((openId) => {
                            return new SaveUserConfig({
                                openId: openId
                                , config: JSON.stringify(config)
                            }).send();
                        })
                        .then((res) => {
                            new CompStoreIsCompStoreParamsModel().setModel(1);
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            },
            // 获取旗舰店参数信息
            getCompStoreParamsInfo() {
                let that = this;
                return new Promise((resolve, reject) => {
                    that.getOpenId()
                        .then((openId) => {
                            return new SaveUserConfig({
                                openId: openId
                            }).send();
                        })
                        .then((res) => {
                            if (res.status !== 200) {
                                reject(res);
                                return;
                            }

                            let data = res.data || {};
                            let config = data.CONFIG_JSON || "";
                            if (!config) {
                                reject("noConfig");
                                return;
                            }

                            new CompStoreParamsModel().setModel(JSON.parse(config));
                            resolve(JSON.parse(config));
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            },

            // 获取openId
            getOpenId() {
                let that = this;
                return new Promise((resolve, reject) => {
                    that.wxLogin()
                        .then((codeInfo) => {
                            return new Jscode2Session4FlagShipStore({
                                code: codeInfo
                            }).send();
                        })
                        .then((res) => {
                            if (res.status !== 200) {
                                reject(res);
                                return;
                            }

                            let openId = res.data.openid;
                            resolve(openId);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            },
            wxLogin() {
                return new Promise((resolve, reject) => {
                    uni.login({
                        success(res) {
                            if (res.code) {
                                resolve(res.code);
                                return;
                            }

                            reject(res);
                        }
                        , fail(err) {
                            reject(err);
                        }
                    });
                });
            },

            // 初始化页面进入配置
            initPageParameter(query) {
                let info = query || {};
                let map = new Map([
                    ["archiveId", "archiveId"]
                    ,["compId", "compId"]
                    ,["adminCompId", "adminCompId"]
                    ,["cityId", "cityId"]
                    ,["adminDeptId", "adminDeptId"]
                    ,["deptId", "deptId"]
                    ,["comefromSource", "comefromSource"]
                ]);
                let mapModel = new Map()
                    .set("archiveId", CompStoreArchiveIdModel)
                    .set("compId", CompStoreCompIdModel)
                    .set("adminCompId", CompStoreAdminCompIdModel)
                    .set("cityId", CompStoreCityIdModel)
                    .set("adminDeptId", CompStoreAdminDeptIdModel)
                    .set("deptId", CompStoreDeptIdModel)
                    .set("comefromSource", CompStoreComefromSourceModel)
                if(query.compId) {
                    this.setData({
                        compId:query.compId
                    });
                }
                for (let key in info) {
                    if (!map.has(key)) continue;

                    if (info[key] === undefined) continue;

                    privateData[map.get(key)] = info[key];
                    (new (mapModel.get(key))()).setModel(info[key]);
                    if (privateData.erHouseApiParams[map.get(key)] !== undefined) {
                        privateData.erHouseApiParams[map.get(key)] = info[key];
                        privateData.rentingHouseApiParams[map.get(key)] = info[key];

                        privateData.erHouseApiParamsMoRen[map.get(key)] = info[key];
                        privateData.rentingHouseApiParamsMoRen[map.get(key)] = info[key];
                    }
                }
                if (info.archiveId) {
                    privateData.newHouseApiParams.archiveId = info.archiveId;
                    privateData.newHouseApiParamsMoRen.archiveId = info.archiveId;
                }
                if (info.cityId) {
                    privateData.newHouseApiParams.brokerCityId = info.cityId;
                    privateData.newHouseApiParamsMoRen.brokerCityId = info.cityId;
                }
            },

            // 初始化数据
            initData() {
                let that = this;
                let homeDataRes = {};
                return new Promise((resolve, reject) => {
                    that.initCompStoreConfig(function (setDataObj) {
                        that.changeButtonClick()
                            .then((res) => {
                                homeDataRes = res;
                                that.brokerInfo = homeDataRes.DATA.brokerInfo;
                                // 采集数据
                                let me = new UserInfoModel().getModel("me") || {};
                                new ShareVisiting().behavior({
                                    archiveId: that.brokerInfo.ARCHIVE_ID || '', // 经济人档案id
                                    cUserId: me.userId || '', // c端用户id，分享时无
                                    caseId: '', // 房源id
                                    caseType: '', // 房源类型：1.出售，2.出租，6.新盘
                                    cityId: that.brokerInfo.CITY_ID || '',
                                    sourceType: that.sourceTypeId, // 统计子分类
                                    statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
                                    appSource: 'zdzf-compStore-1'
                                }).then(res => {
                                    console.log(res)
                                });
                                new SaveCclientUserType().behavior({
                                    archiveId: that.brokerInfo.ARCHIVE_ID || '', // 经济人档案id
                                    sourceType: 2, //sourceType 1 = 平台， 2 = 私有
                                }).then(res => {console.log(res)})

                                return that.initNewHouseData();
                            })
                            .then(() => {
                                let changeButtonArr = privateData.changeButtonArr;
                                for (let btnInfo of changeButtonArr) {
                                    if (btnInfo.text == '新房'
                                        && that.isProperty == 1
                                        && privateData.compId != "56273"
                                        && privateData.compId != "279104") {
                                        btnInfo.haveData = false;
                                    }
                                }
                                privateData.changeButtonArr = changeButtonArr;
                                setDataObj["changeButtonArr"] = privateData.changeButtonArr;

                                that.setData(setDataObj);
                                privateData.initDataIsReady = true;
                                uni.hideLoading();
                                that.setData({isInitIng: false});
                                let showImTab = false;
                                if(homeDataRes.DATA && homeDataRes.DATA.brokerInfo
                                    && homeDataRes.DATA.brokerInfo.ARCHIVE_ID) {
                                    showImTab = true;
                                }
                                let botTab = that.botTab;
                                botTab.im.show = showImTab;
                                that.setData({botTab: botTab});
                                if(showImTab) {
                                    // 初始化im未读数
                                    that.initUnReadMsgNum();
                                }
                                resolve("");
                            })
                            .catch((err) => {
                                uni.hideLoading();
                                that.setData({isInitIng: false});
                                setTimeout(() => {
                                    uni.reLaunch({
                                        url: "/pages/index/index"
                                    });
                                    reject(err);
                                }, 1000);
                            });
                    });
                });
            },

            // 初始化旗舰店配置
            initCompStoreConfig(callback = function () { }) {
                let that = this;
                new CompStoreIndexConfig(privateData.archiveId
                    , privateData.compId).getConfig(function (res) {
                    let setDataObj = {};
                    let titleInfo = that.titleInfo || {};
                    if (!res || Object.keys(res).length === 0) {
                        setDataObj["recommendListSort"] = ["erHouse", "zuHouse", "newHouse"];
                        privateData.changeButtonArr = [
                            {
                                text: "首页"
                                , index: 0
                                , event: "initHomeData"
                                , behavi: ""
                                , haveData: true
                            },
                            {
                                text: "二手房"
                                , index: 1
                                , event: "initErHouseData"
                                , behavi: "58"
                                , haveData: false
                            },
                            {
                                text: "新房"
                                , index: 2
                                , event: "initNewHouseData"
                                , behavi: "59"
                                , haveData: false
                            },
                            {
                                text: "租房"
                                , index: 3
                                , event: "initRentingHouseData"
                                , behavi: "60"
                                , haveData: false
                            }
                        ];
                        that.setData(setDataObj);
                        callback(setDataObj);
                        return;
                    }

                    let shareInfoTitle = res.shareInfo.text || privateData.shareConfig.title
                        || "最新优选旗舰店";
                    if (res.shareInfo.text) {
                        privateData.shareConfig.title = shareInfoTitle;
                    }
                    if (res.shareInfo.imgSrc) {
                        privateData.shareConfig.imageUrl = res.shareInfo.imgSrc;
                    }else{
                        // 默认分享图
                        privateData.shareConfig.imageUrl = 'http://cdn.haofang.net/static/uuminiapp/flagship/index/flagShipShareDefault.jpg';
                    }

                    let indexHomeDataRes = new CompStoreIndexHomeDataResModel().getModel() || {};
                    let compInfo = indexHomeDataRes.compInfo || {};
                    if (res.indexBg) {
                        setDataObj["topBgImgSrc"] = res.indexBg || that.private.topBgImgSrc;
                        setDataObj["topBgSrc"] = res.indexBg || that.private.topBgImgSrc;
                        privateData.haveIndexBg = true;
                    }
                    if (res.logo) {
                        titleInfo.logoImgSrc = res.logo
                            ? res.logo.indexOf("x-oss-process=image") < 0
                                ? (res.logo + privateData.alyParams) : res.logo
                            : privateData.moRenLogoImgSrc;
                        compInfo.compLogo = res.logo || "";
                        indexHomeDataRes.compInfo = compInfo;
                        privateData.haveLogo = true;
                    }
                    if (res.name) {
                        let titleInfoName = res.name || "未知名称";
                        titleInfo.name = titleInfoName;
                        compInfo.compName = titleInfoName;
                        indexHomeDataRes.compInfo = compInfo;
                        privateData.haveName = true;
                    }
                    if (res.navInfo) {
                        privateData.changeButtonArr = res.navInfo;
                    }
                    if (res.recommendInfo && Object.keys(res.recommendInfo).length > 0) {
                        setDataObj["recommendInfo"] = res.recommendInfo;
                    }
                    setDataObj["recommendListSort"] = ["erHouse", "zuHouse", "newHouse"];
                    if (res.recommendListSort) {
                        setDataObj["recommendListSort"] = res.recommendListSort;
                    }
                    if (res.titleBg && res.linearGradientBg) {
                        uni.setNavigationBarColor({
                            frontColor: "#ffffff",
                            backgroundColor: res.titleBg,
                            animation: {
                                duration: 400,
                                timingFunc: "easeIn"
                            }
                        });
                    }
                    if (res.linearGradientBg && res.titleBg) {
                        setDataObj["linearGradientBg"] = res.linearGradientBg;
                    }
                    setDataObj["titleInfo"] = titleInfo;
                    callback(setDataObj);
                });
            },

            // 点击事件
            changeButtonClick(tabItem) {
                let that = this;
                return new Promise((resolve, reject) => {
                    privateData.isClickStatus = true;
                    if (!this.changeButtonArr || this.changeButtonArr.length === 0) {
                        privateData.isClickStatus = false;
                        resolve("");
                        return;
                    }

                    let item = this.changeButtonArr[0];
                    if (tabItem) {
                        item = tabItem;
                    }
                    if (item.behavi) {
                        // 用户行为统计
                        let wxNickname = this.userInfo.nickName;
                        let archiveId = this.archiveId;
                        let cityid = privateData.newHouseApiParams.brokerCityId;
                        let pasme = {
                            index: item.behavi,
                            text: [wxNickname],
                            params: { archiveId: archiveId, cityid: cityid, caseType: 1 }
                        };
                        Behavi.formatConfig(pasme);
                    }
                    if (that.currentClickTopBarIndex !== 0
                        && that.currentClickTopBarIndex === item.index) {
                        privateData.isClickStatus = false;
                        resolve("");
                        return;
                    }

                    that.setData({
                        currentClickTopBarIndex: item.index
                        , currentClickTopBarEventName: item.event
                    });
                    that[item.event]()
                        .then((res) => {
                            privateData.isClickStatus = false;
                            resolve(res);
                        })
                        .catch((err) => {
                            privateData.isClickStatus = false;
                            reject(err);
                            uni.showToast({
                                title: "获取数据失败啦！请稍后重试。",
                                icon: "none"
                            });
                        });
                });
            },

            // 获取首页数据
            initHomeData() {
                let that = this;
                return new Promise((resolve, reject) => {
                    let params = {
                        compId: privateData.compId,
                        cityId: privateData.cityId,
                        adminDeptId: privateData.adminDeptId || '',
                        adminCompId: privateData.adminCompId || '',
                        archiveId: privateData.archiveId
                    };
                    if (!!privateData.deptId) {
                        params['adminCompId'] = privateData.compId;
                    }
                    //物业推广加参数
                    if ('wytg' == privateData.comefromSource) {
                        params = {
                            flag:'propertyPromotion'
                            , cityId: new CompStoreCityIdModel().getModel() || ""
                            , adminCompId: new CompStoreAdminCompIdModel().getModel() || ""
                        }
                    }
                    let compStoreInfo = that.compStoreInfo;

                    new CompStoreInfoModel().setModel(compStoreInfo);
                    if (!this.isFirstEnter) {
                        resolve("");
                        return;
                    }

                    new GetCompStoreHomeData(params).send()
                        .then((res) => {
                            if (res.STATUS != 1) {
                                reject(res);
                                return;
                            }

                            that.setData({
                                isFirstEnter: false
                            });
                            let data = res.DATA || {};
                            let compInfo = data.compInfo || {};

                            privateData.compInfo = compInfo; //存一份公司信息
                            privateData.compId = compInfo.COMP_ID || "";  //更新erpCompId

                            // 更新请求参数数据
                            this.initPageParameter({
                                compId: privateData.compId,
                            });

                            compInfo.compOriName = compInfo.compName;
                            compInfo.compName = compInfo.compName
                                ? compInfo.compName.indexOf("旗舰") >= 0
                                    ? compInfo.compName : compInfo.compName + "旗舰店" : "";
                            data.compInfo = compInfo;
                            res.DATA = data;
                            new CompStoreIndexHomeDataResModel().setModel(res);
                            that.setHomeData(res);

                            let serviceReg = data.brokerInfo ?  data.brokerInfo.SERVICE_REG || "" : "";
                            serviceReg = serviceReg.replace(/(^\s*)|(\s*$)/g, "");
                            if (serviceReg && serviceReg.indexOf(" ") >= 0) {
                                serviceReg = serviceReg.replace(" ", ",");
                            }

                            new CompStoreCityIdModel().setModel(compInfo.CITY_ID);
                            new CompStoreServiceRegModel().setModel(serviceReg);
                            new CompStoreIsPropertyModel().setModel(data.isProperty);
                            new CompStorePropertyInfoModel().setModel(data.property);

                            // 设置buildId缓存
                            if(data.property && data.property.buildInfo
                                && data.property.buildInfo.BUILD_ID) {
                                new CompStoreCompBuildIdModel().setModel(data.property.buildInfo.BUILD_ID);
                            }else {
                                new CompStoreCompBuildIdModel().removeModel();
                            }
                            // isOperation == 1 联营 其他是自营
                            new CompStoreIsOperationModel().setModel(data.isOperation || "");

                            // 更新多个楼盘数组
                            let compStoreChooseListMap = that.compStoreChooseListMap;
                            compStoreChooseListMap["compStoreChooseRegion"].addRightArr =
                                data.property ? data.property.builds || [] : [];
                            compStoreChooseListMap["compStoreChooseRegionRentingHouse"].addRightArr =
                                data.property ? data.property.builds || [] : [];
                            that.setData({compStoreChooseListMap: compStoreChooseListMap});

                            // 埋点统计
                            let reportVal = new StatisticsReport();
                            let compInfoRequestItem = reportVal.getCompInfo();
                            let buildInfoRequestItem = data && data.property
                                ? data.property.buildInfo || {} : {};
                            let propertyInfoRequestItem = data && data.property
                                ? data.property.propertyInfo || {} : {};
                            let compInfoRequestVal = data ? data.compInfo || {} : {};
                            compInfoRequestItem.buildId = buildInfoRequestItem.BUILD_ID || "";
                            compInfoRequestItem.buildName = buildInfoRequestItem.BUILD_NAME || "";
                            compInfoRequestItem.compId = compInfoRequestVal.COMP_ID || "";
                            compInfoRequestItem.compName = compInfoRequestVal.COMP_NAME || "";
                            let archiveId = propertyInfoRequestItem.ARCHIVE_ID || "";
                            let reportValChannel = reportVal.defaultChannel;
                            if(reportVal.getScene() == 2) {
                                reportValChannel = reportVal.scanEnterStore;
                            }
                            if(reportVal.getScene() == 1) {
                                reportValChannel = reportVal.shareEnterStore;
                            }
                            reportVal.send(reportValChannel, archiveId,
                                "", compInfoRequestItem);

                            // 实时统计
                            let realTimeReportVal = new RealTimeStatistics();
                            let realTimeReportCompInfoItem = realTimeReportVal.getCompInfo();
                            realTimeReportCompInfoItem.compId = new CompStoreAdminCompIdModel().getModel() || "";
                            realTimeReportCompInfoItem.erpCompId = compInfoRequestVal.COMP_ID || "";
                            realTimeReportCompInfoItem.buildId = buildInfoRequestItem.BUILD_ID || "";
                            realTimeReportCompInfoItem.buildName = buildInfoRequestItem.BUILD_NAME || "";
                            realTimeReportCompInfoItem.archiveId = propertyInfoRequestItem.ARCHIVE_ID || "";
                            realTimeReportCompInfoItem.deptId = propertyInfoRequestItem.DEPT_ID || "";
                            realTimeReportCompInfoItem.pageDesc = compInfoRequestVal.compName
                                ? compInfoRequestVal.compName.indexOf("旗舰店") === -1
                                    ? compInfoRequestVal.compName + "旗舰店"
                                    : compInfoRequestVal.compName : "";
                            realTimeReportVal.send(realTimeReportCompInfoItem);
                            resolve(res);
                        })
                        .catch((err) => reject(err));
                });
            },
            // 初始化新房数据
            initNewHouseData(isChoose = false) {
                let that = this;
                return new Promise((resolve, reject) => {
                    let compStoreInfo = that.compStoreInfo;
                    let newHouseData = compStoreInfo.newHouseData || {};
                    if (!isChoose && that.newHouseList && that.newHouseList.length > 0) {
                        resolve("");
                        return;
                    }

                    if (!isChoose && newHouseData.noData) {
                        resolve("");
                        return;
                    }

                    newHouseData.isLoading = true;
                    newHouseData.isNoMoreData = false;
                    newHouseData.noData = false;
                    // compStoreInfo.newHouseData = newHouseData;
                    // that.setData({
                    // 	compStoreInfo: compStoreInfo
                    // });
                    privateData.newHouseApiParams.archiveId =
                        new CompStoreArchiveIdModel().getModel() || "";
                    that.getNewHouseData()
                        .then((res) => {
                            if (res.length === 0) {
                                newHouseData.newHouseList = [];
                                newHouseData.isLoading = false;
                                newHouseData.isNoMoreData = false;
                                newHouseData.noData = true;
                                compStoreInfo.newHouseData = newHouseData;
                                that.compStoreInfo = compStoreInfo;
                                if (!isChoose) {
                                    that.setData({
                                        haveNewHouse: false
                                    });
                                }
                                resolve(res);
                                return;
                            }

                            if (res.length < privateData.newHouseApiParams.pageRows) {
                                newHouseData.isNoMoreData = true
                            }
                            if (!isChoose) {
                                UpNavListInfo(that, "initNewHouseData", true, privateData);
                            }
                            newHouseData.isLoading = false;
                            newHouseData.noData = false;
                            // newHouseData.newHouseList = res;
                            compStoreInfo.newHouseData = newHouseData;
                            that.newHouseList = res;
                            that.setData({
                                compStoreInfo: compStoreInfo,
                                indexNewHouseList: res
                            });
                            resolve(res);
                        })
                        .catch((err) => {
                            newHouseData.isLoading = false;
                            newHouseData.isNoMoreData = false;
                            newHouseData.noData = true;
                            compStoreInfo.newHouseData = newHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo
                            });
                            if (!isChoose) {
                                that.setData({
                                    haveNewHouse: false
                                });
                            }
                            reject(err);
                        });
                });
            },
            // 初始化切换数据
            initOtherChooseData() {
                let that = this;
                privateData.chooseRegionIsReady = false;
                return Promise.all([that.initChooseData(), that.initChooseRegionNewHouse()])
                    .then(() => {
                        privateData.chooseRegionIsReady = true;
                        if (!privateData.initDataIsReady) return;

                        uni.hideLoading();
                    })
                    .catch(() => {
                        uni.hideLoading();
                    });
            },
            // 初始化二手房数据
            initErHouseData(isChoose = false) {
                let that = this;
                return new Promise((resolve, reject) => {
                    let compStoreInfo = that.compStoreInfo;
                    let erHouseData = compStoreInfo.erHouseData || {};
                    if (!isChoose && that.erHouseList && that.erHouseList.length > 0) {
                        resolve("");
                        return;
                    }

                    if (!isChoose && erHouseData.noData) {
                        resolve("");
                        return;
                    }

                    erHouseData.isLoading = true;
                    erHouseData.isNoMoreData = false;
                    erHouseData.noData = false;
                    compStoreInfo.erHouseData = erHouseData;
                    that.setData({
                        compStoreInfo: compStoreInfo
                    });
                    that.getErAndRentingHouseData("erHouseApiParams")
                        .then((res) => {
                            if (res.length === 0) {
                                erHouseData.erHouseList = [];
                                erHouseData.isNoMoreData = false;
                                erHouseData.isLoading = false;
                                erHouseData.noData = true;
                                compStoreInfo.erHouseData = erHouseData;
                                that.setData({
                                    compStoreInfo: compStoreInfo
                                });
                                resolve(res);
                                return;
                            }

                            if (res.length < privateData.erHouseApiParams.pageSize) {
                                erHouseData.isNoMoreData = true
                            }
                            erHouseData.isLoading = false;
                            erHouseData.noData = false;
                            // erHouseData.erHouseList = res;
                            compStoreInfo.erHouseData = erHouseData;
                            that.compStoreInfo = compStoreInfo;
                            that.erHouseList = res;
                            resolve(res);
                        })
                        .catch((err) => {
                            erHouseData.isLoading = false;
                            erHouseData.isNoMoreData = false;
                            erHouseData.noData = true;
                            compStoreInfo.erHouseData = erHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo
                            });
                            reject(err);
                        });
                });
            },
            getErAndRentingHouseData(paramsName = "erHouseApiParams") {
                let that = this;
                let compStoreChooseListMap = this.compStoreChooseListMap;
                return new Promise((resolve, reject) => {
                    let params = privateData[paramsName];
                    new GetSecondHouseListAction(params).send()
                        .then((res) => {
                            let paramStr = '';
                            for (let p in params) {
                                paramStr += "&" + p + "=" + params[p];
                            }
                            if (res.STATUS != 1) {
                                reject(res);
                                return;
                            }

                            let data = res.DATA || {};
                            let list = data.list || [];
                            if (list.length === 0) {
                                resolve([]);
                                return;
                            }


                            let newSaleData = [];
                            let apiList = list;
                            for (let i = 0;i<apiList.length;i++) {
                                let dataItem = apiList[i] || {};
                                let item = new ErHouseListItem();
                                if (!dataItem.buildId) continue;

                                let tags = (dataItem.houseTagDesc
                                    && dataItem.houseTagDesc.indexOf("|") >= 0)
                                    ? dataItem.houseTagDesc.split("|") : [];
                                if (tags.length > 3) {
                                    tags = tags.slice(0, 3);
                                }
                                item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
                                item.cityId = dataItem.cityId || "";
                                item.caseType = dataItem.caseType || "";
                                item.houseId = dataItem.houseId || "";
                                item.reSource = dataItem.reSource || "";
                                item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
                                item.houseTitle = dataItem.houseSubject || "";
                                item.houseTing = (dataItem.houseRoom && dataItem.houseRoom != 0 ? dataItem.houseRoom + "室" : "")
                                    + (dataItem.houseWei && dataItem.houseWei != 0 ? dataItem.houseWei + "卫" : "");
                                item.houseArea = dataItem.houseArea || "";
                                item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
                                item.houseName = dataItem.buildName || "";
                                item.houseTotalPrice = dataItem.houseTotalPrice || "";
                                item.houseTotalPriceUnit = dataItem.houseTotalPrice
                                    ? (dataItem.priceUnitCn || "") : "";
                                item.housePriceOfArea = dataItem.houseUnitPrice || "";
                                item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
                                item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
                                item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
                                item.houseTags = tags;
                                item.houseUseage = dataItem.houseUseage || "";
                                item.houseUseageCn = dataItem.houseUseageCn || "";
                                let enterFrom = "";
                                if(this.isProperty && this.isProperty == 1) {
                                    enterFrom = "jk";
                                }
                                // isOperation == 1 联营 其他是自营
                                // isProperty == 1 物业版
                                if(new CompStoreCompBuildIdModel().getModel() === data.buildId
                                    && new CompStoreIsOperationModel().getModel()
                                    && new CompStoreIsOperationModel().getModel() == 1
                                    && new CompStoreIsPropertyModel().getModel()
                                    && new CompStoreIsPropertyModel().getModel() == 1) {
                                    item.archiveId = new CompStoreArchiveIdModel().getModel() || "";
                                }
                                item.pageFrom = enterFrom;
                                newSaleData.push(item);
                            }
                            resolve(newSaleData);
                        })
                        .catch(err => reject(err));
                });
            },
            // 初始化租房数据
            initRentingHouseData(isChoose = false) {
                let that = this;
                return new Promise((resolve, reject) => {
                    let compStoreInfo = that.compStoreInfo;
                    let rentingHouseData = compStoreInfo.rentingHouseData || {};
                    if (!isChoose && that.zuHouseList && that.zuHouseList.length > 0) {
                        resolve("");
                        return;
                    }

                    if (!isChoose && rentingHouseData.noData) {
                        resolve("");
                        return;
                    }

                    rentingHouseData.isLoading = true;
                    rentingHouseData.isNoMoreData = false;
                    rentingHouseData.noData = false;
                    compStoreInfo.rentingHouseData = rentingHouseData;
                    that.setData({
                        compStoreInfo: compStoreInfo
                    });
                    that.getErAndRentingHouseData("rentingHouseApiParams")
                        .then((res) => {
                            if (res.length === 0) {
                                rentingHouseData.rentingHouseList = [];
                                rentingHouseData.isNoMoreData = false;
                                rentingHouseData.noData = true;
                                rentingHouseData.isLoading = false;
                                compStoreInfo.rentingHouseData = rentingHouseData;
                                that.setData({
                                    compStoreInfo: compStoreInfo
                                });
                                resolve(res);
                                return;
                            }

                            if (res.length < privateData.rentingHouseApiParams.pageSize) {
                                rentingHouseData.isNoMoreData = true
                            }
                            rentingHouseData.noData = false;
                            rentingHouseData.isLoading = false;
                            // rentingHouseData.rentingHouseList = res;
                            compStoreInfo.rentingHouseData = rentingHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo,
                                zuHouseList: res
                            });
                            resolve(res)
                        })
                        .catch((err) => {
                            rentingHouseData.noData = true;
                            rentingHouseData.isLoading = false;
                            rentingHouseData.isNoMoreData = false;
                            compStoreInfo.rentingHouseData = rentingHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo
                            });
                            reject(err);
                        });
                });
            },
            // 获取新房数据
            getNewHouseData() {
                return new Promise((resolve, reject) => {
                    let params = privateData.newHouseApiParams;
                    let adminCompId = new CompStoreAdminCompIdModel().getModel() || "";
                    console.log("请求新房的接口",params);
                    if (!params.archiveId || params.archiveId=='null') {
                        resolve([]);
                        return;
                    }

                    new GetCompNewBuildList(params).send()
                        .then((res) => {
                            if (res.errCode != 200) {
                                reject(res);
                                return;
                            }

                            let params = privateData.newHouseApiParams;
                            let data = res.data || {};
                            let newBuildList = data.newBuildList || [];
                            if (newBuildList.length === 0) {
                                resolve([]);
                                return;
                            }

                            let newHouseLisArr = [];
                            for (let i = 0;i<newBuildList.length;i++) {
                                let dataItem = newBuildList[i] || {};
                                let item = new NewHouseListItem();
                                if (!dataItem.buildId) continue;

                                let tags = !dataItem.buildTag
                                    ? [] : dataItem.buildTag.indexOf(",") >= 0
                                        ? dataItem.buildTag.split(",") : [dataItem.buildTag];
                                let buildTypeTags = !dataItem.buildType
                                    ? [] : dataItem.buildType.indexOf(",") >= 0
                                        ? dataItem.buildType.split(",") : [dataItem.buildType];
                                let buildFitmentTags = !dataItem.buildFitment
                                    ? [] : dataItem.buildFitment.indexOf(",") >= 0
                                        ? dataItem.buildFitment.split(",") : [dataItem.buildFitment];
                                tags = tags.concat(buildTypeTags);
                                tags = tags.concat(buildFitmentTags);

                                if (tags.length > 3) {
                                    tags = tags.slice(0, 3);
                                }
                                item.buildId = dataItem.buildId || "";
                                item.buildImg = dataItem.photoUrl || Const.houseDefaultImg;
                                item.buildName = dataItem.buildName || "";
                                item.buildStatus = dataItem.buildStatus || "";
                                item.buildTing = (dataItem.roomText
                                && (dataItem.areaMin || dataItem.areaMax)
                                    ? dataItem.roomText + " | " : (dataItem.roomText || ""));
                                item.buildArea = (dataItem.areaLow && dataItem.areaMax)
                                    ? parseInt(dataItem.areaMin) + "-" + parseInt(dataItem.areaMax)
                                    : (parseInt(dataItem.areaMin || 0) || parseInt(dataItem.areaMax || 0) || "");
                                item.buildAreaUnit = item.buildArea ? "m²" : "";
                                item.buildAddress = dataItem.buildAddr || "";
                                item.buildTags = tags;
                                dataItem.averagePrice = dataItem.averagePrice || "";
                                dataItem.averagePrice = dataItem.averagePrice + "";
                                item.buildPriceOfArea = !dataItem.averagePrice ? "" : dataItem.averagePrice.indexOf("价格") >= 0
                                    ? "" : parseInt(dataItem.averagePrice);
                                item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
                                item.cityId = dataItem.cityId || "";
                                let enterFrom = "";
                                if(this.isProperty && this.isProperty == 1) {
                                    enterFrom = "jk";
                                }
                                // isOperation == 1 联营 其他是自营
                                // isProperty == 1 物业版
                                if(new CompStoreCompBuildIdModel().getModel() === data.buildId
                                    && new CompStoreIsOperationModel().getModel()
                                    && new CompStoreIsOperationModel().getModel() == 1
                                    && new CompStoreIsPropertyModel().getModel()
                                    && new CompStoreIsPropertyModel().getModel() == 1) {
                                    item.archiveId = new CompStoreArchiveIdModel().getModel() || "";
                                }
                                item.pageFrom = enterFrom;
                                newHouseLisArr.push(item);
                            }
                            resolve(newHouseLisArr);
                        })
                        .catch(err => reject(err));
                });
            },

            // 初始化行政区域
            initChooseData() {
                let that = this;
                return new Promise((resolve, reject) => {
                    new InitLocalStorage({cityId: privateData.cityId}).send()
                        .then(res => {
                            if (res.STATUS != 1) {
                                reject(res);
                                return;
                            }

                            new CompStoreIndexChooseDataResModel().setModel(res);
                            that.setChooseData(res);
                            resolve(res);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },

            // 初始化新房区域筛选
            initChooseRegionNewHouse() {
                let that = this;
                return new Promise((resolve, reject) => {
                    new GetNewBuildListCondition({
                        archiveId: "12001",  // 没用的参数
                        brokerCityId: privateData.cityId,
                        compId: privateData.compId,
                        personalVersion: 1,
                    }).send().then((res) => {
                        if (res.status != 1) {
                            reject(res);
                            return;
                        }

                        new CompStoreIndexChooseRegionNewHouseResModel().setModel(res);
                        that.setChooseRegionNewHouse(res);
                        resolve(res);
                    })
                    .catch(err => reject(err));
                });
            },

            // 从缓存渲染数据
            initDataFromLocal() {
                if (!new CompStoreIndexAgoArchiveIdModel().getModel()) {
                    new CompStoreIndexAgoArchiveIdModel().setModel(privateData.archiveId);
                    return;
                }

                let agoArchiveId = new CompStoreIndexAgoArchiveIdModel().getModel();
                if (agoArchiveId != privateData.archiveId) {
                    new CompStoreIndexAgoArchiveIdModel().setModel(privateData.archiveId);
                    return;
                }

                this.setChooseDataFromLocal();
                this.setChooseRegionNewHouseFromLocal();
                this.setHomeDataFromLocal();
            },
            setChooseDataFromLocal() {
                if (!new CompStoreIndexChooseDataResModel().getModel()) return;

                this.setChooseData(new CompStoreIndexChooseDataResModel().getModel());
            },
            setChooseRegionNewHouseFromLocal() {
                if (!new CompStoreIndexChooseRegionNewHouseResModel().getModel()) return;

                this.setChooseRegionNewHouse(new CompStoreIndexChooseRegionNewHouseResModel().getModel());
            },
            setHomeDataFromLocal() {
                if (!new CompStoreIndexHomeDataResModel().getModel()) return;

                this.setHomeData(new CompStoreIndexHomeDataResModel().getModel(), true);
            },

            // 更新首页数据
            setHomeData(res, fromLocal = false) {
                let that = this;
                let compStoreInfo = that.compStoreInfo;
                let indexData = compStoreInfo.indexData || {};
                let data = res.DATA || {};
                let init = data.init || {};
                let compInfo = data.compInfo || {};
                let brokerInfo = data.brokerInfo || {};
                let serverStar = brokerInfo.serverStar || {};
                let saleData = data.saleData || [];
                let newHouseList = data.newHouseList || [];
                let zuHouseList = data.leaseData || [];
                // 设置参数，behaviorToos页面使用
                this.archiveId = data.brokerInfo.ARCHIVE_ID;
                this.setData({ archiveInfo: data.brokerInfo });
                let newSaleData = [];
                for (let i = 0;i<saleData.length;i++) {
                    let dataItem = saleData[i] || {};
                    let item = new ErHouseListItem();
                    if (!dataItem.buildId) continue;

                    let tags = (dataItem.houseTagDesc
                        && dataItem.houseTagDesc.indexOf("|") >= 0)
                        ? dataItem.houseTagDesc.split("|") : [];
                    if (tags.length > 3) {
                        tags = tags.slice(0, 3);
                    }
                    item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
                    item.cityId = dataItem.cityId || "";
                    item.caseType = dataItem.caseType || "";
                    item.houseId = dataItem.houseId || "";
                    item.reSource = dataItem.reSource || "";
                    item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
                    item.houseTitle = dataItem.houseSubject || "";
                    item.houseTing = (dataItem.houseRoom && dataItem.houseRoom != 0 ? dataItem.houseRoom + "室" : "")
                        + (dataItem.houseWei && dataItem.houseWei != 0 ? dataItem.houseWei + "卫" : "");
                    item.houseArea = dataItem.houseArea || "";
                    item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
                    item.houseName = dataItem.buildName || "";
                    item.houseTotalPrice = dataItem.houseTotalPrice || "";
                    item.houseTotalPriceUnit = dataItem.houseTotalPrice
                        ? (dataItem.priceUnitCn || "") : "";
                    item.housePriceOfArea = dataItem.houseUnitPrice || "";
                    item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
                    item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
                    item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
                    item.houseTags = tags;
                    item.houseUseage = dataItem.houseUseage || "";
                    item.houseUseageCn = dataItem.houseUseageCn || "";
                    let enterFrom = "";
                    if(this.isProperty && this.isProperty == 1) {
                        enterFrom = "jk";
                    }
                    // isOperation == 1 联营 其他是自营
                    // isProperty == 1 物业版
                    if(new CompStoreCompBuildIdModel().getModel() === data.buildId
                        && new CompStoreIsOperationModel().getModel()
                        && new CompStoreIsOperationModel().getModel() == 1
                        && new CompStoreIsPropertyModel().getModel()
                        && new CompStoreIsPropertyModel().getModel() == 1) {
                        item.archiveId = new CompStoreArchiveIdModel().getModel() || "";
                    }
                    item.pageFrom = enterFrom;
                    newSaleData.push(item);
                }

                let newHouseLisArr = [];
                for (let i = 0;i<newHouseList.length;i++) {
                    let dataItem = newHouseList[i] || {};
                    let item = new NewHouseListItem();
                    if (!dataItem.buildId) continue;

                    let tags = !dataItem.buildTag
                        ? [] : dataItem.buildTag.indexOf(",") >= 0
                            ? dataItem.buildTag.split(",") : [dataItem.buildTag];
                    let buildTypeTags = !dataItem.buildType
                        ? [] : dataItem.buildType.indexOf(",") >= 0
                            ? dataItem.buildType.split(",") : [dataItem.buildType];
                    let buildFitmentTags = !dataItem.buildFitment
                        ? [] : dataItem.buildFitment.indexOf(",") >= 0
                            ? dataItem.buildFitment.split(",") : [dataItem.buildFitment];
                    tags = tags.concat(buildTypeTags);
                    tags = tags.concat(buildFitmentTags);

                    if (tags.length > 3) {
                        tags = tags.slice(0, 3);
                    }
                    item.buildId = dataItem.buildId || "";
                    item.buildImg = dataItem.photoAddr || Const.houseDefaultImg;
                    item.buildName = dataItem.buildName || "";
                    item.buildStatus = dataItem.buildStatus || "";
                    item.buildTing = (dataItem.roomText
                    && (dataItem.areaLow || dataItem.areaHigh)
                        ? dataItem.roomText + " | " : (dataItem.roomText || ""));
                    item.buildArea = (dataItem.areaLow && dataItem.areaHigh)
                        ? parseInt(dataItem.areaLow) + "-" + parseInt(dataItem.areaHigh)
                        : (parseInt(dataItem.areaLow || 0) || parseInt(dataItem.areaHigh || 0) || "");
                    item.buildAreaUnit = item.buildArea ? "m²" : "";
                    item.buildAddress = dataItem.buildAddr || "";
                    item.buildTags = tags;
                    item.buildPriceOfArea = !dataItem.priceText ? "" : dataItem.priceText.indexOf("价格") >= 0 ? "" : parseInt(dataItem.priceText);
                    item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
                    item.cityId = dataItem.cityId || "";
                    let enterFrom = "";
                    if(this.isProperty && this.isProperty == 1) {
                        enterFrom = "jk";
                    }
                    // isOperation == 1 联营 其他是自营
                    // isProperty == 1 物业版
                    if(new CompStoreCompBuildIdModel().getModel() === data.buildId
                        && new CompStoreIsOperationModel().getModel()
                        && new CompStoreIsOperationModel().getModel() == 1
                        && new CompStoreIsPropertyModel().getModel()
                        && new CompStoreIsPropertyModel().getModel() == 1) {
                        item.archiveId = new CompStoreArchiveIdModel().getModel() || "";
                    }
                    item.pageFrom = enterFrom;
                    newHouseLisArr.push(item);
                }

                let zuHouseListArr = [];
                for (let i = 0;i<zuHouseList.length;i++) {
                    let dataItem = zuHouseList[i] || {};
                    let item = new ErHouseListItem();
                    if (!dataItem.buildId) continue;

                    let tags = (dataItem.houseTagDesc
                        && dataItem.houseTagDesc.indexOf("|") >= 0)
                        ? dataItem.houseTagDesc.split("|") : [];
                    if(dataItem.caseType && dataItem.caseType == 2 && dataItem.reSource && dataItem.reSource == 5) {
                        tags.unshift("合租");
                    }
                    if (tags.length > 3) {
                        tags = tags.slice(0, 3);
                    }
                    item.cityId = dataItem.cityId || "";
                    item.caseType = dataItem.caseType || "";
                    item.houseId = dataItem.houseId || "";
                    item.reSource = dataItem.reSource || "";
                    item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
                    item.houseTitle = dataItem.houseSubject || "";
                    item.houseTing = (dataItem.houseRoom && dataItem.houseRoom != 0 ? dataItem.houseRoom + "室" : "")
                        + (dataItem.houseWei && dataItem.houseWei != 0 ? dataItem.houseWei + "卫" : "");
                    item.houseArea = dataItem.houseArea || "";
                    item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
                    item.houseName = dataItem.buildName || "";
                    item.houseTotalPrice = CheckHousePrice.getPrice(dataItem.houseUseage || 1
                        , dataItem.houseArea || "",dataItem.houseTotalPrice || 0, dataItem.priceUnitCn || "");
                    item.houseTotalPriceUnit = dataItem.houseTotalPrice
                        ? (dataItem.priceUnitCn || "") : "";
                    item.housePriceOfArea = dataItem.houseUnitPrice || "";
                    item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
                    item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
                    item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
                    item.houseTags = tags;
                    item.houseUseage = dataItem.houseUseage || "";
                    item.houseUseageCn = dataItem.houseUseageCn || "";
                    let enterFrom = "";
                    if(this.isProperty && this.isProperty == 1) {
                        enterFrom = "jk";
                    }
                    // isOperation == 1 联营 其他是自营
                    // isProperty == 1 物业版
                    if(new CompStoreCompBuildIdModel().getModel() === data.buildId
                        && new CompStoreIsOperationModel().getModel()
                        && new CompStoreIsOperationModel().getModel() == 1
                        && new CompStoreIsPropertyModel().getModel()
                        && new CompStoreIsPropertyModel().getModel() == 1) {
                        item.archiveId = new CompStoreArchiveIdModel().getModel() || "";
                    }
                    item.pageFrom = enterFrom;
                    zuHouseListArr.push(item);
                }

                if (newSaleData.length > 0) {
                    UpNavListInfo(that, "initErHouseData", true, privateData);
                }
                if (zuHouseListArr.length > 0) {
                    UpNavListInfo(that, "initRentingHouseData", true, privateData);
                }

                let evaAvg = serverStar.evaAvg && serverStar.evaAvg > 4.5
                    ? serverStar.evaAvg : "4.5";
                let agentInfo = {
                    headerImg: brokerInfo.userPhoto
                        && brokerInfo.userPhoto.indexOf("default_avatar") < 0
                        ? brokerInfo.userPhoto : privateData.agentMoRenHeaderImg
                    , name: brokerInfo.userName || "未知"
                    , starNum: evaAvg
                    , starArr: new GetStarList(evaAvg).getList()
                    , serviceLocation: brokerInfo.serviceZoneCn || "未知区域"
                    , archiveId: brokerInfo.ARCHIVE_ID
                    , compId: privateData.compId
                    , serviceRegs: "4,15"
                    , phone: brokerInfo.USER_MOBILE || ""
                };

                //如果物业版楼盘有管理员或分享人，更新 archiveId缓存
                new CompStoreArchiveIdModel().setModel(brokerInfo.ARCHIVE_ID || '');
                new CompStoreAgentInfoModel().setModel(agentInfo);

                let compName = compInfo.compName || "";
                if (!privateData.shareConfig.title) {
                    privateData.shareConfig.title = compName || "最新优选旗舰店";
                }
                if (!privateData.shareConfig.path) {
                    privateData.shareConfig.path = "/pagesStore/compStore/compStore?archiveId="
                        + privateData.archiveId + "&compId=" + privateData.compId
                        + "&cityId=" + privateData.cityId + "&deptId=" + privateData.deptId;
                }
                let setDataObj = {};
                let titleInfo = that.titleInfo || {};
                if (!fromLocal) {
                    if (!privateData.haveIndexBg) {
                        setDataObj["topBgImgSrc"] = init.bg || privateData.topBgImgSrc;
                    }
                    if (!privateData.haveLogo) {
                        titleInfo.logoImgSrc = compInfo.compLogo
                            ? compInfo.compLogo + privateData.alyParams
                            : privateData.moRenLogoImgSrc;
                    }
                    if (!privateData.haveName) {
                        titleInfo.name = compName || "";
                    }
                }

                titleInfo.houseCnt = compInfo.houseCount || 0;
                titleInfo.agentCnt = compInfo.brokerCount || 0;
                compStoreInfo.agentInfo = agentInfo;
                setDataObj["indexErHouseList"] = newSaleData;
                // 等新房接口数据返回的时候在更新新房列表数据
                // setDataObj["indexNewHouseList"] = newHouseLisArr;
                setDataObj["indexZuHouseList"] = zuHouseListArr;
                setDataObj["isProperty"] = data.isProperty;
                setDataObj["propertyInfo"] = data.property;
                //设置来源
                setDataObj["comefromSource"] = privateData.comefromSource;
                setDataObj["compStoreInfo"] = compStoreInfo;
                setDataObj["titleInfo"] = titleInfo;
                that.setData(setDataObj);
            },
            // 更新选择的数据
            setChooseData(res) {
                let that = this;
                let data = res.DATA || {};
                let REG_DATA = data.REG_DATA || [];
                let SECTION_DATA = data.SECTION_DATA || {};
                let SALE_PRICE_DATA = data.SALE_PRICE_DATA || [];
                let newHousePrice = [8000, 10000, 15000, 20000, 25000, 35000, 50000];
                let LEASE_PRICE_DATA = data.LEASE_PRICE_DATA || [];
                let compStoreChooseListMap = that.compStoreChooseListMap;

                let leftArr = [
                    {
                        cityId: ""
                        , text: "不限"
                    }
                ];
                let rightArrMap = {
                    "": [{ cityId: "", text: "不限" }]
                };
                for (let i = 0; i < REG_DATA.length; i++) {
                    if (!REG_DATA[i].REG_ID || !REG_DATA[i].REG_NAME) continue;

                    leftArr.push({
                        cityId: REG_DATA[i].REG_ID + ""
                        , text: REG_DATA[i].REG_NAME
                    });
                }
                for (let key in SECTION_DATA) {
                    if (!key) continue;

                    let SECTION_DATA_Arr = SECTION_DATA[key] || [];
                    let newRightArr = [
                        { cityId: "", text: "不限" }
                    ];
                    for (let j = 0; j < SECTION_DATA_Arr.length; j++) {
                        if (SECTION_DATA_Arr[j].length !== 2) continue;

                        if (!SECTION_DATA_Arr[j][0] || !SECTION_DATA_Arr[j][1]) continue;

                        newRightArr.push({
                            cityId: SECTION_DATA_Arr[j][1] + ""
                            , text: SECTION_DATA_Arr[j][0]
                        });
                    }
                    rightArrMap[key + ""] = newRightArr;
                }
                compStoreChooseListMap.compStoreChooseRegion.leftArr = leftArr;
                compStoreChooseListMap.compStoreChooseRegion.rightArrMap = rightArrMap;
                compStoreChooseListMap.compStoreChooseRegionRentingHouse.leftArr = leftArr;
                compStoreChooseListMap.compStoreChooseRegionRentingHouse.rightArrMap = rightArrMap;

                compStoreChooseListMap.compStoreChoosePrice.content =
                    that.dealPrice(SALE_PRICE_DATA, "万");
                compStoreChooseListMap.compStoreChoosePriceNewHouse.content =
                    that.dealPrice(newHousePrice, "元");
                compStoreChooseListMap.compStoreChoosePriceRentingHouse.content =
                    that.dealPrice(LEASE_PRICE_DATA, "元");

                that.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            // 更新新房区域数据
            setChooseRegionNewHouse(res) {
                let that = this;
                let compStoreChooseListMap = that.compStoreChooseListMap;
                let data = res.data || {};
                let cityList = data.cityList || [];
                let leftArr = [
                    {
                        cityId: ""
                        , text: "不限"
                    }
                ];
                let rightArrMap = {
                    "": [{ cityId: "", text: "不限" }]
                };
                for (let i = 0; i < cityList.length; i++) {
                    if (!cityList[i].cityId || !cityList[i].cityName) continue;

                    leftArr.push({
                        cityId: cityList[i].cityId + ""
                        , text: cityList[i].cityName
                    });
                    let regList = cityList[i].regList || [];
                    let newRightArr = [{ cityId: "", text: "不限" }];
                    for (let j = 0; j < regList.length; j++) {
                        if (!regList[j].regionId || !regList[j].regionName) continue;

                        newRightArr.push({
                            cityId: regList[j].regionId + ""
                            , text: regList[j].regionName
                        });
                    }
                    rightArrMap[cityList[i].cityId + ""] = newRightArr;
                }

                compStoreChooseListMap.compStoreChooseRegionNewHouse.leftArr = leftArr;
                compStoreChooseListMap.compStoreChooseRegionNewHouse.rightArrMap = rightArrMap;
                that.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },

            // 处理价格
            dealPrice(priceData, unit = "万") {
                let priceContent = [
                    { text: "不限", value: "" }
                ];
                for (let k = 0; k < priceData.length; k++) {
                    let val = priceData[k];
                    if (k === 0) {
                        priceContent.push({
                            text: val + unit + "以下"
                            , value: "0:" + val
                        });
                        continue;
                    }

                    priceContent.push({
                        text: priceData[k - 1] + "-" + val + unit
                        , value: priceData[k - 1] + ":" + val
                    });
                    if (k === priceData.length - 1) {
                        priceContent.push({
                            text: val + unit + "以上"
                            , value: val + ":9999"
                        });
                    }
                }
                return priceContent;
            },
            upBottomButtonArr() {
                let bottomButtonConfig = this.bottomButtonConfig;
                bottomButtonConfig.currentClickIndex = 0;
                bottomButtonConfig.content[0].pageTo =
                    "/pagesStore/compStore/compStore?compId=" + privateData.compId
                    + "&archiveId=" + privateData.archiveId
                    + "&compCityId=" + privateData.cityId
                    + "&cityId=" + privateData.cityId;
                bottomButtonConfig.content[1].pageTo =
                    "/pagesStore/mine/mine?compId=" + privateData.compId
                    + "&archiveId=" + privateData.archiveId
                    + "&compCityId=" + privateData.cityId
                    + "&cityId=" + privateData.cityId;
                this.setData({
                    bottomButtonConfig: bottomButtonConfig
                });
            },
            upTitleInfo() {
                let that = this;
                let query = uni.createSelectorQuery();
                query.select(".titleInfoName").boundingClientRect(function (res) {
                    if(!res) return;

                    privateData.sectionTitleTop = res.top + that.scrollTop + res.height;
                }).exec();

                query.select(".compStoreTopEmptyView").boundingClientRect(function (res) {
                    if(!res) return;

                    privateData.compStoreTopEmptyViewHeight = res.height;
                }).exec();
            },

            // 触底加载更多
            changeButtonMapEvent() {
                let that = this;
                if (that.currentClickTopBarIndex < 0) return;

                let event = privateData.changeButtonEventMap.get(that.currentClickTopBarIndex);
                return new Promise((resolve, reject) => {
                    that[event]()
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                            uni.showToast({
                                title: "获取数据失败啦！请稍后重试。",
                                icon: "none"
                            });
                        });
                });
            },
            getMoreHomeData() {
                return new Promise((resolve, reject) => resolve(""));
            },
            getMoreErHouseData() {
                let that = this;
                let compStoreInfo = that.compStoreInfo;
                let erHouseData = compStoreInfo.erHouseData || {};
                return new Promise((resolve, reject) => {
                    if (erHouseData.isNoMoreData || erHouseData.noData) {
                        resolve("");
                        return;
                    }

                    privateData.erHouseApiParams.pageNum++;
                    erHouseData.isLoading = true;
                    erHouseData.isNoMoreData = false;
                    erHouseData.noData = false;
                    compStoreInfo.erHouseData = erHouseData;
                    that.setData({
                        compStoreInfo: compStoreInfo
                    });
                    that.getErAndRentingHouseData("erHouseApiParams")
                        .then((res) => {
                            if (res.length < privateData.erHouseApiParams.pageSize) {
                                erHouseData.isNoMoreData = true
                            }
                            erHouseData.isLoading = false;
                            erHouseData.noData = false;
                            let erHouseList = that.erHouseList || [];
                            erHouseList = erHouseList.concat(res);
                            // erHouseData.erHouseList = erHouseData.erHouseList.concat(res);
                            compStoreInfo.erHouseData = erHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo,
                                erHouseList: erHouseList
                            });
                            resolve(res)
                        })
                        .catch((err) => {
                            erHouseData.isLoading = false;
                            erHouseData.isNoMoreData = false;
                            erHouseData.noData = false;
                            compStoreInfo.erHouseData = erHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo
                            });
                            reject(err);
                        });
                });
            },
            getMoreNewHouseData() {
                let that = this;
                return new Promise((resolve, reject) => {
                    let compStoreInfo = that.compStoreInfo;
                    let newHouseData = compStoreInfo.newHouseData || {};
                    if (newHouseData.isNoMoreData || newHouseData.noData) {
                        resolve("");
                        return;
                    }

                    privateData.newHouseApiParams.pageOffset++;
                    newHouseData.isLoading = true;
                    newHouseData.isNoMoreData = false;
                    newHouseData.noData = false;
                    compStoreInfo.newHouseData = newHouseData;
                    that.setData({
                        compStoreInfo: compStoreInfo
                    });
                    that.getNewHouseData()
                        .then((res) => {
                            if (res.length < privateData.newHouseApiParams.pageRows) {
                                newHouseData.isNoMoreData = true
                            }
                            newHouseData.isLoading = false;
                            newHouseData.noData = false;
                            let newHouseList = that.newHouseList || [];
                            newHouseList = newHouseList.concat(res);
                            // newHouseData.newHouseList = newHouseData.newHouseList.concat(res);
                            compStoreInfo.newHouseData = newHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo,
                                newHouseList: newHouseList
                                // ,haveNewHouse: true
                            });
                            resolve(res);
                        })
                        .catch((err) => {
                            newHouseData.isLoading = false;
                            newHouseData.isNoMoreData = false;
                            newHouseData.noData = false;
                            compStoreInfo.newHouseData = newHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo
                            });
                            reject(err);
                        });
                });
            },
            getMoreRentingHouseData() {
                let that = this;
                return new Promise((resolve, reject) => {
                    let compStoreInfo = that.compStoreInfo;
                    let rentingHouseData = compStoreInfo.rentingHouseData || {};
                    if (rentingHouseData.isNoMoreData || rentingHouseData.noData) {
                        resolve("");
                        return;
                    }

                    privateData.rentingHouseApiParams.pageNum++;
                    rentingHouseData.isLoading = true;
                    rentingHouseData.isNoMoreData = false;
                    rentingHouseData.noData = false;
                    compStoreInfo.rentingHouseData = rentingHouseData;
                    that.setData({
                        compStoreInfo: compStoreInfo
                    });
                    that.getErAndRentingHouseData("rentingHouseApiParams")
                        .then((res) => {
                            if (res.length < privateData.rentingHouseApiParams.pageSize) {
                                rentingHouseData.isNoMoreData = true
                            }
                            rentingHouseData.noData = false;
                            rentingHouseData.isLoading = false;
                            let zuHouseList = that.zuHouseList || [];
                            zuHouseList = zuHouseList.concat(res);
                            // rentingHouseData.rentingHouseList = rentingHouseData.rentingHouseList.concat(res);
                            compStoreInfo.rentingHouseData = rentingHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo,
                                zuHouseList: zuHouseList
                            });
                            resolve(res)
                        })
                        .catch((err) => {
                            rentingHouseData.noData = false;
                            rentingHouseData.isLoading = false;
                            rentingHouseData.isNoMoreData = false;
                            compStoreInfo.rentingHouseData = rentingHouseData;
                            that.setData({
                                compStoreInfo: compStoreInfo
                            });
                            reject(err);
                        });
                });
            },

            // 监听筛选条件变化
            onCompStoreChooseResultParamsChanged(name, info) {
                if (!info || !info.eventName) return;
                let wxNickname = this.userInfo.nickName;
                let archiveId = this.archiveId;
                var cityid = privateData.newHouseApiParams.brokerCityId;
                let map = new Map([
                    // 二手房
                    ["compStoreChooseRegion", {
                        index: 64,
                        text: [wxNickname, info.text, '出售', '购房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 1 }
                    }]
                    , ["compStoreChoosePrice", {
                        index: 65,
                        text: [wxNickname, info.text, '出售', '购房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 1 }
                    }]
                    , ["compStoreChooseHouseType", {
                        index: 66,
                        text: [wxNickname, info.text, '出售', '购房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 1 }
                    }]
                    , ["compStoreChooseMoreArea", {
                        index: 67,
                        text: [wxNickname, info.text + '㎡', '出售', '购房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 1 }
                    }]
                    , ["compStoreChooseMoreUsage", {
                        index: 68,
                        text: [wxNickname, info.text, '出售', '购房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 1 }
                    }]
                    // 新房
                    , ["compStoreChooseRegionNewHouse", {
                        index: 84,
                        text: [wxNickname, info.text],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 6 }
                    }]
                    , ["compStoreChoosePriceNewHouse", {
                        index: 85,
                        text: [wxNickname, info.text],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 6 }
                    }]
                    , ["compStoreChooseUseNewHouse", {
                        index: 86,
                        text: [wxNickname, info.text],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 6 }
                    }]
                    // 租房
                    , ["compStoreChooseRegionRentingHouse", {
                        index: 64,
                        text: [wxNickname, info.text, '出租', '租房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 2 }
                    }]
                    , ["compStoreChoosePriceRentingHouse", {
                        index: 65,
                        text: [wxNickname, info.text, '出租', '租房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 2 }
                    }]
                    , ["compStoreChooseHouseTypeRentingHouse", {
                        index: 66,
                        text: [wxNickname, info.text, '出租', '租房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 2 }
                    }]
                    , ["compStoreChooseMoreRentingHouseArea", {
                        index: 67,
                        text: [wxNickname, info.text + '㎡', '出租', '租房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 2 }
                    }]
                    , ["compStoreChooseMoreRentingHouseUsage", {
                        index: 68,
                        text: [wxNickname, info.text, '出租', '租房'],
                        params: { archiveId: archiveId, cityid: cityid, caseType: 2 }
                    }]
                ]);
                if (!map.has(info.eventName)) return;

                // 用户行为统计
                Behavi.formatConfig(map.get(info.eventName));
            },
            // 按钮切换回调
            onCompStoreChooseChanged() {
                this.dealApiParamsEvent();
            },

            dealApiParamsEvent() {
                let that = this;
                let event = privateData.dealApiParamsEventMap.get(that.currentClickTopBarEventName);
                return new Promise((resolve, reject) => {
                    that[event]()
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                            uni.showToast({
                                title: "获取数据失败啦！请稍后重试。",
                                icon: "none"
                            });
                        });
                });
            },
            dealErHouseApiParams() {
                let that = this;
                let currentClickTopBarEventName = that.currentClickTopBarEventName;
                let config = that.compStoreChooseTabConfig[currentClickTopBarEventName];
                let compStoreChooseTabConfigListMap = that.compStoreChooseTabConfigListMap;
                let compStoreChooseListMap = that.compStoreChooseListMap;
                return new Promise((resolve, reject) => {
                    let erHouseApiParams = {};
                    for (let k in privateData.erHouseApiParamsMoRen) {
                        erHouseApiParams[k] = privateData.erHouseApiParamsMoRen[k];
                    }
                    erHouseApiParams.pageNum = 1;
                    let content = config.content;
                    for (let i = 0; i < content.length; i++) {
                        let item = content[i];
                        if (item.event === "compStoreChooseRegion") {
                            if (item.leftValue) {
                                erHouseApiParams[item.leftApiKey] = item.leftValue;
                            }
                            if (item.rightValue) {
                                erHouseApiParams[item.rightApiKey] = item.rightValue;
                            }
                            if(item.buildId) {
                                erHouseApiParams[item.buildIdApiKey] = item.buildId;
                            }
                            continue;
                        }

                        if (item.event === "compStoreChooseMore") {
                            let moreMap = compStoreChooseListMap.compStoreChooseMore;
                            if (moreMap.areaValue) {
                                erHouseApiParams[item.areaApiKey] = moreMap.areaValue;
                            }
                            if (moreMap.usageValue) {
                                erHouseApiParams[item.houseTypeApiKey] = moreMap.usageValue;
                            }
                            if (moreMap.specialValue.length > 0) {
                                erHouseApiParams[item.specialApiKey] = moreMap.specialValue.join("|");
                            }
                            continue;
                        }

                        if (item.value) {
                            erHouseApiParams[item.apiKey] = item.value;
                        }
                    }
                    privateData.erHouseApiParams = erHouseApiParams;
                    return that.initErHouseData(true)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            },
            dealNewHouseApiParams() {
                let that = this;
                let currentClickTopBarEventName = that.currentClickTopBarEventName;
                let config = that.compStoreChooseTabConfig[currentClickTopBarEventName];
                let compStoreChooseTabConfigListMap = that.compStoreChooseTabConfigListMap;
                let compStoreChooseListMap = that.compStoreChooseListMap;
                return new Promise((resolve, reject) => {
                    let newHouseApiParams = {};
                    for (let k in privateData.newHouseApiParamsMoRen) {
                        newHouseApiParams[k] = privateData.newHouseApiParamsMoRen[k];
                    }
                    newHouseApiParams.pageNum = 1;
                    let content = config.content;
                    for (let i = 0; i < content.length; i++) {
                        let item = content[i];
                        if (item.event === "compStoreChooseRegionNewHouse") {
                            if (item.leftValue) {
                                newHouseApiParams[item.leftApiKey] = item.leftValue;
                            }
                            if (item.rightValue) {
                                newHouseApiParams[item.rightApiKey] = item.rightValue;
                            }
                            continue;
                        }

                        if (item.value && item.event !== "compStoreChoosePriceNewHouse") {
                            newHouseApiParams[item.apiKey] = item.value;
                            continue;
                        }

                        if (item.value && item.event === "compStoreChoosePriceNewHouse") {
                            let priceVal = item.value.split(":");
                            newHouseApiParams["priceMin"] = priceVal[0];
                            newHouseApiParams["priceMax"] = priceVal[1];
                        }
                    }
                    privateData.newHouseApiParams = newHouseApiParams;
                    return that.initNewHouseData(true)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            },
            dealRentingHouseApiParams() {
                let that = this;
                let currentClickTopBarEventName = that.currentClickTopBarEventName;
                let config = that.compStoreChooseTabConfig[currentClickTopBarEventName];
                let compStoreChooseTabConfigListMap = that.compStoreChooseTabConfigListMap;
                let compStoreChooseListMap = that.compStoreChooseListMap;
                return new Promise((resolve, reject) => {
                    let erHouseApiParams = {};
                    for (let k in privateData.rentingHouseApiParamsMoRen) {
                        erHouseApiParams[k] = privateData.rentingHouseApiParamsMoRen[k];
                    }
                    erHouseApiParams.pageNum = 1;
                    let content = config.content;
                    for (let i = 0; i < content.length; i++) {
                        let item = content[i];
                        if (item.event === "compStoreChooseRegionRentingHouse") {
                            if (item.leftValue) {
                                erHouseApiParams[item.leftApiKey] = item.leftValue;
                            }
                            if (item.rightValue) {
                                erHouseApiParams[item.rightApiKey] = item.rightValue;
                            }
                            if(item.buildId) {
                                erHouseApiParams[item.buildIdApiKey] = item.buildId;
                            }
                            continue;
                        }

                        if (item.event === "compStoreChooseMoreRentingHouse") {
                            let moreMap = compStoreChooseListMap.compStoreChooseMoreRentingHouse;
                            if (moreMap.areaValue) {
                                erHouseApiParams[item.areaApiKey] = moreMap.areaValue;
                            }
                            if (moreMap.usageValue) {
                                erHouseApiParams[item.houseTypeApiKey] = moreMap.usageValue;
                            }
                            continue;
                        }

                        if (item.value) {
                            erHouseApiParams[item.apiKey] = item.value;
                        }
                    }
                    privateData.rentingHouseApiParams = erHouseApiParams;
                    return that.initRentingHouseData(true)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            },

            // 关于用户行为埋点需要调用的方法
            pushMsg() {
                let archiveId = privateData.archiveId;
                if (archiveId > 0) {
                    new PushViewMsgStore({
                        userId: new UserInfoModel().getModel("me")
                            ? new UserInfoModel().getModel("me").userId || "" : "",
                        archiveId: archiveId,
                        cPlateType: this.Const.cPlateType_yxstore
                    }).send();
                }
            },

            // 门店分布
            toDeptMap() {
                uni.navigateTo({
                    url: "/pagesWeb/deptMapWx/deptMapWx"
                });
            },

            //   设置底部菜单数据
            setBottomMeum(){
                let that = this;
                uni.getSystemInfo({
                    success: res => {
                        let modelmes = res.model;
                        let isIphoneX = false;
                        if (modelmes.search('iPhone X') != -1) {
                            isIphoneX = true;
                            let _botTab = that.botTab;
                            _botTab.isIphoneX = isIphoneX;
                            that.setData({botTab: _botTab});
                        }
                    }
                });
            },

            // 底部菜单跳转
            swichTab(item){
                let tab = item.tab;
                let index = item.index;
                let botTab = this.botTab;
                if(tab != 'compshop') {
                    new CompStoreLeaveCompIndexModel().setModel(1);
                }
                new CompStoreFindDataAgentInfoModel().setModel(JSON.stringify(this.compStoreInfo.agentInfo));
                let userId = new UserInfoModel().getModel("me")
                    ? new UserInfoModel().getModel("me").userId || "" : "";
                let urlParams = {
                    archiveId: new CompStoreArchiveIdModel().getModel() || '',
                    compId: new CompStoreCompIdModel().getModel() || "",
                    compCityId: new CompStoreCompIdModel().getModel() || "",
                    cityId: new CompStoreCityIdModel().getModel() || "",
                    deptId: new CompStoreDeptIdModel().getModel() || "",
                };
                let url = "/pagesStore/mine/mine?archiveId=" + urlParams.archiveId
                    + "&compId=" + urlParams.compId + "&compCityId=" + urlParams.compCityId
                    + "&cityId=" + urlParams.cityId + "&deptId=" + urlParams.deptId;
                if(index == botTab.indexTab) return;

                if(tab == 'im') {
                    if(!urlParams.archiveId) {
                        uni.showToast({
                            icon: "none",
                            title: "暂无经纪人id"
                        });
                        return;
                    }

                    this.removeUnReadMsgNum();
                    uni.navigateTo({
                        url: botTab.im.url + "?accid=" + "uu_" + userId
                            + "&messageId=" + urlParams.archiveId + "&platform=store"
                    });
                    return;
                }

                uni.redirectTo({url: url});
            },

            removeUnReadMsgNum() {
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let map = new UnReadMsgModel().getModel() || {};
                delete(map[archiveId]);
                new UnReadMsgModel().setModel(map);
                this.unReadMsgNum = 0;
            },
            initUnReadMsgNum() {
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let unReadMsgNumMap = new UnReadMsgModel().getModel() || {};
                let unReadMsgNum = unReadMsgNumMap[archiveId] || 0;
                let botTab = this.botTab;
                botTab.im.unReadMsgNum = unReadMsgNum;
                this.botTab = botTab;
            },

            // 搜索
            searchBtn() {
                uni.navigateTo({
                    url: "/pagesHouse/search/search?from=index&isProperty=" + this.isProperty
                });
            },

            // 禁止穿透
            moveHandle() {},

            // ----------以下都没实现---------------

            // 发布委托按钮
            publishPropertyEntrust() {
                let isProperty = new CompStoreIsPropertyModel().getModel() || "";
                if (!isProperty || isProperty != '1') return;

                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let property = new CompStorePropertyInfoModel().getModel() || {};
                let baseUrl = '/pagesProperty/findHouse/findHouse';
                //如果没有 物业楼盘信息， 则 去获取 默认选取该物业公司下任意一个公司处理
                //没有楼盘信息处理(没有楼盘说明是 物业公司推广，肯定又 adminCompId ,cityId)
                let urlParams = {
                    compId: new CompStoreAdminCompIdModel().getModel() || "",
                    cityId: new CompStoreCityIdModel().getModel() || "",
                };
                if (property.buildInfo) {
                    urlParams = {
                        compId: property.propertyInfo.COMP_ID,
                        deptId: property.propertyInfo.DEPT_ID,
                        buildName: property.buildInfo.BUILD_NAME,
                        buildId: property.buildInfo.BUILD_ID,
                        regionId: property.buildInfo.BUILD_REGION,
                        regionName: property.buildInfo.REG_NAME,
                    };
                }
                if (!!archiveId && archiveId != 'null'){
                    urlParams['archiveId'] = archiveId;
                }
                for (let k in urlParams) {
                    if (baseUrl.indexOf("?") >= 0) {
                        baseUrl += "&" + k + "=" + urlParams[k];
                    } else {
                        baseUrl += "?" + k + "=" + urlParams[k];
                    }
                }
                uni.navigateTo({
                    url: baseUrl
                });
            },

            entrustButton() {
                this.setData({
                    delegateBoxShow: true
                });
            },

            publishDelegate(e) {
                let currentType = Number(e.currentTarget.dataset.tradetype);
                let thsp = this.compStoreInfo.agentInfo;
                let data = {
                    caseType: currentType, entrusturl: '/packageEntrust/pages/entrust/entrust', registration: '/packageEntrust/pages/registration/registration',
                    archiveId: thsp.archiveId, isVip: 1, serviceRegs: thsp.serviceRegs, userName: thsp.name, userPhoto: thsp.headerImg
                };
                Entrust.publishDelegate(data);
            },

            buildUrl(pageUrl, params) {
                let str = "?";
                for (let key in params) {
                    if (str === "?") {
                        str = str + key + "=" + params[key];
                        continue;
                    }

                    str = str + "&" + key + "=" + params[key];
                }
                return pageUrl + str;
            },

            morePerfectAgent() {
                console.error("morePerfectAgent");
                let that = this;
                uni.navigateTo({
                    url: that.buildUrl("/packageStore/pages/moreAgent/moreAgent", {
                        compCityId: privateData.cityId,
                        compId: privateData.compId
                    })
                });
            },


            // 查看更多
            lookMore(event) {
                this[event]();
            },
            moreErHouse() {
                let recommendInfo = this.recommendInfo;
                this.changeButtonClick({
                    text: recommendInfo.erHouse.text
                    , event: "initErHouseData"
                    , index: recommendInfo.erHouse.index
                });
            },
            moreNewHouse() {
                let recommendInfo = this.recommendInfo;
                this.changeButtonClick({
                    text: recommendInfo.newHouse.text
                    , event: "initNewHouseData"
                    , index: recommendInfo.newHouse.index
                });
            },
            moreZuHouse() {
                let recommendInfo = this.recommendInfo;
                this.changeButtonClick({
                    text: recommendInfo.zuHouse.text
                    , event: "initRentingHouseData"
                    , index: recommendInfo.zuHouse.index
                });
            },

            // 查看经纪人详情
            toBrokers() {
                uni.navigateTo({
                    url: '/packageBrokers/brokers/brokers'
                })
            },
            // 一键委托
            findHouse() {
                uni.setStorageSync('findDataAgentInfo', JSON.stringify(this.compStoreInfo.agentInfo));
               
                let archiveId = uni.getStorageSync('archiveId'),
                    compId = uni.getStorageSync('compId');
                uni.navigateTo({
                    url: `/pagesEntrust/privilegeFindHouse/privilegeFindHouse?archiveId=${archiveId}&compId=${compId}&deptId=${this.deptId}`
                })
            },

            //跳转Im咨询
            goToIm(){
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                if(!archiveId) {
                    uni.showToast({title: "暂无经纪人id", icon: "none"});
                    return;
                }

                this.removeUnReadMsgNum();
                uni.navigateTo({
                    url: '/pagesTool/messageDetail/messageDetail?messageId=' + archiveId
                        + "&platform=store",
                });
            },


            // 筛选蒙层
            compStoreChooseTabTcMarkClick() {
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                this.setData({
                    compStoreChooseTabTcShow: false
                    ,compStoreChooseTabConfig: compStoreChooseTabConfig
                });
            },
            // 筛选tab
            compStoreChooseTab(item, index) {
                index = Number(index);
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                this.setData({
                    compStoreChooseTabTcTemplateName: item.event + "Template"
                });
                let that = this;
                let query = uni.createSelectorQuery();
                query.select(".compStoreChooseTabNoFixedView").boundingClientRect(function (res) {
                    if (that.isIosPhone && that.showFixed)  {
                        that.setData({
                            chooseTabCurrentTop:  privateData.sectionHeaderLocationHeight+privateData.compStoreTopEmptyViewHeight
                        });
                        return;
                    }

                    that.setData({
                        chooseTabCurrentTop:  res.top
                    });
                }).exec();
                do {
                    if (this.compStoreChooseTabTcShow
                        && compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex
                        === index) {
                        compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                        this.setData({
                            compStoreChooseTabConfig: compStoreChooseTabConfig
                            ,compStoreChooseTabTcShow: false
                        });
                        break;
                    }

                    compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = index;
                    this.setData({
                        compStoreChooseTabConfig: compStoreChooseTabConfig
                        ,compStoreChooseTabTcShow: true
                    });
                }while (false);

            },
            // 区域
            compStoreChooseRegionLeftClick(item, index) {
                index = Number(index);
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].region;
                let compStoreChooseTabConfigClickItem =
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName]
                        .currentClickIndex];
                compStoreChooseListMap[regionName].leftCurrentCityId = item.cityId;

                if (compStoreChooseListMap[regionName].leftCurrentIndex === index
                    && compStoreChooseListMap[regionName].rightArrMap[item.cityId+""].length > 1) return;

                compStoreChooseListMap[regionName].leftCurrentIndex = index;
                compStoreChooseTabConfigClickItem.text = compStoreChooseTabConfigClickItem.moRenText;
                compStoreChooseTabConfigClickItem.leftValue = item.cityId;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .value = item.cityId;
                if (compStoreChooseListMap[regionName].rightArrMap[item.cityId+""].length <= 1) {
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event,item.cityId, item.text);
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                        .text = item.text;
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                        .buildId = "";
                    compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                    compStoreChooseTabConfigClickItem.rightValue = "";
                    this.setData({
                        compStoreChooseTabTcShow: false
                    });
                    this.postNc();
                }
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    = compStoreChooseTabConfigClickItem;

                if (index === 0) {
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                        .text
                        = compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName]
                        .currentClickIndex].moRenText;
                }

                this.setData({
                    compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseListMap: compStoreChooseListMap
                });
            },
            compStoreChooseRegionRightClick(item, index) {
                index = Number(index);
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].region;

                let leftItem = compStoreChooseListMap[regionName]
                    .leftArr[compStoreChooseListMap[regionName].leftCurrentIndex];
                compStoreChooseListMap[regionName].rightCurrentIndex = index;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .rightValue = "";
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .value = "";
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .buildId = "";
                do {
                    if (index === 0 && compStoreChooseListMap[regionName].leftCurrentIndex !== 0) {
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text
                            = leftItem.text;
                        break;
                    }

                    if (index === 0 && compStoreChooseListMap[regionName].leftCurrentIndex === 0) {
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                            .text = "区域";
                        break;
                    }

                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text
                        = item.text;
                }while (false);

                if (!(index === 0 && compStoreChooseListMap[regionName].leftCurrentIndex !== 0)) {
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                        .value = item.cityId;
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                        .rightValue = item.cityId;
                }
                this.postNc();
                this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event
                    ,item.cityId, item.text.indexOf("不限") >= 0 ? leftItem.text :  leftItem.text + item.text);
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                this.setData({
                    compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseListMap: compStoreChooseListMap
                    ,compStoreChooseTabTcShow: false
                });
            },
            //修改区域选择方式
            compStoreChooseRegionAddLeftClick(item, index) {
                index = Number(index);
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName = this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].region;
                let compStoreChooseListMap = this.compStoreChooseListMap;
                compStoreChooseListMap[regionName].addLeftCurrentIndex = index;
                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            //选择筛选具体的楼盘
            compStoreChooseRegionAddRightClick(item, index) {
                index = Number(index);
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =this
                    .compStoreChooseTabConfigListMap[currentClickTopBarEventName].region;
                let selectBuildName = item.BUILD_NAME || "";
                let buildId = item.BUILD_ID || "";
                compStoreChooseListMap[regionName].addRightCurrentIndex = index;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .leftValue = "";
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .rightValue = "";
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .value = buildId;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .buildId = buildId;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex]
                    .text = selectBuildName;
                this.postNc();
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                this.setData({
                    compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseListMap: compStoreChooseListMap
                    ,compStoreChooseTabTcShow: false
                });
            },
            // 价格列表点击
            compStoreChoosePriceClick(item, index) {
                index = Number(index);
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let regionName =
                    this
                        .compStoreChooseTabConfigListMap[currentClickTopBarEventName].price;

                do {
                    if (index === compStoreChooseListMap[regionName].currentIndex) {
                        break;
                    }

                    compStoreChooseListMap[regionName].currentIndex = index;
                    if (index === 0) {
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                            compStoreChooseTabConfig[currentClickTopBarEventName]
                                .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].moRenText;
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].value = "";
                        break;
                    }

                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                        item.text;
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].value =
                        item.value
                }while (false);
                if (index === compStoreChooseListMap[regionName].currentIndex) {
                    this.postNc();
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event
                        ,item.value, item.text);
                    this.setData({
                        compStoreChooseTabTcShow: false
                    });
                }
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue = "";
                compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue = "";

                this.setData({
                    compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseListMap: compStoreChooseListMap
                });
            },
            // 价格确定
            compStoreChoosePriceConfirm() {
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this
                        .compStoreChooseTabConfigListMap[currentClickTopBarEventName].price;

                if (!compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue
                    || !compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue) {
                    compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                    this.setData({
                        compStoreChooseTabTcShow: false
                        ,compStoreChooseTabConfig: compStoreChooseTabConfig
                    });
                    return;
                }

                if (compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue
                    && compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue
                    && (compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue
                        >= compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue)) {
                    uni.showToast({
                        title: "最大价格应该大于最小价格",
                        icon: "none",
                        duration: 1500
                        ,mask: true
                    });
                    return;
                }

                let uit = "万元";
                let map = new Map([
                    ["initNewHouseData", true]
                    ,["initRentingHouseData", true]
                ]);
                if (map.has(currentClickTopBarEventName)) {
                    uit = "元";
                }
                let inputValue = compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue
                    + ":" + compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue;
                let inputText = compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue
                    + "-" + compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue + uit;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].value = inputValue;
                compStoreChooseTabConfig[currentClickTopBarEventName]
                    .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text = inputText;

                this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event
                    , inputValue, inputText);
                compStoreChooseListMap[regionName].currentIndex = -1;
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                this.postNc();
                this.setData({
                    compStoreChooseTabTcShow: false
                    ,compStoreChooseListMap: compStoreChooseListMap
                    ,compStoreChooseTabConfig: compStoreChooseTabConfig
                });
            },
            compStoreChoosePriceMinInput(e) {
                let val = e && e.detail && e.detail.value ? e.detail.value : "";
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this
                        .compStoreChooseTabConfigListMap[currentClickTopBarEventName].price;

                compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue = val;
                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            compStoreChoosePriceMaxInput(e) {
                let val = e && e.detail && e.detail.value ? e.detail.value : "";
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this
                        .compStoreChooseTabConfigListMap[currentClickTopBarEventName].price;

                compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue = val;
                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            // 户型
            compStoreChooseHouseTypeClick(item, index) {
                index = Number(index);
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].houseType;

                do {
                    if (index === compStoreChooseListMap[regionName].currentIndex) {
                        break;
                    }

                    compStoreChooseListMap[regionName].currentIndex = index;
                    if (index === 0) {
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                            compStoreChooseTabConfig[currentClickTopBarEventName]
                                .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].moRenText;
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].value = "";
                        break;
                    }

                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                        item.text;
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].value =
                        item.value
                }while (false);
                if (index === compStoreChooseListMap[regionName].currentIndex) {
                    this.setData({
                        compStoreChooseTabTcShow: false
                    });
                    this.postNc();
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event
                        , item.value, item.text);
                }
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue = "";
                compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue = "";
                this.setData({
                    compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseListMap: compStoreChooseListMap
                });
            },
            // 更多
            compStoreChooseMoreAreaClick(item, index) {
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].more;

                let moreChooseTypeMap = privateData.moreChooseTypeMap || {};
                let moreChooseTypeMapItem = moreChooseTypeMap[regionName] || {};
                do {
                    if (moreChooseTypeMapItem.areaValue !== undefined
                        && moreChooseTypeMapItem.areaValue === item.value) {
                        moreChooseTypeMapItem.areaValue = "";
                        moreChooseTypeMap[regionName] = moreChooseTypeMapItem;
                        compStoreChooseListMap[regionName].areaValue = "";
                        compStoreChooseListMap[regionName].areaText = "";
                        break;
                    }

                    moreChooseTypeMapItem.areaValue = item.value;
                    moreChooseTypeMap[regionName] = moreChooseTypeMapItem;
                    compStoreChooseListMap[regionName].areaValue = item.value;
                    compStoreChooseListMap[regionName].areaText = item.text;
                }while (false);

                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            compStoreChooseMoreUsageClick(item, index) {
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].more;

                let moreChooseTypeMap = privateData.moreChooseTypeMap || {};
                let moreChooseTypeMapItem = moreChooseTypeMap[regionName] || {};
                do {
                    if (moreChooseTypeMapItem.usageValue !== undefined
                        && moreChooseTypeMapItem.usageValue === item.value) {
                        moreChooseTypeMapItem.usageValue = "";
                        moreChooseTypeMap[regionName] = moreChooseTypeMapItem;
                        compStoreChooseListMap[regionName].usageValue = "";
                        compStoreChooseListMap[regionName].usageText = "";
                        break;
                    }

                    moreChooseTypeMapItem.usageValue = item.value;
                    moreChooseTypeMap[regionName] = moreChooseTypeMapItem;
                    compStoreChooseListMap[regionName].usageValue = item.value;
                    compStoreChooseListMap[regionName].usageText = item.text;
                }while (false);

                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            compStoreChooseMoreSpecialClick(item, index) {
                index = Number(index);
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let specialValue = compStoreChooseListMap.compStoreChooseMore.specialValue || [];
                let specialText = compStoreChooseListMap.compStoreChooseMore.specialText || [];
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].more;

                let needPushItem = true;
                let dealSpecialValue = [];
                let dealSpecialText = [];
                if (specialValue.length > 0
                    && specialValue.indexOf(item.value) >= 0) {
                    for (let i = 0;i<specialValue.length;i++) {
                        if (specialValue[i] === item.value) continue;

                        dealSpecialValue.push(specialValue[i]);
                    }
                    needPushItem = false;
                    specialValue = dealSpecialValue;

                    for (let i = 0;i<specialText.length;i++) {
                        if (specialText[i] === item.value) continue;

                        dealSpecialText.push(specialText[i]);
                    }
                    specialText = dealSpecialText;
                }
                do {
                    if (specialValue.length < 3) {
                        break;
                    }

                    specialValue.shift();
                    specialText.shift();
                }while (false);

                if (needPushItem) {
                    specialValue.push(item.value);
                    specialText.push(item.text);
                }
                compStoreChooseListMap[regionName].specialValue = specialValue;
                compStoreChooseListMap[regionName].specialText = specialText;
                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            compStoreChooseMoreRevertClick() {
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].more;

                compStoreChooseListMap[regionName].areaValue = "";
                compStoreChooseListMap[regionName].areaText = "";
                compStoreChooseListMap[regionName].usageValue = "";
                compStoreChooseListMap[regionName].usageText = "";
                if (compStoreChooseListMap[regionName].specialValue) {
                    compStoreChooseListMap[regionName].specialValue = [];
                    compStoreChooseListMap[regionName].specialText = [];
                }
                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                });
            },
            compStoreChooseMoreConfirmClick() {
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName= this.currentClickTopBarEventName;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].more;

                do {
                    if (!compStoreChooseListMap[regionName].areaValue
                        && !compStoreChooseListMap[regionName].usageValue
                        && (!compStoreChooseListMap[regionName].specialValue
                            || compStoreChooseListMap[regionName].specialValue.length === 0)) {
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                            compStoreChooseTabConfig[currentClickTopBarEventName]
                                .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].moRenText;
                        break;
                    }

                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].moRenText + "  ";
                }while (false);
                if (compStoreChooseListMap[regionName].areaValue) {
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event+"Area"
                        ,compStoreChooseListMap[regionName].areaValue, compStoreChooseListMap[regionName].areaText);
                }
                if (compStoreChooseListMap[regionName].usageValue) {
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event+"Usage"
                        , compStoreChooseListMap[regionName].usageValue, compStoreChooseListMap[regionName].usageText);
                }
                if (compStoreChooseListMap[regionName].specialValue && compStoreChooseListMap[regionName].specialValue.length > 0) {
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event+"Special"
                        ,compStoreChooseListMap[regionName].specialValue ,compStoreChooseListMap[regionName].specialText);
                }
                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                this.postNc();
                this.setData({
                    compStoreChooseListMap: compStoreChooseListMap
                    ,compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseTabTcShow: false
                });
            },
            // 新房
            compStoreChooseUseNewHouseClick(item, index) {
                index = Number(index);
                let compStoreChooseTabConfig = this.compStoreChooseTabConfig;
                let currentClickTopBarEventName = this.currentClickTopBarEventName;
                let compStoreChooseListMap = this.compStoreChooseListMap;
                let regionName =
                    this.compStoreChooseTabConfigListMap[currentClickTopBarEventName].use;

                do {
                    if (index === compStoreChooseListMap[regionName].currentIndex) {
                        break;
                    }

                    compStoreChooseListMap[regionName].currentIndex = index;
                    if (index === 0) {
                        compStoreChooseTabConfig[currentClickTopBarEventName]
                            .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                            compStoreChooseTabConfig[currentClickTopBarEventName]
                                .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].moRenText;
                        break;
                    }

                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].text =
                        item.text;
                    compStoreChooseTabConfig[currentClickTopBarEventName]
                        .content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].value =
                        item.value
                }while (false);
                if (index === compStoreChooseListMap[regionName].currentIndex) {
                    this.postNc();
                    this.postParamsNc(compStoreChooseTabConfig[currentClickTopBarEventName].content[compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex].event
                        , item.value, item.text);
                    this.setData({
                        compStoreChooseTabTcShow: false
                    });
                }

                compStoreChooseTabConfig[currentClickTopBarEventName].currentClickIndex = -1;
                compStoreChooseListMap[regionName].compStoreChoosePriceMinInputValue = "";
                compStoreChooseListMap[regionName].compStoreChoosePriceMaxInputValue = "";
                this.setData({
                    compStoreChooseTabConfig: compStoreChooseTabConfig
                    ,compStoreChooseListMap: compStoreChooseListMap
                });
            },
            // 筛选发送通知
            postNc() {
                new Notification().postNotification(Notify.CompStoreChooseChanged.Name);
            },
            // 筛选发送参数通知
            postParamsNc(eventName = "compStoreChooseRegion", value, text, type = "") {
                if (!text || text.indexOf("不限") >= 0) return;

                new Notification().postNotification(Notify.CompStoreChooseResultParamsChanged.Name, {
                    eventName: eventName
                    ,value: value
                    ,text: text
                    ,type: type
                });
            },
        }
    }
</script>

<style>
    @import "../compStoreCss/compStoreBottomButton.css";
    @import "../compStoreCss/compStoreChooseTab.css";
    @import "../compStoreCss/compStoreErHouse.css";
    @import "../compStoreCss/compStoreIndex.css";
    @import "../compStoreCss/compStoreNewHouse.css";
    @import "../compStoreCss/compStoreRentingHouse.css";
    .empty_loading{
        position: fixed;
        z-index: 999;
        left: 0;
        right: 0;
        width: 100%;
        top: 0;
        height: 100%;
        background: #f5f5f5;
    }
    .topLine{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        color: #315591;
        background-color: #315591;
        height: 2px;
    }
    page{
        background-color: #FFFFFF;
        min-height: 90%;
    }
    .homeView{
        /*margin-top: -2upx;*/
        /*transform: translate(0, -4upx);*/
    }
    .homeView_hidden{
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .pageViewFixed{
        background: #f6f6f6;
        top: 0;
        left: 0;
        width: 100%;
        bottom: 0;
        position: fixed;
        z-index: -1;
    }

    .topBgView{
        position: fixed;
        z-index: -1;
        height: 510upx;
        width: 100%;
        top: -2upx;
        left: 0;
        background: linear-gradient(#315591, #f5f5f5);
        /*background-image: url("http://cdn.haofang.net/static/uuminiapp/compStore/banner_demo.jpg");*/
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .topBgImgView{
        width: 100%;
        height: 100%;
        z-index: 10;
    }
    .topBgMarkView{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        height: 510upx;
        z-index: 11;
        background-color: rgba(0,0,0,0.5);
    }
    .topBgColorView{
        width:100%;
        height:100upx;
        padding-top:30upx;
        background:-webkit-linear-gradient(rgba(49,85,145,1),rgba(49,85,145,0));
        background:linear-gradient(rgba(49,85,145,1),rgba(49,85,145,0));
        display:flex;
        position: fixed;
        top:0;
        z-index:12;
    }
    .topBgMarkBgColor{
        background: linear-gradient(rgba(246,246,246,0),rgba(246,246,246,1));
        position: fixed;
        top: 352upx;
        height: 160upx;
        width: 100%;
        z-index: -1;
    }
    .topBgMarkBgColorAnroid{
        background: -webkit-linear-gradient(#315591, #f5f5f5);
        background: linear-gradient(#315591, #f5f5f5);
        position: fixed;
        top: 356upx;
        height: 160upx;
        width: 100%;
        z-index: -1;
    }

    .flexRowStart{
        display: flex;
    }
    .flexColumnStart{
        display: flex;
        flex-direction: column;
    }
    .flexRowSpaceBetween{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .flexRowCenter{
        display: flex;
        justify-content: center;
    }
    .flexRowEnd{
        display: flex;
        justify-content: flex-end;
    }
    .flexColumnSpaceBetween{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .flexColumnCenter{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .titleInfoView{
        width: 100%;
        margin-top: 40upx;
        padding: 0 30upx;
        box-sizing: border-box;
        flex-shrink: 0;
    }
    .logoImgSrcView{
        width: 90upx;
        height: 90upx;
        overflow: hidden;
        flex-shrink: 0;
        margin-right: 30upx;
        border-radius: 10upx;
    }
    .titleInfoTextView{
        height: 90upx;
        width: 100%;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #FFFFFF;
        font-size: 20upx;
    }
    .titleInfoName{
        font-size: 38upx;
        min-height: 38upx;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .titleInfoHouseAgent{
        min-height: 20upx;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }


    .FixedViewView{
        position: fixed;
        top: -2upx;
        height: 88upx;
        z-index: 80;
        width: 100%;
        overflow: hidden;
    }
    .FixedView{
        position: fixed;
        top: -2upx;
        z-index: 99;
        width: 100%;
    }
    .topBgImgSrcFixedView{
        width: 100%;
        height: 510upx;
        z-index: 20;
    }
    .showChangeFixedView{
        background: -webkit-linear-gradient(rgba(49,85,145,1),rgba(49,85,145,0));
    }
    .changeButtonArrViewStickyTab{
        padding-bottom:30upx;
        box-sizing:border-box;
        /*background:#315591;*/
        /*padding-top: 10px;*/
    }
    .changeButtonArrViewSticky{
        position: -webkit-sticky;
        position: sticky;
        z-index: 82;
        top: 0;
        flex-shrink: 0;
    }
    .changeButtonArrView{
        padding-left: 30upx;
        box-sizing: border-box;
        height: 55upx;
        position: relative;
        flex-shrink: 0;
    }
    .changeButtonClickView{
        position: relative;
        height: 55upx;
        box-sizing: border-box;
        margin-right: 50upx;
        color:#fff;
        font-size:32upx;
        font-weight: bold;
        text-align: center;
    }
    .changeButtonClickViewActive{
        border-bottom:solid 4upx #fff;
    }
    .compStoreTopEmptyView{
        height: 30upx;
        flex-shrink: 0;
        width: 100%;
    }

    .pullUp, .pullUp_noData {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        text-align: center;
    }
    .pullUp .pullUpIcon {
        display: inline-block;
        height: 15px;
        width: 15px;
        border-radius: 100%;
        margin: 6px;
        border: 2px solid #666;
        border-bottom-color: transparent;
        vertical-align: middle;
        -webkit-animation: loading 0.75s linear infinite;
        animation: loading 0.75s linear infinite;
    }
    .pullUp.flip .pullUpIcon {
        -webkit-transform: rotate(0deg) translateZ(0);
    }
    .pullUp.loading .pullUpIcon {
        background-position: 0 100%;
        -webkit-transform: rotate(0deg) translateZ(0);
        -webkit-transition-duration: 0ms;
        -webkit-animation-name: loading;
        -webkit-animation-duration: 2s;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
    }
    @-webkit-keyframes loading {
        0% {
            transform: rotate(0deg);
        }

        50% {
            transform: rotate(180deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    .no-more-data {
        height: 80upx;
        line-height: 80upx;
        text-align: center;
        font-size: 26upx;
        color: #666666;
        margin-bottom: 20upx;
    }



    .sale_no_data {
        position: relative;
        top: 250upx;
        width: 100%;
        height: 400upx;
    }
    .no-pic {
        margin: 0 auto 20upx;
        width: 313upx;
        height: 221upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/compStore/nodata.png)no-repeat center;
        background-size: 100% 100%;
    }

    .indexContentView{
        margin-top: -2upx;
        padding-bottom: 50upx;
        box-sizing: border-box;
    }
    .indexContentView_height{
        height: 100%;
    }
    .indexContentView_height .compStoreIndexView{
        height: 100%;
    }
    page{
        height: 100%;
    }

    /* 搜索框 */
    .search-box{
        width: 136upx;
        height: 60upx;
        letter-spacing: 0upx;
        background-color: #ffffff;
        border-radius: 30upx;
        position: relative;
        opacity: 0.3;
        margin-right: 50upx;
        bottom: 5upx;
    }
    .search-icon{
        width: 30upx;
        height: 60upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/flagship/index/search.png) center center no-repeat;
        background-size: 30upx 29upx;
        position: absolute;
        top: -1upx;
        left: 21upx;
        /* top: 50%; */
        /* bottom: 50%; */
    }
    .search-text{
        width: 56upx;
        height: 60upx;
        font-size: 28upx;
        color: #ffffff;
        opacity: 1 !important;
        position: absolute;
        line-height: 60upx;
        top: -1upx;
        left: 62upx;
    }
    .homeView .shop{
        border-radius:24upx;
        height:48upx;
        text-align:center;
        line-height:48upx;
        font-size:26upx;
        color:#fff;
        background: #ff6f2e;
        padding:0 20upx;
        box-sizing: border-box;
        position: relative;
        white-space: nowrap;
        display: flex;
        flex-direction: row;
        justify-content: center;
        top: 15upx;
    }
    .phoneX-bottom{
        margin-bottom: 90upx !important;
    }
    .search-info{
        position: relative;
    }
</style>
