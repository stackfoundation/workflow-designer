import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

import { WorkflowStepSimple } from '../../models/workflow';
import { translate } from '../../../../../translation-service';

interface SourceOptionsProps {
    step: WorkflowStepSimple,
    classes?: any
}

const styles = (theme: any) => ({
});

@injectSheet(styles)
@observer
export class FailureOptions extends React.Component<SourceOptionsProps, {}> {
    constructor(props: SourceOptionsProps) {
        super(props);
    }

    private get failureIgnored() {
        return this.props.step.ignoreFailure === true;
    }

    @action
    private ignoreFailure(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.step.ignoreFailure = e.currentTarget.checked;
    }

    public render() {
        let classes = this.props.classes || {}
        return (<div className="pure-u-1">
            <label>
                <input type="checkbox" checked={this.failureIgnored} onChange={e => this.ignoreFailure(e)} />{' '}
                {translate('OPTION_FAILURE')}
            </label>
        </div>);
    }
}    