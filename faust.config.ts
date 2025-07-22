import { setConfig } from '@faustwp/core';
import templates from './src/wp-templates';
import possibleTypes from './possibleTypes.json';

export default setConfig({
  templates,
  possibleTypes,
});