import type EnhancementRenderer from "./EnhancementRenderer";
import { isObject, assign } from "min-dash";
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses
  } from 'tiny-svg';
import { Base } from "diagram-js/lib/model";
import { getSemantic, getLabelColor, black } from "bpmn-js/lib/draw/BpmnRenderUtil";
// 绘制圆形
export function drawCircle(renderer: EnhancementRenderer, parentGfx: SVGElement, width: number, height: number, offset:number|Object,attrs:{[propName:string]: any}) {
    if (isObject(offset)) {
        attrs = offset;
        offset = 0;
    }
    offset = offset || 0;
    attrs = renderer._styles.computeStyle(attrs);
    if (attrs.fill === "none") {
        delete attrs.fillOpacity;
    }
    const cx = width / 2, cy = height / 2;
    const circle = svgCreate("circle");
    svgAttr(circle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4 - (offset as number))
    });
    svgAttr(circle, attrs);
    svgAppend(parentGfx, circle);
    return circle;
}

// 绘制菱形
export function drawDiamond(renderer: EnhancementRenderer, parentGfx: SVGElement, width: number, height: number, attrs: {[propName:string]: any}) {
    attrs = renderer._styles.computeStyle(attrs);
    if (attrs.fill === "none") {
        delete attrs.fillOpacity;
    }
    const x_1 = width / 2, y_1 = height / 2;
    const points = [{x: x_1, y: 0}, {x: width, y: y_1}, {x: x_1, y: height}, {x: 0, y: y_1}];
    const pointsString = points.map(function(point) {
        return point.x + ',' + point.y;
    }).join(" ");
    const polygon = svgCreate("polygon");
    svgAttr(polygon, {
        points: pointsString
    });
    svgAttr(polygon, attrs);
    svgAppend(parentGfx, polygon);
    return polygon;
}

// 绘制半圆矩形
export function drawResult(renderer: EnhancementRenderer, parentGfx: SVGElement, width: number, height: number, attrs?: {[propName:string]: any}) {
    const r = height / 2;
    const d = `M${r},0 h${width - r*2} A${r},${r} 180 1 1 ${width-r},${2*r} h${-width + r*2} A${r},${r} 180 1 1 ${r},0`;
    return drawPath(renderer, parentGfx, d, attrs);
}

// 绘制路径
export function drawPath(renderer: EnhancementRenderer, parentGfx: SVGElement, d: string, attrs?: {[propName:string]: any}) {
    attrs = renderer._styles.computeStyle(attrs, ["no-fill"], {
        strokeWidth: 2,
        stroke: black
    });
    const path = svgCreate("path");
    svgAttr(path, { d });
    svgAttr(path, attrs);
    svgAppend(parentGfx, path);
    return path;
}

// 渲染文本标签
export function renderLabel(renderer: EnhancementRenderer, parentGfx: SVGElement, label: string = "", options: Object) {
    options = assign({
        size: {
            width: 100
        }
    }, options);
    const text = renderer.textRenderer.createText(label, options);
    svgClasses(text).add("djs-label");
    svgAppend(parentGfx, text);
    return text;
}
// 渲染内嵌文本标签
export function renderEmbeddedLabel<E extends Base>(renderer: EnhancementRenderer, parentGfx: SVGElement, element: E , align: string, fill?:string) {
    const semantic = getSemantic(element);
    const text = renderLabel(renderer, parentGfx, semantic.name || "", {
        box: element,
        align: align,
        padding: 5,
        style: {
            fill: getLabelColor(element, fill ? fill : "#000", "#ccc")
        }
    });
    return text;
}

/**
 * 获取相反颜色
 * @param {String} oldColor 为16进制色值的字符串（例：'#000000')
 * @return {String} 返回反色的色值
 */
export const colorReverse = (oldColor: string) => {
    if (oldColor.startsWith('#')) {
        oldColor = oldColor.substring(1);
    }
    if (oldColor.length === 3) {
        oldColor = [oldColor[0], oldColor[0], oldColor[1], oldColor[1], oldColor[2], oldColor[2]].join("");
    }
    if (oldColor.length !== 6) {
        throw new Error("Invalid background color." + oldColor);
    }
    const r = parseInt(oldColor.slice(0, 2), 16);
    const g = parseInt(oldColor.slice(2, 4), 16);
    const b = parseInt(oldColor.slice(4, 6), 16);
    if ([r, g, b].some(x => Number.isNaN(x))) {
        throw new Error("Invalid background color."  + oldColor);
    }
    const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? "#000" : "#FFF";
    return textColor;
}