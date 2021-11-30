import {Action, ActionResult, ExecuteActionOptions} from "./action"
import {Disposable, Removable} from "./common"
import {MessageHeaders} from "./message"
import {Emitter, Observable} from "./observable"
import {Result} from "./result"

/**
 * The kind of a query message.
 */
export type QueryKind = "query"

/**
 * A query is an action which requests a view of the system state.
 *
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface Query<B = any, H extends MessageHeaders = MessageHeaders>
    extends Action<B, H> {
    kind: QueryKind
}

/**
 * The result of query.
 *
 * @template R the type of the result
 */
export type QueryResult<R extends Result = Result> = ActionResult<R>

/**
 * The output of a query handler.
 *
 * @template R the type of the result
 */
export type QueryOutput<R extends Result = Result> =
    | QueryResult<R>
    | Promise<QueryResult<R>>

/**
 * A query handler handles a {@link Query} and provides an eventual {@link QueryOutput}.
 *
 * @template Q the type of the query
 * @template R the type of the result
 */
export interface QueryHandler<Q extends Query = Query, R extends Result = Result> {
    /**
     * @param query the query
     */
    (query: Q): QueryOutput<R>
}

/**
 * The symbol used to register {@link QueryBus}.
 */
export const QueryBusSymbol = Symbol.for("ceb/inversion/QueryBus")

export interface QueryBus extends Disposable {
    /**
     * Execute a query and wait for the result.
     * @param query the query
     * @param options the options
     * @template R the type of the result
     * @template Q the type of the query
     */
    execute<R extends Result = Result, Q extends Query = Query>(
        query: Q,
        options?: Partial<ExecuteActionOptions>
    ): Promise<QueryResult<R>>

    /**
     * Register a query handler.
     * @param queryType the type of the query
     * @param handler the handler
     * @template Q the type of the query
     * @template R the type of the result
     */
    handle<Q extends Query = Query, R extends Result = Result>(
        queryType: string,
        handler: QueryHandler<Q, R>
    ): Removable
}

/**
 * The map defines the internal events of an {@link QueryBus}.
 */
export type QueryBusNotificationMap = {
    query_handler_failed: {
        bus: QueryBus
        query: Query
        error: Error
    }
    query_handler_not_found: {
        bus: QueryBus
        query: Query
        error: Error
    }
    disposed: {
        bus: QueryBus
    }
}

/**
 * The observable view of an an {@link QueryBus}.
 */
export interface ObservableQueryBus extends Observable {
    /**
     * Listen to an internal event.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    on<K extends keyof QueryBusNotificationMap>(
        type: K,
        listener: (event: QueryBusNotificationMap[K]) => any
    ): this

    /**
     * Remove listeners.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    off<K extends keyof QueryBusNotificationMap>(
        type?: K,
        listener?: (event: QueryBusNotificationMap[K]) => any
    ): this
}

/**
 * The emitter view of an an {@link QueryBus}.
 */
export interface EmittableQueryBus extends Emitter {
    /**
     * Emit an internal event.
     * @param type the type
     * @param event the event
     * @template K the type of the internal event
     */
    emit<K extends keyof QueryBusNotificationMap>(
        type: K,
        event: QueryBusNotificationMap[K]
    ): void
}
