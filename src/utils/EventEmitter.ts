import { getRawType, notNull } from "./tools";

const isArray = (obj:any) => getRawType(obj) === "array";
const isNullOrUndefined = (obj:any) => !notNull(obj);

interface IFunction extends Function {
    context?: Object;
    once?: boolean;
}

class EventEmitter {
    static _events: {[type:string]: IFunction|IFunction[]} = {};
    constructor(){};

    static _addListener(type: string, fn:IFunction, context: Object, once: boolean):typeof EventEmitter {
        fn.context = context;
        fn.once = once;
        const event = EventEmitter._events[type];
        if (isNullOrUndefined(event)) {
            // 事件可以绑定一个或多个函数
            EventEmitter._events[type] = fn;
        } else if (typeof event === "function") {
            EventEmitter._events[type] = [event, fn];
        } else if (isArray(event)) {
            (EventEmitter._events[type] as IFunction[]).push(fn);
        }
        return EventEmitter;
    };

    static addListener(type:string, fn:IFunction, context:Object): typeof EventEmitter {
        return EventEmitter._addListener(type, fn, context, false);
    };

    static on(type: string, fn:IFunction, context: Object): typeof EventEmitter {
        return EventEmitter.addListener(type, fn, context);
    };

    static once(type: string, fn: IFunction, context: Object): typeof EventEmitter {
        return EventEmitter._addListener(type, fn, context, true);
    };

    static emit(type: string, ...rest: any[]) {
        const event = EventEmitter._events[type];
        if (isNullOrUndefined(event)) {
            return false;
        }
        if (typeof event === "function") {
            (event as IFunction).call(event.context||null, ...rest);
            if (event.once) {
                EventEmitter.removeListener(type, event);
            }
        } else if (isArray(event)) {
            event.map(e => {
                e.call(e.context || null, ...rest);
                if (e.once) {
                    EventEmitter.removeListener(type, e);
                }
            });
        }
        return true;
    }

    static removeListener(type: string, fn: IFunction): typeof EventEmitter {
        if (isNullOrUndefined(EventEmitter._events)) {
            return EventEmitter;
        }
        if (isNullOrUndefined(type)) {
            return EventEmitter;
        }
        const events = EventEmitter._events[type];
        if (typeof events === "function") {
            events === fn && delete EventEmitter._events[type];
        } else {
            const findIndex = events.findIndex((e) => e === fn);
            if (findIndex === -1) {
                return EventEmitter;
            }
            if (findIndex === 0) {
                events.shift();
            } else {
                events.slice(findIndex, 1);
            }
            if (events.length === 1) {
                EventEmitter._events[type] = events[0];
            }
        }
        return EventEmitter;
    }
}

export default EventEmitter;