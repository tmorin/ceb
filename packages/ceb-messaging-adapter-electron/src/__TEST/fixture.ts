import {MessageHeaders} from "@tmorin/ceb-messaging-core";
import {AbstractSimpleCommand, AbstractSimpleEvent, AbstractSimpleResult} from "@tmorin/ceb-messaging-simple";

export class CommandA extends AbstractSimpleCommand<string> {
    static MESSAGE_TYPE = "CommandA"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: CommandA.MESSAGE_TYPE,
            ...headers
        })
    }
}

export class ResultA extends AbstractSimpleResult<string> {
    static MESSAGE_TYPE = "ResultA"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, headers)
    }

    static createFromCommand(command: CommandA, body: string) {
        return new ResultA(body, {
            messageType: ResultA.MESSAGE_TYPE,
            correlationId: command.headers.messageId,
        })
    }
}

export class CommandB extends AbstractSimpleCommand<string> {
    static MESSAGE_TYPE = "CommandB"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: CommandB.MESSAGE_TYPE,
            ...headers
        })
    }
}

export class ResultB extends AbstractSimpleResult<string> {
    static MESSAGE_TYPE = "ResultB"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, headers)
    }

    static createFromCommand(command: CommandB, body: string) {
        return new ResultB(body, {
            messageType: ResultB.MESSAGE_TYPE,
            correlationId: command.headers.messageId,
        })
    }
}

export class FromRendererEvent extends AbstractSimpleEvent<string> {
    static MESSAGE_TYPE = "FromRendererEvent"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: FromRendererEvent.MESSAGE_TYPE,
            ...headers
        })
    }
}

export class FromMainEvent extends AbstractSimpleEvent<string> {
    static MESSAGE_TYPE = "FromMainEvent"

    constructor(
        body: string,
        headers: Partial<MessageHeaders> = {}
    ) {
        super(body, {
            messageType: FromMainEvent.MESSAGE_TYPE,
            ...headers
        })
    }
}
