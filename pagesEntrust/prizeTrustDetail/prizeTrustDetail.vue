<template>
    <view>
        <!-- 加载动画 -->
        <scrollLoading v-if="isRequesting" :isScrollIng="true"></scrollLoading>

        <!-- 头部 -->
        <view v-if="!isRequesting">
            <!-- 经纪人介绍 -->
            <view class="f_r_b agent_top_view">
                <view @click="goToPerStore" class="agent_header_view">
                    <view class="agent_vip_icon" v-if="entrustUserInfo.isVip == 1"></view>
                    <image class="agent_header_img" :src="entrustUserInfo.brokerUserPicUrl" mode="aspectFill"></image>
                </view>

                <view class="f_c_c agent_info_view">
                    <view class="f_r_b">
                        <view @click.stop="setShield" class="f_r_s agent_name_info">
                            <view class="agent_name">{{ entrustUserInfo.brokerName }}</view>
                            <image class="shield_img" mode="aspectFill"
                                   src="http://cdn.haofang.net/static/uuminiapp/entrustImg/no_icon.png"></image>
                            <view class="shield_text">{{ isShield == 1 ? '解除屏蔽' : '屏蔽' }}</view>
                        </view>
                    </view>

                    <view class="f_r_b agent_top_des">
                        <view class="f_r_s star_list">
                            <image v-for="(starUrl, index) in entrustUserInfo.starList"  :key="index"
                                   class="agent_star" :src="starUrl"></image>

                            <view class="star_val">{{ entrustUserInfo.starLevel }}</view>

                            <view class="tradeNum" v-if="entrustUserInfo.receivingNum > 0">{{ entrustUserInfo.receivingNum }}单</view>
                        </view>

                        <view class="get_order_time" v-if="entrustUserInfo.pushLogTime">{{ entrustUserInfo.pushLogTime }} 接单</view>
                    </view>
                </view>
            </view>

            <!-- 经纪人的最后一条消息 -->
            <view v-if="lastMsg" class="last_msg_view f_r">
                <view @click="imChart" class="last_msg_cont f_r_s">
                    <view class='last_msg_arrows'>
                        <image src="http://cdn.haofang.net/static/uuminiapp/entrustImg/entrust-detail-arrows.png"></image>
                    </view>
                    <view class='last_msg_text'>
                        <text class='last_msg_send_time'>{{ lastMsgTime }}</text>{{ lastMsg }}
                    </view>
                    <!--  红点  -->
                    <view class="last_msg_red_point" v-if="brokerUnreadNum">{{ brokerUnreadNum }}</view>
                </view>
            </view>

            <!-- 委托进度 无投诉-->
            <view :class="'progress-' + pushStatusClass" class="manager-progress"
                  v-if="entrustUserInfo.isAppeal == 0 && entrustUserInfo.requireStatus != 0 && entrustUserInfo.rewardStatus!=2 && entrustUserInfo.rewardStatus != 3">
                <view class='line-w'></view>
                <view class="condition-box">
                    <view class="condition">
                        <view class='order-icon'></view>
                        接单
                    </view>
                    <view class="condition">
                        <view :class='pushStatusClass >= 2 ? "tj-icon" :"no-tj"'>
                            <image v-if="pushStatusClass >= 2" mode="widthFix"
                                   src='http://cdn.haofang.net/static/uuminiapp/new_images/tj_icon.png'></image>
                            <image v-if="pushStatusClass < 2" mode="widthFix"
                                   src='http://cdn.haofang.net/static/uuminiapp/entrustImg/no_tj_icon.png'></image>
                        </view>
                        推荐
                    </view>
                    <view class="condition">
                        <view :class='pushStatusClass >= 3 ? "dk-icon" :"no-dk"'>
                            <image v-if="pushStatusClass >= 3" mode="widthFix"
                                   src='http://cdn.haofang.net/static/uuminiapp/new_images/dk_icon.png'></image>
                            <image v-if="pushStatusClass < 3" mode="widthFix"
                                   src='http://cdn.haofang.net/static/uuminiapp/entrustImg/no_dk.png'></image>
                        </view>
                        带看
                    </view>
                    <view class="condition">
                        <view :class='pushStatusClass >= 4 ? "cj-icon" :"no-cj"'></view>
                        成交
                    </view>
                    <view class='line-w-a'></view>
                </view>
            </view>

            <!-- 委托进度 有投诉-->
            <view :class="'progress-' + pushStatusClass" class="manager-progress"
                  v-if="entrustUserInfo.rewardStatus == 2 || entrustUserInfo.rewardStatus == 3">
                <view class='line-w'></view>
                <view class="condition-box">
                    <view class="condition">
                        <view class='order-icon'></view>
                        接单
                    </view>

                    <view class="condition">
                        <view :class='pushStatusClass >= 2 ? "tj-icon" :"no-tj"'>
                            <image v-if="pushStatusClass >= 2" mode="widthFix"
                                   src='https://zdzfapi.haofang.net/PublicC/source/images/publish/kanfang-ed-icon.png'></image>
                            <image v-if="pushStatusClass < 2" mode="widthFix"
                                   src='https://zdzfapi.haofang.net/PublicC/source/images/publish/kanfang.png'></image>
                        </view>房勘
                    </view>

                    <view class="condition tousu-fail">
                        <view :class='entrustUserInfo.rewardStatus == 4 ? "tousu-success" :"no-tousu-success"'></view>
                        {{ entrustUserInfo.rewardStatus == 2 ? '投诉中' : entrustUserInfo.rewardStatus == 3 ? '投诉结束': '投诉'}}</view>
                    <view class='line-w-a'></view>
                </view>
            </view>

            <!-- 空的灰色view -->
            <view class="empty_gray_view"></view>
        </view>

        <!-- 内容区 -->
        <block v-if="!isRequesting">
            <!-- 房源推荐 -->
            <view class="house_recomend_view" v-if="recomendHouseList && recomendHouseList.length > 0">
                <view class="recomend_house_item" v-for="(item, index) in recomendHouseList" :key="index">
                    <view class="recomend_house_item_info">
                        <erHouseListItem :item="item"></erHouseListItem>
                        <!-- 拒绝 -->
                        <image v-if="item.recomHouseStatus == 1"
                               src="http://cdn.haofang.net/static/uuminiapp/entrustDetail/refuse_house.png"
                               mode="aspectFill" class="recomend_house_tag"></image>
                        <!-- 假房源 -->
                        <image v-if="item.recomHouseStatus == 2"
                               src="http://cdn.haofang.net/static/uuminiapp/entrustDetail/fake_house.png"
                               mode="aspectFill" class="recomend_house_tag"></image>
                        <!-- 不合适	 -->
                        <image v-if="item.recomHouseStatus == 3"
                               src="http://cdn.haofang.net/static/uuminiapp/entrustDetail/inappropriate_house.png"
                               mode="aspectFill" class="recomend_house_tag"></image>
                        <!-- 下架	 -->
                        <image v-if="item.recomHouseStatus == 4 || item.recomHouseStatus == 6 || item.recomHouseStatus == 7"
                               src="http://cdn.haofang.net/static/uuminiapp/entrustDetail/down_house.png"
                               mode="aspectFill" class="recomend_house_tag"></image>
                        <!-- 取消	 -->
                        <image v-if="item.recomHouseStatus == 5"
                               src="http://cdn.haofang.net/static/uuminiapp/entrustDetail/candel_house.png"
                               mode="aspectFill" class="recomend_house_tag"></image>
                    </view>

                    <!-- 房源进度 -->
                    <view v-if="item.recomHouseStatus == 0">
                        <view class="recomend_border"></view>
                        <view class="f_r_c look_house_view" v-if="entrustUserInfo.pushStatus==4 && entrustUserInfo.rewardStatus!=2 && entrustUserInfo.rewardStatus!=3">
                            <view @click.stop="disAgreeLookHouse(item)"
                                  class="is_look_this_house_btn no_look_house">不看该房</view>
                            <view @click.stop="agreeLookHouse(item)"
                                  class="is_look_this_house_btn agree_look_house">同意看房</view>
                        </view>

                        <view class="f_r_c yue_look_tips" v-else-if="entrustUserInfo.pushStatus==2 && entrustUserInfo.rewardStatus<2">
                            正在火速赶来为您服务,请耐心等待
                        </view>

                        <view class="f_r_c yue_look_tips" v-else-if="entrustUserInfo.pushStatus==7 && entrustUserInfo.rewardStatus<2">
                            正在为您介绍客户,请耐心等待
                        </view>

                        <view class="appeal-con" v-else-if="entrustUserInfo.rewardStatus == 2">
                            <view class="house-progress-text appeal-note">正向您发起投诉，如有疑问可进行申诉</view>
                            <view class="appeal-btn">
                                <view class="appeal-txt" @click.stop='sendAppeal'>我要申诉</view>
                            </view>
                        </view>

                        <view class="f_r_c dai_look_evaluate_view" v-else-if="item.seeStatus == 2">
                            <view @click="writeEvaluate(item)"
                                  class="dai_look_evaluate_btn is_look_this_house_btn">带看评价</view>
                        </view>

                        <view class="f_r_c yue_look_tips"
                              v-else-if="item.seeStatus == 3 && item.brokerMoney == -1">
                            请对本次服务进行中评价
                        </view>

                        <view class="f_r_c dai_look_evaluate_view"
                              @click="serviceFinishWrite(item)"
                              v-else-if="entrustUserInfo.isEvaluate == 0 && entrustUserInfo.requireStatus == 2 && entrustUserInfo.pushStatus == 10">
                            <view class="is_look_this_house_btn agree_look_house">服务评价</view>
                        </view>

                        <view class="f_r_c yue_look_tips"
                              v-else-if="entrustUserInfo.rewardStatus == 3">
                            投诉处理完毕，奖励金已退还经纪人
                        </view>
                    </view>
                </view>
            </view>

            <!-- 空的灰色view -->
            <view class="empty_gray_view" v-if="recomendHouseList && recomendHouseList.length > 0"></view>

            <!-- 未评价 -->
            <view class="finish_evaluate_view" v-if="(entrustUserInfo.isEvaluate != 1 && showCompleteEvaDialog) || entrustUserInfo.isEvaluate == 1">
                <view class="server-evaluate-result"><text>本次服务评价：</text></view>
                <view class="f_r_c finish_evaluate_star_view">
                    <block v-for="(url, index) in noFinishServiceStarList" :key="index">
                        <image @click="noFinishStarBtn(index)" class="finish_evaluate_star"
                               :src="url"></image>
                    </block>
                </view>

                <!-- 原因 -->
                <view class="no_finish_reason_view f_r_s">
                    <block v-for="(text, index) in (noMeetReasonMap[serviceStarVal] || [])" :key="index">
                        <view :class="noMeetReasonSelectedMap[serviceStarVal] && ((noMeetReasonSelectedMap[serviceStarVal][0] && noMeetReasonSelectedMap[serviceStarVal][0] == index) || (noMeetReasonSelectedMap[serviceStarVal][1] && noMeetReasonSelectedMap[serviceStarVal][1] == index) || (noMeetReasonSelectedMap[serviceStarVal][2] && noMeetReasonSelectedMap[serviceStarVal][2] == index) || (noMeetReasonSelectedMap[serviceStarVal][3] && noMeetReasonSelectedMap[serviceStarVal][3] == index) || (noMeetReasonSelectedMap[serviceStarVal][4] && noMeetReasonSelectedMap[serviceStarVal][4] == index) || (noMeetReasonSelectedMap[serviceStarVal][5] && noMeetReasonSelectedMap[serviceStarVal][5] == index) || (noMeetReasonSelectedMap[serviceStarVal][6] && noMeetReasonSelectedMap[serviceStarVal][6] == index) || (noMeetReasonSelectedMap[serviceStarVal][7] && noMeetReasonSelectedMap[serviceStarVal][7] == index)) ? 'no_finish_reason_item_active' : ''"
                              @click="noMeetReasonChoose(index)"
                              class="no_finish_reason_item">{{ text }}</view>
                    </block>
                </view>

                <view class="no_finish_remark" v-if="serviceStarVal <= 3">
					<textarea
                            placeholder="其他原因可在此对经纪人匿名反馈，帮助我们提高质量。"
                            @input="completeEvaContentInput"
                            class="no_finish_textarea"
                            placeholder-class="no_finish_textarea_pl"
                            maxlength="100"></textarea>
                    <view class="no_finish_textarea_num">{{completeEvaContent.length}}/100字</view>
                </view>

                <view class="no_finish_confirm_btn" @click='submitCompleteEvaData'>提交匿名评价</view>

                <view class="no_finish_bottom_view"></view>
            </view>

            <!-- 已评价 -->
            <view class="finish_evaluate_view" v-else-if="entrustUserInfo.isEvaluate == 1">
                <view class="server-evaluate-result"><text>服务评价</text><text>(经纪人不会看到您的评价)</text></view>

                <view class="f_r_c finish_evaluate_star_view">
                    <block v-for="(url, index) in finishServiceStarList" :key="index">
                        <image class="finish_evaluate_star" :src="url"></image>
                    </block>
                </view>
            </view>

            <!-- 房源跟进 -->
            <view class="follow_view" :class="followDetailShow ? 'show-follow-detail' : ''">
                <view class="follow_title">委托跟进</view>

                <view class="follow_list">
                    <view class="follow_item f_r_s"
                          v-for="(item, index) in followList"
                          :key="index" v-show="followDetailShow || (!followDetailShow && index < showTrackNum)">
                        <view class="follow-li-left">
                            <view class="follow-img">
                                <image :src="item.photoUrl" mode="aspectFill"></image>
                            </view>
                            <view class="follow-line"></view>
                        </view>

                        <view class="follow-li-right">
                            <view class="follow-li-tt">{{ item.trackTitle }}</view>
                            <view class="follow-li-detail">{{ item.trackContent }}</view>
                        </view>
                    </view>
                </view>

                <view v-if="followList.length > showTrackNum && !followDetailShow"
                      class="lookMoreFollow follow-more-btn" @click="followDetailTap">
                    {{ !followDetailShow ? '查看更多' : '收起'}}</view>
            </view>
        </block>


        <!-- 完成支付的服务评价 -->
        <view v-else-if="entrustUserInfo.requireStatus == 2">
            <!-- 已评价 -->
            <view class="finish_evaluate_view" v-if="entrustUserInfo.isEvaluate == 1">
                <view class="finish_evaluate_title">佣金（中介费）总额:</view>
                <view class="finish_evaluate_money">￥{{ serviceEvaActionInfo.brokerMoney || "" }}</view>
                <view class="finish_evaluate_house">房屋{{ entrustUserInfo.caseType == '3'?'总价':'租金' }}{{ serviceEvaActionInfo.houseMoney || "" }}{{ serviceEvaActionInfo.priceUnit || "" }}</view>
                <view class="finish_evaluate_pay_detail">
                    <view class="finish_evaluate_pay_detail_line"></view>
                    <view class="finish_evaluate_pay_detail_text">线上佣金支付明细</view>
                </view>

                <view class="online-pay-info">
                    <view class="online-pay-li">线上已支付: <text>{{ serviceEvaActionInfo.onlinePayMoney }}元</text></view>
                    <view class="online-pay-li" v-if="serviceEvaActionInfo.shareMoney">优惠券抵扣: <text>{{ serviceEvaActionInfo.shareMoney }}元</text></view>
                </view>
                <view class='pay-text'>线下还应支付：<text>{{ serviceEvaActionInfo.offlinePayMoney }}元</text></view>

                <view class="server-evaluate-result"><text>服务评价</text><text>(经纪人不会看到您的评价)</text></view>

                <view class="f_r_c finish_evaluate_star_view">
                    <block v-for="(url, index) in finishServiceStarList" :key="index">
                        <image class="finish_evaluate_star" :src="url"></image>
                    </block>
                </view>
            </view>

            <!-- 未评价 -->
            <view class="finish_evaluate_view" v-else>
                <view class="finish_evaluate_title">线上佣金（中介费）实际支付:</view>
                <view class="finish_evaluate_money">￥{{ serviceEvaActionInfo.realPayMoney4C || "" }}</view>
                <view class="finish_evaluate_find_house">恭喜您找到好房，祝您新居生活幸福！</view>

                <view class="server-evaluate-result"><text>本次服务评价：</text></view>
                <view class="f_r_c finish_evaluate_star_view">
                    <block v-for="(url, index) in noFinishServiceStarList" :key="index">
                        <image @click="noFinishStarBtn(index)" class="finish_evaluate_star"
                               :src="url"></image>
                    </block>
                </view>

                <!-- 原因 -->
                <view class="no_finish_reason_view f_r_s">
                    <block v-for="(text, index) in (noMeetReasonMap[serviceStarVal] || [])" :key="index">
                        <view :class="noMeetReasonSelectedMap[serviceStarVal] && ((noMeetReasonSelectedMap[serviceStarVal][0] && noMeetReasonSelectedMap[serviceStarVal][0] == index) || (noMeetReasonSelectedMap[serviceStarVal][1] && noMeetReasonSelectedMap[serviceStarVal][1] == index) || (noMeetReasonSelectedMap[serviceStarVal][2] && noMeetReasonSelectedMap[serviceStarVal][2] == index) || (noMeetReasonSelectedMap[serviceStarVal][3] && noMeetReasonSelectedMap[serviceStarVal][3] == index) || (noMeetReasonSelectedMap[serviceStarVal][4] && noMeetReasonSelectedMap[serviceStarVal][4] == index) || (noMeetReasonSelectedMap[serviceStarVal][5] && noMeetReasonSelectedMap[serviceStarVal][5] == index) || (noMeetReasonSelectedMap[serviceStarVal][6] && noMeetReasonSelectedMap[serviceStarVal][6] == index) || (noMeetReasonSelectedMap[serviceStarVal][7] && noMeetReasonSelectedMap[serviceStarVal][7] == index)) ? 'no_finish_reason_item_active' : ''"
                              @click="noMeetReasonChoose(index)"
                              class="no_finish_reason_item">{{ text }}</view>
                    </block>
                </view>

                <view class="no_finish_remark" v-if="serviceStarVal <= 3">
					<textarea
                            placeholder="其他原因可在此对经纪人匿名反馈，帮助我们提高质量。"
                            @input="completeEvaContentInput"
                            class="no_finish_textarea"
                            placeholder-class="no_finish_textarea_pl"
                            maxlength="100"></textarea>
                    <view class="no_finish_textarea_num">{{completeEvaContent.length}}/100字</view>
                </view>

                <view class="no_finish_confirm_btn" @click='submitCompleteEvaData'>提交匿名评价</view>

                <view class="no_finish_bottom_view"></view>
            </view>
        </view>


        <!-- 屏蔽弹窗 -->
        <view class='to-wrap' v-if="blockMsgToast">
            <view class='tost-box'>
                <view class='tost-title'>屏蔽提示</view>
                <view class='tost-txt'>屏蔽后双方不能再进行任何联系，订单进入冻结状态，是否屏蔽？</view>
                <view class='toat-btn'>
                    <view class='recall' @click="cancelBlock">不屏蔽了</view>
                    <view class='pull' @click="confirmBlock">确定屏蔽</view>
                </view>
            </view>
        </view>

        <!-- 带看评价弹窗 -->
        <evaluate v-if="evaluateTc" :recomInfoId="recomInfoId"
                  :entrustId="entrustId"
                  @onEvaluateFinishChanged="onEvaluateFinishChanged"
                  @onEvaluateChanged="onEvaluateChanged"></evaluate>

        <!--申诉理由-->
        <view class="refuse-broker-box" @click="closeAppeal" v-if="appealFlagTc">
            <view class="refuse-broker-content" @click.stop="">
                <view class="appeal-broker-header">
                    <view class="refuse-broker-tt">申诉理由</view>
                    <view class="refuse-broker-close" @click="closeAppeal"></view>
                </view>
                <view class="refuse-broker-main">
                    <view class="reason_box_remark_appeal">
                        <textarea placeholder="请填写申诉理由" v-model="appealContent"
                                  placeholder-class="reason-remark-text-placeholder"
                                  maxlength="100"></textarea>
                        <view>{{appealContent.length}}/100字</view>
                    </view>
                </view>
                <view class="refuse-broker-footer-line"></view>
                <view class="refuse-broker-footer appeal-broker-submit"
                      @click.stop="submitAppealData">提交申诉</view>
            </view>
        </view>

        <!--隐私保护-->
        <view class="privacy-box" v-if="privacyBoxShow && (entrustUserInfo.isEvaluate != 1 || entrustUserInfo.pushStatus == 10)">
            <view class="privacy-title">
                <view class="privacy-txt">隐私保护</view>
                <view class="privacy-cancel" @click='privacyCancelEvent'>×</view>
            </view>
            <view class="privacy-txt-box">
                为保护您的隐私，经纪人无法看到您的真实号码，只能通过悠居客转接电话联系您。若对房源无意向，请勿随意告知对方手机号或进行回拨。如不愿再次接听该经纪人的转接电话，可在委托详情页中拒绝该经纪人服务！
            </view>
        </view>

        <!--投诉通知-->
        <view class="grievance-bomp" v-if="grievanceBomp">
            <view class="grievance-bomp-con">
                <view class="grievance-title">投诉通知</view>
                <view class="grievance-img"></view>
                <view class="grievance-txt">您的有奖委托被经纪人{{entrustUserInfo.brokerName}}投诉 具体原因请查看委托跟进,若有异议可发起申诉。如投诉属实奖励金将退还经纪人</view>
                <view class="grievance-btn" @click='grievanceBompCancel'>我知道了</view>
            </view>
        </view>

        <!--有奖委托红包奖励显示-->
        <view class="youjiang-trust-bomp" v-if="prizeTrustBompShow">
            <view class="youjiang-trust-con">
                <view class="youjiang-trust-head">
                    <view class="price-head-note">收到奖励金啦!</view>
                </view>
                <view class="youjiang-trust-middle">
                    <view class="youjiang-money">
                        <view class="money-unit">￥</view>
                        <view class="money-num">{{entrustUserInfo.reWardMoney}}</view>
                    </view>
                    <view class="youjiang-money-note note-top">收到来自经纪人:{{entrustUserInfo.brokerName}}的奖励金,</view>
                    <view class="youjiang-money-note note-bottom">奖励金已存入'我的账户'中,</view>
                    <view class="youjiang-money-note note-bottom">若未被投诉10天后可提现</view>
                </view>
                <view class="youjiang-trust-foot" @click='youjiangBompEvent'>我知道了</view>
            </view>
        </view>

        <!-- 授权 -->
        <get-user-info></get-user-info>
    </view>
