import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
let injectSheet = require('react-jss').default;

import { WorkflowStepSimple, TransientState } from '../../models/workflow';
import { SourceOptions } from './source-options';
import { FailureOptions } from './failure-options';
import { EnvironmentOptions } from './environment-options';
import { VolumeOptions } from './volume-options';
import { PortOptions } from './port-options';
import { HealthOptions } from './health-options';
import { DropDownMenu } from '../drop-down-menu';
import { translate } from '../../../../../translation-service';

interface AdvancedOptionsProps {
    step: WorkflowStepSimple,
    ide: boolean,
    classes?: any
}

const styles = (theme: any) => ({
    advanced: {
        composes: 'pure-u-1',
        marginTop: '16px'
    },
    section: theme.ide ?
        {
            composes: 'inset-panel'
        } :
        {
            composes: 'pure-u-1',
            margin: '0',
            padding: '10px 0',
            borderTop: 'solid 1px #ddd'
        },
    title: theme.ide ?
        {
            composes: 'panel-heading'
        } :
        {
            fontWeight: '700',
            margin: '0 0 4px 0'
        },
    body: theme.ide ?
        { composes: 'panel-body' } :
        {},
    link: {
        color: '#4E73BD',
        fontWeight: '700',
        textDecoration: 'none',
        '&:hover': {
            color: '#34518b',
            textDecoration: 'none'
        },
        '&:visited': {
            textDecoration: 'none'
        }
    }
});

@injectSheet(styles)
@observer
export class AdvancedOptions extends React.Component<AdvancedOptionsProps, {}> {
    constructor(props: AdvancedOptionsProps) {
        super(props);

        if (!this.props.step.transient) {
            this.props.step.transient = new TransientState();
        }
    }

    private get healthConfigured() {
        if (this.props.step.transient.healthConfigured) {
            return true;
        }

        if (this.props.step.health) {
            for (let property in this.props.step.health) {
                if ((this.props.step.health as any)[property]) {
                    return true;
                }
            }
        }

        return false;
    }

    private get environmentConfigured() {
        if (this.props.step.transient.environmentConfigured) {
            return true;
        }

        return this.props.step.environment && this.props.step.environment.length > 0;
    }

    private get volumesConfigured() {
        if (this.props.step.transient.volumesConfigured) {
            return true;
        }

        return this.props.step.volumes && this.props.step.volumes.length > 0;
    }

    private get portsConfigured() {
        if (this.props.step.transient.portsConfigured) {
            return true;
        }

        return this.props.step.ports && this.props.step.ports.length > 0;
    }

    private get sourceOptions() {
        if (this.props.step.transient.sourceOptions) {
            return true;
        }

        return this.props.step.omitSource ||
            (this.props.step.sourceLocation && this.props.step.sourceLocation.length > 0 &&
                this.props.step.sourceLocation !== '/app');
    }

    private get failureOptions() {
        if (this.props.step.transient.failureOptions) {
            return true;
        }

        return this.props.step.ignoreFailure;
    }

    private section(title: string, body: JSX.Element) {
        const classes = this.props.classes || {};
        return (<div className={classes.section}>
            <div className={classes.title}>{title}</div>
            <div className={classes.body}>
                {body}
            </div>
        </div>)
    }

    @action
    private runAction(action: () => void) {
        action();
    }

    private button(label: string, handler: () => void) {
        return {
            display: <span>{label}</span>,
            onClick: () => this.runAction(handler)
        }
    }

    private get additionalAdvancedOptionsAvailable() {
        return !this.sourceOptions ||
            !this.failureOptions ||
            !this.environmentConfigured ||
            !this.volumesConfigured ||
            !this.portsConfigured;
    }

    public render() {
        let step = this.props.step;
        const classes = this.props.classes || {};
        let items = [];

        if (!this.healthConfigured) {
            items.push(this.button(translate('CONFIGURE_HEALTH'),
                () => this.props.step.transient.healthConfigured = true));
        }

        if (!this.environmentConfigured) {
            items.push(this.button(translate('CONFIGURE_ENVIRONMENT'),
                () => this.props.step.transient.environmentConfigured = true));
        }

        if (!this.portsConfigured) {
            items.push(this.button(translate('CONFIGURE_PORTS'),
                () => this.props.step.transient.portsConfigured = true));
        }

        if (!this.volumesConfigured) {
            items.push(this.button(translate('CONFIGURE_VOLUMES'),
                () => this.props.step.transient.volumesConfigured = true));
        }

        if (!this.sourceOptions) {
            items.push(this.button(translate('CONFIGURE_SOURCE'),
                () => this.props.step.transient.sourceOptions = true));
        }

        if (!this.failureOptions) {
            items.push(this.button(translate('CONFIGURE_FAILURE'),
                () => this.props.step.transient.failureOptions = true));
        }

        return (<div className={classes.advanced}>
            {this.healthConfigured &&
                this.section(translate('HELP_HEALTH'), <HealthOptions step={step} ide={this.props.ide} />)}
            {this.sourceOptions &&
                this.section(translate('HELP_SOURCE'), <SourceOptions step={step} />)}
            {this.failureOptions &&
                this.section(translate('HELP_FAILURE'), <FailureOptions step={step} />)}
            {this.environmentConfigured &&
                this.section(translate('HELP_ENVIRONMENT'), <EnvironmentOptions step={step} ide={this.props.ide} />)}
            {this.volumesConfigured &&
                this.section(translate('HELP_VOLUMES'), <VolumeOptions step={step} ide={this.props.ide} />)}
            {this.portsConfigured &&
                this.section(translate('HELP_PORTS'), <PortOptions step={step} ide={this.props.ide} />)}

            {this.additionalAdvancedOptionsAvailable &&
                <DropDownMenu
                    ide={this.props.ide}
                    label={translate('CONFIGURE')}
                    items={items} />}
        </div>);
    }
}
