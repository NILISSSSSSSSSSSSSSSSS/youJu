

// 支付相关


// 微信小程序支付
export class WxAppPay {
    constructor() {}

    getItem() {
        class Item {
            appId = "";
            timeStamp = "";   // 时间戳从1970年1月1日至今的秒数，即当前的时间
            nonceStr = "";   // 随机字符串，长度为32个字符以下
            package = "";    // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx
            signType = "MD5";  // 签名算法，暂支持 MD5
            paySign = "";   // 签名
        }
        return new Item();
    }

    initPay(item = this.getItem()) {
        return new Promise((resolve, reject) => {
            for (let key in item) {
                if (!item[key]) {
                    throw new Error("参数"+key+"不能为空");
                }
            }

            wx.requestPayment({
                'appId': item.appId,
                'timeStamp': item.timeStamp,
                'nonceStr': item.nonceStr,
                'package': item.package,
                'signType': item.signType,
                'paySign': item.paySign,
                'success': function (res) {
                    resolve(res);
                },
                'fail': function (res) {
                    if(res.errMsg && !res.msg) {
                        res.msg = res.errMsg;
                    }
                    reject(res);
                }
            });
        });
    }
}
