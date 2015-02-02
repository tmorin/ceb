// Get a builder.
var builder = ceb().name('properties-tag');

// ## Properties

// The builder's method `properties` adds the given hash of properties to the structure.
//
// > @param properties (object) a map of properties
builder.properties({
    // **Writable value**

    // The property `propWritable` will be initialized with the value *initial value*.
    // It can be updated on runtime.
    propWritable: {
        value: 'initial value',
        writable: true
    },

    // **Value factory**

    // The property `propFactory` will be initialized with the result of the `valueFactory` function.
    // It can be updated on runtime.
    propFactory: {
        valueFactory: function (el) {
            return el.tagName;
        }
    },

    // **Read only value**

    // The property `propReadonly` will be initialized with the value *initial value*.
    // It can't be updated on runtime.
    propReadonly: {
        value: 'initial value',
        writable: false
    },

    // **Accessors**

    // The property `propAccessors` will be initialized given the value *initial value* to the setter.
    //
    // When `propAccessors` will be set (`obj.propAccessors = 'value'`), the setter will be called.
    //
    // When `propAccessors` will be get (`var value = obj.propAccessors`), the getter will be called.
    propAccessors: {
        value: 'initial value',
        // Set accessors are called with the custom element instance and the set value.
        // They should store the values somewhere in order to retrieve them for the getters.
        set: function (el, value) {
            el._setAndGetProperty = value;
        },

        // Get accessors are called with the custom element instance.
        // They should return something.
        get: function (el) {
            return el._setAndGetProperty;
        }
    }
});

// ***
// ## Properties and attributes

// Properties can be linked to element's attributes.
// When a property is updated, the linked attribute is updated too.
// When an attribute is updated, the linked property is updated too.
//
// Properties linked to attributes have automatically built accessors.
// Properties linked to attributes can only handle string and boolean values.
builder.properties({
    // **Default behavior**

    // The property `propAtt` is linked to the attribute `prop-att`.
    // `propAtt` and its attribute is initialized with the value *initial value*.
    propAtt: {
        value: 'initial value',
        attribute: true
    },

    // **Boolean value**

    // The property `propAttBool` is linked to the attribute `prop-att-bool`.
    // `propAttBool` and its attribute is initialized with the value *initial value*.
    //
    // When `propAttBool` is true, attribute is present into the DOM and have the value *""*.
    // When `propAttBool` is false, attribute is not present into the DOM.
    propAttBool: {
        value: true,
        attribute: {
            boolean: true
        }
    },

    // **Linked to another attribute name**

    // The property `propAttBis` is linked to the attribute having the name `another-attribute-name`.
    propAttBis: {
        attribute: {
            name: 'another-attribute-name'
        }
    },

    // **Setter and getter**

    // Properties linked to attributes can have setters and getters too.
    // However, their accessors are already defined by **ceb** to deal with the linked attributes.
    // Their API are closed, but fundamentally different.
    //
    // Attribute's setter and getter act as interceptors.
    // They give a way to change the future attribute value or to change the read attribute value.
    propAttAccessors: {
        value: 'initial value',
        attribute: true,
        // Attributes' setter are called with the element instance and the set value.
        // The returned value will be the attribute's value.
        setter: function (el, value) {
            return value;
        },
        // Attributes' getter are called with the element instance and the attribute's value.
        // The returned value will be the get value.
        getter: function (el, value) {
            return value;
        }
    }
});

// ***
// ## Delegation

// Properties accesses can be applied to a child node.
// When a property/attribute is written, the property or the attribute of the child node is set.
// When an property/attribute is read, the property or the attribute of the child node is get.
builder.properties({
    // **From property to property**

    // The property `fromPropToProp` will delegate write and read access to
    // the property `fromPropToProp` of the child node matching the selector target.
    fromPropToProp: {
        delegate: {
            target: 'button'
        }
    },

    // **From property to another property**

    // The property `fromPropToProp2` will delegate write and read access to
    // the property `prop2` of the child node matching the selector target.
    fromPropToProp2: {
        delegate: {
            target: 'button',
            property: 'prop2'
        }
    },

    // **From property to attribute**

    // The property `fromPropToAtt` will delegate write and read access to
    // the attribute `from-prop-to-att` of the child node matching the selector target.
    fromPropToAtt: {
        delegate: {
            target: 'button',
            attribute: true
        }
    },

    // **From property to another attribute**

    // The property `fromPropToAtt2` will delegate write and read access to
    // the attribute `from-prop-to-att2-bis` of the child node matching the selector target.
    fromPropToAtt2: {
        delegate: {
            target: 'button',
            attribute: 'from-prop-to-att2-bis'
        }
    },

    // **From attribute to attribute**

    // The attribute `from-att-to-att` will delegate write and read access to
    // the attribute `from-att-to-att` of the child node matching the selector target.
    fromAttToAtt: {
        attribute: true,
        delegate: {
            target: 'button'
        }
    },

    // **From attribute to another attribute**

    // The attribute `from-att-to-att2` will delegate write and read access to
    // the attribute `from-att-to-att2-bis` of the child node matching the selector target.
    fromAttToAtt2: {
        attribute: true,
        delegate: {
            target: 'button',
            attribute: 'from-att-to-att2-bis'
        }
    },

    // **From attribute to property**

    // The attribute `from-att-to-prop` will delegate write and read access to
    // the property `fromAttToProp` of the child node matching the selector target.
    fromAttToProp: {
        attribute: true,
        delegate: {
            target: 'button',
            property: true
        }
    },

    // **From attribute to another property**

    // The attribute `from-att-to-prop2` will delegate write and read access to
    // the property `fromAttToProp2Bis` of the child node matching the selector target.
    fromAttToProp2: {
        attribute: true,
        delegate: {
            target: 'button',
            property: 'fromAttToProp2Bis'
        }
    }

});
