import * as React from 'react';
import { Option } from 'react-select';
import VirtualizedSelect from 'react-virtualized-select'
import { VirtualizedOptionRenderOptions } from 'react-virtualized-select'

import { translate } from '../util/translation-service';
import { globalEditorStyles, themeColors } from '../style';
import { CenteredContent } from '../util/centered-content';

import { WorkflowTypes } from '../models/workflow';

import injectSheet from 'react-jss';

const styles = theme => ({
    select: {
        composes: `${globalEditorStyles.largeSelect} ${theme.ide ? 'button-background-color': ''}`,
    },
    title: {
        composes: theme.ide ? 'text-color': '',
        padding: 0,
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '24px'
    },
    description: {
        composes: theme.ide ? 'text-color': '',
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

const typeOptions = WorkflowTypes.map(type => ({ value: type }));

interface StepTypeSelectProps {
    type: string;
    onChange: (value: string) => void;
    classes?: any
}

@injectSheet(styles)
export class StepTypeSelect extends React.Component<StepTypeSelectProps, {}> {
    constructor(props: StepTypeSelectProps) {
        super(props);
    }

    private valueRenderer = (option: Option) => {
        let classes = this.props.classes || {};

        return (
            <CenteredContent container={false}>
                <div className={classes.title}>
                    {translate('NAME_' + (option.value as string).toUpperCase())}
                    </div>
                <div className={classes.description}>
                    {translate('DESCRIPTION_' + (option.value as string).toUpperCase())}
                    </div>
            </CenteredContent>
        );
    }

    private optionRenderer = (options: VirtualizedOptionRenderOptions<Option>) => {
        let option = options.option,
            classes = this.props.classes || {};
        return (
            <CenteredContent
                className={`${classes.option} ${options.focusedOption == option ? classes.selected : ''}`}
                key={options.key}
                onClick={() => options.selectValue(option)}
                onMouseOver={() => options.focusOption(option)}
                style={options.style}>
                <div className={classes.title}>
                    {translate('NAME_' + (option.value as string).toUpperCase())}
                    </div>
                <div className={classes.description}>
                    {translate('DESCRIPTION_' + (option.value as string).toUpperCase())}
                    </div>
            </CenteredContent>
        );
    }

    public render() {
        let classes = this.props.classes || {};

        return (
            <VirtualizedSelect
                className={classes.select}
                clearable={false}
                options={typeOptions}
                optionRenderer={this.optionRenderer}
                optionHeight={100}
                maxHeight={400}
                valueRenderer={this.valueRenderer}
                onChange={option => this.props.onChange((option as Option).value as string)}
                value={this.props.type} />
        )
    }
}
