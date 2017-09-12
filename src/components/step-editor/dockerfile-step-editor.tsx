import * as React from 'react';
import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";
import { CenteredContent } from "../../util/centered-content";
import { translate } from '../../../../../translation-service';
import { observer } from 'mobx-react';
import { action } from 'mobx';

let injectSheet = require('@tiagoroldao/react-jss').default;

const styles = (theme: any) => ({
    label: {
        composes: 'pure-u-1-6 text-right',
        paddingRight: '5px'
    }
});

@injectSheet(styles)
@observer
export class DockerfileStepEditor extends React.Component<{ step: WorkflowStepSimple, classes?: any }, {}> {
    constructor(props: { step: WorkflowStepSimple, classes?: any }) {
        super(props);
    }
    @action
    private onDockerfileChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.step.dockerfile = event.target.value;
    }
    public render() {
        return (
            <div className="pure-g">
                <div className={this.props.classes.label}>
                    <CenteredContent>
                        <span>{translate('LABEL_DOCKERFILE')}</span>
                    </CenteredContent>
                </div>
                <div className="pure-u-5-6">
                    <input
                        type="text"
                        className="pure-input-1 input-text native-key-bindings"
                        name="image"
                        value={this.props.step.dockerfile || ''}
                        onChange={e => this.onDockerfileChange(e)} />
                </div>
            </div>);
    }
}