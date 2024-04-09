import React from "react";
// import {useDispatch} from "react-redux";
import {useSelector} from "../platform/bootstrap";

type DeferLiteralArrayCheck<T> = T extends Array<string | number | boolean | null | undefined> ? T : never;

// /**
//  * Action parameters must be of primitive types, so that the dependency check can work well.
//  * No need add dispatch to dep list, because it is always fixed.
//  */
// export function useAction<P extends Array<string | number | boolean | null | undefined>>(actionCreator: (...args: P) => Action<P>, ...deps: P): () => void {
//     const dispatch = useDispatch();
//     return React.useCallback(() => dispatch(actionCreator(...deps)), deps);
// }
//
// /**
//  * For actions like:
//  * *foo(a: number, b: string, c: boolean): SagaGenerator {..}
//  *
//  * useUnaryAction(foo, 100, "") will return:
//  * (c: boolean) => void;
//  */
// export function useUnaryAction<P extends any[], U>(actionCreator: (...args: [...P, U]) => Action<[...DeferLiteralArrayCheck<P>, U]>, ...deps: P): (arg: U) => void {
//     const dispatch = useDispatch();
//     return React.useCallback((arg: U) => dispatch(actionCreator(...deps, arg)), deps);
// }
//
// /**
//  * For actions like:
//  * *foo(a: number, b: string, c: boolean): SagaGenerator {..}
//  *
//  * useBinaryAction(foo, 100) will return:
//  * (b: string, c: boolean) => void;
//  */
// export function useBinaryAction<P extends any[], U, K>(actionCreator: (...args: [...P, U, K]) => Action<[...DeferLiteralArrayCheck<P>, U, K]>, ...deps: P): (arg1: U, arg2: K) => void {
//     const dispatch = useDispatch();
//     return React.useCallback((arg1: U, arg2: K) => dispatch(actionCreator(...deps, arg1, arg2)), deps);
// }
//
// /**
//  * For actions like:
//  * *foo(data: {key: number}): SagaGenerator {..}
//  *
//  * useModuleObjectAction(foo, "key") will return:
//  * (objectValue: number) => void;
//  */
// export function useObjectKeyAction<T extends object, K extends keyof T>(actionCreator: (arg: T) => Action<[T]>, objectKey: K): (objectValue: T[K]) => void {
//     const dispatch = useDispatch();
//     return React.useCallback((objectValue: T[K]) => dispatch(actionCreator({[objectKey]: objectValue} as T)), [dispatch, actionCreator, objectKey]);
// }
//
// export interface Dispatch<A extends InterfaceAction = AnyAction> {
//     <T extends A>(action: T): Promise<any>;
// }
//
// export function usePromise() {
//     const dispatch: Dispatch<any> = useDispatch();
//     return dispatch;
// }

// type Keys<S extends State, T extends keyof S["app"]> = keyof S["app"][T] & string;

// const getModuleState = <S extends State, T extends keyof S["app"] & string, P extends keyof S["app"][T]>(state: S, moduleStateName: T, keys: Array<P>): Pick<S["app"][T], P> => {
//     if (!state.app[moduleStateName]) {
//         return {} as S["app"][T];
//     }
//     return keys.reduce(
//         (moduleState, key) => {
//             moduleState[key] = state.app[moduleStateName][key];
//             return moduleState;
//         },
//         {} as S["app"][T]
//     );
// };

// const compareState = <T extends keyof State["app"], P extends keyof State["app"][T], S extends Pick<State["app"][T], P>>(left: S, right: S, keys: Array<P>): boolean => {
//     if (!left || !right) {
//         return true;
//     }
//     for (const key of keys) {
//         if (left[key] !== right[key]) {
//             return false;
//         }
//     }
//     return true;
// };

// export function useModuleState<
//     RS extends State,
//     M extends Partial<{
//         [key in keyof RS["app"]]: Array<Keys<RS, key>>;
//     }>,
//     T extends keyof M,
// >(
//     moduleKeys: M
// ): {
//     [key in T]: key extends keyof RS["app"] ? Pick<RS["app"][key], M[key] extends Array<Keys<RS, key>> ? M[key][number] : never> : never;
// };
// export function useModuleState<RS extends State, M extends keyof RS["app"], T extends keyof RS["app"][M]>(moduleStateName: M, keys: Array<T>): Pick<RS["app"][M], T>;

// export function useModuleState<
//     RS extends State,
//     M extends
//         | {
//               [key in keyof RS["app"] as string]: Array<Keys<RS, key>>;
//           }
//         | (keyof RS["app"] & string),
//     T extends M extends keyof RS["app"] ? keyof RS["app"][M] : keyof M,
//     ModuleKeys extends Array<keyof RS["app"] & string>,
//     S extends Pick<RS["app"], keyof RS["app"]>,
// >(moduleNameOrKeys: M, keys?: Array<T>) {
//     const state = useSelector(
//         (state: RS) => {
//             if (typeof moduleNameOrKeys === "string") {
//                 return getModuleState(state, moduleNameOrKeys, keys as any) as M extends keyof RS["app"] ? (T extends keyof RS["app"][M] ? Pick<RS["app"][M], T> : never) : never;
//             }
//             return (
//                 Object.keys(
//                     moduleNameOrKeys as {
//                         [key in keyof RS["app"] as string]: Array<Keys<RS, key>>;
//                     }
//                 ) as ModuleKeys
//             ).reduce(
//                 (result, moduleStateName) => {
//                     result[moduleStateName] = getModuleState(
//                         state,
//                         moduleStateName,
//                         (
//                             moduleNameOrKeys as {
//                                 [key in keyof RS["app"] as string]: Array<Keys<RS, key>>;
//                             }
//                         )[moduleStateName]
//                     ) as any;
//                     return result;
//                 },
//                 {} as {
//                     [key in keyof RS["app"]]: Pick<RS["app"][key], keyof RS["app"][key]>;
//                 }
//             );
//         },
//         (left, right) => {
//             if (typeof moduleNameOrKeys === "string") {
//                 moduleNameOrKeys;
//                 return compareState(left, right, keys as any);
//             }

//             // return compareRootState(left as S, right as S, moduleNameOrKeys[moduleStateName] as Array<Keys<typeof moduleStateName>>);
//             return !(Object.keys(moduleNameOrKeys) as ModuleKeys).some(
//                 moduleStateName =>
//                     !compareState(
//                         (left as S)[moduleStateName],
//                         (right as S)[moduleStateName],
//                         (
//                             moduleNameOrKeys as {
//                                 [key in keyof RS["app"] as string]: Array<Keys<RS, key>>;
//                             }
//                         )[moduleStateName]
//                     )
//             );
//         }
//     );

//     return useMemo(() => state ?? {}, [state]);
// }
