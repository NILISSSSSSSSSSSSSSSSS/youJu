

// Name：通知名称
// Info：通知信息

export class Notify {
    static CityInfoChanged = {
        Name: "CityInfoChanged",
        Info: null
    };
    
    static GpsChanged = {
        Name: "GpsChanged",
        Info: null
    };
    
	// 筛选显示的通知
    static ScreenShowChanged = {
        Name: "ScreenShowChanged",
        Info: null
    };
    
	// 筛选结果的通知
    static ScreenResultChanged = {
        Name: "ScreenResultChanged",
        Info: null
    };
    
	// 搜索结果的通知
    static SearchResChanged = {
        Name: "SearchResChanged",
        Info: null
    };
    
	// 房源周边信息的通知
    static NearInfoMapBtnChanged = {
        Name: "NearInfoMapBtnChanged",
        Info: null
    };
	
	// 个人授权信息变化的通知
	static UserInfoChanged = {
		Name: "UserInfoChanged",
		Info: null
	};

	// 授权变化的通知
	static AuthonChanged = {
		Name: "AuthonChanged",
		Info: null
	};
	
	// 房源列表经纪人弹窗的通知
	static HouseListAgentChanged = {
		Name: "HouseListAgentChanged",
		Info: null
	};
	
	// ------------------ im相关 -----------------
	// 更新消息列表  重新请求api
	static UpChartListChanged = {
		Name: "UpChartListChanged",
		Info: null
	};

	// 新消息
	static NewMsgChanged = {
		Name: "NewMsgChanged",
		Info: null,
		Type_entrust: "entrust"
	};

	// 消息内容change
	static UpChartMsgChanged = {
		Name: "UpChartMsgChanged",
		Info: null
	};
	
	// 消息内容change
	static SendChartMsgChanged = {
		Name: "SendChartMsgChanged",
		Info: null
	};

	// 点击聊天详情的scroll区域
	static ClickChartDetailScroll = {
		Name: "ClickChartDetailScroll",
		Info: null
	};

	// 点击发送消息展开按钮
	static ClickChartMoreInfo = {
		Name: "ClickChartMoreInfo",
		Info: null
	};

    // 拒绝授权
    static RefuseAuthSettingChanged = {
    	Name: "RefuseAuthSettingChanged",
    	Info: null
    };
	
	// 消息已读回执
	static MsgReadChanged = {
		Name: "MsgReadChanged",
		Info: null
	};
	
	// 房源详情撩客文案
	static LiaoKeChartChanged = {
		Name: "LiaoKeChartChanged",
		Info: null
	};

	// 旗舰店筛选按钮点击
	static CompStoreChooseChanged = {
		Name: "CompStoreChooseChanged",
		info: null
	};

	// 旗舰店筛选结果
	static CompStoreChooseResultParamsChanged = {
		Name: "CompStoreChooseResultParamsChanged",
		info: null
	};

	// 消息内容发送成功
	static MsgSendSuccessChange = {
		Name: "MsgSendSuccessChange",
		info: null
	};

	// 别人发的消息回调
	static OtherUserMsgChanged = {
		Name: "OtherUserMsgChanged",
		Info: null
	};
}
