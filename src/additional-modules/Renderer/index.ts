import EnhancementRenderer from "./EnhancementRenderer";
import EnhancementLabelEditingProvider from "./EnhancementLabelEditingProvider";
import EnhancementTextRenderer from "./EnhancementTextRenderer";

const enhancementRenderer = {
    __init__: ["enhancementRenderer", 'labelEditingProvider', 'textRenderer'],
    enhancementRenderer: ["type", EnhancementRenderer],
    labelEditingProvider: ['type', EnhancementLabelEditingProvider],
    textRenderer: ["type", EnhancementTextRenderer]
};

export default enhancementRenderer