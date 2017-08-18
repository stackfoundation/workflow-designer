import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import { AceEditor } from '../ace-editor';

import { ImageField } from '../image-field/image-field';
import { WorkflowStep, WorkflowStepSimple, Workflow } from '../../models/workflow';

// import 'brace/theme/monokai';
// import 'brace/mode/sh';
import { observer } from "mobx-react";
import { CustomInputIO } from "../../models/custom-input";
import { autorun } from "mobx";
import { CatalogImage } from "../../models/catalog";
import { TextEditorFactory } from "../../models/state";

const atom = require('atom');

interface SimpleStepEditorProps { step: WorkflowStepSimple, workflow: Workflow, ide: boolean, catalog: CatalogImage[], textEditorFactory: TextEditorFactory }

@observer
export class SimpleStepEditor extends React.Component<SimpleStepEditorProps, {}> {
    private editorDiv: HTMLElement;
    private editorIO: CustomInputIO<string>;
    private stepScriptDisposer: Function;

    constructor(props: SimpleStepEditorProps) {
        super(props);
    }

    private setEditorElement(el: HTMLElement) {
        if (el) {
            if (el !== this.editorDiv) {
                this.editorDiv = el;

                if (this.props.textEditorFactory) {
                    this.editorIO = this.props.textEditorFactory(el, this.props.step.script);
                    this.editorIO.onChange(() => {
                        this.props.step.script = this.editorIO.getValue();
                    })
                    this.editorDiv.appendChild(this.editorIO.element);
                }


                this.stepScriptDisposer = autorun(() => {
                    if (this.editorIO && this.editorIO.getValue() !== this.props.step.script) {
                        this.editorIO.setValue(this.props.step.script);
                    }
                });
            }
            else {
                this.editorIO.setValue(this.props.step.script);
            }
        }
    }

    componentWillUnmount () {
        if (this.editorIO) {
            this.editorIO.dispose();
        }
        if (this.stepScriptDisposer) {
            this.stepScriptDisposer();
        }
    }

    public render() {
                // <AceEditor theme="monokai" width="100%" mode="sh" onChange={this.onChange} value={this.props.step.script || ''}/>
        return this.props.step ? 
            <div className="pure-u-1">
                <ImageField 
                    catalog={this.props.catalog}
                    ide={this.props.ide} 
                    workflow={this.props.workflow} 
                    step={this.props.step}></ImageField>
                <div ref={el => this.setEditorElement(el)}></div>
            </div>
        : null;
    }
}
