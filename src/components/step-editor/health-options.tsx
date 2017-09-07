import * as React from 'react';
let injectSheet = require('@tiagoroldao/react-jss').default;
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
const Text = require('react-icons/lib/fa/font');
const File = require('react-icons/lib/fa/file-text-o');
const Remove = require('react-icons/lib/fa/times-circle');

import { editorStyles } from '../../style';
import { Options } from '../options';
import { WorkflowStepSimple, HealthCheckType, Health } from '../../models/workflow';
import { CenteredContent } from '../../util/centered-content'
import { translate } from '../../../../../translation-service';
import { Creatable, Option, OptionValues } from 'react-select';

interface HealthOptionsProps {
    step: WorkflowStepSimple;
    ide: boolean;
    classes?: any;
}

const styles = (theme: any) => ({
    labelContainer: {
        textAlign: 'right'
    },
    smallLabelContainer: {
        composes: '$labelContainer pure-u-1-6'
    },
    largeLabelContainer: {
        composes: '$labelContainer pure-u-5-6'
    },
    label: {
        paddingRight: '5px'
    }
});

@injectSheet(styles)
@observer
export class HealthOptions extends React.Component<HealthOptionsProps, {}> {
    constructor(props: HealthOptionsProps) {
        super(props);
    }
    
    componentWillMount () {
        this.setup(this.props);
    }

    componentWillReceiveProps (nextProps: HealthOptionsProps) {
        this.setup(nextProps);
    }

    private setup (props: HealthOptionsProps) {
        if (!props.step.health) {
            props.step.health = new Health();
        };
    }

    private get health() {
        return this.props.step.health;
    }

    private get currentHealthCheckType() {
        if (this.props.step) {
            if (this.props.step.transient.healthCheckType) {
                return this.props.step.transient.healthCheckType;
            } else if (this.props.step.health) {
                if (this.props.step.health.tcp) {
                    return 'tcp';
                } else if (this.props.step.health.http) {
                    return 'http';
                }
            }
        }

        return 'script';
    }

    @action
    private setHealthCheckType(checkType: HealthCheckType) {
        this.props.step.transient.healthCheckType = checkType;
    }

    private healthCheckType(checkType: HealthCheckType) {
        return {
            value: checkType,
            display: (<span>{translate('OPTION_' + checkType.toUpperCase())}</span>)
        };
    }

    private healthCheckTypes() {
        return [
            this.healthCheckType('script'),
            this.healthCheckType('tcp'),
            this.healthCheckType('http')
        ]
    }

    private typeSpecificEditor(checkType: HealthCheckType) {
        let classes = this.props.classes || {};
        return (<div className="pure-g">
            <label className={classes.smallLabelContainer}>
                <CenteredContent>
                    <span className={classes.label}>{translate('LABEL_' + checkType.toUpperCase())}</span>
                </CenteredContent>
            </label>
            <input className="pure-u-5-6"
                type="text"
                value={(this.health as any)[checkType]}
                onChange={e => this.setHealthCheckProperty(
                    () => (this.health as any)[checkType] = e.target.value)} />
        </div>);
    }

    private selectedEditor() {
        let classes = this.props.classes || {};
        return (<div className="pure-u-1" >
            {this.currentHealthCheckType === 'script' && this.typeSpecificEditor('script')}
            {this.currentHealthCheckType === 'tcp' && this.typeSpecificEditor('tcp')}
            {this.currentHealthCheckType === 'http' && this.typeSpecificEditor('http')}
        </div >);
    }

    @action
    private setHealthCheckProperty(setter: () => void) {
        setter();
    }

    private healthCheckNumberProperty(property: string) {
        let classes = this.props.classes || {};
        return (<div className="pure-u-1-2">
            <div className="pure-g">
                <label className={classes.largeLabelContainer}>
                    <CenteredContent>
                        <span className={classes.label}>{translate('LABEL_' + property.toUpperCase())}</span>
                    </CenteredContent>
                </label>
                <input className="pure-u-1-6"
                    type="text"
                    value={(this.health as any)[property]}
                    onChange={e => this.setHealthCheckProperty(
                        () => (this.health as any)[property] = parseInt(e.target.value))} />
            </div>
        </div>);
    }

    public render() {
        let classes = this.props.classes || {};
        return (<div className="pure-g">
            <div className="pure-u-1">
                <Options
                    ide={this.props.ide}
                    options={this.healthCheckTypes()}
                    onChange={a => this.setHealthCheckType(a.value)}
                    selected={this.currentHealthCheckType} />
            </div>
            {this.selectedEditor()}
            {this.healthCheckNumberProperty('interval')}
            {this.healthCheckNumberProperty('retries')}
            {this.healthCheckNumberProperty('timeout')}
            {this.healthCheckNumberProperty('grace')}
        </div>);
    }
}
