declare module 'bpmn-js' {
    import Viewer from 'bpmn-js/lib/Viewer'
  
    export default Viewer
}
declare module 'bpmn-js/lib/Viewer' {
    import BaseViewer from 'bpmn-js/lib/BaseViewer'
    import { Base, ViewerOptions } from 'diagram-js/lib/model'
    import { ModuleDefinition } from 'didi'
  
    export default class Viewer extends BaseViewer {
      constructor(options?: ViewerOptions<Element>)
      _modules: ModuleDefinition[]
      _moddleExtensions: Object
    }
}
declare module 'bpmn-js/lib/BaseViewer' {
    import Diagram from 'diagram-js'
    import { EventCallback } from 'diagram-js/lib/core/EventBus'
    import { ViewerOptions } from 'diagram-js/lib/model'
    import { InternalEvent } from 'diagram-js/lib/core/EventBus'
    import { ModuleDefinition } from 'didi'
    import BpmnModdle, { ModdleElement } from 'bpmn-moddle'
  
    export interface WriterOptions {
      format?: boolean
      preamble?: boolean
    }
    export interface DoneCallbackOpt {
      warnings: any[]
      xml?: string
      svg?: string
      err?: any
    }
    export type BPMNEvent = string
    export type BPMNEventCallback<P extends InternalEvent> = (params: P) => void
  
    export default class BaseViewer extends Diagram {
      constructor(options?: ViewerOptions<Element>)
      _moddle: BpmnModdle
      _container: Element
      _setDefinitions(definitions: ModdleElement): void
      _modules: ModuleDefinition[]
  
      _init(container: Element, moddle: Object, options: Object):void;
  
      importXML(xml: string): Promise<DoneCallbackOpt>
      open(diagram: string): Promise<DoneCallbackOpt>
      saveXML(options?: WriterOptions): Promise<DoneCallbackOpt>
      saveSVG(options?: WriterOptions): Promise<DoneCallbackOpt>
      clear(): void
      destroy(): void
      on<T extends BPMNEvent, P extends InternalEvent>(
        event: T,
        priority: number | BPMNEventCallback<P>,
        callback?: EventCallback<T, any>,
        that?: this
      ): void
      off<T extends BPMNEvent, P extends InternalEvent>(
        events: T | T[],
        callback?: BPMNEventCallback<P>
      ): void
      attachTo<T extends Element>(parentNode: string | T): void
      detach(): void
      importDefinitions(): ModdleElement
      getDefinitions(): ModdleElement
    }
}
declare module 'bpmn-js/lib/BaseModeler' {
    import Viewer from 'bpmn-js'
    import { ViewerOptions } from 'diagram-js/lib/model'
    import BpmnModdle, { ModdleElement } from 'bpmn-moddle'
  
    export default class BaseModeler extends Viewer {
      constructor(options?: ViewerOptions<Element>)
      _createModdle(options: Object): BpmnModdle
      _collectIds(definitions: ModdleElement, elementsById: Object): void
    }
}
declare module 'bpmn-js/lib/NavigatedViewer' {
    import Viewer from 'bpmn-js'
    import { ViewerOptions } from 'diagram-js/lib/model'
  
    export default class NavigatedViewer extends Viewer {
      constructor(options?: ViewerOptions<Element>)
    }
}
declare module "bpmn-js/lib/Modeler" {
    import BaseModeler from 'bpmn-js/lib/BaseModeler'
    import Viewer from 'bpmn-js'
    import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
    import { ModuleDefinition } from 'didi'
    import { ViewerOptions } from 'diagram-js/lib/model'

    export default class Modeler extends BaseModeler {
        constructor(options?: ViewerOptions<Element>)
        Viewer: Viewer
        NavigatedViewer: NavigatedViewer
        _interactionModules: ModuleDefinition[]
        _modelingModules: ModuleDefinition[]
        _modules: ModuleDefinition[]

        createDiagram(): void // 创建流程图
    }
}

declare module "bpmn-js/lib/features/modeling/BpmnFactory" {
    import { Base } from "diagram-js/lib/model";
    import BpmnModdle, { ModdleElement } from "bpmn-moddle";
    import { ModuleConstructor } from "didi";

