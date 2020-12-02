import { Application as ExpressFeathers } from '@feathersjs/express'
import * as Parser from '@oclif/parser'

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<any>;

export interface RateProvider {
  fetchRate (from: string, to: string): Promise<number>
}
export interface RateUpdaterService {
  precache? (): Promise<void>
  purge? (): Promise<void>
  initialize (app: Application): Promise<{ stop: () => Promise<void> }>
}

export interface Config {
  host?: string
  port?: number

  rateUpdateThreshold?: number
  rateUpdateInterval?: number

  oracle?: {
    contactAddress?: string
    account?: string
  }

  blockchain?: {
    provider?: string
    networkId?: number
  }

  rateApi?: {
    url?: string
    token?: string
    ratePollInterval?: number // ms
  },

  log?: {
    level?: string
    filter?: string
    path?: string
  }
}

interface Args {[name: string]: any}

type Options<T> = T extends Parser.Input<infer R>
  ? Parser.Output<R, Args>
  : any

export type Flags<T> = Options<T>['flags']

/**
 * Basic logger interface used around the application.
 */
export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  critical (message: string | Error | object, ...meta: any[]): never

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error (message: string | Error | object, ...meta: any[]): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn (message: string | object, ...meta: any[]): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info (message: string | object, ...meta: any[]): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verbose (message: string | object, ...meta: any[]): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug (message: string | object, ...meta: any[]): void
}
