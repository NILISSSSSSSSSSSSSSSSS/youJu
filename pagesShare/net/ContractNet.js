import {RequestApi, RequestApiItem} from "../../utils/RequestApi";
import {Const} from "../../utils/Const";
import {
    ContractDetailSignTypeModel,
    ContractDetailStatusModel,
    ContractPdfUrlModel,
    ContractSignTimeModel
} from "../../model/ContractModel";

// 参数加密
export class GetAesEncrypt {
    request = {};

    constructor(request) {
        this.request = request;
    }

    send() {
        return new GetAesEncryptRequest(this.request).send()
            .then(res => {
                if(!res.data) return "";

                return res.data.encdata || "";
            });
    }
}
class GetAesEncryptRequest extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/contractMini/getAesEncrypt";
    }
}

// html转图片
export class HtmlToImg {
    htmlUrl = "";
    request = {};

    constructor(contractId = "", cityId = "") {
        this.request = {
            url: encodeURIComponent(this.htmlUrl + contractId + "&cityId=" + cityId),
            type: "img"
        };
    }

    send() {
        return new HtmlToImgOrPdf(this.request).send()
            .then(res => {
                if(res.code !== Const.success) {
                    return Promise.reject(res.msg || "合同加载失败");
                }

                let response = {};
                response["path"] = res.data ? res.data.path || "" : "";
                return response;
            })
            .catch(err => {
                let errInfo = {};
                errInfo["msg"] = err.msg || "合同加载失败";
                return errInfo;
            });
    }
}
// html转pdf
export class HtmlToPdf {
    htmlUrl = "";
    request = {};

    constructor(contractId = "", cityId = "") {
        this.request = {
            // url: encodeURIComponent(this.htmlUrl + contractId + "&cityId=" + cityId),
            contractId: contractId,
            cityId: cityId
        };
    }

    send() {
        return new HtmlToImgOrPdf(this.request).send()
            .then(res => {
                if (res.code !== Const.success) {
                    return Promise.reject(res);
                }

                if(res.data && res.data.pdfAddr && res.data.pdfAddr.indexOf("http://pic.myfun7.com/") === -1) {
                    res.data.pdfAddr = "http://pic.myfun7.com/" + res.data.pdfAddr;
                }
                if(res.data) {
                    new ContractPdfUrlModel().setModel(res.data.pdfAddr || "");
                }
                return res;
            });
    }
}
class HtmlToImgOrPdf extends RequestApi{
    constructor(responseData) {
        if(responseData.contractId) {
            responseData.dealId = responseData.contractId;
        }
        let item = new RequestApiItem();
        item.domain = "vr";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/Pdf/htmlToPdf";
    }
}

// pdf转图片
export class PdfToImg {
    request = {};

    constructor(request) {
        this.request = request;
    }

    send() {
        return new PdfToImgRequest(this.request).send()
            .then(res => {
                if(res.code !== Const.success) {
                    return Promise.reject(res);
                }

                if(res.data && res.data.indexOf("http://pic.myfun7.com/") === -1) {
                    res.data = "http://pic.myfun7.com/" + res.data;
                }
                return res;
            });
    }
}
class PdfToImgRequest extends RequestApi{
    constructor(responseData) {
        if(responseData.contractId) {
            responseData.dealId = responseData.contractId;
        }
        let item = new RequestApiItem();
        item.domain = "vr";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/api/Pdf/pdfToImage?url=";
    }
}

// 获取合同状态接口
export class GetContractStatus {
    request = {};

    // dealId userId cityId
    constructor(data) {
        this.request = data;
    }

    send() {
        return new GetAesEncrypt(this.request).send()
            .then(res => {
                return new GetContractStatusRequest({param: res}).send()
            })
            .then(res => {
                if(res.code !== Const.success) {
                    return Promise.reject(res);
                }

                let data = res.data || {};
                if(data.userImageUrl && data.userImageUrl.indexOf("http://pic.myfun7.com/") === -1) {
                    data.userImageUrl = "http://pic.myfun7.com/" + data.userImageUrl;
                }
                if(data.pdfUrl && data.pdfUrl.indexOf("http://pic.myfun7.com/") === -1) {
                    data.pdfUrl = "http://pic.myfun7.com/" + data.pdfUrl;
                }
                let contractInfo = {
                    status: new ContractDetailStatusModel().getModel(), // 1 已签订  2 未签订 3 已作废 4 审核中
                    signType: new ContractDetailSignTypeModel().getModel(), // 1 线下签约 2 均可 3 线上
                    finishTime: new ContractSignTimeModel().getModel(),
                    pdfUrl: data.pdfUrl,
                    archiveInfo: {
                        deptName: data.userDeptName || "",
                        headerImg: data.userImageUrl || Const.imDefaultHeadImg,
                        archiveId: data.archiveId || "",
                        name: data.userName || ""
                    }
                };
                return contractInfo;
            });
    }
}
class GetContractStatusRequest extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/contractMini/getAppletContractDetails";
    }
}


