import {
  Disposable,
  EmittableQueryBus,
  ExecuteActionOptions,
  ObservableQueryBus,
  Query,
  QueryBus,
  QueryHandler,
  QueryResult,
  Removable,
  Result,
} from "@tmorin/ceb-messaging-core"
import { waitForReturn } from "./common"

/**
 * The symbol used to register {@link SimpleQueryBus}.
 */
export const SimpleQueryBusSymbol = Symbol.for("ceb/inversion/SimpleQueryBus")

export class SimpleQueryBus implements QueryBus, Disposable {
  constructor(
    private readonly emitter: EmittableQueryBus,
    private readonly handlers = new Map<string, QueryHandler<any, any>>()
  ) {}

  get observe(): ObservableQueryBus {
    return this.emitter
  }

  async execute<R extends Result = QueryResult, Q extends Query = Query>(
    query: Q,
    options?: Partial<ExecuteActionOptions>
  ): Promise<QueryResult<R>> {
    this.emitter.emit("query_received", {
      bus: this,
      query,
    })

    const handler = this.resolveHandler<Q, R>(query)

    const opts: ExecuteActionOptions = {
      timeout: 500,
      ...options,
    }

    return await waitForReturn(async () => await handler(query), opts.timeout).catch((error: Error) => {
      this.emitter.emit("query_handler_failed", {
        bus: this,
        query,
        error,
      })
      throw error
    })
  }

  handle<C extends Query = Query, R extends Result = Result>(
    queryType: string,
    handler: QueryHandler<C, R>
  ): Removable {
    if (this.handlers.has(queryType)) {
      throw new Error(`the query type ${queryType} is already handled`)
    }
    this.handlers.set(queryType, handler)
    return {
      remove: () => {
        this.handlers.delete(queryType)
      },
    }
  }

  async dispose(): Promise<void> {
    this.handlers.clear()
    this.emitter.emit("disposed", { bus: this })
  }

  private resolveHandler<Q extends Query = Query, R extends Result = Result>(query: Query): QueryHandler<Q, R> {
    const handler = this.handlers.get(query.headers.messageType)
    if (handler) {
      return handler
    }
    const error = new Error(`handler not found for ${query.headers.messageType}`)
    this.emitter.emit("query_handler_not_found", {
      bus: this,
      query,
      error,
    })
    throw error
  }
}
