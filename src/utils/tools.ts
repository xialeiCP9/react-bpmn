/**
 * 返回数据原始类型
 */
export function getRawType(value:any): string{
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * 校验非空
 */
export function notEmpty(val: any):boolean {
    if (!notNull(val)) {
        return false;
    }
    if (getRawType(val) === "array") {
        return !!((val as Array<any>).length);
    }
    if (getRawType(val) === "object") {
        return !!Object.keys(val).length;
    }
    return true;
}

export function notNull(val: any):boolean {
    return val !== undefined && val !== null;
}