// 发送合同
export class SendContract {
    request = {};

    // cityId=1 & dealId=222222 & emailAddress= &telNum(电话号码)
    constructor(request) {
        if(!request.telNum) {
            request.telNum = new UserInfoModel().getModel("telephone") || "";
        }
        this.request = request;
    }

    send() {
        return new GetAesEncrypt(this.request).send()
            .then(res => {
                return new SendContractRequest({param: res}).send()
            })
            .then(res => {
                if(res.code !== Const.success) {
                    return Promise.reject(res);
                }

                return {
                    code: res.status,
                    msg: res.msg || ""
                };
            });
    }
}
class SendContractRequest extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/contractMini/sendEmail";
    }
}


// 获取交易进度
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
class ProcessListItem {
    title = "";  // 介绍标题
    dealName = ""; // 负责人姓名
    planTime = "";  // 计划完成时间(已处理)
    realityTime = "";  // 实际完成时间(已处理)
    status = 1;  // 1 计划中  2 已完成  3 正在处理
}
class BottomAgentItem {
    archiveId = "";  // 经纪人id
    archiveName = "";  // 经纪人姓名
    archiveHeadImg = "";  // 经纪人头像
    archiveDeptName = "";  // 经纪人所在门店
}

import {UserInfoModel} from "../../model/UserInfoModel";
export class GetContractProcess {
    request = this.getRequestItem();

    constructor(request) {
        this.request = request;
    }

    getRequestItem() {
        class RequestItem {
            dealId = "";  // 处理id（没有合同的时候有这个）
            contractId = "";  // 合同id（生成合同后）
        }
        return new RequestItem();
    }

