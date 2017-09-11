import 'dragula/dist/dragula.css'
import './style.less';

export const themeColors = {
    darkerGreen: '#33A626',
    darkestGreen: '#23731A',
    fadedGreen: '#95CC8F'
}

export const editorStyles = {
    largeSelect: 'select-large',
    mediumSelect: 'select-medium',
    imageSelect: 'select-image',
    normalSelect: 'select-normal'
};

export function sectionStyles (theme: any): {section:any, title: any, body: any, bodyTight: any} {
    return {
        section: theme.ide ?
            {
                composes: 'inset-panel block'
            } :
            {
                composes: 'pure-u-1',
                margin: '0',
                padding: '10px 0',
                borderTop: 'solid 1px #ddd'
            },
        title: theme.ide ?
            {
                composes: 'panel-heading'
            } :
            {
                fontWeight: '700',
                margin: '0 0 4px 0'
            },
        body: theme.ide ?
            { composes: 'panel-body padded' } :
            {},
        bodyTight: theme.ide ?
        { composes: 'panel-body' } :
        {},
    }
}
