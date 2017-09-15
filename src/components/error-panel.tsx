import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('@tiagoroldao/react-jss').default;

import { editorStyles, themeColors, errorStyles } from '../style';
import { translate } from '../../../../translation-service';
const CloseIcon = require('react-icons/lib/go/x');

const styles = (theme: any) => {
    return errorStyles(theme);
};

export interface ErrorPanelProps {
    onClose?: () => void;
    message: string;
    classes?: any;
}

@injectSheet(styles)
@observer
export class ErrorPanel extends React.Component<ErrorPanelProps, {}> {
    constructor(props: ErrorPanelProps) {
        super(props);
    }

    public render() {
        let classes = this.props.classes;

        return <div className="block">
            <div className={classes.errorPanel}>
                {this.props.message}
                <div onClick={() => this.props.onClose && this.props.onClose()} className={classes.errorPanelClose}><CloseIcon/></div>
            </div>
        </div>
    }
}