    export default class BpmnFactory extends ModuleConstructor {
        constructor(moddle: BpmnModdle);
        protected _model: BpmnModdle;
        protected _needsId<E extends Base>(element: E): boolean;
        protected _ensureId<E extends Base>(element: E): void;
        create<E extends Base>(type: string, attrs?: Object): E & ModdleElement;
        createDiLabel<E extends Base>(): E;
        createDiShape<E extends Base>(): E;
        createDiBounds<E extends Base>(): E;
        createDiWaypoints<E extends Base>(): E;
        createDiWaypoint<E extends Base>(): E;
        createDiEdge<E extends Base>(): E;
        createDiPlane<E extends Base>(): E;
    }
}

declare module "bpmn-js/lib/features/modeling/ElementFactory" {
    import { default as DiagramElementFactory } from "diagram-js/lib/core/ElementFactory";
    import BpmnModdle, { ModdleElement } from "bpmn-moddle";
    import { Translate } from "diagram-js/lib/i18n/translate";
    import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
    import { Base, Shape } from "diagram-js/lib/model";
    import { Dimensions } from "diagram-js/lib/core/Canvas";

    export default class ElementFactory extends DiagramElementFactory {
        constructor(bpmnFactory: BpmnFactory, moddle: BpmnModdle, translate: Translate);
        _bpmnFactory: BpmnFactory;
        _moddle: BpmnModdle;
        _translate: Translate;

        baseCreate: typeof DiagramElementFactory.prototype.create;
        create<E extends Base>(elementType: string, attrs?: Object): E & ModdleElement;
        createBpmnElement<E extends Base>(elementType: string, attrs?: Object): E & ModdleElement;
        getDefaultSize(element: Base, di?: ModdleElement): Dimensions;
        createParticipantShape(attrs: Object|boolean): Shape & ModdleElement;
    }
}

declare module "bpmn-js/lib/util/ModelUtil" {
    import { ModdleElement } from "bpmn-moddle";
    import { Base } from "diagram-js/lib/model";

    export function is(element: Base | ModdleElement, type: string): boolean;

    export function isAny(element: Base | ModdleElement, types: string[]): boolean;

    export function getBusinessObject(elements: Base | ModdleElement): ModdleElement;

    export function getDi(element: Base): ModdleElement;
}

// bpmn 元素图形路径字典
declare module "bpmn-js/lib/draw/PathMap" {
  export type Path = {
    d: string;
    width?: number;
    height?: number;
    heightElements?: number[];
    widthElements?: number[];
  }
  export type PathId =
    | "EVENT_MESSAGE"
    | "EVENT_SIGNAL"
    | "EVENT_ESCALATION"
    | "EVENT_CONDITIONAL"
    | "EVENT_LINK"
    | "EVENT_ERROR"
    | "EVENT_CANCEL_45"
    | "EVENT_COMPENSATION"
    | "EVENT_TIMER_WH"
    | 'EVENT_TIMER_LINE'
    | 'EVENT_MULTIPLE'
    | 'EVENT_PARALLEL_MULTIPLE'
    | 'GATEWAY_EXCLUSIVE'
    | 'GATEWAY_PARALLEL'
    | 'GATEWAY_EVENT_BASED'
    | 'GATEWAY_COMPLEX'
    | 'DATA_OBJECT_PATH'
    | 'DATA_OBJECT_COLLECTION_PATH'
    | 'DATA_ARROW'
    | 'DATA_STORE'
    | 'TEXT_ANNOTATION'
    | 'MARKER_SUB_PROCESS'
    | 'MARKER_PARALLEL'
    | 'MARKER_SEQUENTIAL'
    | 'MARKER_COMPENSATION'
    | 'MARKER_LOOP'
    | 'MARKER_ADHOC'
    | 'TASK_TYPE_SEND'
    | 'TASK_TYPE_SCRIPT'
    | 'TASK_TYPE_USER_1'
    | 'TASK_TYPE_USER_2'
    | 'TASK_TYPE_USER_3'
    | 'TASK_TYPE_MANUAL'
    | 'TASK_TYPE_INSTANTIATING_SEND'
    | 'TASK_TYPE_SERVICE'
    | 'TASK_TYPE_SERVICE_FILL'
    | 'TASK_TYPE_BUSINESS_RULE_HEADER'
    | 'TASK_TYPE_BUSINESS_RULE_MAIN'
    | 'MESSAGE_FLOW_MARKER'
  export default class PathMap {
    protected pathMap: { [pathId in PathId]: Path };
    getRawPath(pathId: PathId): string;
    getScaledPath(pathId: string, param: Object): Object;
  }
}

