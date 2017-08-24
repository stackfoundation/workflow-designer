import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Dragula from 'dragula';
import * as classNames from 'classnames';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
const Plus = require('react-icons/lib/go/plus');

import { themeColors } from '../style';

let injectSheet = require('react-jss').default;

import { Workflow, WorkflowStep, WorkflowStepCompound, WorkflowStepSimple } from '../models/workflow';
import { EditorState } from '../models/state';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "atom-panel": any
        }
    }
}

const stepListClass = 'step-list';

const styles = (theme: any) => {

    let ide = {
        step: {
            composes: 'list-item step'
        },
        selected: {
            composes: 'selected'
        }
    }
    
    let web = {
        step: {
            composes: 'step',
            listStyle: 'none',
            lineHeight: '2em',
            fontSize: '16px',
            color: '#000',
            fontWeight: 'normal',
            cursor: 'pointer'
        },
        selected: {
            fontWeight: 'bold',
            color: themeColors.darkerGreen
        },
    }

    return {
        stepList: {
            composes: `${stepListClass} ${theme.ide ? 'list-tree' : ''}`
        },
        subList: {
            composes: theme.ide ? 'list-nested-item' : ''
        },
        step: theme.ide ? ide.step : web.step,
        selected: theme.ide ? ide.selected : web.selected,
        deleteStep: {
            display: 'block',
            position: 'relative',

            '& > div' : {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            
            '&.deleting': {
                color: 'red'
            }
        },
        stepPrefix: {
            fontWeight: 'bold'
        },
        hidden: {
            display: 'none'
        }
    }
};

@injectSheet(styles)
@observer
export class StepList extends React.Component<{ state: EditorState, classes?:any }, {}> {
    private drake: Dragula.Drake;
    public state = {
        dragging: false,
        deleting: false
    };
    private deleteDiv: HTMLElement;

    constructor(props: { state: EditorState, classes?:any }) {
        super(props);
    }

    private get currentStep() {
        return this.props.state.currentStep;
    }

    private get workflow() {
        return this.props.state.workflow;
    }

    private addStep = () => {
        this.props.state.workflow.addStep();
    }

    private selectStep(step: WorkflowStep, event: React.MouseEvent<HTMLLIElement>) {
        this.props.state.selectStep(step);
        event.stopPropagation();
    }

    private stepPrefix(parentList: WorkflowStep[], index: number): string {
        if (index === 0) {
            return '';
        }
        else if (parentList[index - 1].type === "simple") {
            let step = parentList[index - 1] as WorkflowStepSimple;
            
            if (step.runType === 'sequential') {
                return 'Then';
            }
            else if (step.runType === 'parallel') {
                return 'And';
            }
            else if (step.runType === 'service') {
                return 'After ready';
            }
        }
        else if (parentList[index - 1].getType() === WorkflowStepCompound.name) {
            let compoundStep = parentList[index - 1] as WorkflowStepCompound;
            if (compoundStep.steps.length > 0) {
                return this.stepPrefix(compoundStep.steps, compoundStep.steps.length);
            }
            else {
                return this.stepPrefix(parentList, index - 1);
            }
        }

        return '';
    }

    private onDragEnd = (el: Element) => {
        this.setState({dragging: false, deleting: false});
    }

    private onDrop = (el: Element, target: Element, source: Element, sibling: Element) => {
        let deleting = this.state.deleting;
        this.drake.cancel(true);

        if (deleting) {
            this.props.state.deleteStep((el as any).relatedStep);
        }
        else {
            let siblingStep: WorkflowStep = sibling && (sibling as any).relatedStep,
                parentStep: WorkflowStepCompound | Workflow = (target as any).parentStep;

            
            let targetIndex = siblingStep ? this.props.state.workflow.findStep(siblingStep, parentStep).index : parentStep.steps.length
            this.props.state.workflow.moveStep(
                (el as any).relatedStep,
                targetIndex, 
                parentStep);
        }
    }

    private onDrag = (el: Element, source: Element) => {
        if (source.classList.contains(stepListClass)) {
            this.setState({dragging: true});
        }
    }

    componentDidMount() {
        let container = ReactDOM.findDOMNode(this);
        let list = container.querySelectorAll('.' + stepListClass);
        this.drake = Dragula(Array.prototype.slice.call(list), {
            mirrorContainer: container,
            accepts: (el: Element, target: Element, source: Element, sibling: Element) => {
                if (target === this.deleteDiv) {
                    this.setState({deleting: true});
                    return false;
                }
                else {
                    this.setState({deleting: false});
                }

                let parent = target.parentElement;
                while (parent !== null) {
                    if (parent === el) {
                        return false;
                    }
                    parent = parent.parentElement;
                }

                return true;
            },
            isContainer: (el: Element) => {
                return el.classList.contains(stepListClass);
            }
        });

        this.drake.on('drag', this.onDrag);
        this.drake.on('dragend', this.onDragEnd);
        this.drake.on('drop', this.onDrop);

        this.props.state.selectInitialStep();
    }

    componentWillUnmount() {
        this.drake.destroy();
    }

    private stepClasses(step: WorkflowStep) {
        let classes = this.props.classes || {};
        try {
            return classes.step +
                (this.currentStep === step ? ' ' + classes.selected : '') +
                (step.getType() == WorkflowStepCompound.name ? ' ' + classes.subList : '');
        }
        catch(e) {
            throw(e);   
        }
    }

    private stepTitle(parentList: WorkflowStep[], step: WorkflowStep, key: number) {
        let classes = this.props.classes || {};
        return (
            <span>
                <span className={classes.stepPrefix}>{this.stepPrefix(parentList, key)}</span>
                &nbsp;{step.name}
            </span>);
    }

    setStep = (el: HTMLLIElement, parent: any, step: any) => {
        if (el) {
            if (parent) {}
            (el as any).relatedStep = step;
        }
    }

    private subSteps(parent: WorkflowStep | Workflow): JSX.Element {
        let classes = this.props.classes || {};

        if (parent instanceof WorkflowStepCompound || parent instanceof Workflow) {
            return (
                <ul className={classes.stepList} ref={el => el && ((el as any).parentStep = parent)}>
                    {parent.steps.map((step, i) => (
                        <li 
                            className={this.stepClasses(step)} 
                            key={step.name} 
                            ref={el => this.setStep(el, parent, step)}
                            onClick={e => this.selectStep(step, e)}>
                            {this.stepTitle(parent.steps, step, i)}
                            {parent instanceof Workflow && this.subSteps(step)}
                        </li>))}
            </ul>);
        }

        return null;
    }

    private content = () => {
        const classes = this.props.classes || {};
        
        return (
            <div>
                <h3 className="title">Steps:</h3>
                {this.subSteps(this.props.state.workflow)}
                <div 
                    ref={(div) => { this.deleteDiv = div; }}
                    className={[
                        classes.stepList,
                        classes.deleteStep,
                        (!this.state.dragging ? classes.hidden : ''),
                        (this.state.deleting ? 'deleting' : '')].join(' ')
                    }>
                    <i className="glyphicon glyphicon-trash"></i> Delete...
                    <div></div>
                </div>
                <div className={this.state.dragging ? classes.hidden : ''}
                    onClick={this.addStep}>
                    <Plus /> Add Step...
                </div>
            </div>)
    }

    public render() {
        return this.props.state.ide ?
            (<atom-panel class="padded">
                <div className="inset-panel padded">
                    {this.content()}
                </div>
            </atom-panel>) :
            (<div>
                {this.content()}
            </div>);
    }
}
