import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

const InfoCircle = require('react-icons/lib/fa/info-circle');
const ReactTooltip = require('react-tooltip');
let injectSheet = require('@tiagoroldao/react-jss').default;

export interface TooltipProps {
    onClose?: () => void;
    message: string;
    className?: string;
    classes?: any;
}
const styles = (theme: any) => ({
    solid: {
        composes: 'tooltip',
        pointerEvents: 'auto !important',
        '&:hover': {
            visibility: 'visible !important',
            opacity: '1 !important'
        }
    },
});

@injectSheet(styles)
@observer
export class InfoTooltip extends React.Component<TooltipProps, {}> {
    constructor(props: TooltipProps) {
        super(props);
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    public render() {
        let classes = this.props.classes || {};
        return <span
            data-tip={this.props.message}
            data-for="workflowEditor"
            data-delay-hide={1000}
            data-effect={'solid'}
            data-class={classes.solid}
            className={this.props.className || ''}>
            <InfoCircle />
        </span>
    }
}