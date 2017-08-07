import { setTimeout } from 'timers';

import * as React from 'react';
import { observer } from 'mobx-react';

import { CatalogImage } from '../../models/catalog';
import {
    Workflow,
    WorkflowStep,
    WorkflowStepCompound,
    WorkflowStepParallel,
    WorkflowStepSequential,
    WorkflowStepSimple,
} from '../../models/workflow';
import { EditorState } from '../../models/state';
import { WorkflowService } from '../../services/workflow_service';
import { StepTypeSelect } from '../step-type-select';
import { SimpleStepEditor } from './simple-step-editor';
import { ChangeEvent } from 'react';
import { FormReactComponent } from '../../../../../react-forms/validating-react-component';
import { Field } from "../../../../../react-forms/field";

export interface WorkflowStepTypeChangeEvent {
    step: WorkflowStep;
    type: string;
};

@observer
export class StepEditor extends FormReactComponent<{ state: EditorState, step: WorkflowStep }, {}> {
    private nameField: Field;

    constructor(props: { state: EditorState, step: WorkflowStep}) {
        super(props);

        this.nameField = this.createField('props.step.name', value => {
            let errors: string[] = [],
                stepFoundPos = this.props.state.workflow.findStep(step => step.name === value);

            if (!value || value.length === 0) {
                errors.push('requiredField');
            }
            if (stepFoundPos && stepFoundPos.parent.steps[stepFoundPos.index] !== this.props.step) {
                errors.push('nameConflict');
            }
            
            return errors;
        });
    }

    private get catalog() {
        return this.props.state.catalog;
    }

    public render() {
        return (
            <form className="pure-form pure-form-stacked">
                <fieldset>
                    <div className="pure-g">
                        <label className="pure-u-1-12 text-right">Step:</label>
                        <input type="text" 
                            className="pure-u-11-12 pure-u-md-1-2" 
                            name="name"
                            value={this.nameField.fieldVal || ''} onChange={this.onNameChange} />
                        <div className="pure-u-1 pure-u-md-5-12 step-type-input">
                            <StepTypeSelect
                                type={(this.props.step && this.props.step.getType()) || WorkflowStepSequential.name}
                                onChange={this.onTypeChange}></StepTypeSelect>
                        </div>
                    </div>
                    {this.props.step && this.props.step.getType() === WorkflowStepCompound.name ?
                        (<div></div>) :
                        (<SimpleStepEditor state={this.props.state} step={this.props.step}></SimpleStepEditor>)}
                </fieldset>
            </form >
        );
    }

    private onImageChange(image: CatalogImage) {

    }

    private onTypeChange = (type: string) => {
        this.props.state.changeCurrentStepType(type);
    }