// bpmn 文本渲染
declare module "bpmn-js/lib/draw/TextRenderer" {
  import { Bounds } from "diagram-js/lib/core/Canvas";
  import { ModuleConstructor } from "didi";

  export type TextStyle = {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  }
  export default class TextRenderer extends ModuleConstructor {
    constructor(config: any);
    getExternalLabelBounds(bounds: Bounds, text:string): Bounds;
    getTextAnnotationBounds(bounds: Bounds, text:string): Bounds;
    createText(text: string, options?: Object): SVGElement;
    getDefaultSize(): TextStyle;
    getExternalStyle(): TextStyle;
  }
}

// bpmn 核心绘制模块
declare module "bpmn-js/lib/draw/BpmnRenderer" {
  import Canvas, { Position } from 'diagram-js/lib/core/Canvas';
  import EventBus from 'diagram-js/lib/core/EventBus';
  import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
  import Styles from "diagram-js/lib/draw/Styles";
  import PathMap from 'bpmn-js/lib/draw/PathMap';
  import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
  import { Base, Connection, Shape } from 'diagram-js/lib/model';

  export type RendererHandler = <E extends Base, T extends SVGElement>(
    parentGfx: SVGElement,
    element: E,
    options?: any
  ) => SVGElement;
  export type RendererType = 
    | 'bpmn:Event'
    | 'bpmn:StartEvent'
    | 'bpmn:MessageEventDefinition'
    | 'bpmn:TimerEventDefinition'
    | 'bpmn:EscalationEventDefinition'
    | 'bpmn:ConditionalEventDefinition'
    | 'bpmn:LinkEventDefinition'
    | 'bpmn:ErrorEventDefinition'
    | 'bpmn:CancelEventDefinition'
    | 'bpmn:CompensateEventDefinition'
    | 'bpmn:SignalEventDefinition'
    | 'bpmn:MultipleEventDefinition'
    | 'bpmn:ParallelMultipleEventDefinition'
    | 'bpmn:EndEvent'
    | 'bpmn:TerminateEventDefinition'
    | 'bpmn:IntermediateEvent'
    | 'bpmn:IntermediateCatchEvent'
    | 'bpmn:IntermediateThrowEvent'
    | 'bpmn:Activity'
    | 'bpmn:Task'
    | 'bpmn:ServiceTask'
    | 'bpmn:UserTask'
    | 'bpmn:ManualTask'
    | 'bpmn:SendTask'
    | 'bpmn:ReceiveTask'
    | 'bpmn:ScriptTask'
    | 'bpmn:BusinessRuleTask'
    | 'bpmn:SubProcess'
    | 'bpmn:AdHocSubProcess'
    | 'bpmn:Transaction'
    | 'bpmn:CallActivity'
    | 'bpmn:Participant'
    | 'bpmn:Lane'
    | 'bpmn:InclusiveGateway'
    | 'bpmn:ExclusiveGateway'
    | 'bpmn:ComplexGateway'
    | 'bpmn:ParallelGateway'
    | 'bpmn:EventBasedGateway'
    | 'bpmn:Gateway'
    | 'bpmn:SequenceFlow'
    | 'bpmn:Association'
    | 'bpmn:DataInputAssociation'
    | 'bpmn:DataOutputAssociation'
    | 'bpmn:MessageFlow'
    | 'bpmn:DataObject'
    | 'bpmn:DataObjectReference'
    | 'bpmn:DataInput'
    | 'bpmn:DataOutput'
    | 'bpmn:DataStoreReference'
    | 'bpmn:BoundaryEvent'
    | 'bpmn:Group'
    | 'label'
    | 'bpmn:TextAnnotation'
    | 'ParticipantMultiplicityMarker'
    | 'SubProcessMarker'
    | 'ParallelMarker'
    | 'SequentialMarker'
    | 'CompensationMarker'
    | 'LoopMarker'
    | 'AdhocMarker';
  export default class BpmnRenderer extends BaseRenderer {
    constructor(
      config:any,
      eventBus: EventBus,
      styles: Styles,
      pathMap: PathMap,
      canvas: Canvas,
      textRenderer: TextRenderer,
      priority?: number
    );
    protected handlers: { [rendererType in RendererType]: RendererHandler };
    protected _drawPath(parentGfx: SVGElement, element: Base, attrs?: Object): SVGElement;
    protected _renderer(type: RendererType): RendererHandler;
    getConnectionPath<E extends Base>(connection: E): string;
    canRender<E extends Base>(element: E): boolean;
    drawShape<E extends Shape>(parentGfx: SVGElement, element: E): SVGRectElement;
    drawConnection<E extends Connection>(parentGfx: SVGElement, element: E): SVGPolylineElement;
    getShapePath<E extends Base>(shape: E): string;
  }
}

