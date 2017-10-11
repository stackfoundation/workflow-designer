import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

import { WorkflowStepSimple } from '../../models/workflow';
import { translate } from '../../../../../translation-service';
import { CenteredContent } from '../../util/centered-content';

interface SourceOptionsProps {
    step: WorkflowStepSimple,
    classes?: any
}

const styles = (theme: any) => ({
    label: {
        composes: 'input-label pure-u-1 pure-u-md-1-4 text-right',
        paddingRight: '5px'
    }
});

@injectSheet(styles)
@observer
export class SourceOptions extends React.Component<SourceOptionsProps, {}> {
    constructor(props: SourceOptionsProps) {
        super(props);
    }

    private get sourceOmitted() {
        return this.props.step.omitSource === true;
    }

    @action
    private omitSource(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.step.omitSource = e.currentTarget.checked;
    }

    public render() {
        let classes = this.props.classes || {}
        return (<div>
            <div className="pure-g block">
                <div className="pure-u-1 pure-u-md-1-4"></div>
                <div className="pure-u-1 pure-u-md-3-4">
                    <label className="input-label">
                        <input className="input-checkbox" type="checkbox" checked={this.sourceOmitted} onChange={e => this.omitSource(e)} />{' '}
                        {translate('OPTION_OMIT_SOURCE')}
                    </label>
                </div>
            </div>
            <div className="pure-g">
                <label className={classes.label}>
                    <CenteredContent>
                        <span>{translate('LABEL_DOCKERIGNORE')}:</span>
                    </CenteredContent>
                </label>
                <div className="pure-u-1 pure-u-md-3-4">
                    <input className='pure-input-1 code input-text native-key-bindings'
                        type="text"
                        value={this.props.step.dockerignore || ''}
                        onChange={e => this.props.step.dockerignore = e.target.value} />
                </div>
            </div>
        </div>);
    }
}    