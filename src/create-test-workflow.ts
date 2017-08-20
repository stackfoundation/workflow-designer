import { Workflow, WorkflowStepSimple, WorkflowStepCompound } from './models/workflow'

let step = new WorkflowStepSimple({ name: 'Test' });
let step2 = new WorkflowStepSimple({ name: 'Test2' });

export function createTestWorkflow() {
    let workflow = new Workflow();
    workflow.steps = [
        new WorkflowStepSimple({ name: 'one', image: 'telegraf', tag: '1.3.4' }),
        new WorkflowStepCompound({
            name: 'two',
            steps: [
                new WorkflowStepSimple({ name: 'two dot one' }),
                new WorkflowStepSimple({ name: 'two dot two' }),
            ]
        }),
        new WorkflowStepSimple({ name: 'three' }),
        new WorkflowStepSimple({ name: 'four' })
    ];

    return workflow;
}