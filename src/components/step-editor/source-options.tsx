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
export class SourceOptions extends React.Component<SourceOptionsProps, {}> {
    constructor(props: SourceOptionsProps) {
        super(props);
    }

    private get soureOmitted() {
        return this.props.step.omitSource === true;
    }

    @action
    private omitSource(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.step.omitSource = e.currentTarget.checked;
    }

    public render() {
        let classes = this.props.classes || {}
        return (<div className="pure-u-1">
            <label>
                <input type="checkbox" checked={this.soureOmitted} onChange={e => this.omitSource(e)} />{' '}
                {translate('OPTION_OMIT_SOURCE')}
            </label>
        </div>);
    }
}    