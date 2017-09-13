import { observable, action } from 'mobx';

import {CatalogImage} from './catalog';
import {Workflow, WorkflowStep, WorkflowStepSimple, ImageSource} from './workflow';
import { StepType } from "../../../workflow";

export type ScriptEditorFactory = (step: WorkflowStepSimple, fieldName: string) => JSX.Element;

export class EditorState {
    ide: boolean;
    @observable workflow: Workflow;
    @observable currentStep?: WorkflowStep;
    @observable catalog: CatalogImage[];
    scriptEditorFactory: ScriptEditorFactory;

    @action setCatalog(catalog: CatalogImage[]) {
        this.catalog = catalog;
    }

    // @action setSelectedImage(image: CatalogImage) {
    //     (this.currentStep as WorkflowStepSimple).image = image.name;
    // }

    @action selectInitialStep() {
        if (this.workflow && this.workflow.steps && this.workflow.steps.length > 0) {
            this.selectStep(this.workflow.steps[0]);
        }
    }

    @action selectStep(step: WorkflowStep) {
        this.currentStep = step;
    }

    @action deleteStep(step: WorkflowStep) {
        this.workflow.deleteStep(step);

        if (this.currentStep === step) {
            this.selectInitialStep();
        }
    }

    @action changeCurrentStepType(type: StepType) {
        this.currentStep = this.workflow.changeStepType(this.currentStep, type);
    }

    // @action setImageSource(source: ImageSource) {
    //     if (this.currentStep && (this.currentStep as WorkflowStepSimple).imageSource) {
    //         (this.currentStep as WorkflowStepSimple).imageSource = source;
    //     }
    // }
}
