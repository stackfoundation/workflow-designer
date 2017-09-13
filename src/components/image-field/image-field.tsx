import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { translate } from '../../../../../translation-service';
import { EditorState } from '../../models/state';
import { ImageSource, WorkflowStepSimple, Workflow } from '../../models/workflow';
import { Options } from '../options';
import { CatalogImageField } from './catalog-image-field';
import { ManualImageField } from './manual-image-field';
import { StepImageField } from './step-image-field';

import { editorStyles, themeColors } from '../../style';
import { CatalogImage } from "../../models/catalog";

let injectSheet = require('@tiagoroldao/react-jss').default;

const styles = (theme: any) => ({
    editor: {
        marginTop: '8px'
    }
});

interface ImageFieldProps {
    ide: boolean,
    catalog: CatalogImage[],
    workflow: Workflow,
    step: WorkflowStepSimple,
    classes?: any
}

@injectSheet(styles)
@observer
export class ImageField extends React.Component<ImageFieldProps, {}> {
    constructor(props: ImageFieldProps) {
        super(props);
    }

    private get imageSource() {
        return this.props.step.imageSource;
    }

    @action
    private setImageSource(source: ImageSource) {
        this.props.step.imageSource = source;
    }

    private imageSourceOption(source: ImageSource) {
        return {
            value: source,
            display: (<span>{translate('SOURCE_' + source.toUpperCase())}</span>)
        };
    }

    private options() {
        let options = [
            this.imageSourceOption('catalog'),
            this.imageSourceOption('manual')
        ];

        if (this.props.workflow.stepsBefore(this.props.step).length > 0) {
            options.push(this.imageSourceOption('step'));
        }

        return options;
    }

    private selectedEditor() {
        switch (this.imageSource) {
            case 'step':
                return (<StepImageField step={this.props.step} workflow={this.props.workflow}></StepImageField>)
            case 'manual':
                return (<ManualImageField step={this.props.step}></ManualImageField>)
            default:
                return (<CatalogImageField catalog={this.props.catalog} step={this.props.step} workflow={this.props.workflow}></CatalogImageField>)
        }
    }

    public render() {
        let classes = this.props.classes || {};
        return (
            <div>
                <Options
                    ide={this.props.ide}
                    fill={true}
                    options={this.options()}
                    onChange={a => this.setImageSource(a.value)}
                    selected={this.imageSource} />
                <div className={classes.editor}>
                    {this.selectedEditor()}
                </div>
            </div>);
    }
}
