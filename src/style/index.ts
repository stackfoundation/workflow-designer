import 'dragula/dist/dragula.css'
import './style.less';

export const themeColors = {
    darkerGreen: '#33A626',
    darkestGreen: '#23731A',
    fadedGreen: '#95CC8F',
    darkerRed: '#d13b2e',
}

export const editorStyles = {
    largeSelect: 'select-large',
    mediumSelect: 'select-medium',
    imageSelect: 'select-image',
    normalSelect: 'select-normal'
};

export const mediaQueries = {
    sm: '@media screen and (min-width: 35.5em)',
    md: '@media screen and (min-width: 48em)',
    lg: '@media screen and (min-width: 64em)',
    xl: '@media screen and (min-width: 80em)'
}

export function sectionStyles (theme: any): {
    section:any, 
    sectionTitle: any, 
    sectionBody: any, 
    sectionTitleLarge: any, 
    sectionBodyTight: any, 
    sectionBodyBorderless: any} {
    return {
        section: theme.ide ?
            {
                composes: 'inset-panel block'
            } :
            {
                composes: 'pure-u-1',
                marginBottom: '20px'
            },
        sectionTitle: theme.ide ?
            {
                composes: 'panel-heading'
            } :
            {
                fontWeight: '700',
                border: '1px solid #ddd',
                borderBottom: 'none',
                padding: '5px',
                background: '#eee'
            },
        sectionTitleLarge: {
            composes: '$sectionTitle',
            fontSize: '2em',
            fontWeight: 'bold',
            padding: '10px',
        },
        sectionBody: theme.ide ?
            { composes: 'panel-body padded' } 
            : { 
                border: '1px solid #ddd',
                padding: '10px'
            },
        sectionBodyTight: theme.ide ?
            { composes: 'panel-body' } 
            : {
                composes: '$sectionBody',
                padding: '0px'
            },
        sectionBodyBorderless: theme.ide ?
            { composes: 'panel-body' } 
            : {
                composes: '$sectionBody',
                border: 'none'
            }
    }
}

export function listStyles (theme: any): {listTitle: any, rootListTree: any, listTree: any, listItem:any, listItemSelected: any, listItemSubList: any} {
    return {
        listTitle: {
            composes: 'title',

            marginTop: '10px',
        },
        listTree: {
            composes: theme.ide ? 'list-tree' : '',
            padding: '0 0 0 8px',
            marginLeft: theme.ide ? '0' : '6px',
            borderLeft: theme.ide ? 'none' : 'solid 17px #eee',
        },
        rootListTree: {
            composes: '$listTree',
            padding: '0px',
            margin: '0',
            marginBottom: '20px',
            borderLeft: 'none'
        },
        listItem: theme.ide ? 
            {
                composes: 'list-item step',
                cursor: 'pointer',
                position: 'relative',
                listStyle: 'none',
                paddingLeft: '10px'
            } : {
                composes: 'step',
                listStyle: 'none',
                lineHeight: '2em',
                fontSize: '16px',
                color: '#000',
                fontWeight: 'normal',
                cursor: 'pointer',
                position: 'relative',
                paddingLeft: '10px'
            },
        listItemSelected: theme.ide ? {
                composes: 'selected'
            } : {
                fontWeight: 'bold',
                color: themeColors.darkerGreen
            },
        listItemSubList: {
            composes: theme.ide ? 'list-nested-item' : '',

            '& > div': {
                'line-height': '2em'
            },

            '& > $listTree': {
                position: 'relative',
                top: '-10px',
                marginTop: '10px',
                marginBottom: '-10px',
                minHeight: '20px'
            },
        },
    }
}

export function errorStyles (theme: any): {errorPanel: any, errorPanelClose: any} {
    return {
        errorPanel: theme.ide ?
            {
                composes: 'pure-u-1 inset-panel padded background-error',
                
                color: 'white',
                fontWeight: 'bold'
            } : {
                composes: 'pure-u-1',

                color: 'white',
                fontWeight: 'bold',
                background: themeColors.darkerRed,
                padding: '16px',
                position: 'relative',
                borderRadius: '5px',
            },
        errorPanelClose: {
            composes: theme.ide ? 'text-error': '',
            position: 'absolute',
            right: '0.2em',
            top: '0.2em',
            fontSize: '2em',
            lineHeight: '1em',

            '&:hover': {
                color: 'white',
                cursor: 'pointer'
            }
        }
    };
}
