import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

import { editorStyles, themeColors } from '../style';

const activeOption = {
    fontWeight: 'bold',
    color: themeColors.fadedGreen,
    borderBottom: 'solid 3px ' + themeColors.fadedGreen,
    background: 'none'
};

const activeSelectedOption = {
    fontWeight: 'bold',
    color: themeColors.darkerGreen,
    borderBottom: 'solid 3px ' + themeColors.darkerGreen,
    background: 'none'
};

const styles = (theme: any) => {
    if (theme.ide) {
        return {
            optionsList: {
                composes: 'btn-group'
            },
            option: {
                composes: 'btn'
            },
            selected: {
                composes: 'btn selected'
            }
        };
    }
    else {
        return {
            optionsList: {
                composes: 'pure-menu-list select-list',
                margin: '3px 0 0 0'
            },
            option: {
                composes: 'pure-menu-link',
                color: '#aaa',
                fontWeight: 'bold',
                borderBottom: 'solid 3px transparent',
                '&:hover': activeOption,
                '&:focus': {
                    background: 'none',
                    color: '#aaa',
                    fontWeight: 'bold'
                }
            },
            selected: {
                composes: 'pure-menu-link',
                borderBottom: 'solid 3px ' + themeColors.darkerGreen,
                color: themeColors.darkerGreen,
                fontWeight: 'bold',
                '&:hover': activeSelectedOption,
                '&:focus': activeSelectedOption
            }
        };
    }
};

export interface Option {
    display: JSX.Element;
    value: any;
}

export interface OptionsProps {
    ide: boolean;
    options: Option[];
    selected?: any;
    onChange?: (option: Option) => void;
    classes?: any;
}

@injectSheet(styles)
@observer
export class Options extends React.Component<OptionsProps, {}> {
    constructor(props: OptionsProps) {
        super(props);
    }

    private optionClass(option: Option) {
        let classes = this.props.classes || {};
        return this.props.selected === option.value ? classes.selected : classes.option;
    }

    private setSelected(e: React.MouseEvent<any>, option: Option) {
        if (this.props.onChange) {
            this.props.onChange(option);
        }

        e.preventDefault();
    }

    private option(option: Option, key: number) {
        return this.props.ide ?
            (<button key={key} className={this.optionClass(option)} onClick={e => this.setSelected(e, option)}>
                {option.display}
            </button>) :
            (<li key={key} className="pure-menu-item" onClick={e => this.setSelected(e, option)}>
                <a href="#" className={this.optionClass(option)}>
                    {option.display}
                </a>
            </li>);
    }

    public render() {
        let classes = this.props.classes || {};
        return this.props.ide ?
            (<div className="block padded">
                <div className={classes.optionsList}>
                    {this.props.options && this.props.options.map((o, i) => this.option(o, i))}
                </div>
            </div>) :
            (<div className="pure-menu pure-menu-horizontal">
                <ul className={classes.optionsList}>
                    {this.props.options && this.props.options.map((o, i) => this.option(o, i))}
                </ul>
            </div>);
    }
}