import { observable } from "mobx";
import { IWorkflow, IWorkflowStepBase, IWorkflowStepSimple, IWorkflowStepSequential, IWorkflowStepParallel, IWorkflowStepCompound, StepType } from '../../../workflow';

export interface WorkflowStepPos {
    parent: Workflow | WorkflowStepCompound;
    index: number;
}

export class Workflow implements IWorkflow {
    @observable steps: WorkflowStep[] = [];

    changeStepType(step: WorkflowStep, newStepType: string): WorkflowStep {
        let newStep: WorkflowStepSequential | WorkflowStepCompound | WorkflowStepParallel | undefined = undefined;
        if (newStepType === WorkflowStepSequential.name) {
            newStep = new WorkflowStepSequential({ name: '' });
        } else if (newStepType === WorkflowStepCompound.name) {
            newStep = new WorkflowStepCompound({ name: '' });
        } else if (newStepType === WorkflowStepParallel.name) {
            newStep = new WorkflowStepParallel({ name: '' });
        }

        if ((newStepType === WorkflowStepSequential.name || newStepType === WorkflowStepParallel.name) &&
            (step.getType() === WorkflowStepSequential.name || step.getType() === WorkflowStepParallel.name)) {
            Object.assign(newStep as WorkflowStepSimple, step as WorkflowStepSimple);
        }

        if (newStep) {
            newStep.name = step.name;

            let stepPos = this.findStep(step);

            if (stepPos) {
                this.deleteStep(step, stepPos);

                stepPos.parent.steps.splice(stepPos.index, 0, newStep);
            }
        }

        return newStep;
    }

    deleteStep(step: WorkflowStepSequential | WorkflowStepCompound | WorkflowStepParallel, stepPos?: WorkflowStepPos, deleteChildren: boolean = false) {
        stepPos = stepPos || this.findStep(step);

        if (stepPos) {
            stepPos.parent.steps.splice(stepPos.index, 1);

            if (step.getType() === WorkflowStepCompound.name && !deleteChildren) {
                stepPos.parent.steps.splice(stepPos.index, 0, ...(step as WorkflowStepCompound).steps);
            }
        }
    }

    findStep(search: WorkflowStep | string | ((_: WorkflowStep) => boolean), parent?: Workflow | WorkflowStepCompound): WorkflowStepPos | undefined {
        parent = parent || this;

        for (var index = 0; index < parent.steps.length; index++) {
            if (this.test(index, search, parent)) {
                return { parent, index };
            }
            else if (parent.steps[index] instanceof WorkflowStepCompound) {
                let childStep = this.findStep(search, (parent.steps[index] as WorkflowStepCompound));
                if (childStep) {
                    return childStep;
                }
            }
        }

        return undefined;
    }

    flattenedSteps(includeCompoundSteps: boolean = false) {
        return this.flattenSteps(this.steps, includeCompoundSteps);
    }

    moveStep (step: WorkflowStep, index: number, parent: WorkflowStepCompound | Workflow = this) {
        let targetEnd: WorkflowStep = index < parent.steps.length && parent.steps[index];

        this.deleteStep(step, null, true);

        let targetIndex = targetEnd ? parent.steps.indexOf(targetEnd) : parent.steps.length;
        
        parent.steps.splice(targetIndex, 0, step);
    }

    addStep () {
        let steps = this.flattenedSteps(),
            name = 'New step',
            nameCount = 1;

        while (steps.find(step => step.name === name)) {
            nameCount++;
            name = 'New step (' + nameCount + ')';
        }

        this.steps.push(new WorkflowStepSequential({name}));
    }