</template>

<script>
    import { GetEntrustDetail, DisAgreeLookHouse,
        WriteServiceEvaluate, PaySuccessWriteServiceEvaluate,
        GetEntrustFollowList,
        AgreeLookHouse } from "@/net/entrust/EntrustDetail.js";
    import { UserInfoModel } from "@/model/UserInfoModel.js";
    import { Notification } from "@/utils/Notification.js";
    import { Notify } from "@/utils/Notify.js";
    import { GetStarList, formatTimeNew } from "@/utils/common.js";
    import { GetChartDetail } from "@/net/im/GetChartDetail.js";
    import { UnReadMsgModel } from "@/model/im/UnReadMsgModel.js";
    import { IsInBlackList } from "@/net/im/IsInBlackList.js";
    import { BlockMsg } from "@/net/im/BlockMsg.js";
    import { ErHouseListItem } from "@/utils/Const.js";
    import erHouseListItem from "@/components/erHouseListItem.vue";
    import evaluate from "@/components/entrust/detail/evaluate.vue";
    import { Const } from "@/utils/Const.js";
    import {
        SaleHouseAgreeLookHouse,
        SaleHouseDisagreeLookHouse,
        SaleHouseSubmitAppeal
    } from "../../net/entrust/EntrustDetail";
    import {CommonModel} from "../../model/CommonModel";

    let privateData = {
        newMsgTimeOut: null
    };
    export default {
        components: {
            erHouseListItem,
            evaluate
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

        onShareAppMessage() {
            return new this.ShareAppMessage().init();
        },

        data() {
            return {
                prizeTrustBompShow: false,  // 有将委托弹窗
                grievanceBomp: false,  // 投诉通知弹窗
                privacyBoxShow: false,  // 隐私保护弹窗
                appealContent: "", // 申诉的理由
                appealFlagTc: false, // 申诉弹窗
                caseType: 1, // 1: 卖房 2：出租 3：买房 4：求租
                isRequesting: true,
                // 委托id
                entrustId: "",
                isShield: 0, // 是否是屏蔽 1: yes
                // 委托经纪人信息
                entrustUserInfo: {
                    "integrity": 0, //"是否是诚信经纪人（1是0否）",
                    "brokerArchiveId": "",
                    "brokerName": "",
                    "brokerUserPicUrl": "",
                    "brokerMobile": "",//接单经纪人的手机号
                    "entrustHouseNum": "0",
                    "receivingNum": "",//经纪人的成功接单次数-用于IM聊天界面、委托详情界面
                    "currVipQueueStatus": "",
                    //求租求购：2接单、3带看、4完成、5推荐，出租出售：2已接单 3已联系 4申请房勘 5同意房勘 6转入系统 7房勘完成
                    "pushStatus": "2",
                    "requireStatus": "",//委托状态：0已取消 1委托中 2已成交
                    "isEvaluate": 0,//成交以后是否对服务评价，1：已评价，非1未评价
                    "starLevel": "",//星级1-5
                    "starList": [],//星级1-5
                    "pushLogId": "",//经纪人接单信息ID
                    "recomInfoId": "",//经纪人的推荐信息ID，这个值只有在推荐信息成交后才会有值，非成交情况该值没有用
                    "vipCaseId": "",
                    "caseType": "",//委托类型：1出售 2整租 3求购 4求租 5合租
                    "daikanCount": "0",
                    "isUpdateRedFlag": "0",
                    "isVip": "0",
                    "isContact": "0",
                    "rewardType": "",//0普通委托1有奖委托
                    "rewardStatus": "",//有奖委托状态0默认 1已支付 2投诉中 3投诉成功 4成功失败
                    "isAppeal": "",//是否有申诉1是0否
                    "complaintId": ""//投诉ID
                },

                lastMsg:'',//最后一条消息体,默认值
                lastMsgTime:'',//最后一条消息发送时间
                unreadNum: 0,//总的消息未读数，包括经纪人和客服发来的消息（之所以要和brokerUnreadNum作区分是/utils/_im.js这个公用页面已经将该字段占用了，表示所有的未读消息，然后发送到所有引入了该公共文件的页面）
                brokerUnreadNum: 0,//指定经纪人发来的消息未读数，不包括其他人的消息（区分原因同上）

                pushStatusClass: '1',//流程对应的进度条值(1-4):新增
                blockMsgToast: false,  // 屏蔽的弹窗

                recomendHouseList: [],  // 推荐房源数组
                evaluateTc: false,  // 评价弹窗
                recomInfoId: "",
                showCompleteEvaDialog: false,  // 完成
                serviceEvaActionInfo: {},  // 完成服务评价的值
                finishServiceStarList: [],  // 已评价的星数组
                noFinishServiceStarList: [],  // 未评价的星数
                serviceStarVal: 4,  // 未评价星
                noMeetReasonMap: {
                    1: ["讲解很不清晰", "专业知识不强", "反馈不及时", "服务态度不好"],
                    2: ["讲解一般", "专业度不高", "反馈一般", "服务态度一般"],
                    3: ["讲解有待提升", "专业度有待提升", "反馈一般", "服务态度一般"]
                },  // 不满意的原因
                noMeetReasonSelectedMap: {
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: []
                },
                completeEvaContent: "",  // 未评价输入原因

                followList: [],  // 委托跟进列表
                showTrackNum: 2,
                followDetailShow: false,  // 是否展示更多
            }
        },

        onLoad(params) {
            // 监听用户信息授权
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
            // 监听委托新消息
            new Notification().addObserver(this, "NewMsgChanged", Notify.NewMsgChanged.Name);
            // 监听更新消息体
            new Notification().addObserver(this, "UpChartMsgChanged", Notify.UpChartMsgChanged.Name);
            this.initParams(params);
            this.initData();
            this.initNoFinishStarList();
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        onPullDownRefresh() {
            this.initData()
                .then(res => {
                    uni.stopPullDownRefresh();
                })
                .catch(err => {
                    uni.stopPullDownRefresh();
                });
        },

        methods: {
            // 新消息回调
            UpChartMsgChanged(name, item = {}) {
                clearTimeout(privateData.newMsgTimeOut);
                privateData.newMsgTimeOut = null;
                if(item.messageId && this.entrustUserInfo.brokerArchiveId == item.messageId) {
                    privateData.newMsgTimeOut = setTimeout(() => {
                        if(!privateData.newMsgTimeOut) return;

                        this.initChart();
                    }, 1000);
                }
            },

            // 委托新消息回调
            NewMsgChanged(name, item) {
                // 委托类型在执行
                if(item.type === Notify.NewMsgChanged.Type_entrust) {
                    this.initData();
                }
            },

            // 授权回调
            UserInfoChanged() {
                this.initData();
            },

            // 初始化参数
            initParams(params) {
                if(params.entrustId) {
                    this.entrustId = params.entrustId;
                }
            },

            // 初始化数据
            initData() {
                let me = new UserInfoModel().getModel("me") || {};
                if(!me.userId) return Promise.resolve("暂无userId");

                return new Promise((resolve, reject) => {
                    Promise.all([
                        this.initEntrustDetail(),
                    ]).then(res => {
                        this.isRequesting = false;
                        resolve(res);
                    })
                        .catch(err => {
                            this.isRequesting = false;
                            reject(err);
                        });
                });
            },

            // 初始化委托详情
            initEntrustDetail() {
                let me = new UserInfoModel().getModel("me") || {};
                if(!me.userId) return Promise.reject("暂无userId");

                return new GetEntrustDetail({pushLogId: this.entrustId, userId: me.userId}).send()
                    .then(res => {
                        let custHouseList = res.DATA ? res.DATA.housingHouseList || [] : [];
                        let entrustUser = res.DATA ? res.DATA.entrustUser || {} : {};
                        if(res.STATUS != 1) {
                            uni.showModal({
                                title: "温馨提示",
                                content: "获取委托详情失败啦！请稍后重试。",
                                showCancel: false,
                                confirmColor: "#ab7f2e",
                                confirmText: "我知道了",
                            });
                            return Promise.reject(res);
                        }

                        entrustUser.starLevel = entrustUser.starLevel && parseInt(entrustUser.starLevel) >= 3
                            ? entrustUser.starLevel : "3.0";
                        if(entrustUser.pushLogTime && entrustUser.pushLogTime.length > 5) {
                            entrustUser.pushLogTime = entrustUser.pushLogTime.substr(-11, 11);
                        }
                        //处理佣金(仅求购求租委托才有)
                        if(entrustUser.broberComitionRage) {
                            switch (entrustUser.caseType){
                                case '4':
                                    //求租委托
                                    entrustUser['broberComitionRageNum'] = entrustUser.broberComitionRage.substr(0, 2);//佣金数量
                                    entrustUser['broberComitionRageUnit'] = entrustUser.broberComitionRage.substr(-1, 3)+"租金";//佣金单位
                                    if (entrustUser.broberComitionRage.length>3){
                                        entrustUser['broberComitionRageUnit'] = entrustUser.broberComitionRage.substr(-3, 3);//佣金单位
                                    }
                                    break;
                                case '3':
                                    //求购委托
                                    let broberComitionRageList = entrustUser.broberComitionRage.split("%")
                                    entrustUser['broberComitionRageNum'] = broberComitionRageList[0]
                                    entrustUser['broberComitionRageUnit'] = entrustUser.broberComitionRage.substr(-1, 1);//佣金单位
                                    break;
                            }
                        }
                        entrustUser.starList = new GetStarList(entrustUser.starLevel).getList();
                        let pushStatusClassJson = {0:1,2:1,5:2,3:3,4:4};
                        if (entrustUser.caseType == 1 || entrustUser.caseType == 2) {
                            pushStatusClassJson = { 2: 1, 3: 1,4: 2, 5: 2, 7: 3 };
                        }
                        if(entrustUser.pushStatus == 0) {
                            uni.showModal({
                                title: "",
                                content: "经纪人没有找到符合您要求的房源，已取消该订单",
                                showCancel: false,
                                confirmText: "知道了",
                                confirmColor: this.Const.confirmColor,
                                success: () => {
                                    uni.navigateBack({delta: 1});
                                }
                            });
                        }
                        this.pushStatusClass = pushStatusClassJson[entrustUser.pushStatus];
                        if(entrustUser.isEvaluate==1){
                            this.getServiceEvaAction();
                        }
                        entrustUser.brokerUserPicUrl = entrustUser.brokerUserPicUrl
                            || Const.imDefaultHeadImg;

                        // 测试
                        // entrustUser.pushStatus = 10;
                        // entrustUser.rewardStatus = 1;
                        // entrustUser.isEvaluate = 0;
                        // entrustUser.rewardType = 1;
                        // entrustUser.requireStatus = 1;

                        this.entrustUserInfo = entrustUser;
                        // 隐私保护弹窗判断条件
                        if(entrustUser.pushStatus>4){
                            this.privacyBoxShow = true;
                        }

                        // 投诉结果弹窗判断条件
                        if(entrustUser.rewardType == 1
                            && (entrustUser.rewardStatus == 4
                                || entrustUser.rewardStatus == 3)
                            && entrustUser.requireStatus != 2){
                            if(new CommonModel().getModel("entrustBrokerArchiveId")
                                != entrustUser.brokerArchiveId
                                && new CommonModel().getModel("prizeTrustPushLogId")
                                == entrustUser.pushLogId){
                                let grievanceResultContent = "";
                                if(entrustUser.rewardStatus == 4) {
                                    grievanceResultContent = "经判定,经纪人" + entrustUser.brokerName + "对您的投诉不属实,请继续完成委托。";
                                }
                                if (entrustUser.rewardStatus == 3) {
                                    grievanceResultContent = "经判定,经纪人" + entrustUser.brokerName + "对您的投诉属实,奖励金已退还经纪人。";
                                }
                                uni.showModal({
                                    title: "投诉处理结果",
                                    content: grievanceResultContent,
                                    showCancel: false,
                                    confirmText: "我知道了",
                                    confirmColor: "#ab7f2e",
                                    success(res) {
                                        new CommonModel().setModel(entrustUser.brokerArchiveId
                                            , "entrustBrokerArchiveId");
                                        new CommonModel().setModel(entrustUser.pushLogId
                                            , "prizeTrustPushLogId");
                                    }
                                });
                            }
                        }

                        // 投诉通知弹窗判断条件
                        if(entrustUser.rewardType == 1 && entrustUser.rewardStatus == 2
                            && new CommonModel().getModel("prizeTrustPushLogId")
                            == entrustUser.pushLogId
                            && new CommonModel().getModel("grievanceEntrustBrokerArchiveId")
                            != entrustUser.brokerArchiveId
                            && entrustUser.requireStatus != 2){
                            this.grievanceBomp = true;
                        }

                        // 有奖委托弹窗提示
                        if(entrustUser.rewardType == 1 && entrustUser.rewardStatus == 1){
                            if(new CommonModel().getModel("prizeTrustPushLogId")
                                == entrustUser.pushLogId
                                && new CommonModel().getModel("youJiangEntrustBrokerArchiveId")
                                != entrustUser.brokerArchiveId
                                && entrustUser.requireStatus != 2){
                                this.prizeTrustBompShow = true;
                            }
                        }

                        this.initBlockStatus();
                        this.drawErHouseList(custHouseList);
                        return Promise.all([
                            this.initChart(),
                            this.initEntrustFollowList(entrustUser.vipCaseId
                                , entrustUser.caseType, entrustUser.cityId
                                , me.userId, entrustUser.brokerArchiveId)
                        ]);
                    });
            },

            // 渲染二手房数据
            drawErHouseList(apiList = []) {
                let erHouseList = [];
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
                    item.caseType =  dataItem.caseType ? (parseInt(dataItem.caseType)) : "";
                    item.houseId = dataItem.houseId || "";
                    item.reSource = dataItem.reSource || "1";
                    item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
                    item.houseTitle = dataItem.infoSubject || "";
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
                    item.pageFrom = "entrustDetail";
                    item.recomHouseStatus = dataItem.recomHouseStatus || "";
                    item.seeStatus = dataItem.seeStatus || "";

                    item.brokerMoney = dataItem.brokerMoney || "";  // 佣金费用

                    item.delStatus = dataItem.delStatus || "";
                    item.isEvaluate = dataItem.isEvaluate || "";


                    item.isVip = dataItem.isVip || 0;
                    item.recomInfoId = dataItem.recomInfoId || "";
                    item.pushLogId = dataItem.pushLogId || "";
                    erHouseList.push(item);
                }
                this.recomendHouseList = erHouseList;
            },

            // 初始化IM最后一条消息
            initChart() {
                let accid = new UserInfoModel().getModel("accid") || "";
                if(!accid) return Promise.reject("暂无accid");

                let brokerArchiveId = this.entrustUserInfo.brokerArchiveId;
                let unreadNum = new UnReadMsgModel().getModel(brokerArchiveId) || 0;
                return new GetChartDetail({
                    from: accid,
                    to: brokerArchiveId,
                    limit: 100,
                    reverse: 2,
                    isDealMsg: 1}).send()
                    .then(msgList => {
                        msgList = msgList || {};
                        msgList = msgList.data || [];
                        let lastMsgMark = 0;
                        let lastMsg = "";
                        let sendTime = "";
                        let todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)) ;//今天凌晨开始时间戳

                        if(msgList.length === 0) {
                            lastMsg = '暂无聊天消息，赶紧发起聊天，让经纪人更了解你的需求吧';
                            sendTime = formatTimeNew((new Date()).valueOf(), 'h:m');
                            this.lastMsg = lastMsg;
                            this.lastMsgTime = "";
                            this.brokerUnreadNum = unreadNum;
                            return msgList;
                        }

                        for (let i = 0; i < msgList.length; i++) {
                            if (lastMsgMark == 0 && msgList[i].from == brokerArchiveId) {
                                sendTime = msgList[i].sendtime;//消息更新时间戳
                                do{
                                    if (sendTime >= todayStartTime){
                                        sendTime = formatTimeNew(sendTime,'h:m');
                                        break;
                                    }

                                    if (sendTime < todayStartTime && sendTime
                                        >= (todayStartTime - 86400000)){
                                        sendTime = '昨天';
                                        break;
                                    }

                                    if (sendTime < (todayStartTime - 86400000) && sendTime
                                        >= (todayStartTime - 86400000*2)){
                                        sendTime = '前天';
                                        break;
                                    }

                                    if (sendTime < (todayStartTime - 86400000 * 2) && sendTime
                                        >= (todayStartTime - 86400000 * 30)){
                                        let n = Math.ceil((todayStartTime - sendTime) / 86400000);
                                        sendTime = n + '天前';
                                        break;
                                    }

                                    let n = Math.floor((todayStartTime - sendTime) / 86400000/30);
                                    sendTime = n + '个月前'
                                }while(false);
                                let msgTextMap = new Map()
                                    .set(1, "发来一张图片")
                                    .set(2, "发来一段语音")
                                    .set(3, "发来一段视频")
                                    .set(4, "发来一个地理位置");
                                do{
                                    if(msgTextMap.has(msgList[i].type)) {
                                        lastMsg = msgTextMap.get(msgList[i].type);
                                        break;
                                    }

                                    if(msgList[i].type == 0) {
                                        lastMsg = msgList[i].body.msg;
                                        break;
                                    }

                                    if(!msgTextMap.has(msgList[i].type)) {
                                        lastMsg = '暂无聊天消息，赶紧发起聊天，让经纪人更了解你的需求吧'
                                        sendTime=''
                                    }
                                }while(false);
                                lastMsgMark = 1;
                                this.lastMsg = lastMsg;
                                this.lastMsgTime = sendTime;
                                this.brokerUnreadNum = unreadNum;
                                continue;
                            }

                            if (lastMsgMark == 0) {
                                lastMsg = '暂无聊天消息，赶紧发起聊天，让经纪人更了解你的需求吧'
                                let sendTime = '';
                                sendTime = common.formatTime(sendTime,'h:m');
                                this.lastMsg = lastMsg;
                                this.lastMsgTime = "";
                                this.brokerUnreadNum = unreadNum;
                            }
                        }
                        return msgList;
                    });
            },

            // 初始化屏蔽状态
            initBlockStatus() {
                let accid = new UserInfoModel().getModel("accid") || "";
                if(!accid) return Promise.reject("暂无accid");

                let brokerArchiveId = this.entrustUserInfo.brokerArchiveId;
                return new IsInBlackList({accid: accid, archiveId: brokerArchiveId}).send()
                    .then(res => {
                        if(res.status != 1) {
                            this.isShield = 0;
                            return res;
                        }

                        this.isShield = res && res.data ? res.data.flag || 0 : 0;
                        return res;
                    });
            },

            // 初始化委托跟进
            initEntrustFollowList(vipCaseId, caseType, cityId, userId, archiveId) {
                return new GetEntrustFollowList({
                    vipCaseId:vipCaseId,
                    caseType:caseType,
                    cityId:cityId,
                    userId:userId,
                    archiveId:archiveId
                }).send()
                    .then(res => {
                        let followList = [];
                        let userInfo = new UserInfoModel().getModel("userInfo") || {};
                        userInfo = userInfo.userInfo || {};
                        let avatarUrl = userInfo.avatarUrl || "";
                        // 这一步的原因暂时不详
                        if(userInfo.avatarUrl && userInfo.avatarUrl.indexOf("/132") == -1) {
                            avatarUrl = userInfo['avatarUrl'].substr(0, userInfo['avatarUrl'].length - 1) + "/132";
                        }
                        let trackList = res.DATA ? res.DATA.trackList || [] : [];
                        trackList.map((item, index) => {
                            let date = item.date;
                            let trackInfos = item.trackInfos || [];
                            trackInfos.map((info, i) => {
                                let followItem = {
                                    photoUrl: (info['fromSource'] == 1
                                        ? this.entrustUserInfo['brokerUserPicUrl']
                                        : (avatarUrl || Const.defaultHeadImg)),
                                    trackTitle: "【" + info.trackTitle + "】 "
                                        + date + " " + info.hour,
                                    trackContent: info.item,
                                };
                                followList.push(followItem);
                            });
                        });
                        this.followList = followList;
                    });
            },

            // 切换更多和部分
            followDetailTap() {
                this.followDetailShow = !this.followDetailShow;
            },

            // 更新屏蔽状态
            setShield() {
                let me = new UserInfoModel().getModel("me") || {};
                let brokerArchiveId = this.entrustUserInfo.brokerArchiveId;
                if(!me.userId) {
                    uni.showToast({
                        icon: "none",
                        title: "暂无用户id"
                    });
                    return;
                }

                if(this.isShield == 1) {
                    new BlockMsg({userId: me.userId, shieldUserId: brokerArchiveId, status: 0}).send()
                        .then(res => {
                            if(res.STATUS == 1) {
                                uni.showToast({
                                    icon: "none",
                                    title: "已解除屏蔽，去联系吧"
                                });
                                this.isShield = 0;
                                return;
                            }

                            uni.showToast({
                                icon: "none",
                                title: res.INFO || "解除失败，请稍后重试",
                            });
                            this.isShield = 1;
                        });
                    return;
                }

                this.blockMsgToast = true;
            },

            // 不屏蔽
            cancelBlock() {
                this.blockMsgToast = false;
            },

            // 确定屏蔽
            confirmBlock() {
                let me = new UserInfoModel().getModel("me") || {};
                let brokerArchiveId = this.entrustUserInfo.brokerArchiveId;
                if(!me.userId) {
                    uni.showToast({
                        icon: "none",
                        title: "暂无用户id"
                    });
                    return;
                }

                new BlockMsg({userId: me.userId, shieldUserId: brokerArchiveId, status: 1}).send()
                    .then(res => {
                        if(res.STATUS == 1) {
                            this.cancelBlock();
                            uni.showToast({
                                icon: "none",
                                title: "屏蔽成功"
                            });
                            this.isShield = 1;
                            return;
                        }

                        uni.showToast({
                            icon: "none",
                            title: res.INFO || "屏蔽失败，请稍后重试",
                        });
                        this.isShield = 0;
                    });
            },

            // 跳转到微店
            goToPerStore() {
                uni.navigateTo({
                    url: "/pagesStore/personalStore/personalStore?archiveId=" + this.entrustUserInfo.brokerArchiveId
                });
            },

            // 跳转到IM详情
            imChart() {
                if(!this.entrustUserInfo.brokerArchiveId) return;

                let recomendHouseList = this.recomendHouseList;
                let me = new UserInfoModel().getModel("me") || {};
                let url = "/pagesTool/messageDetail/messageDetail";
                url += '?messageId=' + this.entrustUserInfo.brokerArchiveId
                    + "&userId=" + me.userId + "&openId=" + me.openId
                    + "&name=" + this.entrustUserInfo.brokerName;
                uni.navigateTo({
                    url: url
                });
            },


            // 判断是否是屏蔽状态
            checkShieldStatus() {
                if(this.isShield == 1) {
                    uni.showToast({
                        icon: "none",
                        title: "屏蔽状态无法操作"
                    });
                    return true;
                }

                return false;
            },
            // 同意看房
            agreeLookHouse(item) {
                let that = this;
                let me = new UserInfoModel().getModel("me") || {};
                if(this.checkShieldStatus()) {
                    return;
                }

                new SaleHouseAgreeLookHouse({pushLogId: this.entrustUserInfo.pushLogId,
                    isVip: item.isVip,youyouUserId: me.userId}).send()
                    .then(res => {
                        if(res.STATUS != 1) {
                            that.failModel("取消失败啦！请稍后重试。");
                            return;
                        }

                        uni.showToast({
                            title: "操作成功",
                            icon: "success"
                        });
                        that.initData();
                    })
                    .catch(err => {
                        that.failModel("取消失败啦！请稍后重试。");
                    });
            },
            // 不同意看房
            disAgreeLookHouse(item) {
                let that = this;
                let me = new UserInfoModel().getModel("me") || {};
                if(this.checkShieldStatus()) {
                    return;
                }

                uni.showModal({
                    title: "",
                    content: "确定不看该房吗？",
                    confirmColor: "#ab7f2e",
                    success(res) {
                        if(res.confirm) {
                            new SaleHouseDisagreeLookHouse({pushLogId: this.entrustUserInfo.pushLogId,
                                isVip: item.isVip,youyouUserId: me.userId}).send()
                                .then(res => {
                                    if(res.STATUS != 1) {
                                        that.failModel("取消失败啦！请稍后重试。");
                                        return;
                                    }

                                    uni.showToast({
                                        title: "操作成功",
                                        icon: "success"
                                    });
                                    that.initData();
                                })
                                .catch(err => {
                                    that.failModel("取消失败啦！请稍后重试。");
                                });
                        }
                    }
                });
            },
            // 失败的model
            failModel(content) {
                uni.showModal({
                    title: "温馨提示",
                    content: content,
                    showCancel: false,
                    confirmColor: "#ab7f2e",
                    confirmText: "我知道了"
                });
            },


            // 我要申诉
            sendAppeal() {
                if (this.entrustUserInfo.isAppeal == 1){
                    uni.showToast({title: '您已经提交申诉，客服会尽快联系您', icon: 'none'});
                    return;
                }

                this.appealFlagTc = true;
            },
            // 关闭申诉
            closeAppeal() {
                this.appealFlagTc = false;
            },
            // 提交申诉
            submitAppealData() {
                new SaleHouseSubmitAppeal({
                    complaintId: this.entrustUserInfo.complaintId,
                    appealReson: this.appealContent
                }).send().then(res => {
                    if(res.STATUS != 1){
                       uni.showToast({title: "申诉失败", icon: "none"});
                       return;
                    }

                    uni.showToast({title: '您已经提交申诉，客服会尽快联系您', icon: 'none'});
                    this.appealFlag = false;
                }).catch(() => {
                    uni.showToast({title: "申诉失败", icon: "none"});
                });
            },


            // 关闭隐私保护
            privacyCancelEvent() {
                this.privacyBoxShow = false;
            },

            // 关闭投诉通知
            grievanceBompCancel() {
                this.grievanceBomp = false;
                new CommonModel().setModel(this.entrustUserInfo.pushLogId, "prizeTrustPushLogId");
                new CommonModel().setModel(this.entrustUserInfo.brokerArchiveId, "grievanceEntrustBrokerArchiveId");
            },

            // 关闭有奖委托
            youjiangBompEvent() {
                this.prizeTrustBompShow = false;
                new CommonModel().setModel(this.entrustUserInfo.pushLogId,
                    "prizeTrustPushLogId");
                new CommonModel().setModel(this.entrustUserInfo.brokerArchiveId,
                    "youJiangEntrustBrokerArchiveId");
            },


            // 填写评价
            writeEvaluate(item) {
                this.recomInfoId = item.recomInfoId;
                this.evaluateTc = true;
            },
            // 评价弹窗回调
            onEvaluateChanged(val) {
                this.evaluateTc = val;
            },
            // 评价成功回调
            onEvaluateFinishChanged(val) {
                this.initData();
            },

            // 佣金支付
            payMoney(item) {
                // #ifndef MP-WEIXIN
                uni.showModal({
                    showCancel: false,
                    confirmText: "我知道了",
                    confirmColor: "#FF4500",
                    title: "温馨提示",
                    content: "请使用微信悠居客小程序或悠居客App支付佣金"
                });
                // #endif
                // #ifdef MP-WEIXIN
                uni.navigateTo({
                    url: "/pagesEntrust/payEntrustMoney/payEntrustMoney?recomInfoId="
                        + item.recomInfoId
                        + "&pushLogId=" + this.entrustId
                        + "&money=" + item.brokerMoney
                        + "&caseId=" + item.houseId
                        + "&caseType=" + (item.caseType + 2)
                        + "&cityId=" + item.cityId
                });
                // #endif
            },

            // 支付后填写服务评价
            serviceFinishWrite(item) {
                if(this.checkShieldStatus()) {
                    return;
                }

                uni.showLoading({title: "请求中..."});
                this.getServiceEvaAction();
            },
            getServiceEvaAction() {
                new WriteServiceEvaluate({pushLogId: this.entrustId}).send()
                    .then(res => {
                        uni.hideLoading();
                        if(res.STATUS != 1) {
                            uni.showToast({
                                icon: "none",
                                title: "获取评价失败"
                            });
                            return;
                        }

                        this.showCompleteEvaDialog = true;
                        this.serviceEvaActionInfo = res.DATA || {};
                        let starNum = 4;
                        if(res.DATA && res.DATA.evaStar && res.DATA.evaStar > 0) {
                            starNum = res.DATA.evaStar;
                        }
                        this.finishServiceStarList = new GetStarList(starNum,
                            "../../", 5, 0).getList();
                    })
                    .catch(err => {
                        uni.hideLoading();
                        uni.showToast({
                            icon: "none",
                            title: "获取评价失败"
                        });
                    });
            },

            // 支付后未评价
            initNoFinishStarList() {
                this.noFinishServiceStarList = new GetStarList(this.serviceStarVal,
                    "../../", 5, 0).getList();
            },
            // 未评价星点击事件
            noFinishStarBtn(index) {
                this.serviceStarVal = index + 1;
                this.initNoFinishStarList();
            },
            // 选择原因
            noMeetReasonChoose(i) {
                let selected = this.noMeetReasonSelectedMap[this.serviceStarVal];
                let index = (selected).findIndex((info) => {
                    return info == i;
                });
                do{
                    if(index >= 0) {
                        selected.splice(index, 1);
                        break;
                    }

                    if(selected.length >= 5) {
                        selected.shift();
                        selected.push(i);
                        break;
                    }

                    selected.push(i);
                }while(false);
                this.noMeetReasonSelectedMap[this.serviceStarVal] = selected;
            },
            // 输入原因
            completeEvaContentInput(e) {
                this.completeEvaContent = e && e.detail ? e.detail.value || "" : "";
            },
            // 匿名提交
            submitCompleteEvaData() {
                let me = new UserInfoModel().getModel("me") || {};
                let reasonSelected = this.noMeetReasonSelectedMap[this.serviceStarVal] || [];
                if(this.serviceStarVal < 4 && reasonSelected.length == 0
                    && this.completeEvaContent.length == 0) {
                    uni.showToast({
                        icon: "none",
                        title: "请选择标签或填写评论指出经纪人的不足吧"
                    });
                    return;
                }

                let request = {
                    pushLogId: this.entrustId,
                    userId: me.userId || "",
                    archiveId: this.entrustUserInfo.brokerArchiveId,
                    cityId: this.entrustUserInfo.cityId,
                    evaContent: this.completeEvaContent,
                    evaTagIndex: reasonSelected.join(","),
                    evaStar: this.serviceStarVal
                };
                new PaySuccessWriteServiceEvaluate(request).send()
                    .then(res => {
                        if(res.STATUS != 1) {
                            uni.showToast({
                                icon: "none",
                                title: "提交失败"
                            });
                            return;
                        }

                        uni.showToast({
                            title: "操作成功",
                            icon: "success"
                        });
                        this.initData();
                    })
                    .catch((err) => {
                        uni.showToast({
                            icon: "none",
                            title: "提交失败"
                        });
                    });
            },
        },
    }
