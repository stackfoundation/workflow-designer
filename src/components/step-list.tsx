import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Dragula from 'dragula';
import * as classNames from 'classnames';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
const Plus = require('react-icons/lib/go/plus');
const Bars = require('react-icons/lib/fa/bars');
const Trash = require('react-icons/lib/fa/trash');

import { themeColors } from '../style';

let injectSheet = require('@tiagoroldao/react-jss').default;

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
            composes: 'list-item step',
            cursor: 'pointer',
            position: 'relative',
            listStyle: 'none',
            paddingLeft: '10px'
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
            cursor: 'pointer',
            position: 'relative',
            paddingLeft: '10px'
        },
        selected: {
            fontWeight: 'bold',
            color: themeColors.darkerGreen
        },
    }

    return {
        stepList: {
            composes: `${stepListClass} ${theme.ide ? 'list-tree' : ''}`,
            padding: '0 0 0 8px',
            marginLeft: theme.ide ? '0' : '6px',
            borderLeft: theme.ide ? 'none' : 'solid 17px #eee',
        },
        rootList: {
            composes: '$stepList',
            padding: '0px',
            margin: '0',
            marginBottom: '20px',
            borderLeft: 'none'
        },
        subList: {
            composes: theme.ide ? 'list-nested-item' : '',

            '& > span': {
                'line-height': '2em'
            },

            '& > $stepList': {
                position: 'relative',
                top: '-10px',
                marginTop: '10px',
                marginBottom: '-10px',
                minHeight: '20px'
            },
        },
        step: theme.ide ? ide.step : web.step,
        selected: theme.ide ? ide.selected : web.selected,
        deleteStep: {
            composes: theme.ide ? 'btn btn-error' : 'pure-button',
            display: 'block',
            position: 'relative',
            marginRight: theme.ide ? '0px' : '20px',

            '& > div' : {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },

            '& svg' : {
                position: 'relative',
                top: '-0.15em',
            },
        },
        deleteStepDeleting: {
            color: theme.ide ? undefined : 'red'
        },
        stepPrefix: {
            fontWeight: 'bold'
        },
        hidden: {
            display: 'none'
        },
        handle: {
            composes: 'dragula-handle',
            position: 'absolute !important',
            top: '0px',
            right: theme.ide ? '0px' : '25px',
            cursor: 'move',
        },
        handleIcon: {
            composes: `dragula-handle ${theme.ide ? 'icon icon-grabber' : ''}`,
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

    @action
    private addStep() {
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
        else if (parentList[index - 1].type === "sequential") {
            let step = parentList[index - 1] as WorkflowStepSimple;
            
            if (step.type === 'sequential') {
                return 'Then';
            }
            else if (step.type === 'parallel') {
                return 'And';
            }
            else if (step.type === 'service') {
                return 'After ready';
            }
        }
        else if (parentList[index - 1].type === 'compound') {
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
        let container = ReactDOM.findDOMNode(this),
            list = container.querySelectorAll('.' + stepListClass),
            classes = this.props.classes;
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
            moves: (el: Element, target: Element, handle: Element) => {
                return handle.classList.contains('dragula-handle');
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
                (step.type == 'compound' ? ' ' + classes.subList : '');
        }
        catch(e) {
            throw(e);   
        }
    }

    private stepTitle(parentList: WorkflowStep[], step: WorkflowStep, key: number) {
        let classes = this.props.classes || {},
            prefix = this.stepPrefix(parentList, key);
        return (
            <span>
                {prefix.length > 0 && <span className={classes.stepPrefix}>{this.stepPrefix(parentList, key)}&nbsp;</span>}
                {step.name}
            </span>);
    }

    setStep = (el: HTMLLIElement, parent: any, step: any) => {
        if (el) {
            if (parent) {}
            (el as any).relatedStep = step;
        }
    }

    private StepHandle () {
        return <div className={this.props.classes.handle}>
            {this.props.state.ide ? <span className={this.props.classes.handleIcon}></span> : <Bars className={this.props.classes.handleIcon}/>}
        </div>
    }

    private subSteps(parent: WorkflowStep | Workflow): JSX.Element {
        let classes = this.props.classes || {};

        let rootList = parent instanceof Workflow;
        if (parent instanceof WorkflowStepCompound || parent instanceof Workflow) {
            return (
                <ul className={rootList ? classes.rootList : classes.stepList} ref={el => el && ((el as any).parentStep = parent)}>
                    {parent.steps.map((step, i) => (
                        <li 
                            className={this.stepClasses(step)} 
                            key={step.name} 
                            ref={el => this.setStep(el, parent, step)}
                            onClick={e => this.selectStep(step, e)}>
                            {this.stepTitle(parent.steps, step, i)}
                            {this.StepHandle ()}
                            {step instanceof WorkflowStepCompound && this.subSteps(step)}
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
                        stepListClass,
                        classes.deleteStep,
                        (this.state.deleting ? classes.deleteStepDeleting : '')].join(' ')
                    }>
                    {this.state.dragging ? 
                        <span><Trash />Delete...</span> :
                        <span><Plus /> Add Step...</span> }
                    <div></div>
                </div>
            </div>)
    }

    public render() {
        return this.props.state.ide ?
            (<div className="padded">
                <div className="inset-panel padded">
                    {this.content()}
                </div>
            </div>) :
            (<div>
                {this.content()}
            </div>);
    }
}