declare module "bpmn-js/lib/draw/BpmnRenderUtil" {
  import { Base } from "diagram-js/lib/model";
  import { ModdleElement } from 'moddle';
  import { getDi } from "bpmn-js/lib/util/ModelUtil";
  export { getDi };
  export const black: string;
  export function getFillColor(element: Base, defaultColor: string): string;
  export function getStrokeColor(element: Base, defaultColor: string): string;
  export function getLabelColor(element: Base, defaultColor: string, defaultStrokeColor: string): string;
  export function getSemantic(element: Base): ModdleElement;
  export function isCollection(element: Base): boolean;
  export function isThrowEvent(event: ModdleElement): boolean;
  export function isTypedEvent(event: ModdleElement, eventDefinitionType:string, filter?:Function): boolean;
}

declare module 'bpmn-js/lib/features/label-editing/LabelEditingProvider' {
  import { ModuleConstructor } from 'didi'
  import EventBus from "diagram-js/lib/core/EventBus";
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
  import TextRenderer from 'bpmn-js/lib/draw/TextRenderer'
  import Canvas from 'diagram-js/lib/core/Canvas';
  import { Base } from 'diagram-js/lib/model';

  type Bounds = {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    minWidth?: number;
    minHeight?: number;
  }

  type Style = {
    [propName: string]: any;
  }

  type Context = {
    text?: string;
    options?: {[propName:string]:any};
    bounds?: Bounds;
    style?: Style;
  }

  export default class LabelEditingProvider extends ModuleConstructor {
    constructor(eventBus: EventBus, bpmnFactory: BpmnFactory, canvas: Canvas, directEditing:any, modeling:any, resizeHandles:any, textRenderer: TextRenderer);

    // 为活动和文本注释激活直接编辑
    activate(element: Base): Context;
    //  根据元素的大小和位置获取编辑边界框
    getEditingBBox(element: Base): {bounds: Bounds, style: Style};
    // 调用 modeling.updateLabel 更新 label
    update(element: Base, newLabel?:string, activeContextText?:any, bounds?:any): void
  }
}

declare module 'bpmn-js/lib/features/modeling/Modeling' {
    import BaseModeling from "diagram-js/lib/features/modeling/Modeling";
    import EventBus from "diagram-js/lib/core/EventBus";
    import ElementFactory from 'diagram-js/lib/core/ElementFactory';
    import CommandStack from 'diagram-js/lib/command/CommandStack';
    import { Base, Connection, Hints, Label, Root, Shape } from "diagram-js/lib/model";
    import { Lane, ModdleElement } from "bpmn-moddle";
    import { ModelingHandler } from 'diagram-js/lib/features/modeling/Modeling';
    import { Bounds } from 'diagram-js/lib/core/Canvas';
    import Rules from 'diagram-js/lib/features/rules/Rules';

    type Properties = Record<string, string|number|boolean|ModdleElement|null|undefined>;

