import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import { translate } from '../../util/translation-service';
import { EditorState } from '../../models/state';
import { ImageSource, WorkflowStepSimple, Workflow } from '../../models/workflow';
import { CatalogImageField } from './catalog-image-field';
import { ManualImageField } from './manual-image-field';
import { StepImageField } from './step-image-field';

import { globalEditorStyles, themeColors } from '../../style';
import { CatalogImage } from "../../models/catalog";

let injectSheet = require('react-jss').default;

const activeImageSource = {
    fontWeight: 'bold',
    color: themeColors.fadedGreen,
    borderBottom: 'solid 3px ' + themeColors.fadedGreen,
    background: 'none'
};

const activeSelectedImageSource = {
    fontWeight: 'bold',
    color: themeColors.darkerGreen,
    borderBottom: 'solid 3px ' + themeColors.darkerGreen,
    background: 'none'
};

const styles = (theme: any) => {
    if (theme.ide) {
        return {
            imageSource: {
                composes: 'btn'
            },
            selected: {
                composes: 'btn selected'
            }
        };
    }
    else {
        return {
            imageSource: {
                composes: 'pure-menu-link',
                color: '#aaa',
                fontWeight: 'bold',
                borderBottom: 'solid 3px transparent',
                ':hover': activeImageSource,
                ':focus': {
                    background: 'none',
                    color: '#aaa',
                    fontWeight: 'bold',
                }
            },
            selected: {
                composes: 'pure-menu-link',
                borderBottom: 'solid 3px ' + themeColors.darkerGreen,
                color: themeColors.darkerGreen,
                fontWeight: 'bold',
                ':hover': activeSelectedImageSource,
                ':focus': activeSelectedImageSource
            }
        };
    }
};

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

    private get source() {
        return this.props.step.imageSource;
    }

    private setImageSource(source: ImageSource) {
        this.props.step.imageSource = source;
    }

    private sourceClass(source: ImageSource) {
        let classes = this.props.classes || {};
        return this.source === source ? classes.selected : classes.imageSource;
    }

    private sourceOption(source: ImageSource) {
        return this.props.ide ?
            (<button className={this.sourceClass(source)} onClick={_ => this.setImageSource(source)}>
                {translate('SOURCE_' + source.toUpperCase())}
            </button>) :
            (<li className="pure-menu-item" onClick={_ => this.setImageSource(source)}>
                <a href="#" className={this.sourceClass(source)}>
                    {translate('SOURCE_' + source.toUpperCase())}
                </a>
            </li>);
    }

    private selectedEditor() {
        switch (this.source) {
            case 'step':
                return (<StepImageField step={this.props.step} workflow={this.props.workflow}></StepImageField>)
            case 'manual':
                return (<ManualImageField step={this.props.step}></ManualImageField>)
            default:
                return (<CatalogImageField catalog={this.props.catalog} step={this.props.step} workflow={this.props.workflow}></CatalogImageField>)
        }
    }

    public render() {
        return (
            <div>
                {this.props.ide ?
                    (<div className="block padded">
                        <div className="btn-group">
                            {this.sourceOption('catalog')}
                            {this.sourceOption('manual')}
                            {this.props.workflow.stepsBefore(this.props.step).length > 0 ? this.sourceOption('step') : null}
                        </div>
                    </div>) :
                    (<div className="pure-menu pure-menu-horizontal">
                        <ul className="pure-menu-list select-list">
                            {this.sourceOption('catalog')}
                            {this.sourceOption('manual')}
                            {this.props.workflow.stepsBefore(this.props.step).length > 0 ? this.sourceOption('step') : null}
                        </ul>
                    </div>)}
                {this.selectedEditor()}
            </div>);
    }
}
