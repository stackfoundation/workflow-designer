import { css } from 'aphrodite';
import * as React from 'react';

export type Style = React.CSSProperties | string;
export type Styles = Style[] | Style;
export interface ContextSpecificStyle {
    ide?: Styles;
    web?: Styles;
    all?: Styles;
}
export type ContextSpecificStyles = ContextSpecificStyle[] | ContextSpecificStyle;


export type OptionalContextSpecificStyle = ContextSpecificStyle | Style;
export type OptionalContextSpecificStyles = OptionalContextSpecificStyle[] | OptionalContextSpecificStyle;

function isContextSpecific(style: OptionalContextSpecificStyle): style is ContextSpecificStyle {
    return (<ContextSpecificStyle>style).ide != undefined ||
        (<ContextSpecificStyle>style).web != undefined ||
        (<ContextSpecificStyle>style).all != undefined;
}

function append<T>(list: T[], items: T | T[]) {
    if (items) {
        if (Array.isArray(items)) {
            list.push(...(items as T[]));
        } else {
            list.push(items as T);
        }
    }
}

function combine(list1?: Style | Style[], list2?: Style | Style[]) {
    let combined: Style[] = [];
    append(combined, list1)
    append(combined, list2)
    return combined;
}

function contextSpecific(styles: OptionalContextSpecificStyles) {
    let stylesAsArray : OptionalContextSpecificStyle[] = Array.isArray(styles) ? styles : [styles];
    let combined: Style[] = [];

    for (var i = 0; i < stylesAsArray.length; i++) {
        var style = stylesAsArray[i];
        
        if (style) {
            if (typeof style !== 'string' && isContextSpecific(style)) {
                combined.push(...combine(style.all, (window as any).ide ? style.ide : style.web));
            } else {
                append(combined, style);
            }
        }
    }

    return combined;
}

export function classes(styles: OptionalContextSpecificStyles) {
    if (styles) {
        let specific = contextSpecific(styles);
        let combined = '';
        let filtered = [];
        for (let style of specific) {
            if (style) {
                if (typeof style === 'string') {
                    combined += (style as string) + ' ';
                } else {
                    filtered.push(style);
                }
            }
        }

        if (filtered.length > 0) {
            combined = combined + css(filtered);
        }

        return combined;
    }

    return undefined;
}

export { StyleSheet } from 'aphrodite';