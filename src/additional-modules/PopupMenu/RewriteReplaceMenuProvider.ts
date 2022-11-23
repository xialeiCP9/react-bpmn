import ReplaceMenuProvider from "bpmn-js/lib/features/popup-menu/ReplaceMenuProvider";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
import PopupMenu, { PopupMenuEntry } from "diagram-js/lib/features/popup-menu/PopupMenu";
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import BpmnModdle from "bpmn-moddle";
import BpmnReplace from "bpmn-js/lib/features/replace/BpmnReplace";
import Rules from "diagram-js/lib/features/rules/Rules";
import { Translate } from "diagram-js/lib/i18n/translate";
import { Base } from "diagram-js/lib/model";
import { isDifferentType }  from "bpmn-js/lib/features/popup-menu/util/TypeUtil";
import { is } from "bpmn-js/lib/util/ModelUtil";
import * as replaceOptions from "bpmn-js/lib/features/replace/ReplaceOptions";
import { filter } from "min-dash";
class RewriteReplaceMenuProvider extends ReplaceMenuProvider {
    constructor(
        bpmnFactory: BpmnFactory,
        popupMenu: PopupMenu,
        modeling: Modeling,
        moddle: BpmnModdle,
        bpmnReplace: BpmnReplace,
        rules: Rules,
        translate: Translate
    ){
        super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate);
        this._bpmnFactory = bpmnFactory;
        this._popupMenu = popupMenu;
        this._modeling = modeling;
        this._moddle = moddle;
        this._bpmnReplace = bpmnReplace;
        this._rules = rules;
        this._translate = translate;
    }
    /**
     * 重写getEntries 方法
     */
    getEntries (element: Base) {
        const businessObject = element.businessObject;
        const rules = this._rules;
        let entries: replaceOptions.BaseReplaceOption[] = [];
        if (!rules.allowed("shape.replace", { element })) {
            return [];
        }
        const differentType = isDifferentType(element);
        // if (is(businessObject, "bpmn:DataObjectReference")) {

        // }
        if (is(businessObject, "self-defined:If")) {
            entries = filter<replaceOptions.GatewayReplaceOption>(replaceOptions.GATEWAY, differentType);
            return this._createEntries(element, entries);
        }
        if (is(businessObject, "self-defined:PositiveAssertion") ||
            is(businessObject, "self-defined:NegativeAssertion")) {
            const assertionReplaceOption = [
                {
                    actionName: "replace-with-positive-assertion",
                    className: "iconfont icon-positive-assertion",
                    label: "正向断言",
                    target: {
                        type: "self-defined:PositiveAssertion"
                    }
                },
                {
                    actionName: "replace-with-negative-assertion",
                    className: "iconfont icon-negative-assertion",
                    label: "异常断言",
                    target: {
                        type: "self-defined:NegativeAssertion"
                    }
                }
            ]
            entries = filter<replaceOptions.BaseReplaceOption>(assertionReplaceOption, differentType);
            return this._createEntries(element, entries)
        }
        return [];
    }
}

export default RewriteReplaceMenuProvider;