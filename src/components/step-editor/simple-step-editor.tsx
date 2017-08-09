import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { EditorState } from '../../models/state';
// import { AceEditor } from '../ace-editor';

import { ImageField } from '../image-field/image-field';
import { WorkflowStep, WorkflowStepSimple } from '../../models/workflow';

// import 'brace/theme/monokai';
// import 'brace/mode/sh';
import { observer } from "mobx-react";

const atom = require('atom');

@observer
export class SimpleStepEditor extends React.Component<{ state: EditorState, step: WorkflowStepSimple }, {}> {
    private editor: HTMLElement;

    constructor(props: { state: EditorState, step: WorkflowStepSimple }) {
        super(props);
    }

    onChange = (newVal: string) => {
        this.props.step.script = newVal;
    }

    private setEditorElement(el: HTMLElement) {
        if (this.editor != el) {
            this.editor = el;

            let script = this.props.step.script || '';

            if (this.props.state.createEditor) {
                let textEditor = this.props.state.createEditor(script);
                this.editor.appendChild(textEditor);
            }
        }
    }

    public render() {
                // <AceEditor theme="monokai" width="100%" mode="sh" onChange={this.onChange} value={this.props.step.script || ''}/>
        return this.props.step ? 
            <div className="pure-u-1">
                <ImageField state={this.props.state} step={this.props.step}></ImageField>
                <div ref={el => this.setEditorElement(el)}></div>
            </div> 
        : null;
    }
}