    send() {
        return new GetAesEncrypt(this.request).send()
            .then(res => {
                return new GetContractProcessRequest({param: res}).send()
            })
            .then(res => {
                if(res.code !== Const.success) {
                    return Promise.reject(res);
                }

                let data = res.data || {};
                let topItem = new ProcessTopItem();
                topItem.archiveDeptName = data.userDeptName || "";
                topItem.archiveName = data.userName || "";
                topItem.buildName = data.buildName || "";
                topItem.buyHouseName = data.buyOwnerName || "";
                topItem.houseArea = data.area || "";
                // 合同类型出售：101 出租 102
                if(data.sellDealMoney && Number(data.sellDealMoney) && data.dealType == 101) {
                    data.sellDealMoney = (Number(data.sellDealMoney)/10000).toFixed(1);
                    if(data.sellDealMoney.indexOf(".0") >= 0) {
                        data.sellDealMoney = parseInt(data.sellDealMoney);
                    }
                }
                topItem.houseTotalPrice = data.sellDealMoney && Number(data.sellDealMoney)
                    ? Number(data.sellDealMoney) + "万" : "";
                if(data.dealType == 102) {
                    topItem.houseTotalPrice = data.sellDealMoney && Number(data.sellDealMoney)
                        ? Number(data.sellDealMoney) + "元/月" : ""
                }
                topItem.propertyAddress = data.houseAdress || "";
                topItem.saleHouseName = data.sellOwnerName || "";
                if(data.completeTime && data.completeTime.length >= 10) {
                    data.completeTime = data.completeTime.substring(0, 10);
                }
                topItem.signTime = data.completeTime || "";
                topItem.infoList = [
                    [
                        {title: ["卖", "方"], val: topItem.saleHouseName},
                        {title: ["经", "纪", "人"], val: topItem.archiveName+"-"+topItem.archiveDeptName}
                    ],
                    [
                        {title: ["买", "方"], val: topItem.buyHouseName},
                        {title: ["签", "约", "日", "期"], val: topItem.signTime}
                    ]
                ];

                let processList = [];
                let list = data.stepList || [];
                // 1:未处理 2:待处理 3:已处理 4跳过  服务器状态
                let runstepStatusMap = {
                    2: 3,
                    1: 1,
                    3: 3
                };
                for (let info of list) {
                    if(info.runstepStatus === undefined) continue;

                    let listItem = new ProcessListItem();
                    listItem.dealName = info.executorName || "";
                    listItem.status = runstepStatusMap[info.runstepStatus];
                    if(info.timelimitdate && info.timelimitdate.length > 10) {
                        info.timelimitdate = info.timelimitdate.substring(0, 10);
                    }
                    if(info.updateTime && info.updateTime.length > 10) {
                        info.updateTime = info.updateTime.substring(0, 10);
                    }
                    if(listItem.status !== 2) {
                        listItem.planTime = info.timelimitdate || "";
                    }
                    if(listItem.status === 2) {
                        listItem.realityTime = info.updateTime;
                    }
                    listItem.title = info.stepName || "";
                    processList.push(listItem);
                }

                let agentInfo = new BottomAgentItem();
                agentInfo.archiveDeptName = data.userDeptName || "";
                agentInfo.archiveHeadImg = data.userImageUrl || Const.imDefaultHeadImg;
                agentInfo.archiveId = data.archiveId || "";
                agentInfo.archiveName = data.userName || "";

                let contractStatus = 1;
                if(data.dealAuditStatus !== undefined && data.dealAuditStatus == 3) {
                    contractStatus = 2;
                }
                if(data.dealAuditStatus !== undefined && ([0,3,4,5,7,8].includes(data.dealAuditStatus))) {
                    contractStatus = 3;
                }

                // 设置合同详情状态
                let status = 2;
                if(data.contractStatus !== undefined && data.contractStatus == 0) {
                    status = 2;
                }
                if(data.contractStatus !== undefined && data.contractStatus == 1) {
                    status = 1;
                }
                if(data.dealAuditStatus !== undefined && data.dealAuditStatus == 3) {
                    status = 3;
                }
                if(data.dealAuditStatus !== undefined && [1, 2, 5, 6, 9].includes(data.dealAuditStatus)
                    && status !== 1) {
                    status = 4;
                }
                new ContractDetailStatusModel().setModel(status);

                // 设置签约类型
                let signType = 2;
                if(data.signType !== undefined && data.signType == 0) {
                    signType = 1;
                }
                if(data.signType !== undefined && data.signType == 1) {
                    signType = 3;
                }

                new ContractDetailSignTypeModel().setModel(signType);

                // 设置签约日期
                new ContractSignTimeModel().setModel(topItem.signTime);
                if(data.dealType == 102) {
                    uni.reLaunch({
                        url: "/packageShare/pages/contractDetail/contractDetail"
                    });
                }
                return {
                    code: 200,
                    msg: "获取成功",
                    contractStatus: contractStatus,  // 1 正常  2 作废 3 未通过初审
                    topItem: topItem,
                    processList: processList,
                    agentInfo: agentInfo
                };
            });
    }
}
class GetContractProcessRequest extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/contractMini/getAppletWarrantStepList";
    }
}


// 判断能否查看合同
export class CheckIsCanLookContract {
    request = {};

    // cityId=1&dealId=12001&openId=10575&userId=2001&mobile=15856088468
    constructor(request) {
        if(request.userId && new UserInfoModel().getModel("me")) {
            request.userId = new UserInfoModel().getModel("me").userId || "";
        }
        this.request = request;
    }

    send() {
        return new GetAesEncrypt(this.request).send()
            .then(res => {
                return new CheckIsCanLookContractRequest({param: res}).send()
            })
            .then(res => {
                if(res.code !== Const.success) {
                    return Promise.reject(res);
                }

                if(!res.data || res.data.code !== Const.success) {
                    return Promise.reject(res);
                }

                return res;
            });
    }
}
class CheckIsCanLookContractRequest extends RequestApi {
    constructor(responseData) {
        let item = new RequestApiItem();
        item.data = responseData;
        item.domain = "kaidanbao";
        super(item);
    }

    getUrl() {
        return "/Mini/contractMini/shareDeal";
    }
}