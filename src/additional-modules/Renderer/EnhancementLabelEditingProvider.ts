import LabelEditingProvider from "bpmn-js/lib/features/label-editing/LabelEditingProvider";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
import Canvas from "diagram-js/lib/core/Canvas";
import EventBus from "diagram-js/lib/core/EventBus";
import TextRenderer from "bpmn-js/lib/draw/TextRenderer";
import { Base } from "diagram-js/lib/model";
import { assign } from "min-dash";

class EnhancementLabelEditingProvider extends LabelEditingProvider {

    private static _If = "self-defined:If";
    private static _assertion = ["self-defined:Assertion", "self-defined:PositiveAssertion", "self-defined:NegativeAssertion"];

    constructor(eventBus: EventBus, bpmnFactory: BpmnFactory, canvas: Canvas, directEditing:any, modeling:any, resizeHandles:any, textRenderer: TextRenderer) {
        super(eventBus, bpmnFactory, canvas, directEditing, modeling, resizeHandles, textRenderer);
    }

    activate(element: Base): Object {
        const context = super.activate(element);
        // 编辑内容时，是在编辑div中间，并且固定编辑div高度
        if (element.type === EnhancementLabelEditingProvider._If ||
            EnhancementLabelEditingProvider._assertion.includes(element.type)) {
            assign(context.options, {
                centerVertically: true
            });
            delete context.options?.autoResize;
        }
        return context;
    }   

    getEditingBBox(element: Base) {
        const {bounds, style} = super.getEditingBBox(element);
        // bpmn: Gateway 使得Gateway的编辑div也是显示在组件中间
        if (element.type === EnhancementLabelEditingProvider._If ||
            EnhancementLabelEditingProvider._assertion.includes(element.type)) {
            bounds.width = element.width;
            bounds.height = element.height;
        }  
        return {bounds, style}
    }
    update(element: Base, newLabel?: string, activeContextText?: any, bounds?: any): void {
        if (element.type === EnhancementLabelEditingProvider._If||
            EnhancementLabelEditingProvider._assertion.includes(element.type)) {
            bounds.width = element.width;
            bounds.height = element.height;
        }
        super.update(element, newLabel, activeContextText, bounds);
    }
}

EnhancementLabelEditingProvider.$inject = [
    'eventBus',
    'bpmnFactory',
    'canvas',
    'directEditing',
    'modeling',
    'resizeHandles',
    'textRenderer'
  ];

export default EnhancementLabelEditingProvider;