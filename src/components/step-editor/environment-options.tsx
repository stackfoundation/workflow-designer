import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
const Text = require('react-icons/lib/fa/font');
const File = require('react-icons/lib/fa/file-text-o');
const Remove = require('react-icons/lib/fa/times-circle');

import { Options } from '../options';
import { WorkflowStepSimple } from '../../models/workflow';
import { EnvironmentSource, EnvironmentSourceType } from '../../../../workflow';
import { translate } from '../../../../../translation-service';
import { EnvironmentSourceEditor } from './environment-source-editor';
import { mediaQueries } from '../../style';

let injectSheet = require('@tiagoroldao/react-jss').default;

const jssStyles = (theme: any) => ({
    fieldBlock: {
        composes: 'pure-g block base-border-color component-padding-bottom',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',

        '&:last-child': {
            borderBottom: 'none',
            paddingBottom: '0px'
        },

        [mediaQueries.lg]: {
            borderBottom: 'none',
            paddingBottom: '0px'
        }
    },
    editorDiv: {
        composes: 'pure-u-1 pure-u-lg-5-6'
    },
    optionSettings: {
        composes: 'pure-u-1 pure-u-lg-1-6',
        textAlign: 'right',
        paddingLeft: '0px',

        [mediaQueries.lg]: {
            paddingLeft: '10px'
        }
    },
    options: {
        '& > .btn-group': {
            width: '100%',

            '& > button': {
                width: '50%'
            }
        }
    },
    deleteButton: {
        composes: 'btn btn-error btn-block',

        '& > svg': {
            position: 'relative',
            display: 'inline-block',
            top: '-0.10em'
        }
    }
});

interface EnvironmentOptionsProps {
    step: WorkflowStepSimple;
    ide: boolean;
    classes?: any;
}

class EditorState {
    constructor(
        private step: WorkflowStepSimple,
        private source: EnvironmentSource,
        public committed: boolean) {
    }

    commitIfNecessary() {
        if (!this.committed) {
            if (!this.step.environment) {
                this.step.environment = [];
            }

            this.step.environment.push(this.source);
            this.committed = true;
        }
    }
}

class EditorEnvironmentSource implements EnvironmentSource {
    @observable file?: string = '';
    @observable name?: string = '';
    @observable value?: string = '';
}

@injectSheet(jssStyles)
@observer
export class EnvironmentOptions extends React.Component<EnvironmentOptionsProps, { sourceType: EnvironmentSourceType }> {
    constructor(props: EnvironmentOptionsProps) {
        super(props);
    }

    componentWillMount() {
        this.setState({ sourceType: 'pair' });
    }

    private get environment() {
        return this.props.step.environment;
    }

    private sourceTypeEditor() {
        return <div className="pure-g">
            <div className="pure-u-1-4 pure-u-lg-0">
            </div>
            <div className="pure-u-3-4 pure-u-lg-1">
                <Options
                    selected={this.state && this.state.sourceType}
                    ide={this.props.ide}
                    className={this.props.classes.options}
                    onChange={a => this.setSourceType(a.value)}
                    options={this.sourceTypes()} />
            </div>
        </div>;
    }

    @action
    private remove(source: EnvironmentSource) {
        this.environment.splice(this.environment.indexOf(source), 1);
    }

    private sourceEditor(source: EnvironmentSource, key: number, committed: boolean) {
        let state = new EditorState(this.props.step, source, committed);
        let editor = (<EnvironmentSourceEditor
            source={source}
            sourceType={state.committed ? (source.file ? 'file' : 'pair') : this.state.sourceType}
            onChange={() => state.commitIfNecessary()} />);

        return (<div className={this.props.classes.fieldBlock} key={key}>
            <div className={this.props.classes.editorDiv}>{editor}</div>
            <div className={this.props.classes.optionSettings}>
                {committed && this.deleteButton(source)}
                {!committed && this.sourceTypeEditor()}
            </div>
        </div>);
    }

    private deleteButton (source: EnvironmentSource) {
        return this.props.ide ? 
            <div className="pure-g">
                <div className="pure-u-1-4 pure-u-lg-0">
                </div>
                <div className="pure-u-3-4 pure-u-lg-1">
                    <button className={this.props.classes.deleteButton} onClick={_ => this.remove(source)}><Remove /> Remove</button>
                </div>
            </div> : 
            <div onClick={_ => this.remove(source)}><Remove /></div>;
    }

    private sourceEditors() {
        let editors = [];

        if (this.environment) {
            for (let i = 0; i <= this.environment.length; i++) {
                let source = undefined;
                let committed = false;

                if (i < this.environment.length) {
                    source = this.environment[i];
                    committed = true;
                } else {
                    source = new EditorEnvironmentSource();
                }

                editors.push(this.sourceEditor(source, i, committed));
            } 
        } else {
            editors.push(this.sourceEditor(new EditorEnvironmentSource, 0, false));
        }

        return editors;
    }

    private sourceTypes() {
        return [
            {
                display: (<Text />),
                value: 'pair'
            },
            {
                display: (<File />),
                value: 'file'
            }
        ];
    }

    private setSourceType(source: EnvironmentSourceType) {
        this.setState({ sourceType: source });
    }

    public render() {
        let classes = this.props.classes || {}
        return (<div>
            {this.sourceEditors()}
        </div>);
    }
}    