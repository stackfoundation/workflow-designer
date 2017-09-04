import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('react-jss').default;

import { translate } from '../../../../../translation-service';
import { editorStyles } from '../../style';
import { CatalogImage } from '../../models/catalog';
import { WorkflowStepSimple, Workflow } from '../../models/workflow';
import { CatalogSelect } from './catalog-select';
import { CenteredContent } from '../../util/centered-content';

const jssStyles = (theme: any) => ({
    editor: {
        composes: 'pure-u-g'
    },
    title: {
        composes: theme.ide ? 'text-color' : '',
        padding: 0,
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '24px'
    }
});

@injectSheet(jssStyles)
@observer
export class CatalogImageField extends React.Component<{ catalog: CatalogImage[], workflow: Workflow, step: WorkflowStepSimple, classes?: any }, {}> {
    constructor(props: { catalog: CatalogImage[], workflow: Workflow, step: WorkflowStepSimple, classes?: any }) {
        super(props);
    }

    @computed
    private get tags() {
        let currentStep = this.props.step as WorkflowStepSimple;

        if (currentStep && currentStep.image && this.props.catalog) {
            let image = this.props.catalog.find(image => image.name === currentStep.image);
            if (image) {
                return image.tags.map(tag => ({ label: tag, value: tag }));
            }
        }

        return [];
    }

    private get tag() {
        if (this.props.step && (this.props.step as WorkflowStepSimple).tag) {
            return (this.props.step as WorkflowStepSimple).tag;
        }

        return '';
    }

    @action
    private onImageChange = (image: CatalogImage) => {
        this.props.step.image = image.name;
    }

    @action
    private onTagChange = (tag: string) => {
        (this.props.step as WorkflowStepSimple).tag = tag;
    }

    private valueRenderer = (option: Option) => {
        return (
            <CenteredContent container={false}>
                <div className={this.props.classes.title}>{option.value}</div>
            </CenteredContent>
        );
    }

    private placeholder() {
        return (<CenteredContent>
            {translate('PLACEHOLDER_VERSION')}
        </CenteredContent>);
    }

    public render() {
        let classes = this.props.classes || {};
        return (
            <div className={classes.editor}>
                <div className="pure-u-3-4">
                    <CatalogSelect
                        catalog={this.props.catalog}
                        value={this.props.step.image}
                        onChange={this.onImageChange}>
                    </CatalogSelect>
                </div>
                <div className="pure-u-1-4">
                    <VirtualizedSelect
                        className={editorStyles.largeSelect}
                        clearable={false}
                        valueRenderer={this.valueRenderer}
                        searchable={false}
                        options={this.tags}
                        optionHeight={40}
                        placeholder={this.placeholder()}
                        maxHeight={400}
                        onChange={option => this.onTagChange((option as Option).value as string)}
                        value={this.tag} />
                </div>
            </div>);
    }
}
