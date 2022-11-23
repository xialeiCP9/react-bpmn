import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import type { AppDispatch as Dispatch, RootState } from "@/store/store";
import { Button, message, Space, Upload  } from "antd";
import type { UploadProps, RcFile } from "antd/lib/upload/interface.d";
import { ExportOutlined, ImportOutlined } from "@ant-design/icons";
import Modeler from "bpmn-js/lib/Modeler";
import { Shape } from "diagram-js/lib/model";
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import { createNewDiagram } from "@/utils/xml";
import { downloadFile, setEncoded } from "@/utils/files";
import initModeler from "./initModeler";
import moduleAndExtensions from "./moduleAndExtensions";
import styles from "./index.module.less";

interface IProps {
    processName?: string;
    xml?: string;
    dispatch: Dispatch;
    modeler: Modeler|null;
    modeling?: Modeling;
}

const Designer: React.FC<IProps> = (props) => {

    const { dispatch, modeler, modeling, processName } = props;

    const firstRenderRef = useRef<boolean>(true);

    const canvasRef = useRef<HTMLDivElement>(null);

    const setModeler = (modeler:Modeler) => {
        dispatch({
            type: "bpmn/setModeler",
            payload: modeler
        });
    };

    const clearBpmn = () => {
        dispatch({
            type: "bpmn/clear"
        })
    };

    const setActiveElement = (element: Shape) => {
        dispatch({
            type: "bpmn/setActiveElement",
            payload: element
        });
    };

    const uploadProps: UploadProps = {
        accept: ".bpmn",
        showUploadList: false,
        beforeUpload: (file: RcFile) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function () {
                if (typeof this.result === "string") {
                    modeler && modeler.importXML(this.result);
                }
            }
            return false;
        }
    }

    const download = async () => {
        try{
            if (!modeler) {
                return message.error("流程图引擎初始化失败");
            }
            const { err, xml } = await modeler.saveXML();
            if (err) {
                return message.error("流程图引擎导出异常", err.message || err);
            }
            const { href, filename } = setEncoded("BPMN", `${processName || 'diagram'}`, xml);
            downloadFile(href, filename);
        } catch (e) {
            message.error("下载异常", e.message || e);
        }
    }

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        const currentModeler = initModeler(canvasRef.current, moduleAndExtensions(), {
            setModeler,
            clearBpmn,
            modeler,
            modeling
        });

        createNewDiagram(currentModeler).then(res => {
            // 去除powered by bpmn 标记
            (document.querySelector(".bjs-powered-by"))?.remove();
        }).catch(err => {
            
        })

    }, []);

    

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <Space>
                    <Button icon={<ExportOutlined />} onClick={download}>导出</Button>
                    <Upload {...uploadProps}>
                        <Button icon={<ImportOutlined />}>导入</Button>
                    </Upload>
                </Space>
            </div>
            <div className={styles.content}>
                <div className={styles.canvas} ref={canvasRef}>

                </div>
            </div>
        </div> 
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        modeler: state.bpmn.modeler,
        modeling: state.bpmn.modeling
    }
}

export default connect(mapStateToProps)(Designer);