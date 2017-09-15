(window as any).translations = Object.assign((window as any).translations || {}, {
    ADD_STEP: 'Add Step',
    CONFIGURE: 'Add additional configuration',
    CONFIGURE_HEALTH: 'Health check',
    CONFIGURE_ENVIRONMENT: 'Environment variables',
    CONFIGURE_FAILURE: 'Failure behavior',
    CONFIGURE_SOURCE: 'Source availability',
    CONFIGURE_VOLUMES: 'Volumes',
    CONFIGURE_PORTS: 'Ports',
    CONFIGURE_READINESS: 'Readiness check',
    DELETE: 'Delete',
    HELP_HEALTH: 'Health check',
    HELP_ENVIRONMENT: 'Environment variables',
    HELP_FAILURE: 'Behavior on step failure',
    HELP_SOURCE: 'Project source availability',
    HELP_VOLUMES: 'Volumes',
    HELP_PORTS: 'Exposed ports',
    HELP_READINESS: 'Readiness check',
    INSTRUCTION_PORTS: 'Enter a valid port number ( format: internalPort[:externalPort] )',
    LABEL_DOCKERFILE: 'Dockerfile',
    LABEL_FILE: 'File',
    LABEL_GENERATOR: 'Generator',
    LABEL_GRACE: 'Initial grace period (in seconds)',
    LABEL_HOST_PATH: 'Host path',
    LABEL_INTERVAL: 'Interval between checks (in seconds)',
    LABEL_MOUNT_PATH: 'Mount path',
    LABEL_NAME: 'Name',
    LABEL_PATH: 'Path',
    LABEL_PORT: 'Port',
    LABEL_RETRIES: 'Number of retry attempts',
    LABEL_SCRIPT: 'Script',
    LABEL_TIMEOUT: 'Timeout for check (in seconds)',
    LABEL_VALUE: 'Value',
    LABEL_WORKFLOW: 'Workflow',
    OPTION_FAILURE: 'If this step fails, continue running rest of workflow',
    OPTION_HTTP: 'HTTP port readiness',
    OPTION_HTTPS: 'HTTPS port readiness',
    OPTION_OMIT_SOURCE: 'Do not mount the project source for this step',
    OPTION_SCRIPT: 'Health check script',
    OPTION_TCP: 'TCP port readiness',
    PLACEHOLDER_IMAGE: 'Select image for step...',
    PLACEHOLDER_VERSION: 'Select version...',
    PLACEHOLDER_TYPE: 'Select step type...',
    RUN_CALL: 'Call another workflow',
    RUN_GENERATED: 'Generate and run a workflow',
    RUN_SCRIPT: 'Run a script',
    RUN_DOCKERFILE: 'Use an existing Dockerfile',
    SELECT_TEXT_CREATE_PORT: 'Create port {} mapped to external port {}',
    SOURCE_CATALOG: 'Use official Docker image',
    SOURCE_MANUAL: 'Use custom Docker image',
    SOURCE_STEP: 'Use final state of previous step as image',
    TITLE_STEPS: 'Steps',
    TITLE_WORKFLOW: 'Workflow',
    TITLE_WORKFLOW_VARIABLES: 'Workflow Variables',
    STEP_HAS_ERRORS: 'This step had errors in the workflow definition in the following fields: {}.',
    TYPE_DESCRIPTION_COMPOUND: 'Wait for all sub-steps to complete or be healthy',
    TYPE_DESCRIPTION_SEQUENTIAL: 'Workflow will wait for the step to complete',
    TYPE_DESCRIPTION_PARALLEL: 'Workflow will not wait for this step to complete',
    TYPE_DESCRIPTION_SERVICE: 'Workflow will wait for this step to be healthy',
    TYPE_NAME_COMPOUND: 'Compound Step',
    TYPE_NAME_SEQUENTIAL: 'Sequential Step',
    TYPE_NAME_PARALLEL: 'Parallel Step',
    TYPE_NAME_SERVICE: 'Service Step'
});
