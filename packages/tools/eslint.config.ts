import { defineConfig, getConfig } from '@chunithmsg/eslint-config'

const config = getConfig(import.meta.url)

export default defineConfig([...config])
