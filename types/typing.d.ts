declare module "*.module.less" {
    const content: {
        [className: string]: string
    }
    export  = content;
}

declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<React.ReactSVGElement>>;
    export default content;
}

declare module "*.xml" {
    
}