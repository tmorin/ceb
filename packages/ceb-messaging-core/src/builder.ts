import {Action} from "./action";
import {Command} from "./command";
import {Event} from "./event";
import {Message, MessageHeaders, MessageKind} from "./message";
import {Query} from "./query";
import {Result, ResultHeaders} from "./result";

let counter = 0;

function getNewNbr() {
    return counter++;
}

/**
 * The builder helps to create messages: commands, queries, results and events.
 *
 * @template B the type of the body
 * @template H the type of the headers
 * @template M the type of the message
 */
export class MessageBuilder<B = any,
    H extends MessageHeaders = MessageHeaders,
    M extends Message<B, H> = Message<B, H>> {
    constructor(
        protected readonly _messageKind: MessageKind,
        protected _messageType: string = _messageKind,
        protected _messageId: string = `${_messageType}-${getNewNbr()}-${Date.now()}}`,
        protected _body?: B,
        protected _headers: Partial<H> = {}
    ) {
    }

    /**
     * Provide a generic builder.
     * @param kind the kind of the message
     * @template B the type of the body
     * @template H the type of the headers
     * @template M the type of the message
     */
    static get<B = any,
        H extends MessageHeaders = MessageHeaders,
        M extends Message<B, H> = Message<B, H>>(kind: MessageKind) {
        return new MessageBuilder<B, H, M>(kind, kind);
    }

    /**
     * Provide a builder for commands.
     * @param type the type of the command
     * @template B the type of the body
     * @template H the type of the headers
     * @template M the type of the message
     */
    static command<B = any,
        H extends MessageHeaders = MessageHeaders,
        M extends Command<B, H> = Command<B, H>>(type: string) {
        return new MessageBuilder<B, H, M>("command", type);
    }

    /**
     * Provide a builder for queries.
     * @param type the type of the query
     * @template B the type of the body
     * @template H the type of the headers
     * @template M the type of the message
     */
    static query<B = any,
        H extends MessageHeaders = MessageHeaders,
        M extends Query<B, H> = Query<B, H>>(type: string) {
        return new MessageBuilder<B, H, M>("query", type);
    }

    /**
     * Provide a builder for results.
     * @param action the original action
     * @param type the type of the result
     * @template B the type of the body
     * @template H the type of the headers
     * @template M the type of the message
     */
    static result<B = any,
        H extends ResultHeaders = ResultHeaders,
        M extends Result<B, H> = Result<B, H>>(action: Action, type?: string) {
        return new MessageBuilder<B, H, M>("result", type || "result").headers(<
            Partial<H>
            >{
            originalMessageId: action.headers.messageId
        });
    }

    /**
     * Provide a builder to create an empty result.
     * @param action the original action
     * @template B the type of the body
     * @template H the type of the headers
     * @template M the type of the message
     */
    static empty<B = undefined,
        H extends ResultHeaders = ResultHeaders,
        M extends Result<B, H> = Result<B, H>>(action: Action) {
        return this.result<B, H, M>(action, "empty");
    }

    /**
     * Provide a builder for events.
     * @param type the type of events
     * @template B the type of the body
     * @template H the type of the headers
     * @template M the type of the message
     */
    static event<B = any,
        H extends MessageHeaders = MessageHeaders,
        M extends Event<B, H> = Event<B, H>>(type: string) {
        return new MessageBuilder<B, H, M>("event", type);
    }

    /**
     * Change the type.
     * @param type the type
     */
    type(type: string) {
        this._messageType = type;
        return this;
    }

    /**
     * Change the identifier.
     * @param identifier the identifier
     */
    identifier(identifier: string) {
        this._messageId = identifier;
        return this;
    }

    /**
     * Change the body.
     * @param body the body
     */
    body(body: B) {
        this._body = body;
        return this;
    }

    /**
     * Change the headers.
     * @param headers the headers
     */
    headers(headers: Partial<H>) {
        this._headers = {...this._headers, ...headers};
        return this;
    }

    /**
     * Build the message.
     */
    build(): M {
        const kind = this._messageKind;
        const body = this._body;
        const headers = <MessageHeaders>{
            ...this._headers,
            messageType: this._messageType,
            messageId: this._messageId
        };
        return <M>{
            kind,
            headers,
            body
        };
    }
}
