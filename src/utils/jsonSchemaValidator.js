const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const ajvFormats = require('ajv-formats');

function validateSchema(response, schemaPath) {
    const schemaFullPath = path.resolve(__dirname, schemaPath);

    // Check if file exist
    if (!fs.existsSync(schemaFullPath)) {
        throw new Error(`Schema file not found at path: ${schemaFullPath}`);
    }

    // Read the file and convert to JSON
    const schema = JSON.parse(fs.readFileSync(schemaFullPath, 'utf-8'));

    // Start AVJ with avj-formats
    const ajv = new Ajv();
    ajvFormats(ajv);

    const validate = ajv.compile(schema);
    const isSchemaValid = validate(response);

    const validationErrors = validate.errors || [];

    if (!isSchemaValid) {
        const validationErrorsString = JSON.stringify(
            validationErrors,
            null,
            2
        );
        const errorMessage = `JSON schema validation failed. Validation errors:\n${validationErrorsString}`;
        console.log(errorMessage);
        throw new Error(errorMessage);
    }

    console.log('Schema validation completed successfully.');

    return { isSchemaValid, validationErrors };
}

module.exports = validateSchema;
