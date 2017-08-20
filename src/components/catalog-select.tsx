import * as React from 'react';
import * as select from 'react-select';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select'
import { VirtualizedOptionRenderOptions } from 'react-virtualized-select'

import { globalEditorStyles, themeColors } from '../style';
import { CenteredContent } from '../util/centered-content';

import { CatalogImage } from '../models/catalog';
import { EditorState } from '../models/state';
import { WorkflowStepSimple } from '../models/workflow';
import injectSheet from 'react-jss';

const jssStyles = theme => ({
    
    select: {
        composes: `${globalEditorStyles.largeSelect} ${globalEditorStyles.imageSelect} ${theme.ide ? 'button-background-color' : ''}`
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

interface CatalogSelectProps { 
    onChange: (value: CatalogImage) => void, 
    value: string, 
    catalog: CatalogImage[]
    classes?: any
}

@injectSheet(jssStyles)
@observer
export class CatalogSelect extends React.Component<CatalogSelectProps, {}> {
    constructor(props: CatalogSelectProps) {
        super(props);
    }

    private valueRenderer = (option: ImageOption) => {
        const classes = this.props.classes || {};

        return (
            <CenteredContent container={false}>
                <div className={classes.title}>{option.image.title}</div>
                <div className={classes.description}>{option.image.description}</div>
                <div className={classes.logo} style={
                    { backgroundImage: 'url(' + catalogBase + option.image.name + '.png)' }
                }>
                </div>
            </CenteredContent>
        );
    }

    private optionRenderer = (options: VirtualizedOptionRenderOptions<ImageOption>) => {
        let option = options.option;
        const classes = this.props.classes || {};

        return (
            <CenteredContent
                className={options.focusedOption == option ? `${classes.option} ${classes.selected}` : classes.option}
                key={options.key}
                onClick={() => options.selectValue(option)}
                onMouseOver={() => options.focusOption(option)}
                style={options.style}>
                <div className={classes.title}>{option.image.title}</div>
                <div className={classes.description}>{option.image.description}</div>
                <div className={classes.logo} style={
                    { backgroundImage: 'url(' + catalogBase + option.image.name + '.png)' }
                }>
                </div>
            </CenteredContent>
        );
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
        const classes = this.props.classes || {};

        return (
            <VirtualizedSelect
                className={classes.select}
                options={this.options}
                optionRenderer={this.optionRenderer}
                optionHeight={100}
                maxHeight={400}
                clearable={false}
                valueRenderer={this.valueRenderer}
                onChange={option => this.props.onChange((option as ImageOption).image)}
                value={this.selectedOption} />
        )
    }
}
