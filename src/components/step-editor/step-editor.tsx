import { setTimeout } from 'timers';
import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { CatalogImage } from '../../models/catalog';
import {
    Workflow,
    WorkflowStep,
    WorkflowStepCompound,
    WorkflowStepSimple,
} from '../../models/workflow';
import { EditorState, ScriptEditorFactory } from '../../models/state';
import { WorkflowService } from '../../services/workflow_service';
import { StepTypeSelect } from '../step-type-select';
import { SimpleStepEditor } from './simple-step-editor';
import { CenteredContent } from '../../util/centered-content';
import { ChangeEvent } from 'react';
import { FormReactComponent } from '../../../../../react-forms/validating-react-component';
import { Field } from "../../../../../react-forms/field";

export interface WorkflowStepTypeChangeEvent {
    step: WorkflowStep;
    type: string;
};

interface StepEditorProps {
    state: EditorState,
    ide: boolean,
    step: WorkflowStep,
    workflow: Workflow,
    catalog: CatalogImage[],
    scriptEditorFactory: ScriptEditorFactory
}

@observer
export class StepEditor extends FormReactComponent<StepEditorProps, {}> {
    private nameField: Field;

    constructor(props: StepEditorProps) {
        super(props);

        this.nameField = this.createField('props.step.name', value => {
            let errors: string[] = [],
                stepFoundPos = this.props.workflow.findStep(step => step.name === value);

            if (!value || value.length === 0) {
                errors.push('requiredField');
            }
            if (stepFoundPos && stepFoundPos.parent.steps[stepFoundPos.index] !== this.props.step) {
                errors.push('nameConflict');
            }

            return errors;
        });
    }

    public render() {
        return (
            <form className="pure-form pure-form-stacked">
                <fieldset>
                    <div className="pure-g">
                        <label className="pure-u-1-12 text-right">
                            <CenteredContent>Step:</CenteredContent>
                        </label>
                        <input type="text"
                            className="pure-u-11-12 pure-u-md-1-2 native-key-bindings"
                            name="name"
                            value={this.nameField.fieldVal || ''} onChange={e => this.onNameChange(e)} />
                        <div className="pure-u-1 pure-u-md-5-12 step-type-input">
                            <StepTypeSelect
                                type={(this.props.step && this.props.step.type || WorkflowStepSimple.name)}
                                onChange={this.onTypeChange}></StepTypeSelect>
                        </div>
                    </div>
                    {this.props.step && this.props.step.type === 'compound' ?
                        null :
                        (<SimpleStepEditor
                            scriptEditorFactory={this.props.scriptEditorFactory}
                            workflow={this.props.workflow}
                            ide={this.props.ide}
                            catalog={this.props.catalog}
                            step={this.props.step as WorkflowStepSimple}>
                        </SimpleStepEditor>)}
                </fieldset>
            </form>);
    }

    private onTypeChange = (type: string) => {
        this.props.state.changeCurrentStepType(type);
    }

    @action
    private onNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.updateField(this.nameField, event.target.value);
    }
}