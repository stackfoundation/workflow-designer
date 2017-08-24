import * as React from 'react';

import '../util/translations.ts';

import { EditorState } from '../models/state';
import { StepEditor } from './step-editor/step-editor';
import { StepList } from './step-list';

import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

import * as mobx from "mobx";
import { observer } from "mobx-react";
import { IWorkflow } from "../../../workflow";

let injectSheet = require('react-jss').default;

const styles = (theme: any) => ({
    editor: {
        composes: `pure-g workflow-editor ${theme.ide ? 'base-ide-style' : 'base-web-style'}`
    },
    list: {
        composes: `pure-u-1-4 ${theme.ide ? 'block': ''}`
    },
    stepEditor: {
        composes: `pure-u-3-4 ${theme.ide ? 'block': ''}`
    }
});

@injectSheet(styles)
@observer
export class WorkflowEditor extends React.Component<{ state: EditorState, classes?: any }, {}> {
    constructor(props: { state: EditorState, classes?: any }) {
        super(props);
    }

    public render() {
        let classes = this.props.classes || {};

        return (
            <div className={classes.editor}>
                <div className={classes.list}>
                    <StepList state={this.props.state}></StepList>
                </div>
                <div className={classes.stepEditor}>
                    <StepEditor 
                        state={this.props.state}
                        ide={this.props.state.ide}
                        textEditorFactory={this.props.state.textEditorFactory}
                        catalog={this.props.state.catalog}
                        workflow={this.props.state.workflow}
                        step={this.props.state.currentStep}>
                    </StepEditor>
                </div>
            </div>
        );
    }
}
