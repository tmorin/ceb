import {MessageConstructor, MessageHeaders, MessageType} from "@tmorin/ceb-messaging-core";
import {SimpleIpcMessageConverter} from "../converter";
import {AbstractSimpleCommand, AbstractSimpleEvent, AbstractSimpleResult} from "@tmorin/ceb-messaging-simple";

export class CommandA extends AbstractSimpleCommand<string> {
    static NAME = "CommandA"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: CommandA.NAME,
            ...headers
        })
    }
}

export class ResultA extends AbstractSimpleResult<string> {
    static NAME = "ResultA"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, headers)
    }

    static createFromCommand(command: CommandA, body: string) {
        return new ResultA(body, {
            messageType: ResultA.NAME,
            correlationId: command.headers.messageId,
        })
    }
}

export class CommandB extends AbstractSimpleCommand<string> {
    static NAME = "CommandB"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: CommandB.NAME,
            ...headers
        })
    }
}

export class ResultB extends AbstractSimpleResult<string> {
    static NAME = "ResultB"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, headers)
    }

    static createFromCommand(command: CommandB, body: string) {
        return new ResultB(body, {
            messageType: ResultB.NAME,
            correlationId: command.headers.messageId,
        })
    }
}

export class FromRendererEvent extends AbstractSimpleEvent<string> {
    static NAME = "FromRendererEvent"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: FromRendererEvent.NAME,
            ...headers
        })
    }
}

export class FromMainEvent extends AbstractSimpleEvent<string> {
    static NAME = "FromMainEvent"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: FromMainEvent.NAME,
            ...headers
        })
    }
}

export class Converter extends SimpleIpcMessageConverter {
    constructor(
        types: Map<MessageType, MessageConstructor<any>> = new Map([
            [FromRendererEvent.NAME, FromRendererEvent],
            [FromMainEvent.NAME, FromMainEvent],
            [CommandA.NAME, CommandA],
            [ResultA.NAME, ResultA],
            [CommandB.NAME, CommandB],
            [ResultB.NAME, ResultB],
        ])
    ) {
        super(types)
    }
}
