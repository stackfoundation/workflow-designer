import * as React from 'react';
import { bootstrap } from './src/workflow-designer.module';
import { Workflow, WorkflowStepSimple } from './src/models/workflow';
import Loadable from 'react-loadable';

bootstrap(
    document.getElementById('root'), 
    false, 
    true,
    new Workflow(),
    (step: WorkflowStepSimple, fieldName: string) => {
        let CodeEditor = Loadable({
            loader: () => import(/* webpackChunkName: "editor",  */ './src/components/code-editor'),
            loading: () => <div></div>
        });
        return <CodeEditor step={step} fieldName={fieldName}/>
    },
    (url: string, text: string) => <a href={url} target="_blank">{text}</a>
);