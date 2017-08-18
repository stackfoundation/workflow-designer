import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observable, action, toJS, spy, reaction } from 'mobx';

import { EditorState } from './models/state'
import { Workflow, WorkflowStepSequential, WorkflowStepCompound } from './models/workflow'
import { WorkflowEditor } from './components/workflow-editor'

import { WorkflowService } from './services/workflow_service'
import { IWorkflow } from "../../workflow";
import { CustomInputIO, CustomInputFactory } from "./models/custom-input";

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

export interface IWorkFlowEditorIO {
    getWorkflow: () => IWorkflow;
    destroy: () => void;
    onDirty: (callback: Function) => () => void;
}

export class WorkFlowEditorIO implements IWorkFlowEditorIO {
    private onChangeSubs: Function[] = [];

    constructor (private editorState: EditorState, private parentElement: Element) {


        ReactDOM.render((
            <WorkflowEditor state={this.editorState}></WorkflowEditor>
        ), parentElement);

        reaction(() => {
            return toJS(this.editorState.workflow.steps);
        }, workflow => { 
            for (var i = 0; i < this.onChangeSubs.length; i++) {
                this.onChangeSubs[i]();
            }
         })
    }

    public getWorkflow (): IWorkflow {
        return toJS(this.editorState.workflow) as IWorkflow;
    };

    public onDirty (callback: Function) {
        this.onChangeSubs.push (callback);

        return () => {
            this.onChangeSubs.splice(this.onChangeSubs.indexOf(callback), 1);
        };
    };

    public destroy () {
        ReactDOM.unmountComponentAtNode(this.parentElement);
    }
}

export function bootstrap(
    element: Element, 
    ide: boolean, 
    workflow: IWorkflow, 
    textEditorFactory: CustomInputFactory<string>): IWorkFlowEditorIO {

    let state = new EditorState();
    new WorkflowService().getWorkflowImagesCatalog()
        .then(response => state.setCatalog(response));

    state.workflow = Workflow.apply(workflow) || new Workflow();
    state.ide = ide;
    state.textEditorFactory = textEditorFactory;
    
    if (ide) {
        (window as any).ide = ide;
    }

    return new WorkFlowEditorIO(state, element);
}
