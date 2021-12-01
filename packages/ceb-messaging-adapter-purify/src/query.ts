import { Either, EitherAsync, Maybe, Nothing } from "purify-ts"
import {
  ExecuteActionOptions,
  MessageBuilder,
  Query,
  QueryBus,
  Removable,
  Result,
  ResultHeaders,
} from "@tmorin/ceb-messaging-core"

/**
 * The asynchronous result of a query.
 */
export type PurifyQueryResult<B = any> = Promise<Either<Error, Maybe<B>>>

/**
 * The output of a query handler.
 */
export type PurifyQueryHandlerOutput<B = any> = EitherAsync<Error, Maybe<B>>

/**
 * The handler of a query.
 */
export interface PurifyQueryHandler<Q extends Query = Query, B = any> {
  /**
   * @param query the query
   */
  (query: Q): PurifyQueryHandlerOutput<B>
}

/**
 * The symbol used to register {@link PurifyQueryBus}.
 */
export const PurifyQueryBusSymbol = Symbol.for("ceb/inversion/PurifyQueryBus")

/**
 * An adapter of {@link QueryBus} for the purify world.
 */
export class PurifyQueryBus {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Execute a query and wait for a result.
   * @param query the query
   * @param options the options
   */
  execute<B = any, Q extends Query = Query, R extends Result<B> = Result>(
    query: Q,
    options?: Partial<ExecuteActionOptions>
  ): PurifyQueryResult<B> {
    return EitherAsync<Error, Maybe<B>>(() =>
      this.queryBus
        .execute<R, Q>(query, options)
        .then((result) => result.body)
        .then((body) => Maybe.fromNullable(body))
    ).run()
  }

  /**
   * Handle a query.
   * @param queryType the type of the quer
   * @param handler the handler
   */
  handle<Q extends Query = Query, B = any, R extends Result<B> = Result>(
    queryType: string,
    handler: PurifyQueryHandler<Q, B>
  ): Removable {
    return this.queryBus.handle<Q, R>(queryType, (query) => {
      return handler(query)
        .map((maybe) => {
          return maybe.map((body) => MessageBuilder.result<B, ResultHeaders, R>(query).body(body).build())
        })
        .run()
        .then((either) => {
          if (either.isLeft()) {
            throw either.swap().extract()
          }
          return either
            .orDefaultLazy(() => Nothing)
            .orDefaultLazy(() => MessageBuilder.empty<B, ResultHeaders, R>(query).build())
        })
    })
  }
}
