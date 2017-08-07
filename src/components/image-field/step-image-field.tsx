import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import { globalEditorStyles, classes } from '../../style';
import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";

@observer
export class StepImageField extends React.Component<{ workflow: Workflow, step: WorkflowStepSimple }, {}> {
    constructor(props: { workflow: Workflow, step: WorkflowStepSimple }) {
        super(props);
    }

    private onTagChange(tag: string) {

    }

    @computed
    private get previousSteps() {
        if (this.props.step) {
            let previousSteps = [];
            let steps = this.props.workflow.flattenedSteps();

            for (let step of steps) {
                if (step !== this.props.step) {
                    previousSteps.push(step);
                } else {
                    break;
                }
            }

            return previousSteps.map(step => ({ label: step.name, value: step.name }));
        }

        return [];
    }

    private get previousStep() {
        if (this.props.step) {
            return this.props.step.name;
        }

        return '';
    }

    public render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <VirtualizedSelect
                        className={classes(globalEditorStyles.largeSelect)}
                        clearable={false}
                        options={this.previousSteps}
                        optionHeight={100}
                        maxHeight={400}
                        onChange={option => this.onTagChange((option as Option).value as string)}
                        value={this.previousStep} />
                </div>
            </div>);
    }
}
