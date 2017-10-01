import * as React from 'react';
let injectSheet = require('@tiagoroldao/react-jss').default;
import * as mobx from "mobx";
import { observer } from "mobx-react";
import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
const AngleDown = require('react-icons/lib/fa/angle-down');
const AngleUp = require('react-icons/lib/fa/angle-up');
const ReactTooltip = require('react-tooltip');

import { EditorState } from '../models/state';
import { StepEditor } from './step-editor/step-editor';
import { StepList } from './step-list';
import { IWorkflow } from "../../../workflow";
import '../util/translations.ts';
import { translate } from '../../../../translation-service';
import { themeColors, listStyles, sectionStyles, mediaQueries, shadows } from '../style';
import { WorkflowStep } from '../models/workflow';
import { VariablesEditor } from '../components/step-editor/variables-editor';

const styles = (theme: any) => {
    let list = listStyles(theme);
    let section = sectionStyles(theme);

    list.rootListTree.marginBottom = '0px';
    list.listItem.fontSize = '1.2em';
    list.listItem.paddingLeft = '0px';
    list.listItem.fontWeight = 'bold';

    list.listTitle.color = theme.ide ? undefined : '#666';

    return Object.assign({
        form: {
            composes: theme.ide ? '' : 'pure-form',
        },
        editor: {
            composes: `pure-g padded workflow-editor ${theme.ide ? 'base-ide-style' : 'base-web-style'}`,

            [mediaQueries.md]: {
                padding: theme.ide ? '' : '0px 15px',
            },
        },
        tooltipWrapper: {
            composes: 'pure-u-1',
            position: 'absolute'
        },
        tooltip: {
            composes: theme.ide ? 'ide-tooltip' : '',
        },
        listWrapper: {
            composes: `pure-u-1 pure-u-md-1-4 ${theme.ide ? 'block': ''}`,
            padding: '10px',
            position: 'relative',
            margin: '10px 0px',
            background: theme.ide ? undefined : '#eee',

            [mediaQueries.md]: {
                background: theme.ide ? undefined : 'transparent',
                padding: '0px',
                paddingRight: '10px',
                margin: '0px',
            },
        },
        listWrapperTopShadow : Object.assign({
            [mediaQueries.md]: {
                display: 'none',
            },
        }, shadows.top),
        listWrapperBottomShadow : Object.assign({
            [mediaQueries.md]: {
                display: 'none',
            },
        }, shadows.bottom),
        list: {
            composes: theme.ide ? 'inset-panel padded': '',

            '&.closed': {
                display: 'none',

                [mediaQueries.md]: {
                    display: 'block',
                },
            }
        },
        mainEditor: {
            composes: `pure-u-1 pure-u-md-3-4 ${theme.ide ? 'block': ''}`,
            padding: '0px 10px',

            [mediaQueries.md]: {
                padding: '0px',
            },
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
        listMobileHeader: {
            textAlign: 'center',

            '& > h3': {
                marginTop: '10px',
                marginBottom: '0px'
            },

            '& > hr': {
                marginBottom: '0px'
            },


            [mediaQueries.md]: {
                display: 'none',
            }
        },
        listMobileSwitch: {
            fontSize: '2em',
            lineHeight: '0.5em',
        }
    }, list, section);
};

interface WorkflowEditorState {
    section: 'step' | 'workflowVars',
    mobileMenuOpen: boolean
}


@injectSheet(styles)
@observer
export class WorkflowEditor extends React.Component<{ state: EditorState, classes?: any }, {}> {
    public state: WorkflowEditorState = {
        section: 'workflowVars',
        mobileMenuOpen: false
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

    private get selectedItemDescription () {
        let out = '';

        if (this.state.section === 'workflowVars') {
            return translate('TITLE_WORKFLOW_VARIABLES');
        }
        else {
            return 'Step - ' + this.props.state.currentStep.name;
        }
    }

    public render() {
        let classes = this.props.classes || {},
            workflowVarCount = this.props.state.workflow ? this.props.state.workflow.workflowVariables.length : 0;

        return (
            <div className={classes.editor}>
                <div className={classes.tooltipWrapper}>
                    <ReactTooltip id="workflowEditor" effect="solid" class={classes.tooltip} html={true}/>
                </div>
                <div className={classes.listWrapper}>
                    <div className={classes.listMobileHeader} onClick={() => this.setState({mobileMenuOpen: !this.state.mobileMenuOpen})}>
                        <h3>
                            {this.selectedItemDescription}
                        </h3>
                        <hr/>
                        <span className={classes.listMobileSwitch}>
                            {this.state.mobileMenuOpen ? <AngleUp></AngleUp> : <AngleDown></AngleDown>}
                        </span>
                    </div>
                    <div className={classes.listWrapperTopShadow}></div>
                    <div className={classes.listWrapperBottomShadow}></div>
                    <div className={[classes.list, this.state.mobileMenuOpen ? 'open' : 'closed'].join(' ')}>
                        <ul className={classes.rootListTree}>
                            <li 
                                className={[classes.listItem, this.state.section === 'workflowVars' ? classes.listItemSelected : ''].join(' ')} 
                                onClick={e => this.selectSection('workflowVars')}>
                                <span>
                                    {workflowVarCount > 0 && <span className={classes.workflowVarsCount}>{workflowVarCount}</span>}
                                    <span>{translate('TITLE_WORKFLOW')}</span>
                                </span>
                            </li>
                        </ul>
                        <h3 className={[classes.listTitle, this.state.section === 'step' ? classes.listItemSelected : ''].join(' ')}>{translate('TITLE_STEPS')}</h3>
                        <StepList state={this.props.state} onStepSelect={step => this.selectStep(step)}></StepList>
                        {this.props.children}
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
                            <div className={[classes.section, workflowVarCount.toString()].join(' ')}>
                                <div className={classes.sectionTitle}>Workflow Variables</div>
                                <div className={classes.sectionBody}>
                                    <VariablesEditor
                                        variables={this.props.state.workflow ? this.props.state.workflow.workflowVariables : []}
                                        ide={this.props.state.ide}>
                                    </VariablesEditor>
                                </div>
                            </div>
                        </form>}
                </div>
            </div>
        );
    }
}
