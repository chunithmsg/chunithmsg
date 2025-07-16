import { defineWorkspace } from 'vitest/config'

import { glob } from './patches/packages/workspace-dependencies/src/zx'

const projects = await glob([
	// All vitest projects
	'{apps,packages}/*/vitest.config{,.node}.ts',
])

export default defineWorkspace(projects)
