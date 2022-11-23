import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import type { RootState } from "@/store/store";
import styles from "./index.module.less";
import SvgIcon from "@/components/SvgIcon";
import { Divider, Tooltip } from "antd";
import { assign } from "min-dash";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import Modeler from "bpmn-js/lib/Modeler";
import Create from "diagram-js/lib/features/create/Create";
import EventBus from "diagram-js/lib/core/EventBus";

interface IProps extends PropsWithChildren{
    modeler: Modeler|null;
}

const Palette: React.FC<IProps> = (props) => {

    const { modeler } = props;
    const handTool = useMemo(() => {
        return modeler?.get("handTool") as any;
    }, [modeler]);
    const lassoTool = useMemo(() => {
        return modeler?.get("lassoTool") as any;
    }, [modeler]);
    const spaceTool = useMemo(() => {
        return modeler?.get("spaceTool") as any;
    }, [modeler]);
    const globalConnect = useMemo(() => {
        return modeler?.get("globalConnect") as any;
    }, [modeler]);

    const [activeType, setActiveType] = useState<string>("");

    // useEffect(() => {
    //     function check(){
    //         console.log("fdafdsafsdafsadf")
    //         setActiveType("");
    //     }
    //     if (!handTool) {
    //         return;
    //     }
    //     window.addEventListener("click", check);
    //     return () => window.removeEventListener("click", check);
    // }, [handTool]);

    useEffect(() => {
        if (!modeler) {
            return;
        }
        const eventBus: EventBus = modeler.get("eventBus");
        eventBus.on("lasso.end", 1500, () => {
            setActiveType("");
            // console.log("handTool?.isActive()", handTool?.isActive());
            // console.log("lassoTool?.isActive()", lassoTool?.isActive());
            // console.log("spaceTool?.isActive()", spaceTool?.isActive());
            // console.log("globalConnect?.isActive()", globalConnect?.isActive());
        });
        eventBus.on("spaceTool.end", 1500, () => {
            setActiveType("");
            // console.log("handTool?.isActive()", handTool?.isActive());
            // console.log("lassoTool?.isActive()", lassoTool?.isActive());
            // console.log("spaceTool?.isActive()", spaceTool?.isActive());
            // console.log("globalConnect?.isActive()", globalConnect?.isActive());
        });
        eventBus.on("hand.end", 1500, () => {
            setActiveType("");
            // console.log("handTool?.isActive()", handTool?.isActive());
            // console.log("lassoTool?.isActive()", lassoTool?.isActive());
            // console.log("spaceTool?.isActive()", spaceTool?.isActive());
            // console.log("globalConnect?.isActive()", globalConnect?.isActive());
        });
        eventBus.on("global-connect.ended", 1500, () => {
            setActiveType("");
            // console.log("handTool?.isActive()", handTool?.isActive());
            // console.log("lassoTool?.isActive()", lassoTool?.isActive());
            // console.log("spaceTool?.isActive()", spaceTool?.isActive());
            // console.log("globalConnect?.isActive()", globalConnect?.isActive());
        });
    }, [modeler]);

    const handleEvent = (e: Event, type:string, options?: any) => {
        if (!modeler) {
            return;
        }
        switch(type){
            case "hand-tool":
                handTool.activateHand(e);
                setActiveType("hand-tool");
                break;
            case "lasso-tool":
                lassoTool.activateSelection(e);
                setActiveType("lasso-tool");
                break;
            case "space-tool":
                spaceTool.activateSelection(e);
                setActiveType("space-tool");
                break;
            case "global-connect-tool":
                globalConnect.start(e);
                setActiveType("global-connect-tool");
                break;
            default:
                setActiveType("");
                const ElementFactory: ElementFactory = modeler.get("elementFactory");
                const create: Create = modeler.get("create");
                const shape = ElementFactory.createShape(assign({ type: type, options }));
                create.start(e, shape);
                break;
        }
        
    }

    return (
        <div className={styles.box}>
            <div className={styles.tool}>
                <Tooltip title={"激活抓手工具"} placement="right">
                    <div
                        onClick={e => handleEvent(e as unknown as Event, "hand-tool")}
                    >
                        <SvgIcon iconClass="hand" className={[styles.svgIcon, styles.hand, activeType==="hand-tool" ? styles.active : ""].join(" ")} />
                    </div>
                </Tooltip>
                <Tooltip title={"激活套索工具"} placement="right">
                    <div
                        onClick={e => handleEvent(e as unknown as Event, "lasso-tool")}
                    >
                        <SvgIcon iconClass="lasso-tool" className={[styles.svgIcon, styles.lasso, activeType==="lasso-tool" ? styles.active : ""].join(" ")} />
                    </div>
                </Tooltip>
                <Tooltip title={"激活创建/删除空间工具"} placement="right">
                    <div
                        onClick={e => handleEvent(e as unknown as Event, "space-tool")}
                    >
                        <SvgIcon iconClass="space-tool" className={[styles.svgIcon, styles.lasso, activeType==="space-tool" ? styles.active : ""].join(" ")} />
                    </div>
                </Tooltip>
                <Tooltip title={"激活全局连接工具"} placement="right">
                    <div
                        onClick={e => handleEvent(e as unknown as Event, "global-connect-tool")}
                    >
                        <SvgIcon iconClass="connect" className={[styles.svgIcon, styles.lasso, activeType==="global-connect-tool" ? styles.active : ""].join(" ")} />
                    </div>
                </Tooltip>
            </div>
            <Divider />
            <div className={styles.node}>
                <Tooltip title={"创建开始事件"} placement="right">
                    <div 
                        draggable={true}
                        onClick={e => handleEvent(e as unknown as Event, "bpmn:StartEvent")}
                        onDragStart={e => handleEvent(e as unknown as Event, "bpmn:StartEvent")}>
                        <SvgIcon iconClass="circle" className={[styles.svgIcon, styles.circle].join(" ")} />
                    </div>
                </Tooltip>
                <Tooltip title={"条件判断"} placement="right">
                    <div
                        draggable={true}
                        onClick={e => handleEvent(e as unknown as Event, "self-defined:If")}
                        onDragStart={e => handleEvent(e as unknown as Event, "self-defined:If")}>
                        <SvgIcon iconClass="diamond" className={[styles.svgIcon, styles.circle].join(" ")} />
                    </div>
                    
                </Tooltip>
                <Tooltip title={"创建任务"} placement="right">
                    <div
                        draggable={true}
                        onClick={e => handleEvent(e as unknown as Event, "bpmn:Task")}
                        onDragStart={e => handleEvent(e as unknown as Event, "bpmn:Task")}
                    >
                        <SvgIcon iconClass="task" className={[styles.svgIcon, styles.circle].join(" ")} />
                    </div>
                </Tooltip>
                <Tooltip title={"创建断言"} placement="right">
                    <div
                        draggable={true}
                        onClick={e => handleEvent(e as unknown as Event, "self-defined:PositiveAssertion")}
                        onDragStart={e => handleEvent(e as unknown as Event, "self-defined:PositiveAssertion")}
                    >
                        <SvgIcon iconClass="result" className={[styles.svgIcon, styles.circle].join(" ")} />
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        modeler: state.bpmn.modeler
    }
}

export default connect(mapStateToProps)(Palette);