import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

import { editorStyles } from '../../style';
import { EditorState } from '../../models/state';
import { WorkflowStepSimple, Workflow } from "../../models/workflow";
import { CenteredContent } from '../../util/centered-content';
import { translate } from '../../../../../translation-service';

const jssStyles = (theme: any) => ({
    title: {
        composes: theme.ide ? 'text-color' : '',
        padding: 0,
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '24px'
    },
    placeholder: {
        composes: theme.ide ? 'text-color' : '',
        padding: 0,
        margin: 0,
        fontSize: '16px',
        lineHeight: '24px'
    },
});

@injectSheet(jssStyles)
@observer
export class StepImageField extends React.Component<{ workflow: Workflow, step: WorkflowStepSimple, classes?: any }, {}> {
    constructor(props: { workflow: Workflow, step: WorkflowStepSimple }) {
        super(props);
    }

    @action
    private onImageChange(image: string) {
        this.props.step.image = image;
    }

    private valueRenderer = (option: Option) => {
        return (<CenteredContent>
            <div className={this.props.classes.title}>{option.label}</div>
        </CenteredContent>);
    }
    
    private placeholder() {
        return (<CenteredContent>
            <div className={this.props.classes.placeholder}>{translate('PLACEHOLDER_IMAGE')}</div>
        </CenteredContent>);
    }

    public render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <VirtualizedSelect
                        className="native-key-bindings"
                        clearable={false}
                        searchable={false}
                        placeholder={this.placeholder()}
                        valueRenderer={this.valueRenderer}
                        options={this.props.workflow.stepsBefore(this.props.step)}
                        maxHeight={400}
                        onChange={option => this.onImageChange((option as Option).value as string)}
                        value={this.props.step.image || ''} />
                </div>
            </div>);
    }
}
