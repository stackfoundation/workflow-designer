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

interface MappedPort {
    protocol?: string,
    sourcePort?: string,
    targetPort?: string
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

    private breakPorts (portsString: string): MappedPort {
        let out: MappedPort = {};

        if (portsString.indexOf('/') > -1) {
            out.protocol = portsString.substr(0, portsString.indexOf('/'));
            portsString = portsString.substr(portsString.indexOf('/') + 1)
        }

        if (portsString.indexOf(':') === portsString.length - 1) {
            out.sourcePort = out.targetPort = portsString.substr(0, portsString.length - 1);
        }
        else if (portsString.indexOf(':') > -1) {
            let ports = portsString.split(':');
            out.sourcePort = ports[0];
            out.targetPort = ports[1];
        }
        else {
            out.sourcePort = out.targetPort = portsString;
        }

        return out;
    }

    private validPort = (arg: { label: string }): boolean => {
        if (!arg.label || !arg.label.length) {
            return false;
        }
        let portMappings = this.breakPorts(arg.label);

        if (!portMappings.sourcePort || !portMappings.sourcePort.length) {
            return false;
        }

        try {
            let ports = [portMappings.sourcePort, portMappings.targetPort],
                varRegex = /^\$\{[a-zA-Z]+\}$/;

            if (!varRegex.test(portMappings.protocol) && ['tcp', 'udp'].indexOf(portMappings.protocol) === -1) {
                return false;
            }
            for (var i = 0; i < ports.length; i++) {
                if (!varRegex.test(ports[i]) && parseInt(ports[i]).toString() !== ports[i]) {
                    return false;
                }
            }
        } catch (e) {
            return false;
        }
        
        return true;
    }

    private portCreateText = (label: string): string => {
        if (this.validPort({label})) {
            let ports = this.breakPorts(label);
            return translate('SELECT_TEXT_CREATE_PORT', [ports.protocol || '', ports.sourcePort, ports.targetPort]);
        }
        
        return translate('INSTRUCTION_PORTS');
    }
    
    shouldKeyDownEventCreateNewOption (arg: { keyCode: number }) {
        return arg.keyCode === 32 || arg.keyCode === 9 || arg.keyCode === 13 || arg.keyCode === 188;
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
                shouldKeyDownEventCreateNewOption={this.shouldKeyDownEventCreateNewOption}
                multi={true}
                clearable={true}
                placeholder={translate('PLACEHOLDER_PORTS')}
                promptTextCreator={this.portCreateText}
                noResultsText={translate('INSTRUCTION_PORTS')}
                value={portsArray} 
                onChange={p => this.add(p)} />
        </div>);
    }
}
