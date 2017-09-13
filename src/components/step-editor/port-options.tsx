import * as React from 'react';
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
const Text = require('react-icons/lib/fa/font');
const File = require('react-icons/lib/fa/file-text-o');
const Remove = require('react-icons/lib/fa/times-circle');
let injectSheet = require('@tiagoroldao/react-jss').default;

import { editorStyles } from '../../style';
import { Options } from '../options';
import { WorkflowStepSimple } from '../../models/workflow';
import { translate } from '../../../../../translation-service';
import { Creatable, Option, OptionValues } from 'react-select';

interface PortOptionsProps {
    step: WorkflowStepSimple;
    ide: boolean;
    classes?: any;
}

const jssStyles = (theme: any) => {
    return {
        selectInput: {
            composes: theme.ide ? 'text-color' : ''
        }
    };
};

@injectSheet(jssStyles)
@observer
export class PortOptions extends React.Component<PortOptionsProps, {}> {
    constructor(props: PortOptionsProps) {
        super(props);
    }

    private get ports() {
        return this.props.step.ports;
    }

    @action
    private add(ports: Option<OptionValues>) {
        if (ports) {
            let newPorts: string[] = [];
            for (let i = 0; i < ports.length; i++) {
                newPorts.push(ports[i].value as string);
            }
            this.props.step.ports = newPorts;
        }
    }

    @action
    private remove(port: string) {
        this.ports.splice(this.ports.indexOf(port), 1);
    }

    private log(event: React.KeyboardEvent<HTMLInputElement>) {
        console.log(event);
    }

    private breakPorts (portsString: string): string[] {
        let out: string[] = [];

        if (portsString.indexOf(':') === portsString.length - 1) {
            out = [portsString.substr(0, portsString.length - 1)];
        }
        else if (portsString.indexOf(':') > -1) {
            out = portsString.split(':');
        }
        else {
            out = [portsString];
        }

        return out;
    }

    private validPort = (arg: { label: string }): boolean => {
        if (!arg.label || !arg.label.length) {
            return false;
        }
        let portMappings = this.breakPorts(arg.label);

        if (portMappings.length > 2) {
            return false;
        }

        try {
            for (var i = 0; i < portMappings.length; i++) {
                if (parseInt(portMappings[i]).toString() !== portMappings[i]) {
                    return false;
                }
            }
        } catch (e) {
            return false;
        }
        
        return true;
    }

    private portCreateText = (label: string): string => {
        let ports = this.breakPorts(label),
            out = "Create port " + ports[0];

        if (ports.length == 2) {
            out += " mapped to external port " + ports[1];
        }
        
        return out;
    }

    public render() {
        let classes = this.props.classes || {};
        let portsArray: Option[] = [];

        this.ports.forEach(port => portsArray.push({ label: port, value: port }));

        return (<div>
            <Creatable
                className={`${editorStyles.normalSelect} native-key-bindings`}
                inputProps={{className: this.props.classes.selectInput}}
                isValidNewOption={this.validPort}
                multi={true}
                clearable={true}
                promptTextCreator={this.portCreateText}
                noResultsText={'Enter a valid port number ( format: internalPort[:externalPort] )'}
                value={portsArray} 
                onChange={p => this.add(p)} />
        </div>);
    }
}
