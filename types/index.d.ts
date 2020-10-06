import LightqueryFactory from "./LightqueryFactory";

export declare const makePureLightquery: (strict?: boolean) => LightqueryFactory;

export declare const µ: LightqueryFactory;
export declare const $: typeof µ;
export declare const lq: typeof µ;
export declare const lightquery: typeof µ;

export * from "./utils/typedefs"
export * from "./utils/Callable"
export * from "./utils/helpers"

export * from "./errors/UnimplementedError"
export * from "./errors/UnsupportedError"
export * from "./errors/NotEnoughElementsError"
export * from "./errors/InvalidArgumentError"

export * from "./strategies/init/index"

export * from "./CssEngine"
export * from "./LightqueryCollection"
export * from "./LightqueryFactory"
