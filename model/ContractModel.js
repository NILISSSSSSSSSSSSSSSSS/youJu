import {DefaultModel} from "./DefaultModel";


// 合同ID
export class ContractIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractIdModel"
    }

    getIsLocal() {
        return false;
    }
}

// 合同城市ID
export class ContractCityIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractCityIdModel"
    }

    getIsLocal() {
        return false;
    }
}

// 合同pdf链接
export class ContractPdfUrlModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractPdfUrlModel"
    }

    getIsLocal() {
        return false;
    }
}

// 合同 dealID
export class ContractDealIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractDealIdModel"
    }

    getIsLocal() {
        return false;
    }
}

// 合同 userId
export class ContractUserIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractUserIdModel"
    }

    getIsLocal() {
        return false;
    }
}

// 签约日期
export class ContractSignTimeModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractSignTimeModel"
    }

    getIsLocal() {
        return false;
    }
}

// 合同详情页状态 status
// status: 1, // 1 已签订  2 未签订 3 已作废
export class ContractDetailStatusModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractDetailStatusModel"
    }

    getIsLocal() {
        return false;
    }
}

// 合同详情页签约配置 signType
// 1 线下签约 2 均可 3 线上
export class ContractDetailSignTypeModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ContractDetailSignTypeModel"
    }

    getIsLocal() {
        return false;
    }
}