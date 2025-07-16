import { defineConfig, getConfig } from '../eslint-config/src/default.config'

const config = getConfig(import.meta.url)

export default defineConfig([...config])
