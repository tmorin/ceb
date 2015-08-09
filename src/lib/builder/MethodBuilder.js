export default class MethodBuilder {

    constructor(name) {
        this.method = {name};
    }

    call(fn) {
        this.method.fn = fn;
    }

    build(proto) {
        proto[this.method.name] = this.method.fn;
    }
}