    private onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.updateField(this.nameField, event.target.value);
    }


    // initialise () {
    //     this.updatePrevStepChoices();

    //     this.fieldDisplay['imageDescription'] = false;

    //     this.stepTypes = [
    //         {value: WorkflowStepSequential.name, label: 'Sequential Step', description: 'Next step will wait for this one to finish.'},
    //         {value: WorkflowStepParallel.name, label: 'Parallel Step', description: 'Next step will run as this one does.'}
    //     ];

    //     if (this.isRootStep) {
    //         this.stepTypes.push({value: WorkflowStepCompound.name, label: 'Compound Step', description: 'Set of multiple steps.'});
    //     }

    //     this.removeForm();

    //     this._form = new FormGroup({
    //         name: new FormControl(this.step.name, Validators.compose([Validators.required, control => {
    //             let duplicate = this.workflow.findStep(step => step !== this.step && step.name === control.value);
    //             if (duplicate) {
    //                 return {keyConflict: true};
    //             }
    //             return null;
    //         }])),
    //         type: new FormControl(this.step.getType())
    //     });



    //         this._form.addControl('image', new FormControl((this.step as WorkflowStepSimple).image));

    //         this.subscribeToFieldChanges(this._form.controls.image, newValue => {
    //             if (!newValue) {
    //                 return;
    //             }

    //             if ((this.step as WorkflowStepSimple).imageSource === 'catalog') {
    //                 this.updateTagChoices(newValue);
    //                 this.loadStepImageDescription(newValue);
    //             }

    //             if (newValue !== (this.step as WorkflowStepSimple).image) {
    //                 (this.step as WorkflowStepSimple).image = newValue;
    //             }
    //         });

    //         this.updateTagChoices((this.step as WorkflowStepSimple).image);
    //         this.loadStepImageDescription((this.step as WorkflowStepSimple).image);

    //         this._form.addControl('tag', new FormControl((this.step as WorkflowStepSimple).tag));

    //         this.subscribeToFieldChanges(this._form.controls.tag, newValue => {
    //             if (!newValue) {
    //                 return;
    //             }

    //             if (newValue !== (this.step as WorkflowStepSimple).tag) {
    //                 (this.step as WorkflowStepSimple).tag = newValue;
    //             }
    //         });

    //         this._form.addControl('envVariables', new FormArray([]));
    //         (this.step as WorkflowStepSimple).envVariables
    //             .forEach(variable => this.addEnvVarControl(variable.name, variable.value));

    //         this.addEnvVarControl();

    //         this.fieldDisplay['envVariables'] = (this.step as WorkflowStepSimple).envVariables.length > 0;

    //         let portsControl = new FormControl({
    //             value: (this.step as WorkflowStepSimple).ports.map(el => ({value: el, display: el})),
    //             disabled: this.readOnly});
    //         this._form.addControl('ports', portsControl);

    //         this.fieldDisplay['ports'] = (this.step as WorkflowStepSimple).ports.length > 0;

    //         this.subscribeToFieldChanges(portsControl, change => {
    //             (this.step as WorkflowStepSimple).ports = change.map((el: any) => el.value);
    //         });
    //     }
    // }

    // private updateTagChoices(imageName: string) {
    //     let imageChoice = (this.catalogImageChoices.find(el => el.catalogEntry.name === imageName));
    //     if (imageChoice) {
    //         this.catalogTagChoices = imageChoice.catalogEntry.tags.map(tag => ({label: tag, value: tag}));
    //     }
    //     else {
    //         this.catalogTagChoices = [];
    //     }
    // }

    // private loadStepImageDescription (imageName: string) {
    //     if (!imageName || (this.step as WorkflowStepSimple).imageSource !== 'catalog') {
    //         return;
    //     }
    //     this.stepImageDescriptionLoadState = 'loading';
    //     this.stepImageDescription = '';
    //     this.workflowService.catalogInfoHtml(imageName)
    //         .subscribe(html => {
    //             this.stepImageDescription = html;
    //             this.stepImageDescriptionLoadState = 'loaded';
    //         }, err => {
    //             this.stepImageDescriptionLoadState = 'error';
    //         });
    // }

    // public validatePortNumber (value: FormControl) {
    //     let portNumbers: string[] = [];

    //     if (value.value.indexOf(':') > -1) {
    //         portNumbers = (value.value as string).split(':');
    //     }
    //     else {
    //         portNumbers = [value.value];
    //     }

    //     for (var i = 0; i < portNumbers.length; i++) {
    //         if (portNumbers[i].length && parseInt(portNumbers[i]).toString() !== portNumbers[i]) {
    //             return {invalidPortNumber: true};
    //         }
    //     }

    //     return {};
    // }

    // public onAddTag = (tag: TagModel) => {
    //     return Observable.of(tag)
    //         .map(tag => {
    //             if (typeof tag === 'string' && tag.indexOf(':') === tag.length - 1) {
    //                 return tag.substr(0, tag.length - 1);
    //             }
    //             return tag;
    //         })
    //         .filter(tag => {
    //             let existing = (this.step as WorkflowStepSimple).ports;
    //             for (var i = 0; i < existing.length; i++) {
    //                 if (existing[i].split(':')[0] === (tag as string).split(':')[0]) {
    //                     return false;
    //                 }
    //             }
    //             return true;
    //         });
    // }

    // public addEnvVarControl (key: string = '', value: any = '') {
    //     let prevKey = key,
    //         prevValue = value,
    //         envVariables = this._form.controls['envVariables'] as FormArray,
    //         formGroup = new FormGroup({});

    //     let keyControl = new FormControl({value: key, disabled: this.readOnly}, control => {
    //         for (let i in envVariables.controls) {
    //             let other = envVariables.controls[i].get('key');
    //             if (other && control && control.value && other !== control && other.value === control.value) {
    //                 return {keyConflict: true};
    //             }
    //         }
    //         return null;
    //     });
    //     let valueControl = new FormControl({value: value, disabled: this.readOnly});

    //     this.subscribeToFieldChanges(keyControl, val => {
    //         this.removeEnvVar(prevKey);
    //         if (envVariables.controls.length && envVariables.controls.indexOf(formGroup) === envVariables.length - 1) {
    //             this.addEnvVarControl();
    //         }

    //         if (keyControl.value && valueControl.value && keyControl.valid && valueControl.valid) {
    //             this.setEnvVar(keyControl.value, valueControl.value);
    //             prevKey = keyControl.value;
    //         }
    //     });

    //     this.subscribeToFieldChanges(valueControl, val => {
    //         if (envVariables.controls.length && envVariables.controls.indexOf(formGroup) === envVariables.length - 1) {
    //             this.addEnvVarControl();
    //         }
    //         if (keyControl.value && valueControl.value && keyControl.valid && valueControl.valid) {
    //             this.setEnvVar(keyControl.value, valueControl.value);
    //             prevValue = valueControl.value;
    //         }
    //     });

    //     formGroup.addControl('key', keyControl);
    //     formGroup.addControl('value', valueControl);

    //     envVariables.push(formGroup);
    // }

    // public removeEnvVarControl (control: FormGroup) {
    //     let key = control.get('key');
    //     if (key) {
    //         let varIndex = (this.step as WorkflowStepSimple).envVariables
    //             .findIndex(el => el.name === (key as AbstractControl).value);

    //         if (varIndex > -1) {
    //             (this.step as WorkflowStepSimple).envVariables.splice(varIndex, 1);
    //         }

    //         this.removeControl(key);
    //     }
    //     let value = control.get('value');
    //     if (value) {
    //         this.removeControl(value);
    //     }

    //     this.removeControl(control);
    // }

    // private setEnvVar (name: string, value: string) {
    //     let prop = (this.step as WorkflowStepSimple).envVariables.find(el => el.name === name);

    //     if (prop) {
    //         prop.value = value;
    //     }
    //     else {
    //         (this.step as WorkflowStepSimple).envVariables.push({name,value});
    //     }
    // }

    // private removeEnvVar (name: string) {
    //     let propIndex = (this.step as WorkflowStepSimple).envVariables.findIndex(el => el.name === name);
    //     if (propIndex >= 0) {
    //         (this.step as WorkflowStepSimple).envVariables.splice(propIndex, 1);
    //     }
    // }


    // private changeType (type: string) {
    //     this.onWorkflowStepTypeChange.next({
    //         step: this.step,
    //         type
    //     });
    // }

    // public updateStepScript (newScript: string) {
    //     if (this.step.constructor.name === WorkflowStepSequential.name) {
    //         let step = this.step as WorkflowStepSequential;

    //         if (step.script !== newScript) {
    //             this.form.markAsDirty();
    //         }

    //         step.script = newScript;
    //     }
    // }

}