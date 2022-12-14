import { execSync } from 'child_process'
import path from 'path'

import chalk from 'chalk'
import kebabCase from 'lodash/kebabCase'

import { getPkgLocation } from './pkg-location'

export type RenderResult = {
  value: string | undefined
  error: Error | null
}

async function render(id: string, octopusPath: string) {
  const octopusDir = path.dirname(octopusPath)
  const renderPath = path.join(octopusDir, `${kebabCase(id)}-render.png`)
  const fontsDir = process.env.FONTS_PATH ?? path.join(await getPkgLocation(), 'fonts')
  const fontsOption = fontsDir ? `--fonts ${fontsDir}` : ''
  const ignoreValidation = process.env.ODE_IGNORE_VALIDATION === 'true' ? '--ignore-validation' : ''
  try {
    execSync(
      `${process.env.ODE_RENDERER_CMD} ${ignoreValidation} ${fontsOption} --bitmaps ${octopusDir} ${octopusPath} ${renderPath}`,
      {
        stdio: 'ignore',
      }
    )
    return { value: renderPath, error: null }
  } catch (error) {
    console.error(chalk.red(`Rendering failed while processing ${octopusPath}`))
    return { value: undefined, error }
  }
}

export async function renderOctopus(id: string, octopusPath: string): Promise<RenderResult> {
  return await render(id, octopusPath)
}
