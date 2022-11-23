import TextRenderer from "bpmn-js/lib/draw/TextRenderer";
import { Bounds } from "diagram-js/lib/core/Canvas";

class EnhancementTextRenderer extends TextRenderer {
    constructor(config: any){
        super(config);
    }

    getTextAnnotationBounds(bounds: Bounds, text: string): Bounds {
        console.log("getTextAnnotationBounds", bounds);
        return super.getTextAnnotationBounds(bounds, text);
    }
    getExternalLabelBounds(bounds: Bounds, text: string): Bounds {
        console.log("getExternalLabelBounds", bounds, text);
        return super.getExternalLabelBounds(bounds, text);
    }

    createText(text: string, options?: Object): SVGElement {
        console.log("createText", options);
        return super.createText(text, options);
    }
}

export default EnhancementTextRenderer;