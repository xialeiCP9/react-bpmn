declare module "moddle" {
    type UriOrPrefix = {
        uri?: string;
        prefix?: string;
    }

    export class Base {
        get(name:string): ReturnType<typeof Properties.prototype.get>;
        set(name:string, value:any): ReturnType<typeof Properties.prototype.set>;
        $instanceOf: typeof Moddle.prototype.hasType;
    }

    export class ModdleElement extends Base {
        constructor(attrs: Object);
        readonly $type: string;
        $attrs: Object | {};
        $parent: any;
        [field: string]: any;

        static $model: Moddle;
        static $descriptor: Descriptor;
        static hasType(element: ModdleElement, type?: string): boolean;
    }

    export class Factory {
        constructor(model: Moddle, properties: Properties);
        model: Moddle;
        properties: Properties;

        createType(descriptor: Descriptor): ModdleElement;
    }

    export type BuiltingsKeys = 'String' | 'Boolean' | 'Integer' | 'Real' | 'Element';
    export type TypeConverters = {
        [T in Exclude<BuiltingsKeys, 'Element'>]: (s: string) => string | boolean | number;
    }

    export type coerceType = <T extends Exclude<BuiltingsKeys, 'Element'>>(
        type: T,
        value: string
    ) => ReturnType<TypeConverters[T]>;

    export function isBuiltIn(type: BuiltingsKeys): boolean;

    export function isSimple(type: Exclude<BuiltingsKeys, 'Element'>): boolean;

    type ParsedName = {
        name: string;
        prefix: string;
        localName: string;
    }

    export function parseName(name: string, defaultPrefix?:string): ParsedName;

    // DescriptorBuilder
    type Property = {
        ns: ParsedName;
        name: ParsedName["name"];
        isId?: boolean;
        isBody?: boolean;
    }

    type DescriptorType = {
        name: string;
        properties: Property[];
        superClass?: string[];
        extends?: string[];
        meta?: Object | {};
    }

    type Descriptor = {
        ns: ParsedName;
        name: ParsedName["name"];
        allTypes: DescriptorType[];
        allTypesByName: Record<string, DescriptorType[]>;
        properties: Property[];
        propertiesByName: Record<string, Property[]>;
        bodyProperty?: Property;
        idProperty?: Property;
    }

    export class DescriptorBuilder implements Descriptor {
        constructor(nameNs: ParsedName);
        ns: ParsedName;
        name: ParsedName["name"];
        allTypes: DescriptorType[];
        allTypesByName: Record<string, DescriptorType[]>;
        properties: Property[];
        propertiesByName: Record<string, Property[]>;
        bodyProperty?: Property;
        idProperty?: Property;

        build(): Descriptor;
        addProperty(p: Property, idx?: number, validate?: boolean): void;
        replaceProperty(oldProperty: Property, newProperty: Property, replace?: boolean): void|never;
        redefineProperty(
            p: Property,
            targetPropertyName: `${string}#${string}`,
            replace?: boolean
        ): void | never;
        addNamedProperty(p: Property, validate?: boolean): void|never;
        removeNamedProperty(p: Property):void|never;
        setBodyProperty(p: Property, validate?:boolean): void|never;
        setIdProperty(p: Property, validate?: boolean): void | never;
        assertNotDefined(p: Property, name?: string): void | never;
        hasProperty(name: string): Property|undefined;
        addTrait(t: DescriptorType, inherited: boolean): void;
    }

    // Registry
    export interface Package {
        name: string;
        prefix: string;
        types: DescriptorType[];
    }

    export class Registry {
        constructor(packages: Package[], properties: Properties);
        packageMap: Record<string, Package>;
        typeMap: Record<string, DescriptorType>;
        packages: Package[];
        properties: Properties;

        getPackage(uriOrPrefix: UriOrPrefix): Package;
        getPackages(): Package[];
        registerPackage(pkg: Package): number;
        registerType(type: DescriptorType, pkg: Package): void;
        mapTypes(nsName: Object, iterator: Function, trait?: boolean): void;

        getEffectiveDescriptor(name: string): DescriptorBuilder;

        definePackage(target: Descriptor, pkg: Package): void;
    }

    export class Properties {
        constructor(model: Moddle);
        model: Moddle;
        set(target: ModdleElement, name:string, value: any):void;
        get(target: ModdleElement, name:string):any;

        define(target: ModdleElement, name: string, options: PropertyDescriptor): void;
        defineDescriptor(target: Omit<ModdleElement, '$descriptor'>, descriptor: Descriptor): void;
        defineModel(target: Omit<ModdleElement, '$model'>, model: ModdleElement): void;
    }

    export class Moddle {
        constructor(packages: Package[]);

        properties: Properties;
        factory: Factory;
        registry: Registry;
        typeCache: Record<string, ModdleElement>;

        create(type: Descriptor|string, attrs: any): ModdleElement;
        getType(type: string|Descriptor): DescriptorBuilder;
        createAny(name: string, nsUri: string, properties?: Properties): void;
        getPackage: typeof Registry.prototype.getPackage;
        getPackages: typeof Registry.prototype.getPackages;
        getElementDescriptor(element: ModdleElement): Descriptor;
        hasType(element: ModdleElement|string, type?: string): boolean;
        getPropertyDescriptor(element: ModdleElement, property: Property): Descriptor;
        getTypeDescriptor(type:string): Descriptor;
    }
    export type isBuiltInType = typeof isBuiltIn;
    export type isSimpleType = typeof isSimple;
    export type parseNameNs = typeof parseName;
}