import * as React from 'react';

import '../util/translations.ts';
import { StyleSheet, classes } from '../style';

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

const styles = {
    editor: ['pure-g', 'workflow-editor'],
    list: {
        ide: 'block',
        all: ['pure-u-1-4']
    },
    stepEditor: {
        ide: 'block',
        all: ['pure-u-3-4']
    }
};

@observer
export class WorkflowEditor extends React.Component<{ state: EditorState }, {}> {
    constructor(props: { state: EditorState }) {
        super(props);
    }

    public render() {
        return (
            <div className={classes(styles.editor)}>
                <div className={classes(styles.list)}>
                    <StepList state={this.props.state}></StepList>
                </div>
                <div className={classes(styles.stepEditor)}>
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
