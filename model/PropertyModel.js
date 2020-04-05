// 物业版委托登记相关
import {DefaultModel} from "./DefaultModel";

// 设置 toSend = 2 物业版
export class PropertyToSend extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyToSend"
    }
}

// 设置经纪人id
export class PropertyArchiveId extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyArchiveId"
    }
}

// 设置经纪人name
export class PropertyArchiveName extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyArchiveName"
    }
}

// 设置经纪人head
export class PropertyArchiveHead extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyArchiveHead"
    }
}

// 设置公司id(admin库的公司id)
export class PropertyCompId extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyCompId"
    }
}

// 设置门店deptId(admin库的门店id)
export class PropertyDeptId extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyDeptId"
    }
}

// 设置经纪人服务区域id
export class PropertyRegionId extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyRegionId"
    }
}

// 设置经纪人服务区域name
export class PropertyRegionName extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyRegionName"
    }
}

// 设置楼盘buildId
export class PropertyBuildId extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyBuildId"
    }
}

// 设置楼盘buildName
export class PropertyBuildName extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyBuildName"
    }
}

// 设置楼盘build图片
export class PropertyBuildCompPhoto extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyBuildCompPhoto"
    }
}

// 设置物业委托发布参数
export class PropertyPushEntrustRequestData extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "PropertyPushEntrustRequestData"
    }
}
