import * as React from 'react';
import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";
import { CenteredContent } from "../../util/centered-content";
import { translate } from '../../../../../translation-service';
import { observer } from 'mobx-react';
import { action } from 'mobx';

@observer
export class DockerfileStepEditor extends React.Component<{ step: WorkflowStepSimple }, {}> {
    constructor(props: { step: WorkflowStepSimple }) {
        super(props);
    }
    @action
    private onDockerfileChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.step.dockerfile = event.target.value;
    }
    public render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1-6">
                    <CenteredContent>
                        <span>{translate('LABEL_DOCKERFILE')}</span>
                    </CenteredContent>
                </div>
                <div className="pure-u-5-6">
                    <input
                        type="text"
                        className="pure-u-1 native-key-bindings"
                        name="image"
                        value={this.props.step.dockerfile || ''}
                        onChange={e => this.onDockerfileChange(e)} />
                </div>
            </div>);
    }
}