    export default class Modeling extends BaseModeling {
      constructor(
        eventBus: EventBus,
        elementFactory: ElementFactory,
        commandStack: CommandStack,
        bpmnRules: Rules
      );
      protected _bpmnRules: Rules;
      getHandlers<H extends ModelingHandler>(): Record<string, H>;
      updateLabel(element: Base, newLabel:Label|string, newBounds?:Bounds, hints?:Hints): void;
      connect(source: Shape, target: Shape, attrs?: Object, hints?: Hints): Connection;
      updateModdleProperties(element:Base, moddleElement:ModdleElement,properties: Properties): void;
      updateProperties(element: Base, properties: Properties): void;
      resizeLane(laneShape: Shape, newBounds: Bounds, balanced?: boolean): void;
      addLane(targetLaneShape: Shape, location: Location): Lane;
      splitLane(targetLane: Lane, count:number): void;
      updateLaneRefs(flowNodeShapes: Shape, laneShapes: Shape): void;
      makeProcess(): Root;
      claimId(id: string, moddleElement: ModdleElement): void;
      unclaimId(id: string, moddleElement: ModdleElement): void;
      setColor(elements: Base|Base[], colors:any): void;
    }
}

// 元素上下文菜单
declare module "bpmn-js/lib/features/context-pad/ContextPadProvider" {
  import { Injector, ModuleConstructor } from "didi";
  import EventBus from 'diagram-js/lib/core/EventBus';
  import ContextPad from 'diagram-js/lib/features/context-pad/ContextPad';
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
  import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
  import Connect from 'diagram-js/lib/features/connect/Connect';
  import Create from 'diagram-js/lib/features/create/Create';
  import PopupMenu, { PopupMenuEntry } from 'diagram-js/lib/features/popup-menu/PopupMenu';
  import Canvas from 'diagram-js/lib/core/Canvas';
  import Rules from 'diagram-js/lib/features/rules/Rules';
  import { Translate } from 'diagram-js/lib/i18n/translate';
  import AutoPlace from 'diagram-js/lib/features/auto-place/AutoPlace';
  import { Base } from "diagram-js/lib/model";

  type ContextPadAction = {
    group: string;
    className: string;
    title: string;
    action: Record<string, (event: Event, Element: Base) => unknown>;
  }
  /**
   * 元素对应的上下文菜单
   * 实例化时添加对 autoPlace 实例的依赖
   * 注册 create.end 事件监听函数，手动触发 replace 下面的点击事件
   */
  export default class ContextPadProvider extends ModuleConstructor {
    constructor(
      config: any,
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
      translate?: Translate,
      priority?: number
    );
    _config: any;
    _contextPad: ContextPad;
    _modeling: Modeling;
    _elementFactory: ElementFactory;
    _connect: Connect;
    _create: Create;
    _popupMenu: PopupMenu;
    _canvas: Canvas;
    _rules: Rules;
    _translate: Translate;
    _autoPlace: AutoPlace;
    /**
     * 根据当前节点提供可见上下文菜单入口
     * 可以通过继承或重写来增加上下文菜单可用功能
     */
    getContextPadEntries(element: Base): Record<string, ContextPadAction>;
  }
}

