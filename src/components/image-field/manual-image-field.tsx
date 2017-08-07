import * as React from 'react';
import { observer } from 'mobx-react';

import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";

@observer
export class ManualImageField extends React.Component<{ step: WorkflowStepSimple }, {}> {
    constructor(props: { step: WorkflowStepSimple }) {
        super(props);
    }

    private onTagChange(tag: string) {

    }

    public render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <input type="text" className="pure-u-1" name="image" value="" />
                </div>
            </div>);
    }
}
