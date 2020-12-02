/**
 * Error for problems related to rate-provider
 */
export class RateProviderError extends Error {
  static code = 'RATE_PROVIDER_ERR'
  public code: string

  constructor (message: string) {
    super(message)
    this.name = 'RateProviderError'
    this.code = RateProviderError.code
  }
}
