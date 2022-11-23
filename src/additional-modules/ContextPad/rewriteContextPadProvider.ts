import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { Injector } from "didi";
import EventBus from 'diagram-js/lib/core/EventBus';
import ContextPad from 'diagram-js/lib/features/context-pad/ContextPad';
import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import Connect from 'diagram-js/lib/features/connect/Connect';
import Create from 'diagram-js/lib/features/create/Create';
import PopupMenu from 'diagram-js/lib/features/popup-menu/PopupMenu';
import Canvas from 'diagram-js/lib/core/Canvas';
import Rules from 'diagram-js/lib/features/rules/Rules';
import { Translate } from 'diagram-js/lib/i18n/translate';
import { Base, Shape } from "diagram-js/lib/model";
import {
    assign,
    forEach,
    isArray,
    every
  } from 'min-dash';
  import { is } from "bpmn-js/lib/util/ModelUtil";

class RewriteContextPadProvider extends ContextPadProvider {
    constructor(config: any,
        injector: Injector,
        eventBus: EventBus,
        contextPad: ContextPad,
        modeling: Modeling,
        elementFactory: ElementFactory,
        connect: Connect,
        create: Create,
        popupMenu: PopupMenu,
        canvas: Canvas,
        rules: Rules,
        translate?: Translate
    ) {
        super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate, 2000);
        this._contextPad = contextPad;
        this._modeling = modeling;
        this._elementFactory = elementFactory;
        this._connect = connect;
        this._create = create;
        this._popupMenu = popupMenu;
        this._canvas = canvas;
        this._rules = rules;
        this._translate = translate;
        this._autoPlace = injector.get("autoPlace", false);
    }

    getContextPadEntries(element: Base){
        const contextPad = this._contextPad,
            modeling = this._modeling,

            elementFactory = this._elementFactory,
            connect = this._connect,
            create = this._create,
            popupMenu = this._popupMenu,
            canvas = this._canvas,
            rules = this._rules,
            autoPlace = this._autoPlace,
            translate = this._translate;
        const actions = {};
        if (element.type === "label") {
            return actions;
        }
        const businessObject = element.businessObject;
        function startConnect(event: Event, element: Base) {
            connect.start(event, element);
        }
    
        function removeElement(e: Event, element: Base) {
            modeling.removeElements([ element ]);
        }
    
        function getReplaceMenuPosition(element: Base) {
    
            var Y_OFFSET = 5;
        
            var diagramContainer = canvas.getContainer(),
                pad = contextPad.getPad(element).html;
        
            var diagramRect = diagramContainer.getBoundingClientRect(),
                padRect = (pad as HTMLElement).getBoundingClientRect();
        
            var top = padRect.top - diagramRect.top;
            var left = padRect.left - diagramRect.left;
        
            var pos = {
                x: left,
                y: top + padRect.height + Y_OFFSET
            };
        
            return pos;
        }

        /**
         * 创建一个追加动作
         */
        function appendAction(type:string, className:string, title: string, options: Object) {
            function appendStart(event: Event, element: Base) {
                const shape = elementFactory.createShape(assign({type}, options));
                create.start(event, shape, {
                    source: element
                });
            }
            const append = autoPlace ? function(event: Event, element: Base) {
                const shape = elementFactory.createShape(assign({type}, options));
                autoPlace.append(element as Shape, shape);
            } : appendStart;
            return {
                group: "model",
                className: className,
                title: title,
                action: {
                    dragstart: appendStart,
                    click: append
                }
            }
        }

        // if (!popupMenu.isEmpty(element, "bpmn-replace") ||
        //     !is(businessObject, "bpmn:Task") ||
        //     !is(businessObject, "self-defined:If")
        //     ) {
        //     // 替换菜单项
        //     assign(actions, {
        //         "replace": {
        //             group: "edit",
        //             className: "bpmn-icon-screw-wrench",
        //             title: "修改类型",
        //             action: {
        //                 click: function(event: MouseEvent, element: Base) {
        //                     const position = assign(getReplaceMenuPosition(element), {
        //                         cursor: {x: event.x, y: event.y}
        //                     });
        //                     popupMenu.open(element, "bpmn-replace", position);
        //                 }
        //             }
        //         }
        //     });
        // }

        if (is(businessObject, "bpmn:StartEvent") ||
            is(businessObject, "self-defined:If") ||
            is(businessObject, "bpmn:Task")
            ) {
            // 开始节点\条件判断节点\任务节点，可以连线、增加判断、追加任务、追加断言
            assign(actions, {
                "connect": {
                    group: "connect",
                    className: "bpmn-icon-connection-multi",
                    title: "连接线",
                    action: {
                        click: startConnect,
                        dragStart: startConnect
                    }
                },
                "append.if":
                    appendAction(
                        "self-defined:If",
                        "iconfont icon-if",
                        "追加判断条件",
                        {
                            isForCompensation: false
                        }
                    ),
                "append.task":
                    appendAction(
                        "bpmn:Task",
                        "bpmn-icon-task",
                        "追加任务",
                        {
                            isForCompensation: false
                        }
                    ),
                "append.assertion":
                    appendAction(
                        "self-defined:PositiveAssertion",
                        "iconfont icon-positive-assertion",
                        "追加正向断言",
                        {
                            isForCompensation: false
                        }
                    )
            });
        }

        if (is(businessObject, "self-defined:Assertion")) {
            assign(actions, {
                "replace": {
                    group: "edit",
                    className: "bpmn-icon-screw-wrench",
                    title: "修改类型",
                    action: {
                        click: function(event: MouseEvent, element: Base) {
                            const position = assign(getReplaceMenuPosition(element), {
                                cursor: {x: event.x, y: event.y}
                            });
                            popupMenu.open(element, "bpmn-replace", position);
                        }
                    }
                }
            })
        }

        let deleteAllowed = rules.allowed("elements.delete", { elements: [ element ] });
        if (isArray(deleteAllowed)) {
            deleteAllowed = deleteAllowed[0] === element;
        }
        if (deleteAllowed) {
            assign(actions, {
                "delete": {
                    group: "edit",
                    className: "bpmn-icon-trash",
                    title: "删除",
                    action: {
                        click: removeElement
                    }
                }
            })
        }

        return actions;
    }
}

export default RewriteContextPadProvider;