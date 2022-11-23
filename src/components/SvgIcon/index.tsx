import React from "react";

interface IProps {
    iconClass: string;
    className?: string;
}

const SvgIcon: React.FC<IProps> = ({iconClass, className}) => {

    const styleExternalIcon = {
        mask: `url(${iconClass}) no-repeat 50% 50%`,
        WebkitMask: `url(${iconClass}) no-repeat 50% 50%`
    }
    const isExternal = (path:string) => /^(https?:|mailto:|tel:)/.test(path);
    const svgClass = className ? "svg-icon " + className: "svg-icon";
    const iconName = `#icon-${iconClass}`;
    return (
        <React.Fragment>
            {
                isExternal(iconClass)
                ?
                <div style={styleExternalIcon} className={`svg-external-icon ${svgClass}`} />
                :
                (
                    <svg className={svgClass} aria-hidden="true">
                        <use xlinkHref={iconName}/>
                    </svg>
                )
            }
        </React.Fragment>
    )
}

export default SvgIcon;