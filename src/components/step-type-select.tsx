import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { VirtualizedOptionRenderOptions } from 'react-virtualized-select'

import { translate } from '../util/translation-service';
import { StyleSheet, globalEditorStyles, classes, themeColors } from '../style';
import { CenteredContent } from '../util/centered-content';

import { WorkflowTypes } from '../models/workflow';

const stylesheet = StyleSheet.create({
    title: {
        padding: 0,
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '24px'
    },
    description: {
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
    },
    selected: {
        border: 'solid 3px ' + themeColors.darkerGreen,
        color: themeColors.darkerGreen,
    }
});

const styles = {
    select: {
        ide: 'button-background-color',
        all: [globalEditorStyles.largeSelect]
    },
    title: {
        ide: 'text-color',
        all: stylesheet.title
    },
    description: {
        ide: 'text-color',
        all: stylesheet.description
    }
}

const typeOptions = WorkflowTypes.map(type => ({ value: type }));

function valueRenderer(option: Option) {
    return (
        <CenteredContent container={false}>
            <div className={classes(styles.title)}>
                {translate('NAME_' + (option.value as string).toUpperCase())}
                </div>
            <div className={classes(styles.description)}>
                {translate('DESCRIPTION_' + (option.value as string).toUpperCase())}
                </div>
        </CenteredContent>
    );
}

function optionRenderer(options: VirtualizedOptionRenderOptions<Option>) {
    let option = options.option;
    return (
        <CenteredContent
            className={options.focusedOption == option ?
                classes([stylesheet.option, stylesheet.selected]) : classes(stylesheet.option)}
            key={options.key}
            onClick={() => options.selectValue(option)}
            onMouseOver={() => options.focusOption(option)}
            style={options.style}>
            <div className={classes(styles.title)}>
                {translate('NAME_' + (option.value as string).toUpperCase())}
                </div>
            <div className={classes(styles.description)}>
                {translate('DESCRIPTION_' + (option.value as string).toUpperCase())}
                </div>
        </CenteredContent>
    );
}

export class StepTypeSelect extends React.Component<{ type: string, onChange: (value: string) => void }, {}> {
    constructor(props: { type: string, onChange: (value: string) => void }) {
        super(props);
    }

    public render() {
        return (
            <VirtualizedSelect
                className={classes(styles.select)}
                clearable={false}
                options={typeOptions}
                optionRenderer={optionRenderer}
                optionHeight={100}
                maxHeight={400}
                valueRenderer={valueRenderer}
                onChange={option => this.props.onChange((option as Option).value as string)}
                value={this.props.type} />
        )
    }
}
