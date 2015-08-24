/**
 * A builder is defined by a build method.
 * @abstract
 */
export class Builder {
    /**
     * To specify the logic of the builder.
     * @param {!CustomElementBuilder.context.proto} proto the prototype
     * @param {!CustomElementBuilder.on} on the method on
     */
    build() {
        throw new Error('not implemented');
    }

}