    private flattenSteps(steps: WorkflowStep[], includeCompoundSteps: boolean = false) {
        let flatSteps: WorkflowStep[] = [];

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];
            if (step.getType() === WorkflowStepCompound.name) {
                if (includeCompoundSteps) {
                    flatSteps.push(step);
                }
                flatSteps = flatSteps.concat(this.flattenSteps((step as WorkflowStepCompound).steps));
            }
            else {
                flatSteps.push(step);
            }
        }

        return flatSteps;
    }

    private test(index: number, test: string | WorkflowStep | ((_: WorkflowStep) => boolean), parent: Workflow | WorkflowStepCompound): boolean {
        if (typeof test === 'string') {
            return parent.steps[index].name === test;
        }
        else if (typeof test === 'function') {
            return test(parent.steps[index]);
        }
        else {
            return parent.steps[index] === test;
        }
    }

    static apply (source: IWorkflow): Workflow {
        return Object.assign(Object.create(Workflow.prototype), source, {
            steps: source.steps.map(step => {
                if (step.type === 'sequential') return WorkflowStepSequential.apply(step);
                if (step.type === 'parallel') return WorkflowStepParallel.apply(step);
                if (step.type === 'compound') return WorkflowStepCompound.apply(step);
            })
        });
    }
}

export type WorkflowStep = WorkflowStepSequential | WorkflowStepParallel | WorkflowStepCompound;
export type ImageSource = 'catalog' | 'manual' | 'step';

export abstract class WorkflowStepBase implements IWorkflowStepBase {
    @observable name: string = '';
    readonly type: string;

    constructor(step: Partial<WorkflowStepBase>) {
        this.name = step.name;
    }

    getType() {
        if (this instanceof WorkflowStepSequential) {
            return WorkflowStepSequential.name;
        }
        else if (this instanceof WorkflowStepParallel) {
            return WorkflowStepParallel.name;
        }
        else if (this instanceof WorkflowStepCompound) {
            return WorkflowStepCompound.name;
        }
        else if (this instanceof WorkflowStepBase) {
            return WorkflowStepBase.name;
        }

        return '';
    }

    static apply (source: IWorkflowStepBase): WorkflowStepBase {
        return Object.assign(Object.create(WorkflowStepBase.prototype), source);
    }
}

export class WorkflowStepSimple extends WorkflowStepBase implements IWorkflowStepSimple {
    constructor(step: Partial<WorkflowStepSimple>) {
        super(step);
    }

    @observable imageSource?: ImageSource = 'catalog';
    @observable image?: string = '';
    @observable tag?: string = '';
    @observable script?: string = '';
    @observable envVariables?: { name: string, value: string }[] = [];
    @observable ports?: string[] = [];

    static apply (source: IWorkflowStepSimple): WorkflowStepSimple {
        return Object.assign(Object.create(WorkflowStepSimple.prototype), source);
    }
}

export class WorkflowStepSequential extends WorkflowStepSimple implements IWorkflowStepSequential {
    readonly type: StepType = 'sequential';

    constructor(step: Partial<WorkflowStepSequential>) {
        super(step);
        Object.assign(this, step);
    }

    static apply (source: IWorkflowStepSequential): WorkflowStepSequential {
        return Object.assign(Object.create(WorkflowStepSequential.prototype), source);
    }
}

export class WorkflowStepParallel extends WorkflowStepSimple implements IWorkflowStepParallel {
    readonly type: StepType = 'parallel';

    constructor(step: Partial<WorkflowStepParallel>) {
        super(step);
        Object.assign(this, step);
    }

    static apply (source: IWorkflowStepParallel) {
        return Object.assign(Object.create(WorkflowStepParallel.prototype), source);
    }
}

export class WorkflowStepCompound extends WorkflowStepBase implements IWorkflowStepCompound {
    readonly type: StepType = 'compound';

    constructor(step: Partial<WorkflowStepCompound>) {
        super(step);
        Object.assign(this, step);
    }

    @observable steps?: WorkflowStep[] = [];

    static apply (source: IWorkflowStepCompound): WorkflowStepCompound {
        return Object.assign(Object.create(WorkflowStepCompound.prototype), source, {
            steps: source.steps.map(step => {
                if (step.type === 'sequential') return WorkflowStepSequential.apply(step);
                if (step.type === 'parallel') return WorkflowStepParallel.apply(step);
                if (step.type === 'compound') return WorkflowStepCompound.apply(step);
            })
        });
    }
}

export const WorkflowTypes = [
    WorkflowStepSequential.name,
    WorkflowStepParallel.name,
    WorkflowStepCompound.name
];
