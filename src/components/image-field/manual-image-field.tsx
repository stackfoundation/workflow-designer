import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";

@observer
export class ManualImageField extends React.Component<{ step: WorkflowStepSimple }, {}> {
    constructor(props: { step: WorkflowStepSimple }) {
        super(props);
    }

    @action
    private onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.step.image = event.target.value;
    }

    public render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <input 
                        type="text" 
                        className="pure-input-1 input-text native-key-bindings" 
                        name="image" 
                        value={this.props.step.image || ''}
                        onChange={e => this.onImageChange(e)}/>
                </div>
            </div>);
    }
}
