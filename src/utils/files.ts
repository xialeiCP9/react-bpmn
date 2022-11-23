// 文件下载
export function downloadFile(href: string, filename: string) {
    if (href && filename) {
        const a = document.createElement("a");
        a.download = filename; // 指定下载的文件名
        a.href = href; // URL对象
        a.click(); // 模拟点击
        URL.revokeObjectURL(a.href); // 释放URL对象
    }
}

// 根据所需类型进行转码并返回下载地址
export function setEncoded(type: "XML"|"BPMN"|"SVG", filename:string, data:string):{filename:string, href:string,data:string} {
    const encodedData = encodeURIComponent(data);
    return {
        filename: `${filename}.${type.toLowerCase()}`,
        href: `data:application/${type === "SVG" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
    };
}