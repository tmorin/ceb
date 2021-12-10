import { Query, QueryHandler, Result } from "@tmorin/ceb-messaging-core"

/**
 * The symbol used to register {@link DiscoverableQueryHandler}.
 */
export const DiscoverableQueryHandlerSymbol = Symbol.for("ceb/inversion/DiscoverableQueryHandler")

/**
 * A query handler discovered by the container on startup.
 *
 * @template Q the type of the Query
 * @template R the type of the Result
 */
export type DiscoverableQueryHandler<Q extends Query = Query, R extends Result = Result> = {
  type: string
  handler: QueryHandler<Q, R>
}
