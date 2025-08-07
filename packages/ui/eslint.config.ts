import { getReactConfig } from '@chunithmsg/eslint-config/react';

const config = getReactConfig(import.meta.url);

export default getReactConfig([...config])
