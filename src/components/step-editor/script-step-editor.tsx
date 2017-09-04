import * as React from 'react';
import * as ReactDOM from 'react-dom';
let injectSheet = require('react-jss').default;

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
import { ScriptEditorFactory } from "../../models/state";
import { Option } from "react-select";
import { CenteredContent } from "../../util/centered-content";
import { translate } from '../../../../../translation-service';
import { AdvancedOptions } from './advanced-options';
// const atom = require('atom');
import { editorStyles, themeColors } from '../../style';


const styles = (theme: any) => ({
    select: {
        composes: `${editorStyles.largeSelect} ${theme.ide ? 'button-background-color' : ''}`
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
        padding: '0 20px'
    },
    selected: {
        composes: 'selected',
    },
    focused: {
        composes: 'focused',
    }
});

interface ScriptStepEditorProps {
    step: WorkflowStepSimple,
    workflow: Workflow,
    ide: boolean,
    catalog: CatalogImage[],
    scriptEditorFactory: ScriptEditorFactory,
    classes?: any
}

@injectSheet(styles)
@observer
export class ScriptStepEditor extends React.Component<ScriptStepEditorProps, {}> {
    private editorDiv: HTMLElement;
    private editorIO: CustomInputIO<string>;
    private stepScriptDisposer: Function;

    constructor(props: ScriptStepEditorProps) {
        super(props);
    }

    public render() {
        const classes = this.props.classes || {};
        return this.props.step ?
            <div className="pure-g">
                <div className="pure-u-1">
                    <ImageField
                        catalog={this.props.catalog}
                        ide={this.props.ide}
                        workflow={this.props.workflow}
                        step={this.props.step}></ImageField>
                </div>
                <AdvancedOptions
                    ide={this.props.ide}
                    step={this.props.step} />
                <div className="pure-u-1">
                    {this.props.scriptEditorFactory(this.props.step)}
                </div>
            </div>
            : null;
    }
}