import * as React from 'react';

import { StyleSheet, classes } from '../style';

const stylesheet = StyleSheet.create({
    container: {
        ':before': {
            content: "''",
            display: 'inline-block',
            height: '100%',
            verticalAlign: 'middle',
            marginRight: '-0.25em'
        }
    },
    content: {
        display: 'inline-block',
        verticalAlign: 'middle'
    }
});

export interface ContentProperties extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    container?: boolean;
}

export class CenteredContent extends React.Component<ContentProperties, {}> {
    constructor(props: ContentProperties) {
        super(props);
    }

    public render() {
        let { container, className, ...other } = this.props;
        if (container !== false) {
            const containerClasses = classes(stylesheet.container);
            return (
                <div className={className ? className + ' ' + containerClasses : containerClasses} {...other}>
                    <div className={classes(stylesheet.content)}>
                        {this.props.children}
                    </div>
                </div>)
        } else {
            const contentClasses = classes(stylesheet.content);
            return (<div className={className ? className + ' ' + contentClasses : contentClasses} {...other}>
                {this.props.children}
            </div>)
        }
    }
}
