import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

const InfoCircle = require('react-icons/lib/fa/info-circle');
import ReactTooltip from 'react-tooltip';

export interface TooltipProps {
    onClose?: () => void;
    message: string;
    className?: string;
}

@observer
export class InfoTooltip extends React.Component<TooltipProps, {}> {
    constructor(props: TooltipProps) {
        super(props);
    }
    
    componentDidUpdate () {
        ReactTooltip.rebuild();
    }
    
    componentDidMount () {
        ReactTooltip.rebuild();
    }

    public render() {
        return <span data-tip={this.props.message} data-for="workflowEditor" className={this.props.className || ''}>
            <InfoCircle />
        </span>
    }
}