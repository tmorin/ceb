import {
    Command,
    CommandKind,
    Event,
    EventKind,
    Message,
    MessageKind,
    Query,
    QueryKind,
    Result,
    ResultKind,
} from "@tmorin/ceb-messaging-core"

/**
 * A base class for specific messages.
 */
export abstract class DomMessage<M extends Message = Message> extends CustomEvent<M> {
  /**
   * @param type the type of the DOM Event
   * @param message the message
   * @param eventInit optional initial properties
   * @protected
   */
  protected constructor(type: string, message: M, eventInit?: Partial<EventInit>) {
    super(type, {
      ...eventInit,
      detail: message,
    })
  }

  /**
   * Provide the Event type of a kind.
   * @param kind the kind
   */
  static fromKindToType(kind: MessageKind) {
    return `ceb-messaging-${kind}`
  }
}

/**
 * The options of {@link DomCommand}
 */
export type DomCommandOptions = {
  /**
   * When `true`, the {@link DomResult} will be dispatched on the target.
   * @default `true`
   */
  dispatchResult?: boolean
  /**
   * The maximum time in millisecond to wait fore a result.
   */
  timeout?: number
}

/**
 * The Custom Event embeds a {@link Command}.
 * When dispatched, the {@link CommandForwarder} handles the Custom Event and forwards it to the messaging world.
 */
export class DomCommand<M extends Command = Command> extends DomMessage<M> {
  /**
   * The kind of the command.
   */
  static MESSAGE_KIND: CommandKind = "command"
  /**
   * The options of the command.
   */
  readonly options: Readonly<DomCommandOptions>

  /**
   * @param message the messsage
   * @param options the options
   */
  constructor(message: M, options?: Partial<DomCommandOptions>) {
    super(DomCommand.CUSTOM_EVENT_TYPE, message, {
      bubbles: true,
      cancelable: true,
    })
    this.options = {
      dispatchResult: true,
      ...options,
    }
  }

  /**
   * The type of the DOM Event.
   */
  static get CUSTOM_EVENT_TYPE() {
    return DomMessage.fromKindToType(DomCommand.MESSAGE_KIND)
  }
}

/**
 * The options of {@link DomQuery}
 */
export type DomQueryOptions = {
  /**
   * The maximum time in millisecond to wait fore a result.
   */
  timeout?: number
}

/**
 * The Custom Event embeds a {@link Query}.
 * When dispatched, the {@link QueryForwarder} handles the Custom Event and forwards it to the messaging world.
 */
export class DomQuery<M extends Query = Query> extends DomMessage<M> {
  /**
   * The kind of the query.
   */
  static MESSAGE_KIND: QueryKind = "query"
  /**
   * The options of the command.
   */
  readonly options: Readonly<DomQueryOptions>

  /**
   * @param message the messsage
   * @param options the options
   */
  constructor(message: M, options?: Partial<DomCommandOptions>) {
    super(DomQuery.CUSTOM_EVENT_TYPE, message, {
      bubbles: true,
      cancelable: true,
    })
    this.options = {
      ...options,
    }
  }

  /**
   * The type of the DOM Event.
   */
  static get CUSTOM_EVENT_TYPE() {
    return DomMessage.fromKindToType(DomQuery.MESSAGE_KIND)
  }
}

/**
 * The Custom Event embeds a {@link Event}.
 * When dispatched, the {@link EventForwarder} handles the Custom Event and forwards it to the messaging world.
 */
export class DomEvent<M extends Event = Event> extends DomMessage<M> {
  /**
   * The kind of the event.
   */
  static MESSAGE_KIND: EventKind = "event"

  /**
   * @param message the message
   */
  constructor(message: M) {
    super(DomEvent.CUSTOM_EVENT_TYPE, message, {
      bubbles: true,
      cancelable: false,
    })
  }

  /**
   * The type of the DOM Event.
   */
  static get CUSTOM_EVENT_TYPE() {
    return DomMessage.fromKindToType(DomEvent.MESSAGE_KIND)
  }
}

/**
 * The Custom Event embeds a {@link Result}.
 * Once an action {@link DomCommand} or {@link DomQuery} is executed, its result is dispatched on the target.
 */
export class DomResult<M extends Result = Result> extends DomMessage<M> {
  /**
   * The kind of the result.
   */
  static MESSAGE_KIND: ResultKind = "result"

  /**
   * @param message the message
   */
  constructor(message: M) {
    super(DomResult.CUSTOM_EVENT_TYPE, message, {
      bubbles: false,
      cancelable: false,
    })
  }

  /**
   * The type of the DOM Event.
   */
  static get CUSTOM_EVENT_TYPE() {
    return DomMessage.fromKindToType(DomResult.MESSAGE_KIND)
  }
}

/**
 * A specialization of {@link DomResult} for error handling.
 */
export class DomResultError<M extends Result<Error> = Result<Error>> extends DomResult<M> {
  /**
   * @param message the message
   */
  constructor(message: M) {
    super(message)
  }
}