declare module "bpmn-js/lib/features/popup-menu/ReplaceMenuProvider" {
  import { ModuleConstructor } from 'didi';
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
  import PopupMenu, { PopupMenuEntry } from 'diagram-js/lib/features/popup-menu/PopupMenu';
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
  import BpmnModdle from 'bpmn-moddle';
  import BpmnReplace from "bpmn-js/lib/features/replace/BpmnReplace";
  import Rules from 'diagram-js/lib/features/rules/Rules';
  import { Translate } from 'diagram-js/lib/i18n/translate';
  import { Base } from 'diagram-js/lib/model';
  import { ReplaceOption } from 'bpmn-js/lib/features/replace/ReplaceOptions'
  /**
   * 替换元素
   */
  export default class ReplaceMenuProvider extends ModuleConstructor {
    constructor(
      bpmnFactory: BpmnFactory,
      popupMenu: PopupMenu,
      modeling: Modeling,
      moddle: BpmnModdle,
      bpmnReplace: BpmnReplace,
      rules: Rules,
      translate: Translate
    );
    protected _bpmnFactory: BpmnFactory;
    protected _popupMenu: PopupMenu;
    protected _modeling: Modeling;
    protected _moddle: BpmnModdle;
    protected _bpmnReplace: BpmnReplace;
    protected _rules: Rules;
    protected _translate: Translate;
    // 在弹出菜单中注册替换菜单提供程序
    register(): void;
    // 从指定元素的replaceOptions中获取所有条目，并在其中应用过滤器。例如，仅获取与当前元素不同的元素
    getEntries(element: Base): PopupMenuEntry[];
    // 获取给定元素的标题项列表。这包括用于多实例标记和临时标记的按钮。
    getHeaderEntries(element: Base): PopupMenuEntry[];
    _createEntries(element: Base, replaceOptions: Object): PopupMenuEntry[];
    _createSequenceFlowEntries(element: Base, replaceOptions: ReplaceOption[]): PopupMenuEntry[];
    _createMenuEntry(definitions: ReplaceOption, element: Base, action?: Function): PopupMenuEntry;
    _getLoopEntries(element: Base): PopupMenuEntry[];
    _getDataObjectIsCollection(element: Base): PopupMenuEntry[];
    _getParticipantMultiplicity(element: Base): PopupMenuEntry[];
    _getAdHocEntry(element: Base): PopupMenuEntry;
  }
}

declare module "bpmn-js/lib/features/popup-menu/util/TypeUtil" {
  import { Base } from 'diagram-js/lib/model';
  import { PopupMenuEntry } from 'diagram-js/lib/features/popup-menu/PopupMenu';
  export function isDifferentType<T>(element: Base): (entry: T)=>boolean;
}

declare module "bpmn-js/lib/features/replace/ReplaceOptions" {
  export type BaseReplaceOption = {
    label: string;
    actionName: string;
    className: string;
    target: {
      type: string;
    };
  };
  export type StartEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType?: string;
    }
  };
  export type SubProcessStartEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType: string;
      isInterrupting?: boolean;
    };
  };
  export type IntermediateEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType?: string;
      eventDefinitionAttrs?: {
        name: string;
      };
    };
  };
  export type EndEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType?: string;
    };
  };
  export type GatewayReplaceOption = BaseReplaceOption & {
    target: {
      instantiate?: boolean;
      eventGatewayType?: boolean;
    };
  };
  export type SubProcessReplaceOption = BaseReplaceOption & {
    target: {
      isExpanded: boolean;
      triggeredByEvent?: boolean;
    };
  };
  export type TaskReplaceOption = BaseReplaceOption & {
    target: {
      isExpanded?: boolean;
    };
  };
  export type DataObjectReplaceOption = BaseReplaceOption;
  export type DataStoreReplaceOption = BaseReplaceOption;
  export type BoundaryEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType: string;
      cancelActivity?: boolean;
    };
  };
  export type SequenceFlowReplaceOption = {
    label: string;
    actionName: string;
    className: string;
  };
  export type ParticipantReplaceOption = BaseReplaceOption & {
    label: string | Function;
    target: {
      isExpanded: boolean;
    };
  };
  export type ReplaceOption =
    | BaseReplaceOption
    | StartEventReplaceOption
    | SubProcessStartEventReplaceOption
    | IntermediateEventReplaceOption
    | EndEventReplaceOption
    | GatewayReplaceOption
    | SubProcessReplaceOption
    | TaskReplaceOption
    | DataObjectReplaceOption
    | DataStoreReplaceOption
    | BoundaryEventReplaceOption
    | SequenceFlowReplaceOption
    | ParticipantReplaceOption
  export const START_EVENT: StartEventReplaceOption[];
  export const START_EVENT_SUB_PROCESS: StartEventReplaceOption[];
  export const INTERMEDIATE_EVENT: IntermediateEventReplaceOption[];
  export const END_EVENT: EndEventReplaceOption[];
  export const GATEWAY: GatewayReplaceOption[];
  export const SUBPROCESS_EXPANDED: SubProcessReplaceOption[];
  export const TRANSACTION: SubProcessReplaceOption[];
  export const EVENT_SUB_PROCESS: SubProcessReplaceOption[];
  export const TASK: TaskReplaceOption[];
  export const DATA_OBJECT_REFERENCE: DataObjectReplaceOption[];
  export const DATA_STORE_REFERENCE: DataStoreReplaceOption[];
  export const BOUNDARY_EVENT: BoundaryEventReplaceOption[];
  export const EVENT_SUB_PROCESS_START_EVENT: SubProcessStartEventReplaceOption[];
  export const SEQUENCE_FLOW: SequenceFlowReplaceOption[];
  export const PARTICIPANT: ParticipantReplaceOption[];
}

