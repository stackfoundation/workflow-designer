import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observable, action, toJS, spy, reaction } from 'mobx';

import { EditorState } from './models/state'
import { Workflow, WorkflowStepSimple, WorkflowStepCompound } from './models/workflow'
import { WorkflowEditor } from './components/workflow-editor'

import { WorkflowService } from './services/workflow_service'
import { IWorkflow } from "../../workflow";
import { CustomInputIO, CustomInputFactory } from "./models/custom-input";

import {jss, JssProvider, ThemeProvider} from 'react-jss';
import jssComposer from 'jss-compose';
import jssNested from 'jss-nested';

jss.use(jssComposer());
jss.use(jssNested());

export interface IWorkFlowEditorIO {
    getWorkflow: () => IWorkflow;
    destroy: () => void;
    onDirty: (callback: Function) => () => void;
}

export class WorkFlowEditorIO implements IWorkFlowEditorIO {
    private onChangeSubs: Function[] = [];

    constructor (private editorState: EditorState, private parentElement: Element) {

        let theme = {
            ide: editorState.ide
        };

        ReactDOM.render((
            <JssProvider jss={jss}>
            <ThemeProvider theme={theme}>
                <WorkflowEditor state={this.editorState}></WorkflowEditor>
            </ThemeProvider>
            </JssProvider>
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
