import * as React from 'react';

import { EditorState } from '../../models/state';
import { AceEditor } from '../ace-editor';

import { ImageField } from '../image-field/image-field';
import { WorkflowStep, WorkflowStepSimple } from '../../models/workflow';

import 'brace/theme/monokai';
import 'brace/mode/sh';
import { observer } from "mobx-react";

@observer
export class SimpleStepEditor extends React.Component<{ state: EditorState, step: WorkflowStepSimple }, {}> {
    constructor(props: { state: EditorState, step: WorkflowStepSimple }) {
        super(props);
    }

    onChange = (newVal: string) => {
        this.props.step.script = newVal;
    }

    public render() {
        return this.props.step ? 
            <div className="pure-u-1">
                <ImageField state={this.props.state} step={this.props.step}></ImageField>
                <AceEditor theme="monokai" width="100%" mode="sh" onChange={this.onChange} value={this.props.step.script || ''}/>
            </div> 
        : null;
    }
}
