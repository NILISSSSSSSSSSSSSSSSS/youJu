// 旗舰店model相关
import {DefaultModel} from "../../model/DefaultModel";


// pageToIndexQuery == CompStoreEnterQueryModel
// compStoreParams == CompStoreParamsModel
// isCompStoreParams == CompStoreIsCompStoreParamsModel


// 旗舰店进入参数
export class CompStoreEnterQueryModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreEnterQueryModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店配置config
export class CompStoreConfigModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreConfigModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店参数 compStoreParams
export class CompStoreParamsModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreParamsModel"
    }

    getIsLocal() {
        return true;
    }
}

// isCompStoreParams
export class CompStoreIsCompStoreParamsModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIsCompStoreParamsModel"
    }

    getIsLocal() {
        return true;
    }
}

// 上一次进入的经纪人id indexAgoArchiveId
export class CompStoreIndexAgoArchiveIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIndexAgoArchiveIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// compStoreInfo 公司信息
export class CompStoreInfoModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreInfoModel"
    }

    getIsLocal() {
        return true;
    }
}


// indexChooseDataRes
export class CompStoreIndexChooseDataResModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIndexChooseDataResModel"
    }

    getIsLocal() {
        return true;
    }
}
// indexChooseRegionNewHouseRes
export class CompStoreIndexChooseRegionNewHouseResModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIndexChooseRegionNewHouseResModel"
    }

    getIsLocal() {
        return true;
    }
}
// indexHomeDataRes
export class CompStoreIndexHomeDataResModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIndexHomeDataResModel"
    }

    getIsLocal() {
        return true;
    }
}


// agentInfo
export class CompStoreAgentInfoModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreAgentInfoModel"
    }

    getIsLocal() {
        return true;
    }
}

// leaveCompIndex
export class CompStoreLeaveCompIndexModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreLeaveCompIndexModel"
    }

    getIsLocal() {
        return true;
    }
}

// findDataAgentInfo
export class CompStoreFindDataAgentInfoModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreFindDataAgentInfoModel"
    }

    getIsLocal() {
        return true;
    }
}

// unReadMsgNumMap 未读数
export class CompStoreUnReadMsgNumMapModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreUnReadMsgNumMapModel"
    }

    getIsLocal() {
        return true;
    }
}

// 门店分布搜索
export class DeptMapSearchKeyWord extends DefaultModel {
    constructor() {
        super();
    }

    getKey() {
        return "DeptMapSearchKeyWord"
    }

    getIsLocal() {
        return false;
    }
}

// 门店分布是否完成搜索
export class DeptMapFinishSearch extends DefaultModel {
    constructor() {
        super();
    }

    getKey() {
        return "DeptMapFinishSearch"
    }

    getIsLocal() {
        return false;
    }
}


// 旗舰店 compId
export class CompStoreCompIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreCompIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 deptId
export class CompStoreDeptIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreDeptIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 cityId
export class CompStoreCityIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreCityIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 archiveId
export class CompStoreArchiveIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreArchiveIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 adminDeptId
export class CompStoreAdminDeptIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreAdminDeptIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 adminCompId
export class CompStoreAdminCompIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreAdminCompIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 comefromSource
export class CompStoreComefromSourceModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreComefromSourceModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 serviceReg
export class CompStoreServiceRegModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreServiceRegModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店 isProperty  是否是物业版 1：是   其他：不是
export class CompStoreIsPropertyModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIsPropertyModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店  propertyInfo 物业版相关信息
export class CompStorePropertyInfoModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStorePropertyInfoModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店  compBuildId 公司楼盘id
export class CompStoreCompBuildIdModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreCompBuildIdModel"
    }

    getIsLocal() {
        return true;
    }
}

// 旗舰店  isOperation 判断是自营还是联营  1 联营 其他是自营
export class CompStoreIsOperationModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CompStoreIsOperationModel"
    }

    getIsLocal() {
        return true;
    }
}

