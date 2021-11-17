import {AbstractSimpleCommand, AbstractSimpleEvent, AbstractSimpleQuery, AbstractSimpleResult} from "../message";
import {MessageCommandHandler, MessageEventListener} from "@tmorin/ceb-messaging-core/src";

export class CommandA extends AbstractSimpleCommand<string> {
    constructor(body: string) {
        super(body);
    }
}

export class QueryA extends AbstractSimpleQuery<string> {
    constructor(body: string) {
        super(body);
    }
}

export class ResultA extends AbstractSimpleResult<string> {
    constructor(body: string) {
        super(body);
    }
}

export class ResultB extends AbstractSimpleResult<string> {
    constructor(body: string) {
        super(body);
    }
}

export class EventA extends AbstractSimpleEvent<string> {
    constructor(body: string) {
        super(body);
    }
}

export class EventWithMessageType extends AbstractSimpleEvent<string> {
    static MESSAGE_TYPE: string = "TestEventBis"

    constructor(body: string) {
        super(body);
    }
}

export class CommandWithMessageType extends AbstractSimpleCommand<string> {
    static MESSAGE_TYPE: string = "TestCommandBis"

    constructor(body: string) {
        super(body);
    }
}

export class EventAListener implements MessageEventListener<EventA> {
    readonly EventType = EventA

    async on(event: EventA): Promise<void> {
    }
}

export class CommandWithMessageTypeHandler implements MessageCommandHandler<CommandWithMessageType, ResultA> {
    readonly CommandType = CommandWithMessageType
    readonly ResultType = ResultA

    async handle(command: CommandWithMessageType): Promise<ResultA> {
        console.log("there")
        return new ResultA(command.body)
    }
}
