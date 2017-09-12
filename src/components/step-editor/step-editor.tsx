import { setTimeout } from 'timers';
import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

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
import { StepType } from "../../../../workflow";
import { mediaQueries } from '../../style';

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
    scriptEditorFactory: ScriptEditorFactory,
    classes?: any
}

const styles = (theme: any) => {
    return {
        form: {
            composes: theme.ide ? '' : 'pure-form pure-form-stacked',
        },
        stepNameDiv: {
            composes: 'pure-u-1 pure-u-lg-7-12 block',
            position: 'relative',
            [mediaQueries.lg]: {
                paddingRight: '10px',
                marginBottom: '0px'
            }
        },
        stepNameLabel: {
            composes: 'pure-u-1-3 text-right',
            fontSize: '2em',
            paddingRight: '10px',
            height: '100%'
        },
        stepNameInputDiv: {
            composes: 'pure-u-2-3',
            height: '100%'
        },
        stepNameInput: {
            composes: 'pure-u-1 input-text native-key-bindings',
            height: '100%',
            margin: '0 !important',
            fontSize: '2em',
        },
        stepTypeInputDiv: {
            composes: 'pure-u-1 pure-u-lg-5-12 step-type-input',
        }
    };
};

@injectSheet(styles)
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
        let classes = this.props.classes;
        return (
            <form className={classes.form}>
                <fieldset>
                    <div className="pure-g block">
                        <div className={classes.stepNameDiv}>
                            <label className={classes.stepNameLabel}>
                                <CenteredContent>Step:</CenteredContent>
                            </label>
                            <div className={classes.stepNameInputDiv}>
                                <input type="text"
                                    className={classes.stepNameInput}
                                    
                                    name="name"
                                    value={this.nameField.fieldVal || ''} onChange={e => this.onNameChange(e)} />
                            </div>
                        </div>
                        <div className={classes.stepTypeInputDiv}>
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

    private onTypeChange = (type: StepType) => {
        this.props.state.changeCurrentStepType(type);
    }

    @action
    private onNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.updateField(this.nameField, event.target.value);
    }
}