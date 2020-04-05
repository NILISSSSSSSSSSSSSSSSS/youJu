import {DefaultModel} from "./DefaultModel";


// 日志
export class ConsoleModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "ConsoleModel"
    }

    getIsLocal() {
        return true;
    }
}
