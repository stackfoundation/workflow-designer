import { observable, computed } from "mobx";
import { IWorkflow, IWorkflowStepBase, IWorkflowStepSimple, IWorkflowStepCompound, IHealth, EnvironmentSource, StepType, Volume }
    from '../../../workflow';

export interface WorkflowStepPos {
    parent: Workflow | WorkflowStepCompound;
    index: number;
}

export class Workflow implements IWorkflow {
    @observable steps: WorkflowStep[] = [];

    changeStepType(step: WorkflowStep, newStepType: string): WorkflowStep {
        let newStep: WorkflowStepSimple | WorkflowStepCompound | undefined = undefined;
        if (newStepType === WorkflowStepSimple.name) {
            newStep = new WorkflowStepSimple({ name: '' });
        } else if (newStepType === WorkflowStepCompound.name) {
            newStep = new WorkflowStepCompound({ name: '' });
        }

        if (newStepType === WorkflowStepSimple.name && step.type !== 'compound') {
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

    deleteStep(step: WorkflowStepSimple | WorkflowStepCompound, stepPos?: WorkflowStepPos, deleteChildren: boolean = false) {
        stepPos = stepPos || this.findStep(step);

        if (stepPos) {
            stepPos.parent.steps.splice(stepPos.index, 1);

            if (step.type === 'compound' && !deleteChildren) {
                let steps = (step as WorkflowStepCompound).steps;

                stepPos.parent.steps.splice(stepPos.index, 0, ...(steps.map(a => a)));
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

    @computed
    get flattenedStepsSimple() {
        return this.getFlattenedSteps(false);
    }

    @computed
    get flattenedStepsAll() {
        return this.getFlattenedSteps(false);
    }

    stepsBefore(step: WorkflowStepBase) {
        if (step) {
            let previousSteps = [];
            let steps = this.flattenedStepsSimple;

            for (let currentStep of steps) {
                if (currentStep !== step) {
                    previousSteps.push(currentStep);
                } else {
                    break;
                }
            }

            return previousSteps.map(currentStep => ({ label: currentStep.name, value: currentStep.name }));
        }

        return [];
    }

    private getFlattenedSteps(includeCompoundSteps: boolean = false) {
        return this.flattenSteps(this.steps, includeCompoundSteps);
    }

    moveStep(step: WorkflowStep, index: number, parent: WorkflowStepCompound | Workflow = this) {
        let targetEnd: WorkflowStep = index < parent.steps.length && parent.steps[index];

        this.deleteStep(step, null, true);

        let targetIndex = targetEnd ? parent.steps.indexOf(targetEnd) : parent.steps.length;

        parent.steps.splice(targetIndex, 0, step);
    }

    addStep() {
        let steps = this.flattenedStepsAll,
            name = 'New step',
            nameCount = 1;

        while (steps.find(step => step.name === name)) {
            nameCount++;
            name = 'New step (' + nameCount + ')';
        }

        this.steps.push(new WorkflowStepSimple({ name }));
    }

    private flattenSteps(steps: WorkflowStep[], includeCompoundSteps: boolean = false) {
        let flatSteps: WorkflowStep[] = [];

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];
            if (step.type === 'compound') {
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

    static apply(source: IWorkflow): Workflow {
        return Object.assign(Object.create(Workflow.prototype), source, {
            steps: source.steps.map(step => {
                if (step.type === 'compound') return WorkflowStepCompound.apply(step as IWorkflowStepCompound);
                else return WorkflowStepSimple.apply(step as IWorkflowStepSimple);
            })
        });
    }
}

export type WorkflowStep = WorkflowStepSimple | WorkflowStepCompound;
export type ImageSource = 'catalog' | 'manual' | 'step';
export type ActionType = 'script' | 'call' | 'generated' | 'dockerfile';
export type HealthCheckType = 'script' | 'tcp' | 'http';

export abstract class WorkflowStepBase implements IWorkflowStepBase {
    @observable name: string = '';
    readonly type: StepType;

    constructor(step: Partial<WorkflowStepBase>) {
        this.name = step.name;
    }

    static apply(source: IWorkflowStepBase): WorkflowStepBase {
        return Object.assign(Object.create(WorkflowStepBase.prototype), source);
    }
}

export class TransientState {
    @observable healthCheckType?: HealthCheckType;
    @observable action?: ActionType;
    @observable healthConfigured: boolean;
    @observable sourceOptions: boolean;
    @observable failureOptions: boolean;
    @observable environmentConfigured: boolean;
    @observable volumesConfigured: boolean;
    @observable portsConfigured: boolean;
}

export class Health implements IHealth {
    @observable script?: string;
    @observable tcp?: string;
    @observable http?: string;
    @observable interval?: number;
    @observable timeout?: number;
    @observable retries?: number;
    @observable grace?: number;
}

export class WorkflowStepSimple extends WorkflowStepBase implements IWorkflowStepSimple {
    type: StepType = 'sequential';

    constructor(step: Partial<WorkflowStepSimple>) {
        super(step);
        Object.assign(this, step);
    }

    @observable imageSource?: ImageSource = 'catalog';
    @observable transient?: TransientState = new TransientState();
    @observable image?: string = '';
    @observable tag?: string = '';
    @observable dockerfile?: string = '';
    @observable target?: string = '';
    @observable generator?: string = '';
    @observable script?: string = '';
    @observable omitSource?: boolean = false;
    @observable ignoreFailure?: boolean = false;
    @observable sourceLocation?: string = '';
    @observable health?: IHealth = new Health();
    @observable environment?: EnvironmentSource[] = [];
    @observable ports?: string[] = [];
    @observable volumes?: Volume[] = [];

    static apply(source: IWorkflowStepSimple): WorkflowStepSimple {
        let step: WorkflowStepSimple = Object.assign(Object.create(WorkflowStepSimple.prototype), source);
        return step;
    }
}

export class WorkflowStepCompound extends WorkflowStepBase implements IWorkflowStepCompound {
    readonly type: StepType = 'compound';

    constructor(step: Partial<WorkflowStepCompound>) {
        super(step);
        Object.assign(this, step);
    }

    @observable steps?: WorkflowStep[] = [];

    static apply(source: IWorkflowStepCompound): WorkflowStepCompound {
        return Object.assign(Object.create(WorkflowStepCompound.prototype), source, {
            type: 'compound',
            steps: source.steps.map(step => {
                if (step.type === 'compound') return WorkflowStepCompound.apply(step);
                else return WorkflowStepSimple.apply(step as WorkflowStepSimple);
            })
        });
    }
}
