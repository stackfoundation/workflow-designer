import * as React from 'react';
import * as ace from 'brace';

import 'brace/mode/text';

type PropTypes = {
    mode?: string,
    theme?: string,
    name?: string,
    height?: string,
    width?: string,
    fontSize?: number,
    showGutter?: boolean,
    onChange?: Function,
    defaultValue?: string,
    value?: string,
    onLoad?: Function,
    maxLines?: number,
    readOnly?: boolean,
    highlightActiveLine?: boolean,
    showPrintMargin?: boolean,
    selectFirstLine?: boolean,
    wrapEnabled?: boolean,
    setShowPrintMargin?: boolean
};

export class AceEditor extends React.Component<PropTypes> {
    private editor: ace.Editor;
    private editorEl: HTMLElement;

    static defaultProps: PropTypes = {
        name: 'brace-editor',
        mode: 'text',
        theme: '',
        height: '500px',
        width: '500px',
        defaultValue: '',
        value: '',
        fontSize: 12,
        showGutter: true,
        onChange: null,
        onLoad: null,
        maxLines: null,
        readOnly: false,
        highlightActiveLine: true,
        showPrintMargin: true,
        selectFirstLine: false,
        wrapEnabled: false
    };

    constructor(props: PropTypes) {
        super(props);
    }

    private onChange = () => {
        if (this.props.onChange) {
            const value = this.editor.getValue();
            this.props.onChange(value);
        }
    }

    componentDidMount() {
        this.editor = ace.edit(this.editorEl);
        this.editor.$blockScrolling = Infinity;
        this.editor.getSession().setMode('ace/mode/' + this.props.mode);
        this.editor.setTheme('ace/theme/' + this.props.theme);
        this.editor.setFontSize(this.props.fontSize.toString());
        this.editor.on('change', this.onChange);
        this.editor.setValue(this.props.defaultValue || this.props.value, (this.props.selectFirstLine === true ? -1 : null));
        this.editor.setOption('maxLines', this.props.maxLines);
        this.editor.setOption('readOnly', this.props.readOnly);
        this.editor.setOption('highlightActiveLine', this.props.highlightActiveLine);
        this.editor.setShowPrintMargin(this.props.setShowPrintMargin);
        this.editor.getSession().setUseWrapMode(this.props.wrapEnabled);
        this.editor.renderer.setShowGutter(this.props.showGutter);

        if (this.props.onLoad) {
            this.props.onLoad(this.editor);
        }
    }

    componentWillReceiveProps(nextProps: PropTypes) {
        let currentRange = this.editor.selection.getRange();

        if (nextProps.mode !== this.props.mode) {
            this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
        }
        if (nextProps.theme !== this.props.theme) {
            this.editor.setTheme('ace/theme/' + nextProps.theme);
        }
        if (nextProps.fontSize !== this.props.fontSize) {
            this.editor.setFontSize(nextProps.fontSize.toString());
        }
        if (nextProps.maxLines !== this.props.maxLines) {
            this.editor.setOption('maxLines', nextProps.maxLines);
        }
        if (nextProps.readOnly !== this.props.readOnly) {
            this.editor.setOption('readOnly', nextProps.readOnly);
        }
        if (nextProps.highlightActiveLine !== this.props.highlightActiveLine) {
            this.editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
        }
        if (nextProps.setShowPrintMargin !== this.props.setShowPrintMargin) {
            this.editor.setShowPrintMargin(nextProps.setShowPrintMargin);
        }
        if (nextProps.wrapEnabled !== this.props.wrapEnabled) {
            this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
        }
        if (typeof nextProps.value === 'string' && this.editor.getValue() !== nextProps.value) {
            this.editor.setValue(nextProps.value, (this.props.selectFirstLine === true ? -1 : null));
            if(currentRange && typeof currentRange === "object") {
                this.editor.getSession().getSelection().setSelectionRange(currentRange);
            }
        }
        if (nextProps.showGutter !== this.props.showGutter) {
            this.editor.renderer.setShowGutter(nextProps.showGutter);
        }
    }

    render() {
        return <div 
            ref={(el) => {this.editorEl = el}}
            id={this.props.name} 
            onChange={this.onChange}
            style={{width: this.props.width, height: this.props.height}}>
        </div>
    }
}