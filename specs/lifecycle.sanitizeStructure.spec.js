/*jshint expr:true, strict:false*/
describe('#sanitizeStructure', function() {
    describe('GIVEN a structure struct', function() {
        var struct;
        beforeEach(function() {
            struct = {
                properties: {},
                prototype: Object.create(HTMLButtonElement.prototype),
                'extends': 'button',
                features: [],
                interceptors: [],
                wrappers: []
            };
        });
        describe('AND a protoype, an extends, an empty features list, an empty interceptors list, an empty wrappers list', function() {
            beforeEach(function() {
            });
            describe('WHEN the structure is sanitized', function() {
                beforeEach(function() {
                    ceb._testing.sanitizeStructure(struct);
                });
                it('THEN the protoype is not sanitized', function() {
                    expect(struct.prototype).to.be.an.instanceof(HTMLButtonElement);
                });
                it('AND the extends is not sanitized', function() {
                    expect(struct['extends']).to.be.equal('button');
                });
                it('AND the features is not sanitized', function() {
                    expect(struct.features).to.be.empty;
                });
                it('AND the interceptors is not sanitized', function() {
                    expect(struct.interceptors).to.be.empty;
                });
                it('AND the wrappers is not sanitized', function() {
                    expect(struct.wrappers).to.be.empty;
                });
            });
        });
        describe('AND no protoype, no extends, no features list, no interceptors list, no wrappers list', function() {
            beforeEach(function() {
                struct.properties = {};
                struct.prototype = null;
                struct['extends'] = null;
                struct.features = null;
                struct.interceptors = null;
                struct.wrappers = null;
            });
            describe('WHEN the structure is sanitized', function() {
                beforeEach(function() {
                    ceb._testing.sanitizeStructure(struct);
                });
                it('THEN the protoype is sanitized', function() {
                    expect(struct.prototype).to.be.an.instanceof(HTMLElement);
                });
                it('AND the extends is sanitized', function() {
                    expect(struct['extends']).to.be.null;
                });
                it('AND the features is sanitized', function() {
                    expect(struct.features).to.be.empty;
                });
                it('AND the interceptors not sanitized', function() {
                    expect(struct.interceptors).to.be.empty;
                });
                it('AND the wrappers is sanitized', function() {
                    expect(struct.wrappers).to.be.empty;
                });
            });
        });
    });
});
