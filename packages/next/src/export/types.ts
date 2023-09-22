import type { WriteFileOptions } from 'fs'
import type { OutgoingHttpHeaders } from 'http'
import type { RenderOptsPartial as AppRenderOptsPartial } from '../server/app-render/types'
import type { RenderOptsPartial as PagesRenderOptsPartial } from '../server/render'
import type { LoadComponentsReturnType } from '../server/load-components'
import type AmpHtmlValidator from 'next/dist/compiled/amphtml-validator'
import type { FontConfig } from '../server/font-utils'
import type { ExportPathMap, NextConfigComplete } from '../server/config-shared'
import type { Span } from '../trace'

export interface AmpValidation {
  page: string
  result: {
    errors: AmpHtmlValidator.ValidationError[]
    warnings: AmpHtmlValidator.ValidationError[]
  }
}

export type FileWriter = (
  type: string,
  path: string,
  content: any,
  encodingOptions?: WriteFileOptions
) => Promise<void>

type PathMap = ExportPathMap[keyof ExportPathMap]

export interface ExportPageInput {
  path: string
  pathMap: PathMap
  distDir: string
  outDir: string
  pagesDataDir: string
  renderOpts: WorkerRenderOptsPartial
  ampValidatorPath?: string
  trailingSlash?: boolean
  buildExport?: boolean
  serverRuntimeConfig: { [key: string]: any }
  subFolders?: boolean
  optimizeFonts: FontConfig
  optimizeCss: any
  disableOptimizedLoading: any
  parentSpanId: any
  httpAgentOptions: NextConfigComplete['httpAgentOptions']
  debugOutput?: boolean
  isrMemoryCacheSize?: NextConfigComplete['experimental']['isrMemoryCacheSize']
  fetchCache?: boolean
  incrementalCacheHandlerPath?: string
  fetchCacheKeyPrefix?: string
  nextConfigOutput?: NextConfigComplete['output']
  enableExperimentalReact?: boolean
}

export type ExportedPageFile = {
  type: string
  path: string
}

export type ExportRouteResult =
  | {
  ampValidations?: AmpValidation[]
      revalidate: number | false
  fromBuildExportMeta?: {
    status?: number
    headers?: OutgoingHttpHeaders
  }
  ssgNotFound?: boolean
    }
  | {
      error: boolean
    }

export type ExportPageResult = ExportRouteResult & {
  files: ExportedPageFile[]
  duration: number
}

export type WorkerRenderOptsPartial = PagesRenderOptsPartial &
  AppRenderOptsPartial

export type WorkerRenderOpts = WorkerRenderOptsPartial &
  LoadComponentsReturnType

export type ExportWorker = (
  input: ExportPageInput
) => Promise<ExportPageResult | undefined>

export interface ExportAppOptions {
  outdir: string
  isInvokedFromCli: boolean
  hasAppDir: boolean
  silent?: boolean
  threads?: number
  debugOutput?: boolean
  pages?: string[]
  buildExport: boolean
  statusMessage?: string
  exportPageWorker?: ExportWorker
  exportAppPageWorker?: ExportWorker
  endWorker?: () => Promise<void>
  nextConfig?: NextConfigComplete
  hasOutdirFromCli?: boolean
}

export type ExportPageMetadata = {
  revalidate: number | false
  metadata:
    | {
        status?: number | undefined
        headers?: OutgoingHttpHeaders | undefined
      }
    | undefined
  duration: number
}

export type ExportAppResult = {
  /**
   * Key'ed to the `path` value, each of these contain metadata for each of
   * the pages that were exported (if there was any).
   */
  paths: Record<
    string,
    {
      revalidate: number | false
      metadata:
        | {
            status?: number | undefined
            headers?: OutgoingHttpHeaders | undefined
          }
        | undefined
    }
  >
  durations: Record<string, Record<string, number>>
  ssgNotFoundPaths: string[]
}

export type ExportAppWorker = (
  dir: string,
  options: ExportAppOptions,
  span: Span
) => Promise<ExportAppResult | null>
