// livix-core.js

/**
 * LifecycleMixin - A mixin that adds lifecycle and rendering support
 * to any base class that extends HTMLElement.
 */
export const LifecycleMixin = Base => class extends Base {
  
    /**
     * Called when the component is added to the DOM.
     * Executes the user's custom `connect()` and triggers the initial render.
     */
    connectedCallback() {
      super.connectedCallback?.();
      this.connect?.();
      this._renderInternal?.();
    }
  
    /**
     * Called when the component is removed from the DOM.
     * Executes the user's custom `disconnect()` if defined.
     */
    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.disconnect?.();
    }
  
    /**
     * Registers the list of attributes to observe for changes.
     * Combines attributes defined in the base class and user-defined `attrs`.
     */
    static get observedAttributes() {
      const baseAttrs = super.observedAttributes || [];
      const ownAttrs = this.attrs || [];
      return [...new Set([...baseAttrs, ...ownAttrs])];
    }
  
    /**
     * Called automatically when an observed attribute changes.
     * Executes the user's custom `willupdate()` and triggers re-render.
     */
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`[Mixin] Attribute changed: ${name} = ${newValue}`);
      if (typeof super.attributeChangedCallback === 'function') {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
      if (oldValue !== newValue) {
        this.willupdate?.(name, oldValue, newValue);
        this._renderInternal?.();
      }
    }
  
    /**
     * Internal render function: calls user-defined `render()` and injects the
     * returned HTML into the shadow DOM. Executes `didrender()` afterward.
     */
    _renderInternal() {
      if (typeof this.render === 'function') {
        const html = this.render();
        if (typeof html === 'string') {
          this.shadowRoot.innerHTML = html;
          this.didrender?.();
        }
      }
    }
  };
  
  /**
   * BaseComponent - A base class that sets up a shadow root
   * and provides an empty `render()` method to be overridden by subclasses.
   */
  export class BaseComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    render() {} // To be implemented by subclasses
  }
  
  /**
   * LivixElement - The default entry point for users.
   * Combines BaseComponent with LifecycleMixin for convenience.
   */
  export class LivixElement extends LifecycleMixin(BaseComponent) {}
  