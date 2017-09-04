import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('react-jss').default;

import { editorStyles, themeColors } from '../style';

const hoverItem = {
    color: '#000',
    background: 'none',
    fontWeight: '700'
};

const hoverLabel = {
    color: '#000',
    background: 'none'
};

const styles = (theme: any) => {
    if (theme.ide) {
        return {
            container: {
                composes: 'block padded'
            },
            menu: {
                composes: 'btn-group'
            },
            button: {
                composes: 'btn'
            }
        };
    }
    else {
        return {
            container: {
                composes: 'pure-menu pure-menu-horizontal',
                display: 'inline-block',
                width: 'auto'
            },
            menuLabelContainer: {
                composes: 'pure-menu pure-menu-horizontal'
            },
            menuLabel: {
                composes: 'pure-menu-item pure-menu-has-children pure-menu-allow-hover',
                background: 'none',
                color: '#aaa',
                fontWeight: 'bold',
                '&:hover': hoverLabel,
                '&:focus': hoverLabel
            },
            labelLink: {
                color: '#444',
                textDecoration: 'none',
                '&:hover': hoverLabel,
                '&:focus': hoverLabel
            },
            menuContainer: {
                composes: 'pure-menu-children',
                padding: '5px',
                border: 'solid 1px #ccc',
                borderLeft: 'solid 10px #ccc',
                minWidth: '230px'
            },
            item: {
                composes: 'pure-menu-link',
                color: '#444',
                padding: '10px 15px',
                fontWeight: '500',
                borderBottom: 'solid 3px transparent',
                '&:hover': hoverItem,
                '&:focus': {
                    background: 'none',
                    color: '#444',
                    fontWeight: '700'
                }
            }
        };
    }
};

export interface Item {
    display: JSX.Element;
    onClick?: () => void;
}

export interface DropDownMenuProps {
    ide: boolean;
    label: string;
    items: Item[];
    classes?: any;
}

@injectSheet(styles)
@observer
export class DropDownMenu extends React.Component<DropDownMenuProps, {}> {
    constructor(props: DropDownMenuProps) {
        super(props);
    }

    private handleClick(e: React.MouseEvent<any>, item: Item) {
        if (item.onClick) {
            item.onClick();
        }

        e.preventDefault();
    }

    private item(item: Item, key: number) {
        let classes = this.props.classes || {};
        return this.props.ide ?
            (<button key={key} className={classes.item} onClick={e => this.handleClick(e, item)}>
                {item.display}
            </button>) :
            (<li key={key} className="pure-menu-item" onClick={e => this.handleClick(e, item)}>
                <a href="#" className={classes.item}>
                    {item.display}
                </a>
            </li>);
    }

    public render() {
        let classes = this.props.classes || {};
        return this.props.ide ?
            (<div className={classes.container}>
                <div className={classes.menuContainer}>
                    {this.props.items && this.props.items.map((b, i) => this.item(b, i))}
                </div>
            </div>) :
            (<ul className={classes.menuLabelContainer}>
                <li className={classes.menuLabel}>
                    <a href="#" className={classes.labelLink}>{this.props.label} <span className="Select-arrow"></span></a>
                    <ul className={classes.menuContainer}>
                        {this.props.items && this.props.items.map((b, i) => this.item(b, i))}
                    </ul>
                </li>
            </ul>);
    }
}