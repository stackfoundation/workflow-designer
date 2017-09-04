import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
const Text = require('react-icons/lib/fa/font');
const File = require('react-icons/lib/fa/file-text-o');
const Remove = require('react-icons/lib/fa/times-circle');

import { Options } from '../options';
import { WorkflowStepSimple } from '../../models/workflow';
import { Volume } from '../../../../workflow';
import { translate } from '../../../../../translation-service';
import { VolumeEditor } from './volume-editor';

interface EnvironmentOptionsProps {
    step: WorkflowStepSimple;
    ide: boolean;
    classes?: any;
}

class EditorState {
    constructor(
        private step: WorkflowStepSimple,
        private volume: Volume,
        public committed: boolean) {
    }

    commitIfNecessary() {
        if (!this.committed) {
            if (!this.step.volumes) {
                this.step.volumes = [];
            }

            this.step.volumes.push(this.volume);
            this.committed = true;
        }
    }
}

class EditorVolume implements Volume {
    @observable mountPath?: string = '';
    @observable hostPath?: string = '';
}

@observer
export class VolumeOptions extends React.Component<EnvironmentOptionsProps, {}> {
    constructor(props: EnvironmentOptionsProps) {
        super(props);
    }

    private get volumes() {
        return this.props.step.volumes;
    }

    @action
    private remove(volume: Volume) {
        this.volumes.splice(this.volumes.indexOf(volume), 1);
    }

    private volumeEditor(volume: Volume, key: number, committed: boolean) {
        let state = new EditorState(this.props.step, volume, committed);
        let editor = (<VolumeEditor
            volume={volume}
            onChange={() => state.commitIfNecessary()} />);

        return (<div className="pure-g" key={key}>
            <div className="pure-u-11-12">{editor}</div>
            <div className="pure-u-1-12">
                {committed && <div onClick={_ => this.remove(volume)}><Remove /></div>}
            </div>
        </div>);
    }

    private sourceEditors() {
        let editors = [];

        if (this.volumes) {
            for (let i = 0; i <= this.volumes.length; i++) {
                let volume = undefined;
                let committed = false;

                if (i < this.volumes.length) {
                    volume = this.volumes[i];
                    committed = true;
                } else {
                    volume = new EditorVolume();
                }

                editors.push(this.volumeEditor(volume, i, committed));
            }
        } else {
            editors.push(this.volumeEditor(new EditorVolume(), 0, false));
        }

        return editors;
    }

    public render() {
        let classes = this.props.classes || {}
        return (<div>
            {this.sourceEditors()}
        </div>);
    }
}    