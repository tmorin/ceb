import {
    Disposable,
    EmittableQueryBus,
    ExecuteActionOptions,
    MessageBuilder,
    ObservableQueryBus,
    Query,
    QueryBus,
    QueryHandler,
    QueryOutput,
    QueryResult,
    Removable,
    Result
} from "@tmorin/ceb-messaging-core"
import {waitForReturn} from "./common"

/**
 * The symbol used to register {@link SimpleQueryBus}.
 */
export const SimpleQueryBusSymbol = Symbol.for("ceb/inversion/SimpleQueryBus")

export class SimpleQueryBus implements QueryBus, Disposable {
    constructor(
        private readonly emitter: EmittableQueryBus,
        private readonly handlers = new Map<string, QueryHandler<any, any>>()
    ) {
    }

    get observe(): ObservableQueryBus {
        return this.emitter
    }

    async execute<R extends Result = Result, Q extends Query = Query>(
        query: Q,
        options?: Partial<ExecuteActionOptions>
    ): Promise<QueryResult<R>> {
        let handler = this.resolveHandler(query)

        const opts: ExecuteActionOptions = {
            timeout: 500,
            ...options
        }

        let result = await waitForReturn<QueryOutput<any>>(
            () => handler(query),
            opts.timeout
        ).catch((error: any) => {
            this.emitter.emit("query_handler_failed", {
                bus: this,
                query,
                error
            })
            throw error
        })

        if (result && result.kind === "error") {
            throw result.body
        }

        return result || MessageBuilder.result(query).type("empty").build()
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
            }
        }
    }

    async dispose(): Promise<void> {
        this.handlers.clear()
        this.emitter.emit("disposed", {bus: this})
    }

    private resolveHandler(query: Query) {
        let handler = this.handlers.get(query.headers.messageType)
        if (handler) {
            return handler
        }
        const error = new Error(
            `handler not found for ${query.headers.messageType}`
        )
        this.emitter.emit("query_handler_not_found", {
            bus: this,
            query,
            error
        })
        throw error
    }
}
