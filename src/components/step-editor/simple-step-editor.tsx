import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { translate } from '../../../../../translation-service';
import { EditorState } from '../../models/state';
import { Options } from '../options';
import { WorkflowStepSimple, Workflow, ActionType, StepTransientState } from '../../models/workflow';
import { ScriptStepEditor } from './script-step-editor';
import { DockerfileStepEditor } from './dockerfile-step-editor';
import { ExtWorkflowStepEditor } from './ext-workflow-step-editor';
import { ScriptEditorFactory, SfLinkFactory } from "../../models/state";
import { editorStyles, themeColors } from '../../style';
import { CatalogImage } from "../../models/catalog";
import { CenteredContent } from '../../util/centered-content';

let injectSheet = require('@tiagoroldao/react-jss').default;

interface SimpleStepEditorProps {
    step: WorkflowStepSimple,
    workflow: Workflow,
    ide: boolean,
    allowCalls: boolean,
    catalog: CatalogImage[],
    scriptEditorFactory: ScriptEditorFactory,
    sfLinkFactory: SfLinkFactory,
    classes?: any
}

const styles = (theme: any) => {
    return {
        labelContainer: {
            composes: 'pure-u-1-4 pure-u-md-1-6',
            textAlign: 'right'
        },
        label: {
            paddingRight: '5px'
        }
    };
};

@injectSheet(styles)
@observer
export class SimpleStepEditor extends React.Component<SimpleStepEditorProps, {}> {
    constructor(props: SimpleStepEditorProps) {
        super(props);
    }

    private get action() {
        if (this.props.step) {
            return this.props.step.action;
        }

        return 'script';
    }

    @action
    private setAction(action: ActionType) {
        if (!this.props.step.transient) {
            this.props.step.transient = new StepTransientState();
        }

        this.props.step.transient.action = action;
    }

    @action
    private setServiceName (name: string) {
        this.props.step.serviceName = name;
    }

    private actionOption(action: ActionType) {
        return {
            value: action,
            display: (<span>{translate('RUN_' + action.toUpperCase())}</span>)
        };
    }

    private options() {
        return this.props.allowCalls ?
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
                sfLinkFactory={this.props.sfLinkFactory}
                scriptField={'script'}
                workflow={this.props.workflow}
                ide={this.props.ide}
                catalog={this.props.catalog}
                step={this.props.step as WorkflowStepSimple}>
            </ScriptStepEditor>);
        } else if (this.action == 'generated') {
            return (<ScriptStepEditor
                scriptEditorFactory={this.props.scriptEditorFactory}
                sfLinkFactory={this.props.sfLinkFactory}
                includeWorkflowVariables={true}
                scriptField={'generator'}
                workflow={this.props.workflow}
                ide={this.props.ide}
                catalog={this.props.catalog}
                step={this.props.step as WorkflowStepSimple}>
            </ScriptStepEditor>);
        } else if (this.action == 'dockerfile') {
            return (<DockerfileStepEditor step={this.props.step as WorkflowStepSimple} />);
        } else if (this.action == 'call') {
            return (<ExtWorkflowStepEditor step={this.props.step as WorkflowStepSimple} />);
        }
    }

    public render() {
        let classes = this.props.classes || {};
        return (
            <div>
                {this.props.step.type === "service" && <div className="pure-g">
                    <label className={classes.labelContainer}>
                        <CenteredContent>
                            <span className={classes.label}>{translate('LABEL_SERVICE_NAME')}:</span>
                        </CenteredContent>
                    </label>
                    <div className="pure-u-3-4 pure-u-md-5-6">
                        <input className="pure-input-1 input-text native-key-bindings"
                            type="text"
                            value={this.props.step.serviceName || ""}
                            onChange={e => this.setServiceName(e.target.value)} />
                    </div>
                </div>}
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
