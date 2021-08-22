# AttributePropagationBuilder

The builder handles the propagation of an attribute's values to embedded elements.
That means, each time the attribute is mutated, the mutation is propagated to selected child nodes.

Its usage is cover by the reference documentation: [AttributePropagationBuilder](../api/classes/_tmorin_ceb_builders.AttributePropagationBuilder.html).
It's part of the [@tmorin/ceb-builders](https://www.npmjs.com/package/@tmorin/ceb-builders) package.

## Challenge yourself

Will you be able to ...
1. propagate the value of the attribute `value` to the property `placeholder` of the `input`?
2. propagate the value of the attribute `frozen` to the attribute `disabled` of the `input`?

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-slug-hash="qBmYKwe" data-editable="true" data-user="tmorin" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/qBmYKwe">
  &lt;ceb/&gt; ~ challenge/AttributePropagationBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
