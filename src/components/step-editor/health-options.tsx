import * as React from 'react';
let injectSheet = require('@tiagoroldao/react-jss').default;
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
const Text = require('react-icons/lib/fa/font');
const File = require('react-icons/lib/fa/file-text-o');
const Remove = require('react-icons/lib/fa/times-circle');

import { editorStyles } from '../../style';
import { Options } from '../options';
import { WorkflowStepSimple} from '../../models/workflow';
import { CenteredContent } from '../../util/centered-content'
import { translate } from '../../../../../translation-service';
import { Creatable, Option, OptionValues } from 'react-select';
import { HealthType, HealthTypes } from "../../../../workflow";

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
    healthNumberPropDiv: {
        composes: 'pure-u-1 pure-u-lg-1-2 block'
    },
    healthNumberPropFieldDiv: {
        composes: 'pure-u-1-6'
    },
    healthNumberPropField : {
        composes: 'pure-input-1 input-text native-key-bindings'
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

    private get health() {
        return this.props.step.health;
    }

    private get currentHealthCheckType() {
        if (this.props.step) {
            if (this.props.step.transient.healthCheckType) {
                return this.props.step.transient.healthCheckType;
            } else if (this.props.step.health && this.props.step.health.type) {
                return this.props.step.health.type;
            }
            
        }

        return 'script';
    }

    @action
    private setHealthCheckType(checkType: HealthType) {
        this.props.step.transient.healthCheckType = checkType;
    }

    private healthCheckTypes() {
        return HealthTypes.map(type => ({
            value: type,
            display: (<span>{translate('OPTION_' + type.toUpperCase())}</span>)
        }));
    }

    private scriptTypeEditor() {
        let classes = this.props.classes || {};
        return (<div className="pure-g">
            <label className={classes.smallLabelContainer}>
                <CenteredContent>
                    <span className={classes.label}>{translate('LABEL_SCRIPT')}</span>
                </CenteredContent>
            </label>
            <div className="pure-u-5-6">
                <input className="pure-input-1 input-text native-key-bindings"
                    
                    type="text"
                    value={this.health.script || ""}
                    onChange={e => this.setHealthCheckProperty(
                        () => this.health.script = e.target.value)} />
            </div>
        </div>);
    }

    private requestTypeEditor(checkType: HealthType) {
        let classes = this.props.classes || {};
        return (<div className="pure-g">
            <label className={classes.smallLabelContainer}>
                <CenteredContent>
                    <span className={classes.label}>{translate('LABEL_PORT')}</span>
                </CenteredContent>
            </label>
            <div className={checkType === "tcp" ? "pure-u-5-6" : "pure-u-1-3"}>
                <input className="pure-input-1 input-text native-key-bindings"
                    
                    type="text"
                    value={this.health.port || ""}
                    onChange={e => this.setHealthCheckProperty(
                        () => this.health.port = e.target.value)} />
            </div>
            {checkType !== "tcp" &&
                (<label className={classes.smallLabelContainer}>
                    <CenteredContent>
                        <span className={classes.label}>{translate('LABEL_PATH')}</span>
                    </CenteredContent>
                </label>)}
            {checkType !== "tcp" &&
                (<div className="pure-u-1-3">
                    <input className="pure-input-1 input-text native-key-bindings"
                    
                    type="text"
                    value={this.health.path}
                    onChange={e => this.setHealthCheckProperty(
                        () => this.health.path = e.target.value)} />
                </div>)}
        </div>);
    }

    private selectedEditor() {
        let classes = this.props.classes || {};
        let type = this.currentHealthCheckType;
        return (<div className="pure-u-1 block" >
            {type && (type === 'script' ? this.scriptTypeEditor() : this.requestTypeEditor(type))}
        </div >);
    }

    @action
    private setHealthCheckProperty(setter: () => void) {
        setter();
    }

    private healthCheckNumberProperty(property: string) {
        let classes = this.props.classes || {};

        let onNumberChange = (property: string, e: React.ChangeEvent<HTMLInputElement>) => {
            this.setHealthCheckProperty(() => {
                let value = parseInt(e.target.value);
                if (!isNaN(value)) {
                    let stringVal = value;
                    (this.health as any)[property] = value
                }
                
            })
        }

        return (<div className={classes.healthNumberPropDiv}>
            <div className="pure-g">
                <label className={classes.largeLabelContainer}>
                    <CenteredContent>
                        <span className={classes.label}>{translate('LABEL_' + property.toUpperCase())}</span>
                    </CenteredContent>
                </label>
                <div className={classes.healthNumberPropFieldDiv}>
                    <input
                        type="text"
                        className={classes.healthNumberPropField}
                        value={(this.health as any)[property] || ""}
                        onChange={e => this.setHealthCheckProperty(
                            () => (this.health as any)[property] = parseInt(e.target.value))} />
                </div>
            </div>
        </div>);
    }

    public render() {
        let classes = this.props.classes || {};
        return (<div className="pure-g">
            <div className="pure-u-1 block">
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
