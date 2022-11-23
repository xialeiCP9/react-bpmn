// 全局化bpmn-js模块
import { createSlice } from "@reduxjs/toolkit";
import { Action } from "redux"
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import Modeler from "bpmn-js/lib/Modeler";
import { Shape } from "diagram-js/lib/model";

export interface BpmnState {
    modeler: Modeler | null;
    modeling?: Modeling;
    activeElement?: Shape;
}

interface ExtendAction<T> extends Action<string> {
    payload?: T;
}

const initialState: BpmnState = {
    modeler: null,
    modeling: undefined,
    activeElement: undefined
}

const modelerSlice = createSlice({
    name: "bpmn",
    initialState,
    reducers: {
        setModeler(state, action: ExtendAction<Modeler>){
            const modeler = action.payload!;
            const modeling = modeler.get<Modeling>("modeling");
            return {
                ...state,
                modeler,
                modeling
            }
        },
        setActiveElement(state, action: ExtendAction<Shape>) {
            return {
                ...state,
                activeElement: action.payload
            }
        },
        clear(){
            return initialState;
        }
    }
});

export default modelerSlice.reducer;