</script>

<style>
    /*有奖委托*/
    .youjiang-trust-bomp{
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.3);
        position: fixed;
        top:0;
        left: 0;
        z-index: 30000;
    }
    .youjiang-trust-con{
        position: relative;
        width:552upx;
        height: 668upx;
        background: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/youjiang-redenvelope-bg.png') center center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top:0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
    .youjiang-trust-head{
        text-align: center;
        padding-top: 70upx;
    }
    .price-head-note{
        color: #fff;
        font-size: 36upx;
        padding-bottom: 10upx
    }
    .price-head-agent{
        color: #ffc0b4;
        font-size: 22upx;
    }
    .youjiang-trust-middle{
        padding-top: 70upx;
    }
    .youjiang-money{
        display: -webkit-box;
        -webkit-box-align: start;
        -webkit-box-pack:center;
        color: #fff;
        box-sizing: border-box;
    }
    .money-unit{
        font-size: 22upx;
        padding-top: 40upx;
    }
    .money-num{
        font-size: 132upx;
    }
    .youjiang-money-note{
        font-size: 24upx;
        color: #ffc0b4;
        text-align: center;
    }
    .note-top{
        padding-top: 40upx;
    }
    .note-bottom{
        padding-top: 10upx
    }
    .youjiang-trust-foot{
        color: #fff;
        font-size: 36upx;
        text-align: center;
        position: absolute;
        width:100%;
        line-height: 3.5;
        left:0;
        bottom: 0;
    }

    /*投诉通知*/
    .grievance-bomp{
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.5);
        z-index:9999;
    }
    .grievance-bomp-con{
        width: 80%;
        background: #fff;
        margin: 0 auto;
        position: absolute;
        left: 50%;
        top: 30%;
        -webkit-transform: translate(-50%,-30%);
        -moz-transform: translate(-50%,-30%);
        -ms-transform: translate(-50%,-30%);
        -o-transform: translate(-50%,-30%);
        transform: translate(-50%,-30%);
        border-radius: 20upx;
    }
    .grievance-title{
        font-size: 40upx;
        color: #666666;
        text-align: center;
        padding:40px 0;
    }
    .grievance-img{
        width: 109upx;
        height: 109upx;
        background: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/grievance-icon.png') center center no-repeat;
        background-size: 100% 100%;
        margin:0 auto;
    }
    .grievance-txt{
        color: #666666;
        font-size: 28upx;
        text-align: center;
        width: 80%;
        color:#666666;
        font-size:28upx;
        text-align:center;
        width:80%;
        margin:0 auto;
        padding:100upx 0;

    }
    .trusting-txt{
        color: #c6c6c6;
        font-size: 28upx;
    }
    .agent-note-txt-color{
        color: #98C6C9;
    }
    .grievance-btn{
        font-size:36upx;
        text-align:center;
        color:#333;
        padding:40upx 0;
        border:1px solid #E2E2E2;
        border-bottom-left-radius: 20upx;
        border-bottom-right-radius: 20upx;
    }

    /*隐私*/
    .privacy-box{
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #FDF5E8;
        color: #DC8F31;
    }
    .privacy-title{
        display: -webkit-box;
        -webkit-box-align: start;
        -webkit-box-pack: justify;
        padding: 0 20upx;
        padding-top: 20upx;
    }
    .privacy-txt{
        font-size: 28upx;
        font-weight: bold;
        position: relative;
        padding-left: 30upx;
    }
    .privacy-txt::before{
        content: '';
        display: inline-block;
        width: 25upx;
        height: 30upx;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -15upx;
        background: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/ic-shield.png');
        background-size: 100% 100%;
    }
    .privacy-txt-box{
        font-size: 24upx;
        padding: 20upx;
        line-height: 1.6;
    }
    .privacy-cancel{
        color: #52AFE7;
        font-size: 36upx;
        height: 100%;
    }

    /*申诉*/
    .appeal-con{
        background: #fff;
        padding-top: 20upx;
    }
    .appeal-btn{
        text-align: right;
        font-size: 28upx;
        color: #17b980;
        background: #fff;
        padding: 15upx 30upx 15upx 0;
    }
    .appeal-note{
        margin:0 30upx 0 30upx;
        padding: 15upx 0;
        font-size: 28upx;
        background: #f6f6f6;
        padding-left: 10upx;
    }

    /*  取消委托原因弹框   */
    .refuse-broker-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 50;
    }
    .refuse-broker-content{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;
        background: #fff;
    }
    .refuse-broker-header{
        position: relative;
        text-align: center;
        font-size: 36upx;
        color: #000;
        height: 128upx;
        line-height: 128upx;
        border-bottom: 1upx solid #eee;
    }
    .appeal-broker-header{
        position: relative;
        text-align: center;
        font-size: 36upx;
        color: #000;
        height: 128upx;
        line-height: 128upx;
    }
    .refuse-broker-close{
        position: absolute;
        width: 100upx;
        height: 128upx;
        top: 0;
        right: 0;
        background: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/close2.png) center center no-repeat;
        background-size: 26upx 26upx;
    }
    .refuse-broker-footer-line{
        position: relative;
        background: #eee;
        width: 100%;
        height: 10upx;
    }
    .refuse-broker-footer{
        text-align: center;
        font-size: 36upx;
        color: #cccdcf;
        height: 125upx;
        line-height: 125upx;
    }
    .refuse-broker-footer.refuse-broker-submit{
        color: #f64a12;
    }
    .refuse-broker-footer,.appeal-broker-submit{
        color: #1AC160;
    }
    .refuse-broker-box .reason_box_remark{
        position: relative;
        width: 630upx;
        height: 114upx;
        overflow: hidden;
        margin: 0 auto 38upx;
    }
    .reason_box_remark_appeal{
        position: relative;
        width: 630upx;
        font-size: 26upx;
        height: 160upx;
        overflow: hidden;
        margin: 0 auto 38upx;
    }
    .refuse-broker-box .reason_box_remark textarea,.reason_box_remark_appeal textarea{
        background-color: #f1f1f1;
        width: 100%;
        height: 100%;
        font-size: 28upx;
        border-radius: 8upx;
        padding: 15upx 20upx;
        box-sizing: border-box;
        color: #000;
    }
    .refuse-broker-box .reason_box_remark .reason-remark-text-placeholder,.reason_box_remark_appeal .reason-remark-text-placeholder{
        font-size: 28upx;
        color: #888;
        background-color: #f1f1f1;
    }
    .refuse-broker-box .reason_box_remark view,.reason_box_remark_appeal view{
        font-size: 26upx;
        position: absolute;
        right: 15upx;
        bottom: 18upx;
        color: #888;
    }
    .refuse-broker-box .reason_box{
        width: 624upx;
        margin: 0 auto;
        display: flex;
        flex-wrap:wrap;
        overflow: hidden;
        margin-top:75upx;
        margin-bottom: 32upx;
    }
    .refuse-broker-box .reason_box .reason{
        width:270upx;
        height: 60upx;
        line-height: 60upx;
        font-size: 26upx;
        box-sizing: border-box;
        text-align: center;
        border: 1upx solid #ddd;
        border-radius: 4upx;
        color:#999;
        position: relative;
        box-sizing: border-box;
        margin-bottom: 30upx;
    }
    .refuse-broker-box .reason_box .reason:nth-child(1),
    .refuse-broker-box .reason_box .reason:nth-child(3),
    .refuse-broker-box .reason_box .reason:nth-child(5){
        margin-right: 64upx;
    }
    .refuse-broker-box .reason_box .reason.select{
        border: 1upx solid #333;
        color: #333;
        background-color: #f6f6f6;
    }
    /*  取消委托原因弹框end   */

    /*投诉*/
    .tousu-success{
        width: 44upx;
        height: 44upx;
        background: url(https://zdzfapi.haofang.net/PublicC/source/images/publish/tousu-cg.png) no-repeat center center;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .no-tousu-success{
        width: 44upx;
        height: 44upx;
        background: url(https://zdzfapi.haofang.net/PublicC/source/images/publish/pro-tousu-icon.png) no-repeat center center;
        background-size: 100%;
        margin-bottom: 10upx;
        margin:0 auto;
        margin-bottom: 10upx;
    }
    .tousu-fail{
        color: #ff5a1f !important;
        text-align: center;
    }

    /* 委托跟进 */
    .follow_view{
        padding: 0 0 0 30upx;
        box-sizing: border-box;
        background: #FFFFFF;
    }
    .follow_title{
        height:108upx;
        line-height:108upx;
        font-size:32upx;
        color:#000;
        box-sizing:border-box;
        text-align: left;
        border-bottom: 1upx solid #DDDDDD;
    }
    .follow_list{
        position:relative;
        padding-top:68upx;
        padding-right:32upx;
        box-sizing: border-box;
    }
    .follow_item{
        position:relative;
        width:100%;
        overflow:hidden;
    }
    .follow-li-left{
        display: flex;
        flex-direction:column;
        padding: 0 22upx;
        position: relative;
        box-sizing: border-box;
    }
    .follow-li-left .follow-img{
        width: 64upx;
        height: 64upx;
        border-radius: 50upx;
        overflow: hidden;
    }
    .follow-li-left .follow-img image{
        width: 100%;
        height: 100%;
    }
    .follow-li-left .follow-line{
        flex: 1;
        width: 2upx;
        margin: 8upx auto;
        background-color: #ddd;
    }
    .follow-li-right{
        font-size: 24upx;
        flex: 1;
    }
    .follow-li-right .follow-li-tt{
        margin-bottom: 30upx;
    }
    .follow-li-right .follow-li-detail{
        white-space: normal;
        color: #888;
        margin-bottom: 40upx;
    }
    .follow-li:first-child .follow-li-right .follow-li-tt{
        color: #4daaf0;
    }
    .follow-li:first-child .follow-li-right .follow-li-detail{
        color: #000;
    }
    .lookMoreFollow{
        text-align: center;
        width:100%;
        color: #b7b7b7;
        padding-bottom: 30upx;
        font-size: 24upx;
        box-sizing: border-box;
    }
    .follow-more-btn::after{
        content: '';
        display: inline-block;
        width: 15upx;
        height: 9upx;
        margin-left: 8upx;
        margin-bottom: 6upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/changeImg/down_icon.png) center center no-repeat;
        background-size: 100% 100%;
    }
    .show-follow-detail .follow-more-btn::after{
        transform:scaleY(-1);
    }


    /* 未评价 */
    .finish_evaluate_find_house{
        font-size:32upx;
        margin:0 auto 60upx;
        text-align:center;
        color:#000;
    }
    .no_finish_reason_view{
        width: 100%;
        margin:40upx auto 44upx;
        flex-wrap:wrap;
        padding: 0 70upx;
        box-sizing: border-box;
    }
    .no_finish_reason_item{
        width: 47%;
        height:60upx;
        line-height:60upx;
        font-size:26upx;
        box-sizing:border-box;
        text-align:center;
        border:1upx solid #ddd;
        border-radius:4upx;
        color:#999;
        position:relative;
        box-sizing:border-box;
        margin-right: 6%;
        margin-bottom:26upx;
    }
    .no_finish_reason_view .no_finish_reason_item:nth-child(2n){
        margin-right: 0;
    }
    .no_finish_reason_view .no_finish_reason_item_active{
        border:1upx solid #333;
        color:#333;
        background-color:#f6f6f6;
    }
    .no_finish_remark{
        position:relative;
        width: 100%;
        height:126upx;
        overflow:hidden;
        margin:0 auto 38upx
    }
    .no_finish_textarea{
        background-color:#f1f1f1;
        width:100%;
        height:100%;
        font-size:28upx;
        border-radius:8upx;
        padding:15upx 20upx;
        box-sizing:border-box;
        color:#000;
    }
    .no_finish_textarea_num{
        font-size:26upx;
        position:absolute;
        right:15upx;
        bottom:18upx;
        color:#888;
    }
    .no_finish_textarea_pl{
        font-size: 28upx;
        color: #888;
        background-color: #f1f1f1;
    }
    .no_finish_confirm_btn{
        height:94upx;
        line-height:94upx;
        border-radius:8upx;
        text-align:center;
        color:#fff;
        font-size:32upx;
        background: -webkit-linear-gradient(left, rgb(255,111,46) , rgb(254,142,13));
        letter-spacing:1upx;
        margin-top:26upx;
    }
    .no_finish_bottom_view{
        height: 80upx;
        width: 100%;
    }

    /* 已成交 */
    .finish_evaluate_view{
        background:#fff;
        width:100%;
        box-sizing:border-box;
        padding:50upx;
    }
    .finish_evaluate_title{
        font-size:32upx;
        color:#999;
        margin-bottom:75upx;
        text-align: left;
    }
    .finish_evaluate_money{
        font-weight:bold;
        font-size:50upx;
        text-align:center;
        margin:0 auto 54upx;
        color: #101D36;
    }
    .finish_evaluate_house{
        font-size:32upx;
        margin:0 auto 60upx;
        text-align:center;
        color:#000;
    }
    .finish_evaluate_pay_detail{
        position:relative;
        display:-webkit-flex;
        align-items:center;
        justify-content:center;
        width:100%;
        font-size:30upx;
        margin-bottom:50upx;
    }
    .finish_evaluate_pay_detail_line{
        position:absolute;
        left:0;
        top:50%;
        width:100%;
        height:1px;
        background:#eee;
    }
    .finish_evaluate_pay_detail_text{
        padding:0 20upx;
        background:#fff;
        z-index:1;
        color:#888;
        position: relative;
    }
    .online-pay-info{
        position: relative;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    .online-pay-info .online-pay-li{
        position: relative;
        width: 50%;
        font-size: 30upx;
        color: #888;
        margin-bottom: 30upx;
    }
    .online-pay-info .online-pay-li:nth-child(2n){
        text-align: right;
    }
    .online-pay-info .online-pay-li text{
        color: #000;
        display: inline;
    }
    .pay-text{
        position: relative;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        padding: 30upx 0;
        border-top:1px dashed #eee;
        border-bottom:1px dashed #eee;
        font-size: 30upx;
        color: #888;
    }
    .pay-text text{
        float: right;
        color: #000;
    }
    .server-evaluate-result{
        font-size: 30upx;
        padding: 30upx 0;
        color: #888;
    }
    .server-evaluate-result text{
        text-align: left;
        display: inline;
    }
    .server-evaluate-result text:last-child{
        font-size: 28upx;
    }
    .finish_evaluate_star_view{
        height:86upx;
        margin:0 auto;
        margin-bottom:20upx;
        margin-top:20upx;
    }
    .finish_evaluate_star{
        width:86upx;
        height:86upx;
        flex-shrink: 0;
        margin: auto 16upx auto 0;
    }
    .finish_evaluate_star_view .finish_evaluate_star:last-child{
        margin-right: 0;
    }


    /* 头部 */
    .agent_top_view{
        padding: 20upx 20upx 0;
        box-sizing: border-box;
    }
    .agent_header_view{
        width:100upx;
        height:100upx;
        position:relative;
        border-radius:50%;
        border:2upx solid #eeeeee;
        margin-bottom:10upx;
        box-sizing: border-box;
        flex-shrink: 0;
    }
    .agent_header_img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .agent_vip_icon{
        width:44upx;
        height:44upx;
        background:url('https://zdzfapi.haofang.net/PublicC/images/top-vip.png') center center no-repeat;
        background-size:30upx 30upx;
        position:absolute;
        left:-20upx;
        top:-16upx;
        transform:rotate(-45deg);
        -webkit-transform:rotate(-45deg);
    }
    .agent_name_info{
        font-size:32upx;
        color:#333333;
        letter-spacing:2px;
        line-height:46upx;
    }
    .agent_name{
        font-size:30upx;
        color:#333333;
        max-width:240upx;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-weight: bold;
        margin-bottom: 0;
    }
    .shield_img{
        width:27upx;
        height:28upx;
        flex-shrink: 0;
        margin: auto 10upx auto 20upx;
    }
    .shield_text{
        color:#999;
        font-size:28upx;
        font-weight:normal;
    }
    .agent_info_view{
        width: 100%;
        padding-left: 20upx;
        box-sizing: border-box;
    }
    .yongjin_text{
        font-weight:normal;
        font-size:28upx;
        color:#999;
        line-height:46upx;
    }
    .yongjin_val{
        font-size:36upx;
        color:#ff5d2f;
        margin-left:5upx;
    }
    .yongjin_unit{
        font-size:28upx;
        color:#ff5d2f;
    }
    .agent_top_des{
        margin-top: 10upx;
    }
    .star_list .agent_star:last-child{
        margin-right: 0;
    }
    .agent_star{
        width: 22upx;
        height: 20upx;
        margin: auto 10upx auto 0;
    }
    .star_val{
        font-size:16upx;
        color:#fff;
        background-color:#fcad08;
        border-radius:4upx;
        padding:0 8upx;
        margin:auto 10upx;
    }
    .tradeNum{
        font-size:24upx;
        color:#4a4949;
        padding:0 5upx;
        border-radius:4upx;
    }
    .get_order_time{
        color:#999;
        font-size:24upx;
        font-weight:normal;
        text-align:right;
    }

    /* 消息体 */
    .last_msg_view{
        box-sizing: border-box;
        padding-bottom: 10upx;
        padding-top: 30upx;
    }
    .last_msg_cont{
        background:#f7f7f9;
        border-radius:10upx;
        width:72.5%;
        margin-left:144upx;
        padding:13upx;
        position:relative;
    }
    .last_msg_arrows{
        position:absolute;
        width:30upx;
        height:15upx;
        top:-32upx;
        left:20upx;
    }
    .last_msg_arrows image{
        width: 100%;
        height: 100%;
    }
    .last_msg_text{
        font-size:30upx;
        padding-left:10upx;
        color:#666666;
        overflow:hidden;
        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        box-sizing: border-box;
    }
    .last_msg_send_time{
        color:#4daaf0;
        font-size:25upx;
        margin-right: 10upx;
    }
    .last_msg_red_point{
        position:absolute;
        top:20upx;
        right:-10upx;
        min-width:30upx;
        height:30upx;
        line-height:30upx;
        margin-top:-30upx;
        font-weight:bold;
        font-size:20upx;
        color:white;
        text-align:center;
        background:#ff3d43;
        border:none;
        border-radius:100%;
        display:inline-block;
    }

    /* 委托进度流程 */
    .manager-progress{
        position:relative;
        width: 100%;
        height:120upx;
        background: #fff;
        padding-top: 20upx;
    }
    .condition-box{
        position: relative;
        right: 0;
        left: 0;
        margin: auto;
        display: flex;
        justify-content: space-between;
        width: 80%;
    }
    .manager-progress .condition{
        font-size: 26upx;
        color:#b7b7b7;
        position:relative;
        padding-top: 5upx;
        text-align: center;
        letter-spacing: 1px;
    }
    .order-icon{
        width: 44upx;
        height: 44upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/new_images/order_icon.png) no-repeat center center;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .no-order{
        width: 44upx;
        height: 44upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/entrustImg/no_order_icon.png) no-repeat center center;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .tj-icon{
        position: relative;
        width: 44upx;
        height: 44upx;
        background: #1bc964;
        margin-bottom: 10upx;
        border-radius: 100%;
    }
    .tj-icon image{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        height: 100%;
    }
    .no-tj{
        position: relative;
        width: 44upx;
        height: 44upx;
        background: #f4f4f4;
        border-radius: 100%;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .no-tj image{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 24upx;
        height: 28upx;
    }
    .no-dk{
        position: relative;
        width: 44upx;
        height: 44upx;
        background: #f4f4f4;
        border-radius: 100%;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .no-dk image{
        width: 26upx;
        height: 25upx;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    .dk-icon{
        position: relative;
        width: 44upx;
        height: 44upx;
        background: #1bc964;
        margin-bottom: 10upx;
        border-radius: 100%;
    }
    .dk-icon image{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    .no-cj{
        width: 44upx;
        height: 44upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/entrustImg/no_cj.png) no-repeat center center;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .cj-icon{
        width: 44upx;
        height: 44upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/new_images/cj_icon.png) no-repeat center center;
        background-size: 100%;
        margin-bottom: 10upx;
    }
    .line-w{
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 45upx;
        width: 70%;
        height: 2upx;
        background: #b7b7b7;
    }
    .line-w-a{
        position: absolute;
        height: 1upx;
        left: 0;
        top: 25upx;
        background: green;
    }
    .progress-1 .condition-box .line-w-a{
        width:0%;
        background: #4daaf0;
    }
    .progress-2 .condition-box .line-w-a{
        width:35%;
        background: #4daaf0;
    }
    .progress-3 .condition-box .line-w-a{
        width:65%;
        background: #4daaf0;
    }
    .progress-4 .condition-box .line-w-a{
        width:95%;
        background: #4daaf0;
    }
    .condition{
        position: relative;
        z-index: 3;
    }
    .progress-1 .condition:nth-of-type(1),
    .progress-2 .condition:nth-of-type(1),
    .progress-2 .condition:nth-of-type(2),
    .progress-3 .condition:nth-of-type(1),
    .progress-3 .condition:nth-of-type(2),
    .progress-3 .condition:nth-of-type(3),
    .progress-4 .condition:nth-of-type(1),
    .progress-4 .condition:nth-of-type(2),
    .progress-4 .condition:nth-of-type(3),
    .progress-4 .condition:nth-of-type(4){
        color:#4daaf0;
    }
    .manager-progress .path-line::after{
        content: '';
        position:absolute;
        display: block;
        top:0upx;
        left: 0;
        width:100%;
        margin: 0 25upx;
        height: 2px;
        background: #b7b7b7;
        transform: scale(1,0.5);
        transform-origin: top center;
    }

    /* 屏蔽弹窗 */
    .to-wrap{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    .tost-box{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 120;
        width: 600upx;
        height: 320upx;
        background: #fff;
        border-radius: 16upx;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .tost-title{
        width: 100%;
        height: 90upx;
        line-height: 90upx;
        text-align: center;
        border-bottom:2upx solid #e7e7e7;
    }
    .tost-txt{
        flex: 1;
        padding:10upx 55upx;
        line-height: 50upx;
        font-size: 30upx;
        color: #333333;
        text-align: center;
    }
    .toat-btn{
        width: 100%;
        height: 90upx;
        font-size: 32upx;
        text-align: center;
        line-height: 90upx;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .toat-btn .recall{
        height: 75upx;
        line-height: 75upx;
        width: 35%;
        background: #ab7f2e;
        color: white;
        border-radius: 16upx;
        margin-right:40upx;
    }
    .toat-btn .pull{
        width: 35%;
        height: 75upx;
        line-height: 75upx;
        color: #ab7f2e;
        border: 2upx solid #ab7f2e;
        border-radius: 16upx;
        margin-left:40upx;
    }
    .rule-substrict{
        width:100%;
        padding:26upx 40upx;
        box-sizing:border-box;
        color: #aaa;
        line-height: 1.5;
        font-size: 24upx;
    }
    .index-btn{
        width:100upx;
        height: 100upx;
        background: url('https://zdzfapi.haofang.net/Public/wxApp/images/personalCenter/index-btn.png?t=33') center center no-repeat;
        background-size: 100% 100%;
        position: fixed;
        right: 2upx;
        bottom:100upx;
        z-index: 999
    }

    /* 灰色view */
    .empty_gray_view{
        height: 20upx;
        background: #F5F5F5;
        width: 100%;
    }

    /* 推荐房源 */
    .house_recomend_view{
        background-color:#fff;
        padding: 10upx 20upx;
        box-sizing: border-box;
    }
    .recomend_house_item{
        overflow:hidden;
        margin:30upx 0;
        padding: 0 20upx 0 30upx;
        box-sizing: border-box;
        border-radius:5upx;
        box-shadow:0upx 0upx 5upx 5upx #EFEFEF;
    }
    .recomend_house_item_info{
        position: relative;
        margin-bottom: -2upx;
    }
    .recomend_border{
        height: 1upx;
        width: 100%;
        background: #EEEEEE;
    }
    .recomend_house_tag{
        position:absolute;
        top:33upx;
        right:22upx;
        width:130upx;
        height:105upx;
        background-size:100% 100%;
        background-repeat:no-repeat;
        background-position:center center;
    }
    .look_house_view{
        padding-top:16upx;
        padding-bottom:16upx;
        background-color:#FFF;
        text-align:center;
        box-sizing: border-box;
    }
    .is_look_this_house_btn{
        position:relative;
        line-height:52upx;
        font-size:28upx;
        width:196upx;
        height:52upx;
        line-height:52upx;
        margin-right:24upx;
        box-sizing:border-box;
        display:inline-block;
        border-radius:8upx;
        text-align:center;
    }
    .no_look_house{
        background-color:#dcdcdc;
        color:rgb(102,102,102);
    }
    .agree_look_house{
        background-color:#4daaf0;
        color:#fff;
    }
    .yue_look_tips{
        text-align:center;
        color:#b7b7b7;
        font-size:28upx;
        padding:16upx 0;
        box-sizing: border-box;
    }
    .dai_look_evaluate_view{
        padding-top:16upx;
        padding-bottom:16upx;
        background-color:#FFF;
        text-align:center;
    }
    .dai_look_evaluate_btn{
        background:#4daaf0;
        color:#fff;
    }
    .dai_look_evaluate_btn::before{
        content: '';
        display: inline-block;
        width: 24upx;
        height: 24upx;
        margin-bottom: -.2upx;
        margin-right: 10upx;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url(http://cdn.haofang.net/static/uuminiapp/new_images/ic_entrust_evaluation.png?t=1111)
    }
</style>
