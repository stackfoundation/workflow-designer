import * as React from 'react';
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
const Text = require('react-icons/lib/fa/font');
const File = require('react-icons/lib/fa/file-text-o');
const Remove = require('react-icons/lib/fa/times-circle');

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
        if (ports.length) {
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

    public render() {
        let classes = this.props.classes || {};
        let portsArray: Option[] = [];

        this.ports.forEach(port => portsArray.push({ label: port, value: port }));

        return (<div>
            <Creatable
                className={editorStyles.normalSelect}
                multi={true}
                clearable={false}
                value={portsArray} 
                onChange={p => this.add(p)} />
        </div>);
    }
}
