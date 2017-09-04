import * as React from 'react';
let injectSheet = require('react-jss').default;
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { EnvironmentSource, EnvironmentSourceType } from '../../../../workflow';
import { CenteredContent } from '../../util/centered-content'
import { translate } from '../../../../../translation-service';

const styles = (theme: any) => ({
    labelContainer: {
        composes: 'pure-u-1-8',
        textAlign: 'right'
    },
    label: {
        paddingRight: '5px'
    },
    halfInput: {
        composes: 'pure-u-3-8 code'
    },
    fullInput: {
        composes: 'pure-u-7-8 code'
    }
});

interface SourceEditorProps {
    source: EnvironmentSource;
    sourceType: EnvironmentSourceType;
    onChange: () => void;
    classes?: any;
}

@injectSheet(styles)
@observer
export class EnvironmentSourceEditor extends React.Component<SourceEditorProps> {
    constructor(props: SourceEditorProps) {
        super(props);
    }

    private notifyChange() {
        if (this.props.onChange) {
            this.props.onChange();
        }
    }

    @action
    private setFile(file: string) {
        this.props.source.file = file;
        this.notifyChange();
    }

    @action
    private setName(name: string) {
        this.props.source.name = name;
        this.notifyChange();
    }

    @action
    private setValue(value: string) {
        this.props.source.value = value;
        this.notifyChange();
    }

    public render() {
        let classes = this.props.classes || {};
        return this.props.sourceType === 'pair' ?
            (<div className="pure-g">
                <label className={classes.labelContainer}>
                    <CenteredContent>
                        <span className={classes.label}>{translate('LABEL_NAME')}</span>
                    </CenteredContent>
                </label>
                <input className={classes.halfInput}
                    type="text"
                    value={this.props.source.name}
                    onChange={e => this.setName(e.target.value)} />
                <label className={classes.labelContainer}>
                    <CenteredContent>
                        <span className={classes.label}>{translate('LABEL_VALUE')}</span>
                    </CenteredContent>
                </label>
                <input className={classes.halfInput}
                    type="text"
                    value={this.props.source.value}
                    onChange={e => this.setValue(e.target.value)} />
            </div>) :
            (this.props.sourceType === 'file' &&
                <div className="pure-g">
                    <label className={classes.labelContainer}>
                        <CenteredContent>
                            <span className={classes.label}>{translate('LABEL_FILE')}</span>
                        </CenteredContent>
                    </label>
                    <input className={classes.fullInput}
                        type="text"
                        value={this.props.source.file}
                        onChange={e => this.setFile(e.target.value)} />
                </div>);
    }
}
