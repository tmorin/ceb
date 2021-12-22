import {
  EmittableQueryBus,
  MessageBuilder,
  ObservableQueryBus,
  Query,
  QueryBus,
  QueryBusNotificationMap,
  QueryHandler,
  QueryResult,
  Removable,
  Result,
} from "@tmorin/ceb-messaging-core"
import { Context, Service, ServiceBroker } from "moleculer"
import { MoleculerExecuteActionOptions } from "./common"

/**
 * The map of the internal events for querys handling.
 */
export interface MoleculerQueryBusNotificationMap extends QueryBusNotificationMap {
  moleculer_service_destruction_failed: {
    name: string
    bus: QueryBus
    error: Error
  }
  query_execution_failed: {
    query: Query
    bus: QueryBus
    error: Error
  }
}

export interface MoleculerObservableQueryBus extends ObservableQueryBus {
  /**
   * Listen to an internal event.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  on<K extends keyof MoleculerQueryBusNotificationMap>(
    type: K,
    listener: (event: MoleculerQueryBusNotificationMap[K]) => any
  ): this

  /**
   * Remove listeners.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  off<K extends keyof MoleculerQueryBusNotificationMap>(
    type?: K,
    listener?: (event: MoleculerQueryBusNotificationMap[K]) => any
  ): this
}

/**
 * The emitter view of an an {@link QueryBus}.
 */
export interface MoleculerEmitterQueryBus extends EmittableQueryBus {
  /**
   * Emit an internal event.
   * @param type the type
   * @param event the event
   * @template K the type of the internal event
   */
  emit<K extends keyof MoleculerQueryBusNotificationMap>(type: K, event: MoleculerQueryBusNotificationMap[K]): void
}

/**
 * Implementation of the {@link QueryBus} for Moleculer.
 */
export class MoleculerQueryBus implements QueryBus {
  constructor(
    private readonly emitter: MoleculerEmitterQueryBus,
    private readonly broker: ServiceBroker,
    private readonly services: Set<Service> = new Set()
  ) {}

  get observer(): MoleculerObservableQueryBus {
    return this.emitter
  }

  private static createService<Q extends Query = Query, R extends Result = Result>(
    queryType: string,
    handler: QueryHandler<Q, R>,
    broker: ServiceBroker,
    queryBus: QueryBus,
    emitter: MoleculerEmitterQueryBus
  ): Service {
    return broker.createService({
      name: queryType,
      actions: {
        execute(context: Context): Promise<R> {
          const query = context.params as Q
          // @ts-ignore
          return Promise.resolve<QueryResult<R>>((async () => handler(query))())
            .then((result) => result || MessageBuilder.result(query).type("empty").build())
            .catch((error: Error) => {
              emitter.emit("query_handler_failed", {
                bus: queryBus,
                query,
                error,
              })
              throw error
            })
        },
      },
    })
  }

  handle<Q extends Query = Query, R extends Result = Result>(
    queryType: string,
    handler: QueryHandler<Q, R>
  ): Removable {
    if (this.broker.services.find((s) => s.name === queryType)) {
      throw new Error(`the query type ${queryType} is already handled`)
    }

    const service = MoleculerQueryBus.createService(queryType, handler, this.broker, this, this.emitter)

    this.services.add(service)

    return {
      remove: () => {
        this.services.delete(service)
        this.broker.destroyService(service).catch((error: Error) =>
          this.emitter.emit("moleculer_service_destruction_failed", {
            bus: this,
            error,
            name: service.name,
          })
        )
      },
    }
  }

  execute<R extends Result = Result, C extends Query = Query>(
    query: C,
    options?: Partial<MoleculerExecuteActionOptions>
  ): Promise<R> {
    const queryName = `${query.headers.messageType}.execute`
    console.log("options", options)
    return this.broker.call<R, C>(queryName, query, {
      ...options,
      requestID: query.headers.messageId,
    })
  }

  async dispose(): Promise<void> {
    await Promise.all(
      Array.from(this.services).map((service) => {
        this.broker.destroyService(service).catch((error: Error) =>
          this.emitter.emit("moleculer_service_destruction_failed", {
            bus: this,
            error,
            name: service.name,
          })
        )
      })
    )
  }
}
