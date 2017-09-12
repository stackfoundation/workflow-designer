import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

import { translate } from '../../../../../translation-service';
import { editorStyles, mediaQueries } from '../../style';
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
    },
    catalogSelectDiv: {
        composes: 'pure-u-1 pure-u-lg-3-4'
    },
    catalogSelect: {
        composes: editorStyles.largeSelect,
        [mediaQueries.lg]: {
            '& .Select-control': {
                'border-right': 'none',
                'border-top-right-radius': '0',
                'border-bottom-right-radius': '0',
            }
        }
    },
    tagSelectDiv: {
        composes: 'pure-u-1 pure-u-lg-1-4'
    },
    tagSelect: {
        composes: editorStyles.largeSelect + ' VirtualizedSelect',
        '& > .Select-control': {
            height: '40px',
            textAlign: 'center'
        },

        [mediaQueries.lg]: {
            '& > .Select-control': {
                height: '100px',
                textAlign: 'inherit',
                'border-top-left-radius': '0',
                'border-bottom-left-radius': '0',
            }
        }
    }
});

function extractImage(image: string) {
    let tagSeparator = image.lastIndexOf(':');
    if (tagSeparator > 0) {
        return image.substring(0, tagSeparator);
    }

    return image;
}


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
            let currentImage = extractImage(currentStep.image);
            let image = this.props.catalog.find(image => image.name === currentImage);
            if (image) {
                return image.tags.map(tag => ({ label: tag, value: tag }));
            }
        }

        return [];
    }

    private get image() {
        if (this.props.step && (this.props.step as WorkflowStepSimple).image) {
            let image = (this.props.step as WorkflowStepSimple).image;
            return extractImage(image);
        }

        return '';
    }

    private get tag() {
        if (this.props.step && (this.props.step as WorkflowStepSimple).image) {
            let image = (this.props.step as WorkflowStepSimple).image;
            let tag = 'latest';

            let tagSeparator = image.lastIndexOf(':');
            if (tagSeparator > 0) {
                tag = image.substring(tagSeparator + 1);
            }

            return tag;
        }

        return '';
    }

    @action
    private onImageChange = (image: CatalogImage) => {
        this.props.step.image = image.name;
    }

    @action
    private onTagChange = (tag: string) => {
        let image = (this.props.step as WorkflowStepSimple).image;

        if (image) {
            image = extractImage(image);
            
            if (!tag || tag === '') {
                tag = 'latest';
            }

            (this.props.step as WorkflowStepSimple).image = image + ':' + tag;
        }
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
                <div className={classes.catalogSelectDiv}>
                    <CatalogSelect
                        className={classes.catalogSelect}
                        catalog={this.props.catalog}
                        value={this.image}
                        onChange={this.onImageChange}>
                    </CatalogSelect>
                </div>
                <div className={classes.tagSelectDiv}>
                    <VirtualizedSelect
                        className={classes.tagSelect}
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
