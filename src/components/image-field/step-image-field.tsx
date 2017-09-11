import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';

import { editorStyles } from '../../style';
import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";

@observer
export class StepImageField extends React.Component<{ workflow: Workflow, step: WorkflowStepSimple }, {}> {
    constructor(props: { workflow: Workflow, step: WorkflowStepSimple }) {
        super(props);
    }

    @action
    private onImageChange(image: string) {
        this.props.step.image = image;
    }

    public render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <VirtualizedSelect
                        className={`${editorStyles.largeSelect} native-key-bindings`}
                        clearable={false}
                        searchable={false}
                        options={this.props.workflow.stepsBefore(this.props.step)}
                        optionHeight={100}
                        maxHeight={400}
                        onChange={option => this.onImageChange((option as Option).value as string)}
                        value={this.props.step.image || ''} />
                </div>
            </div>);
    }
}
