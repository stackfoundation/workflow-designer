import { bootstrap, createTestWorkflow } from './src/workflow-editor.module';
import { saveWorkflow } from '../workflow-loader/workflow-loader';

bootstrap(document.getElementById('root'), false, createTestWorkflow());
