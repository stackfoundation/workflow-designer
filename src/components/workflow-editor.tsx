import * as React from 'react';
let injectSheet = require('@tiagoroldao/react-jss').default;
import * as mobx from "mobx";
import { observer } from "mobx-react";
import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

import { EditorState } from '../models/state';
import { StepEditor } from './step-editor/step-editor';
import { StepList } from './step-list';
import { IWorkflow } from "../../../workflow";
import '../util/translations.ts';
import { translate } from '../../../../translation-service';
import { themeColors, listStyles, sectionStyles } from '../style';
import { WorkflowStep } from '../models/workflow';
import { VariablesEditor } from '../components/step-editor/variables-editor';

const styles = (theme: any) => {
    let list = listStyles(theme);
    let section = sectionStyles(theme);

    return Object.assign({
        form: {
            composes: theme.ide ? '' : 'pure-form',
        },
        editor: {
            composes: `pure-g padded workflow-editor ${theme.ide ? 'base-ide-style' : 'base-web-style'}`
        },
        listWrapper: {
            composes: `pure-u-1-4 ${theme.ide ? 'block': ''}`,

            paddingRight: '10px'
        },
        list: {
            composes: theme.ide ? 'inset-panel padded': ''
        },
        mainEditor: {
            composes: `pure-u-3-4 ${theme.ide ? 'block': ''}`
        },
        workflowVarsCount: theme.ide? {
            composes: 'badge badge-info',
            marginRight: '5px',
        }: {
            marginRight: '5px',
            
            padding: '0.375em 0.6em',
            minWidth: '1.875em',
            fontWeight: 'normal',
            color: 'white',
            borderRadius: '2em',
            backgroundColor: themeColors.darkerGreen
        },
    }, list, section);
};

interface WorkflowEditorState {
    section: 'step' | 'workflowVars'
}


@injectSheet(styles)
@observer
export class WorkflowEditor extends React.Component<{ state: EditorState, classes?: any }, {}> {
    public state: WorkflowEditorState = {
        section: 'workflowVars'
    }

    constructor(props: { state: EditorState, classes?: any }) {
        super(props);
    }

    private selectStep (step: WorkflowStep) {
        this.setState({section: 'step'});
    }

    private selectSection (section: WorkflowEditorState['section']) {
        this.setState({section});
        this.props.state.clearSelectedStep();
    }

    public render() {
        let classes = this.props.classes || {},
            workflowVarCount = this.props.state.workflow.workflowVariables.length;

        return (
            <div className={classes.editor}>
                <div className={classes.listWrapper}>
                    <div className={classes.list}>
                        <h3 className={classes.listTitle}>{translate('TITLE_WORKFLOW')}</h3>
                        <ul className={classes.rootListTree}>
                            <li 
                                className={[classes.listItem, this.state.section === 'workflowVars' ? classes.listItemSelected : ''].join(' ')} 
                                onClick={e => this.selectSection('workflowVars')}>
                                <span>
                                    {workflowVarCount > 0 && <span className={classes.workflowVarsCount}>{workflowVarCount}</span>}
                                    <span>{translate('TITLE_WORKFLOW_VARIABLES')}</span>
                                </span>
                            </li>
                        </ul>
                        <h3 className={classes.listTitle}>{translate('TITLE_STEPS')}</h3>
                        <StepList state={this.props.state} onStepSelect={step => this.selectStep(step)}></StepList>
                    </div>
                </div>
                <div className={classes.mainEditor}>
                    {this.state.section === 'step' && 
                        <StepEditor 
                            state={this.props.state}
                            ide={this.props.state.ide}
                            scriptEditorFactory={this.props.state.scriptEditorFactory}
                            catalog={this.props.state.catalog}
                            workflow={this.props.state.workflow}
                            step={this.props.state.currentStep}>
                        </StepEditor>}
                    {this.state.section === 'workflowVars' && 
                        <form className={classes.form}>
                            <div className={classes.section}>
                                <div className={classes.sectionTitleLarge}>Workflow Variables</div>
                                <div className={classes.sectionBody}>
                                    <VariablesEditor
                                        variables={this.props.state.workflow.workflowVariables}
                                        ide={this.props.state.ide}>
                                    </VariablesEditor>
                                </div>
                            </div>
                            <div className="block"></div>
                        </form>}
                </div>
            </div>
        );
    }
}
