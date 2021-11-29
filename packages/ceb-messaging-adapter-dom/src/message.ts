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
    ResultKind
} from "@tmorin/ceb-messaging-core";

/**
 * A base class for specific messages.
 */
export abstract class DomMessage<M extends Message = Message> extends CustomEvent<M> {
    /**
     * Provide the Event type of a kind.
     * @param kind the kind
     */
    static fromKindToType(kind: MessageKind) {
        return `ceb-messaging-${kind}`
    }

    protected constructor(
        type: string,
        message: M,
        eventInitDict?: Partial<Omit<CustomEventInit<M>, "detail">>
    ) {
        super(type, {
            ...eventInitDict,
            detail: message
        });
    }
}

export class DomCommand<M extends Command = Command> extends DomMessage<M> {

    static MESSAGE_KIND: CommandKind = "command"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomCommand.MESSAGE_KIND)
    }

    constructor(
        message: M,
        readonly dispatchResult = true
    ) {
        super(DomCommand.CUSTOM_EVENT_TYPE, message, {
            bubbles: true,
            cancelable: true
        });
    }
}

export class DomQuery<M extends Query = Query> extends DomMessage<M> {

    static MESSAGE_KIND: QueryKind = "query"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomQuery.MESSAGE_KIND)
    }

    constructor(message: M) {
        super(DomQuery.CUSTOM_EVENT_TYPE, message, {
            bubbles: true,
            cancelable: true
        });
    }
}

export class DomEvent<M extends Event = Event> extends DomMessage<M> {

    static MESSAGE_KIND: EventKind = "event"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomEvent.MESSAGE_KIND)
    }

    constructor(message: M) {
        super(DomEvent.CUSTOM_EVENT_TYPE, message, {
            bubbles: true,
            cancelable: false
        });
    }
}

export class DomResult<M extends Result = Result> extends DomMessage<M> {

    static MESSAGE_KIND: ResultKind = "result"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomResult.MESSAGE_KIND)
    }

    constructor(message: M) {
        super(DomResult.CUSTOM_EVENT_TYPE, message, {
            bubbles: false,
            cancelable: false,
        });
    }
}

export class DomResultError<M extends Result<Error> = Result<Error>> extends DomResult<M> {

    static MESSAGE_KIND: ResultKind = "result"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomResult.MESSAGE_KIND)
    }

    constructor(message: M) {
        super(message);
    }
}
