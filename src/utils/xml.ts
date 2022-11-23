import Modeler from "bpmn-js/lib/Modeler";

export type TSettings = {
    processId?: string|number;
    processName?: string;
}

export function emptyXML(key:string|number, name:string) {
    return (
        `
        <?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_08nwfbs" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="10.2.0">
  <bpmn:process id="${key}" name="${name}" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1txzrli" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
        `
    )
}

export async function createNewDiagram(modeler: Modeler, newXml?: string, settings?:TSettings) {
    try {
        const timestamp = Date.now();
        const { processId, processName } = settings || {};
        const newId = processId ? processId : `Process_${timestamp}`;
        const newName = processName || `业务流程_${timestamp}`;
        const xmlString = newXml || emptyXML(newId, newName);
        const res = await modeler.importXML(xmlString);
        console.log("createNewDiagram", res)
    } catch (e) {
        console.log(e);
    }
}