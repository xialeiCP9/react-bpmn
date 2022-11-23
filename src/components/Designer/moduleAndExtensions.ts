// 扩展渲染
import EnhancementRenderer from "@/additional-modules/Renderer";
// 扩展contextPad
import rewriteContextPad from "@/additional-modules/ContextPad";
// 扩展替换组件
import rewriteReplaceMenu from "@/additional-modules/PopupMenu";
// moddle 定义文件
import myModdleDescriptors from "@/moddle-extendsions/my.json";

export default function () {
    const modules = []; // modules 扩展模块数组
    let moddle = {}; // moddle 声明文件对象
    const options = {}; // modeler 其他配置
    // 配置自定义渲染
    modules.push(EnhancementRenderer);
    // 配置自定义contextpad
    modules.push(rewriteContextPad);
    // 配置自定义替换组件
    modules.push(rewriteReplaceMenu);
    // 设置自定义属性
    moddle["my"] = myModdleDescriptors;
    return [modules, moddle, options];
}