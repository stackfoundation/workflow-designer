import * as React from 'react';
import { autorun } from "mobx";

import { CustomInputIO } from "../../models/custom-input";
import { WorkflowStepSimple } from '../../models/workflow';
import { TextEditorFactory } from "../../models/state";

interface AtomEditorProps {
    step: WorkflowStepSimple,
    textEditorFactory: TextEditorFactory,
    classes?: any
}

export class AtomEditor extends React.Component<AtomEditorProps, {}> {
    private editorDiv: HTMLElement;
    private editorIO: CustomInputIO<string>;
    private stepScriptDisposer: Function;

    constructor(props: AtomEditorProps) {
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
                // this.editorIO.setValue(this.props.step.script);
            }
        }
    }

    componentWillUnmount() {
        if (this.editorIO) {
            this.editorIO.dispose();
        }
        if (this.stepScriptDisposer) {
            this.stepScriptDisposer();
        }
    }

    public render() {
        return <div ref={el => this.setEditorElement(el)}></div>;
    }
}
