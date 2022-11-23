import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import Modeler from "bpmn-js/lib/Modeler";
import EventEmiter from "@/utils/EventEmitter";

export type Context = {
    setModeler(modeler:Modeler): void;
    clearBpmn(): void;
    modeler:Modeler|null;
    modeling?: Modeling
}

export default function (designerDom: HTMLElement, moduleAndExtensions: Array<any>, context: Context) {
    const options = {
        container: designerDom,
        additionalModules: moduleAndExtensions[0] || [],
        moddleExtensions: moduleAndExtensions[1] || {},
        ...moduleAndExtensions[2]
    };
    // 清除旧的modeler
    context.modeler && context.modeler.destroy();
    
    // 创建新modeler
    const modeler = new Modeler(options);
    // 写入store
    context.setModeler(modeler);

    EventEmiter.emit("modeler-init", modeler);

    modeler.on("commandStack.changed", async(event) => {
        try {
            const { xml } = await modeler.saveXML({ format: true });
            console.log("事件 commandStack.changed", xml);
        } catch(error) {
            console.log(error);
        }
    });

    modeler.on("commandStack.elements.create.preExecute", (event) => {
        console.log("事件 commandStack.elements.create.preExecute", event);
        // 创建新节点在这里，添加默认值
        const { context: { elements } } = event;
        if (elements[0] && elements[0].type === "bpmn:StartEvent") {
            console.log("elements[0]", elements[0])
            //elements[0].name = "开始事件"
            elements[0].businessObject.name = "开始事件"
        }
        return event;
    });

    modeler.on("commandStack.shape.replace.preExecute", (event) => {
        // 替换原有节点
        console.log("commandStack.shape.replace.preExecute", event);

        return event;
    });

    return modeler;

}