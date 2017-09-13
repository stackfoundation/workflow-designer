import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { translate } from '../../../../../translation-service';
import { EditorState } from '../../models/state';
import { Options } from '../options';
import { WorkflowStepSimple, Workflow, ActionType, TransientState } from '../../models/workflow';
import { ScriptStepEditor } from './script-step-editor';
import { DockerfileStepEditor } from './dockerfile-step-editor';
import { ScriptEditorFactory } from "../../models/state";
import { editorStyles, themeColors } from '../../style';
import { CatalogImage } from "../../models/catalog";

interface SimpleStepEditorProps {
    step: WorkflowStepSimple,
    workflow: Workflow,
    ide: boolean,
    catalog: CatalogImage[],
    scriptEditorFactory: ScriptEditorFactory,
    classes?: any
}

@observer
export class SimpleStepEditor extends React.Component<SimpleStepEditorProps, {}> {
    constructor(props: SimpleStepEditorProps) {
        super(props);
    }

    private get action() {
        if (this.props.step) {
            if (this.props.step.transient && this.props.step.transient.action) {
                return this.props.step.transient.action;
            } else if (this.props.step.dockerfile) {
                return 'dockerfile';
            } else if (this.props.step.target) {
                return 'call';
            } else if (this.props.step.generator) {
                return 'generated';
            }
        }

        return 'script';
    }

    @action
    private setAction(action: ActionType) {
        if (!this.props.step.transient) {
            this.props.step.transient = new TransientState();
        }

        this.props.step.transient.action = action;
    }

    private actionOption(action: ActionType) {
        return {
            value: action,
            display: (<span>{translate('RUN_' + action.toUpperCase())}</span>)
        };
    }

    private options() {
        return this.props.ide ?
            [
                this.actionOption('script'),
                this.actionOption('call'),
                this.actionOption('generated'),
                this.actionOption('dockerfile')
            ] :
            [
                this.actionOption('script'),
                this.actionOption('dockerfile')
            ]
    }

    private selectedEditor() {
        if (this.action == 'script') {
            return (<ScriptStepEditor
                scriptEditorFactory={this.props.scriptEditorFactory}
                scriptField={'script'}
                workflow={this.props.workflow}
                ide={this.props.ide}
                catalog={this.props.catalog}
                step={this.props.step as WorkflowStepSimple}>
            </ScriptStepEditor>);
        } else if (this.action == 'generated') {
            return (<ScriptStepEditor
                scriptEditorFactory={this.props.scriptEditorFactory}
                scriptField={'generator'}
                workflow={this.props.workflow}
                ide={this.props.ide}
                catalog={this.props.catalog}
                step={this.props.step as WorkflowStepSimple}>
            </ScriptStepEditor>);
        } else if (this.action == 'dockerfile') {
            return (<DockerfileStepEditor step={this.props.step as WorkflowStepSimple} />);
        }
    }

    public render() {
        let classes = this.props.classes || {};
        return (
            <div>
                <Options
                    ide={this.props.ide}
                    fill={true}
                    options={this.options()}
                    onChange={a => this.setAction(a.value)}
                    selected={this.action} />
                {this.selectedEditor()}
            </div>);
    }
}
