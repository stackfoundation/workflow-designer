import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observable, action, toJS } from 'mobx';

import { EditorState } from './models/state'
import { Workflow, WorkflowStepSequential, WorkflowStepCompound } from './models/workflow'
import { WorkflowEditor } from './components/workflow-editor'

import { WorkflowService } from './services/workflow_service'
import { IWorkflow } from "../../workflow";

let step = new WorkflowStepSequential({ name: 'Test' });
let step2 = new WorkflowStepSequential({ name: 'Test2' });

export function createTestWorkflow() {
    let workflow = new Workflow();
    workflow.steps = [
        new WorkflowStepSequential({ name: 'one', image: 'telegraf', tag: '1.3.4' }),
        new WorkflowStepCompound({
            name: 'two',
            steps: [
                new WorkflowStepSequential({ name: 'two dot one' }),
                new WorkflowStepSequential({ name: 'two dot two' }),
            ]
        }),
        new WorkflowStepSequential({ name: 'three' }),
        new WorkflowStepSequential({ name: 'four' })
    ];

    return workflow;
}

export interface WorkFlowEditorIO {
    getWorkflow: () => IWorkflow;
}

export function bootstrap(
    element: Element, 
    ide: boolean, 
    workflow: IWorkflow, 
    createEditor: (script: string) => HTMLElement): WorkFlowEditorIO {

    let state = new EditorState();
    new WorkflowService().getWorkflowImagesCatalog()
        .then(response => state.setCatalog(response));

    state.workflow = Workflow.apply(workflow) || new Workflow();
    state.ide = ide;
    state.createEditor = createEditor;
    
    if (ide) {
        (window as any).ide = ide;
    }

    ReactDOM.render((
        <WorkflowEditor state={state}></WorkflowEditor>
    ), element);

    return {
        getWorkflow: () => toJS(state.workflow) as IWorkflow
    };
}
