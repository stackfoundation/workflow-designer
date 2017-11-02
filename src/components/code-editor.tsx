import * as React from 'react';
import { action } from 'mobx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/pastel-on-dark.css';
let injectSheet = require('react-jss').default;
import * as CodeMirror from 'react-codemirror';
import 'codemirror/mode/shell/shell';

import { WorkflowStepSimple } from '../models/workflow';

const styles = (theme: any) => ({
    editor: {
        fontFamily: 'Courier New',
        fontSize: '16px'
    }
});

interface CodeEditorProps {
    step?: WorkflowStepSimple;
    fieldName: string;
    classes?: any;
}

@injectSheet(styles)
export default class CodeEditor extends React.Component<CodeEditorProps, { }> {
    constructor(props: CodeEditorProps) {
        super(props);
    }

    @action
    updateCode(newCode: string) {
        (this.props.step as any)[this.props.fieldName] = newCode;
    }

    public render() {
        let classes = this.props.classes || {};
        return (<CodeMirror
            className={classes.editor}
            value={(this.props.step as any)[this.props.fieldName]}
            onChange={(code: any) => this.updateCode(code)}
            options={{ lineNumbers: true, mode: 'shell', theme: 'pastel-on-dark' }} />);
    }
}