// 更换bpmn元素模块
declare module "bpmn-js/lib/features/replace/BpmnReplace" {
  import { ModuleConstructor } from 'didi';
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
  import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
  import ModdleCopy from "bpmn-js/lib/features/copy-paste/ModdleCopy";
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
  import Replace from 'diagram-js/lib/features/replace/Replace';
  import Rules from 'diagram-js/lib/features/rules/Rules';
  import Selection from 'diagram-js/lib/features/selection/Selection';
  import { Base } from 'diagram-js/lib/model';

  export const CUSTOM_PROPERTIES: [
    "cancelActivity",
    "instantiate",
    "eventGatewayType",
    "triggeredByEvent",
    "isInterrupting"
  ];
  export default class BpmnReplace extends ModuleConstructor {
    constructor(
      bpmnFactory: BpmnFactory,
      elementFactory: ElementFactory,
      moddleCopy: ModdleCopy,
      modeling: Modeling,
      replace: Replace,
      rules: Rules,
      selection: Selection
    );
    // 为替换元素准备新的业务对象，并触发替换操作
    replaceElement(element: Base, target: Object, hints?: Object): Base;
  }
}

/**
 * bpmn 元素的复制粘贴
 */
declare module "bpmn-js/lib/features/copy-paste/ModdleCopy" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
  import BpmnModdle, { ModdleElement } from "bpmn-moddle";
  import { Base } from "diagram-js/lib/model";
  import { ModuleConstructor } from 'didi';
  /**
   * 用于将模型属性从源元素复制到目标元素。
   * 初始化时注册 moddleCopy.canCopyProperties, moddleCopy.canCopyProperty,
   * moddleCopy.cansetCopiedProperty 事件的监听函数，对元素实例与元素属性的可复制性进行校验
   */
  export default class ModdleCopy extends ModuleConstructor {
    constructor(eventBus: EventBus, bpmnFactory: BpmnFactory, moddle: BpmnModdle);
    protected _bpmnFactory: BpmnFactory;
    protected _eventBus: EventBus;
    protected _moddle: BpmnModdle;
    /**
     * 将源元素的模型属性赋值到目标元素
     */
    copyElement<T extends ModdleElement>(
      sourceElement: T,
      targetElement: T,
      propertyNames?: string[]
    ): T;
    copyProperty<T extends ModdleElement, U>(property: U, parent: T, propertyName: string): U;
    // 返回copy元素对应的新id，不需要id的返回undefined
    _copyId(id: string, element: Base): string|undefined;
  }
}

// palette
declare module "bpmn-js/lib/features/palette/PaletteProvider" {
  import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
  import Create from 'diagram-js/lib/features/create/Create';
  import SpaceTool from "diagram-js/lib/features/space-tool/SpaceTool";
  import LassoTool from 'diagram-js/lib/features/lasso-tool/LassoTool';
  import HandTool from 'diagram-js/lib/features/hand-tool/HandTool';
  import GlobalConnect from 'diagram-js/lib/features/global-connect/GlobalConnect';
  import Palette from 'diagram-js/lib/features/palette/Palette';
  import { Base } from 'diagram-js/lib/model';
  export default class PaletteProvider {
    static $inject?: string[];
    constructor(
      palette: Palette,
      create: Create,
      elementFactory: ElementFactory,
      spaceTool: SpaceTool,
      lassoTool: LassoTool,
      handTool: HandTool,
      globalConnect: GlobalConnect,
      translate?: any,
      priority?: number
    );
    getPaletteEntries(element: Base): Object;
  }
}