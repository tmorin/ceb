import {
    Command,
    CommandKind,
    Event,
    EventKind,
    Message,
    MessageHeaders,
    MessageKind,
    Query,
    QueryKind,
    Result,
    ResultHeaders,
    ResultKind
} from "@tmorin/ceb-messaging-core";

export class DomMessage<B = any, H extends MessageHeaders = MessageHeaders> extends CustomEvent<Message<B, H>> {
    static fromKindToType(kind: MessageKind) {
        return `ceb-messaging-${kind}`
    }

    constructor(kind: MessageKind, body: B, headers: H) {
        super(DomMessage.fromKindToType(kind), {
            bubbles: true,
            cancelable: true,
            detail: {kind, headers, body}
        });
    }
}

export class DomCommand<B = any, H extends MessageHeaders = MessageHeaders> extends CustomEvent<Command<B, H>> {

    static MESSAGE_KIND: CommandKind = "command"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomCommand.MESSAGE_KIND)
    }

    constructor(body: B, headers: H) {
        super(DomCommand.CUSTOM_EVENT_TYPE, {
            bubbles: true,
            cancelable: true,
            detail: {kind: DomCommand.MESSAGE_KIND, headers, body}
        });
    }
}

export class DomQuery<B = any, H extends MessageHeaders = MessageHeaders> extends CustomEvent<Query<B, H>> {

    static MESSAGE_KIND: QueryKind = "query"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomQuery.MESSAGE_KIND)
    }

    constructor(body: B, headers: H) {
        super(DomQuery.CUSTOM_EVENT_TYPE, {
            bubbles: true,
            cancelable: true,
            detail: {kind: DomQuery.MESSAGE_KIND, headers, body}
        });
    }
}

export class DomEvent<B = any, H extends MessageHeaders = MessageHeaders> extends CustomEvent<Event<B, H>> {

    static MESSAGE_KIND: EventKind = "event"

    static get CUSTOM_EVENT_TYPE() {
        return DomMessage.fromKindToType(DomEvent.MESSAGE_KIND)
    }

    constructor(body: B, headers: H) {
        super(DomEvent.CUSTOM_EVENT_TYPE, {
            bubbles: true,
            cancelable: true,
            detail: {kind: DomEvent.MESSAGE_KIND, headers, body}
        });
    }
}

export class DomResult<B = any, H extends ResultHeaders = ResultHeaders> extends CustomEvent<Result<B, H>> {

    static MESSAGE_KIND: ResultKind = "result"

    static get CUSTOM_RESULT_TYPE() {
        return DomMessage.fromKindToType(DomResult.MESSAGE_KIND)
    }

    constructor(body: B, headers: H) {
        super(DomResult.CUSTOM_RESULT_TYPE, {
            bubbles: true,
            cancelable: true,
            detail: {kind: DomResult.MESSAGE_KIND, headers, body}
        });
    }
}
