import {DefaultModel} from "./DefaultModel";

// 包含agentInfo 
export class AgentInfoModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "agentInfoDetail"
    }
    
    getIsLocal() {
        return true;
    }
}
