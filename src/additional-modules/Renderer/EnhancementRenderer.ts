import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import PathMap from "bpmn-js/lib/draw/PathMap";
import TextRenderer from "bpmn-js/lib/draw/TextRenderer";
import Canvas from "diagram-js/lib/core/Canvas";
import EventBus from "diagram-js/lib/core/EventBus";
import Styles from "diagram-js/lib/draw/Styles";
import { Base } from "diagram-js/lib/model";
import { colorReverse, drawDiamond, renderEmbeddedLabel, drawResult } from "./utils";

class EnhancementRenderer extends BpmnRenderer{
    public _styles: Styles;
    public textRenderer: TextRenderer;
    public pathMap: PathMap;
    constructor(config: any, eventBus: EventBus, styles: Styles, pathMap: PathMap, canvas: Canvas, textRenderer: TextRenderer) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, 3000);
        this._styles = styles;
        this.textRenderer = textRenderer;
        this.pathMap = pathMap;
        // 重绘开始节点
        // this.handlers["bpmn:StartEvent"] = (parentGfx: SVGElement, element: Base, attrs: any) => {
        //     if (!attrs || !attrs["fillOpacity"]) {
        //         !attrs && (attrs = {});
        //         attrs["fillOpacity"] = 1;
        //         attrs["fill"] = "white";
        //         attrs["strokeWidth"] = 1;
        //         attrs["stroke"] = "black";
        //     }
        //     element.width = 50;
        //     element.height = 50;
        //     return drawCircle(this, parentGfx, element.width, element.height, 0, attrs);
        // }

        this.handlers["self-defined:If"] = (parentGfx: SVGElement, element: Base, attrs: any) => {
            if (!attrs || !attrs["fillOpacity"]) {
                !attrs && (attrs = {});
                attrs["fillOpacity"] = 0.95;
                attrs["fill"] = "none";
                attrs["strokeWidth"] = 2;
                attrs["stroke"] = "black";
            }
            // 重设宽高
            element.width = 120;
            element.height = 60;
            // 设置渲染文本标签的位置为中间
            renderEmbeddedLabel(this, parentGfx, element, "center-middle");
            return drawDiamond(this, parentGfx, element.width, element.height, attrs);
        }

        this.handlers["self-defined:Assertion"] = (parentGfx: SVGElement, element: Base, attrs: any) => {
            if (!attrs || !attrs["fillOpacity"]) {
                !attrs && (attrs = {});
                attrs["fillOpacity"] = 0.95;
                
                attrs["strokeWidth"] = 2;
                attrs["stroke"] = "black";
            }
            // 重设宽高
            element.width = 160;
            element.height = 80;
            const textColor = colorReverse(attrs["fill"] || "#000");
            // 设置渲染文本标签的位置为中间
            
            const assertion = drawResult(this, parentGfx, element.width, element.height, attrs);
            renderEmbeddedLabel(this, parentGfx, element, "center-middle", textColor);
            return assertion;
        }

        this.handlers["self-defined:PositiveAssertion"] = (parentGfx: SVGElement, element: Base, attrs: any) => {
            if (!attrs) {
                attrs = {}
            }
            attrs["fill"] = "#33b71e";
            return this.handlers["self-defined:Assertion"](parentGfx, element, attrs);
        }
        this.handlers["self-defined:NegativeAssertion"] = (parentGfx: SVGElement, element: Base, attrs: any) => {
            if (!attrs) {
                attrs = {}
            }
            attrs["fill"] = "#cd3e3e";
            return this.handlers["self-defined:Assertion"](parentGfx, element, attrs);
        }
    }
}

EnhancementRenderer.$inject = ["config.bpmnRenderer", "eventBus", "styles", "pathMap", "canvas", "textRenderer"];

export default EnhancementRenderer;