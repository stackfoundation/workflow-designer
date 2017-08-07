import * as React from 'react';
import * as select from 'react-select';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select'
import { VirtualizedOptionRenderOptions } from 'react-virtualized-select'

import { globalEditorStyles, StyleSheet, classes, themeColors } from '../style';
import { CenteredContent } from '../util/centered-content';

import { CatalogImage } from '../models/catalog';
import { EditorState } from '../models/state';
import { WorkflowStepSimple } from '../models/workflow';

const stylesheet = StyleSheet.create({
    title: {
        padding: 0,
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '24px'
    },
    description: {
        padding: '0 20px 0 0',
        margin: 0,
        fontSize: '14px',
        lineHeight: '16px'
    },
    logo: {
        position: 'absolute',
        top: '10px',
        bottom: '10px',
        left: '20px',
        width: '120px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%'
    },
    option: {
        cursor: 'pointer',
        paddingLeft: '160px',
        border: 'solid 3px transparent',
        margin: 0
    },
    selected: {
        border: 'solid 3px ' + themeColors.darkerGreen,
        color: themeColors.darkerGreen,
    }
});

const styles = {
    select: {
        ide: 'button-background-color',
        all: [globalEditorStyles.largeSelect, globalEditorStyles.imageSelect]
    },
    title: {
        ide: 'text-color',
        all: stylesheet.title
    },
    description: {
        ide: 'text-color',
        all: stylesheet.description
    },
    logo: stylesheet.logo,
    option: stylesheet.option,
    selected: stylesheet.selected
};

const catalogBase = 'https://s3-eu-west-1.amazonaws.com/dev.stack.foundation/catalog/';

class ImageOption implements select.Option {
    label?: string;
    value?: string | number | boolean;
    clearableValue?: boolean;
    disabled?: boolean;
    image: CatalogImage;

    constructor(option: Partial<ImageOption>) {
        Object.assign(this, option);
    }
}

function valueRenderer(option: ImageOption) {
    return (
        <CenteredContent container={false}>
            <div className={classes(styles.title)}>{option.image.title}</div>
            <div className={classes(styles.description)}>{option.image.description}</div>
            <div className={classes(styles.logo)} style={
                { backgroundImage: 'url(' + catalogBase + option.image.name + '.png)' }
            }>
            </div>
        </CenteredContent>
    );
}

function optionRenderer(options: VirtualizedOptionRenderOptions<ImageOption>) {
    let option = options.option;
    return (
        <CenteredContent
            className={options.focusedOption == option ? classes([styles.option, styles.selected]) : classes(styles.option)}
            key={options.key}
            onClick={() => options.selectValue(option)}
            onMouseOver={() => options.focusOption(option)}
            style={options.style}>
            <div className={classes(styles.title)}>{option.image.title}</div>
            <div className={classes(styles.description)}>{option.image.description}</div>
            <div className={classes(styles.logo)} style={
                { backgroundImage: 'url(' + catalogBase + option.image.name + '.png)' }
            }>
            </div>
        </CenteredContent>
    );
}

@observer
export class CatalogSelect extends React.Component<{ onChange: (value: CatalogImage) => void, value: string, catalog: CatalogImage[] }, {}> {
    constructor(props: { value: string, onChange: (value: CatalogImage) => void, catalog: CatalogImage[] }) {
        super(props);
    }

    @computed private get options() {
        return this.props.catalog ?
            this.props.catalog
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(image => new ImageOption({ image: image, value: image.name })) :
            [];
    }

    @computed private get selectedOption() {
        return this.options.find(el => el.image.name === this.props.value);
    }

    public render() {
        return (
            <VirtualizedSelect
                className={classes(styles.select)}
                options={this.options}
                optionRenderer={optionRenderer}
                optionHeight={100}
                maxHeight={400}
                clearable={false}
                valueRenderer={valueRenderer}
                onChange={option => this.props.onChange((option as ImageOption).image)}
                value={this.selectedOption} />
        )
    }
}
