import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import { AceEditor } from '../ace-editor';

import { ImageField } from '../image-field/image-field';
import { WorkflowStep, WorkflowStepSimple, Workflow } from '../../models/workflow';

// import 'brace/theme/monokai';
// import 'brace/mode/sh';
import VirtualizedSelect, { VirtualizedOptionRenderOptions } from 'react-virtualized-select';

import { observer } from "mobx-react";
import { CustomInputIO } from "../../models/custom-input";
import { autorun } from "mobx";
import { CatalogImage } from "../../models/catalog";
import { TextEditorFactory } from "../../models/state";
import { stepRunTypeValues, StepRunType } from "../../../../workflow";
import { Option } from "react-select";
import { CenteredContent } from "../../util/centered-content";
import { translate } from "../../util/translation-service";

const atom = require('atom');
import { globalEditorStyles, themeColors } from '../../style';

import injectSheet from 'react-jss';

const styles = theme => ({
    select: {
        composes: `${globalEditorStyles.largeSelect} ${theme.ide ? 'button-background-color' : ''}`
    },
    title: {
        composes: theme.ide ? 'text-color' : '',
        padding: 0,
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '24px'
    },
    description: {
        composes: theme.ide ? 'text-color' : '',
        padding: 0,
        margin: 0,
        fontSize: '14px',
        lineHeight: '16px'
    },
    option: {
        cursor: 'pointer',
        margin: 0,
        padding: '0 20px',
        border: 'solid 3px transparent',

        '&.selected': {
            border: 'solid 3px ' + themeColors.darkerGreen,

            '& *': {
                color: themeColors.darkerGreen,
            }
        }
    }
});

interface SimpleStepEditorProps { 
    step: WorkflowStepSimple, 
    workflow: Workflow, 
    ide: boolean, 
    catalog: CatalogImage[], 
    textEditorFactory: TextEditorFactory,
    classes?: any
}

@injectSheet(styles)
@observer
export class SimpleStepEditor extends React.Component<SimpleStepEditorProps, {}> {
    private editorDiv: HTMLElement;
    private editorIO: CustomInputIO<string>;
    private stepScriptDisposer: Function;

    private stepRunOptions = Object.keys(stepRunTypeValues).map(key => ({value: key}));

    constructor(props: SimpleStepEditorProps) {
        super(props);
    }

    private setEditorElement(el: HTMLElement) {
        if (el) {
            if (el !== this.editorDiv) {
                this.editorDiv = el;

                if (this.props.textEditorFactory) {
                    this.editorIO = this.props.textEditorFactory(el, this.props.step.script);
                    this.editorIO.onChange(() => {
                        this.props.step.script = this.editorIO.getValue();
                    })
                    this.editorDiv.appendChild(this.editorIO.element);
                }


                this.stepScriptDisposer = autorun(() => {
                    if (this.editorIO && this.editorIO.getValue() !== this.props.step.script) {
                        this.editorIO.setValue(this.props.step.script);
                    }
                });
            }
            else {
                this.editorIO.setValue(this.props.step.script);
            }
        }
    }

    componentWillUnmount () {
        if (this.editorIO) {
            this.editorIO.dispose();
        }
        if (this.stepScriptDisposer) {
            this.stepScriptDisposer();
        }
    }

    private valueRenderer = (option: Option) => {
        const classes = this.props.classes || {};

        return (
            <CenteredContent container={false}>
                <div className={classes.title}>
                    {translate('NAME_STEP_RUN_TYPE_' + (option.value as string).toUpperCase())}
                    </div>
                <div className={classes.description}>
                    {translate('DESCRIPTION_STEP_RUN_TYPE_' + (option.value as string).toUpperCase())}
                    </div>
            </CenteredContent>
        );
    }

    private optionRenderer = (options: VirtualizedOptionRenderOptions<Option>) => {
        let option = options.option;
        const classes = this.props.classes || {};

        return (
            <CenteredContent
                className={`${classes.option} ${options.focusedOption == option ? 'selected' : ''}`}
                key={options.key}
                onClick={() => options.selectValue(option)}
                onMouseOver={() => options.focusOption(option)}
                style={options.style}>
                <div className={classes.title}>
                    {translate('NAME_STEP_RUN_TYPE_' + (option.value as string).toUpperCase())}
                    </div>
                <div className={classes.description}>
                    {translate('DESCRIPTION_STEP_RUN_TYPE_' + (option.value as string).toUpperCase())}
                    </div>
            </CenteredContent>
        );
    }

    public render() {
        const classes = this.props.classes || {};

        return this.props.step ? 
            <div className="pure-u-1">
                <div className="pure-g">
                    <div className="pure-u-1-12">
                        Run:
                    </div>
                    <div className="pure-u-11-12">
                        <VirtualizedSelect
                            className={classes.select}
                            clearable={false}
                            options={this.stepRunOptions}
                            optionRenderer={this.optionRenderer}
                            valueRenderer={this.valueRenderer}
                            optionHeight={100}
                            maxHeight={400}
                            onChange={option => this.props.step.runType = ((option as Option).value as StepRunType)}
                            value={this.props.step.runType || ''} />
                    </div>
                </div>
                <ImageField 
                    catalog={this.props.catalog}
                    ide={this.props.ide} 
                    workflow={this.props.workflow} 
                    step={this.props.step}></ImageField>
                <div ref={el => this.setEditorElement(el)}></div>
            </div>
        : null;
    }
}
