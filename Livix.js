// livix-core

export function createStore(initialState = {}) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = { ...state, ...newState };
      listeners.forEach((callback) => callback(state));
    },
    subscribe: (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback); // return unsubscribe
    },
  };
}

export const livixEvent = {
  /**
   * Registers a global custom event listener.
   */
  on(event, callback) {
    document.addEventListener(event, callback);
  },

  /**
   * Removes a global custom event listener.
   */
  off(event, callback) {
    document.removeEventListener(event, callback);
  },

  /**
   * Dispatches (fires) a global custom event with optional data.
   */
  emit(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
};

/**
 * LifecycleMixin - A mixin that adds lifecycle and rendering support
 * to any base class that extends HTMLElement.
 */
export const LifecycleMixin = (Base) =>
  class extends Base {
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
      if (typeof super.attributeChangedCallback === "function") {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
      if (oldValue !== newValue) {
        this.willupdate?.(name, oldValue, newValue);
        this._renderInternal?.();
      }
    }

    /**
     * setProperty - Defines a single reactive property on the component.
     * Any updates to this property will automatically trigger a re-render.
     *
     * @param {string} name - The name of the property to define.
     * @param {*} initialValue - The initial value of the property.
     *
     * Usage:
     *   this.setProperty('count', 0);
     *   this.count = 5; // will automatically call this._renderInternal()
     */

    setProperty(name, initialValue) {
      let value = initialValue;
      Object.defineProperty(this, name, {
        get: () => value,
        set: (newValue) => {
          if (value !== newValue) {
            this.willupdate?.(name, value, newValue);
            value = newValue;
            this._renderInternal?.();
          }
        },
      });
    }

    /**
     * property - Defines multiple reactive properties on the component at once.
     * Each property will automatically trigger a re-render when its value changes.
     *
     * @param {Object} properties - An object where keys are property names and values are initial values.
     *
     * Usage:
     *   this.property({
     *     count: 0,
     *     title: 'Hello',
     *     user: { name: 'xxx' }
     *   });
     *
     *   this.count = 1; // will automatically call this._renderInternal()
     */

    property(properties) {
      for (const [name, initialValue] of Object.entries(properties)) {
        let value = initialValue;
        Object.defineProperty(this, name, {
          get: () => value,
          set: (newValue) => {
            if (value !== newValue) {
              this.willupdate?.(name, value, newValue);
              value = newValue;
              this._renderInternal?.();
            }
          },
        });
      }
    }

    /**
     * Internal render function: calls user-defined `render()` and injects the
     * returned HTML into the shadow DOM. Executes `didrender()` afterward.
     */
    _renderInternal() {
      if (typeof this.render === "function") {
        const html = this.render();
        if (typeof html === "string") {
          this.shadowRoot.innerHTML = html;
          this.didrender?.();
        }
      }
    }

    async applyStyles(url) {
      const response = await fetch(url);
      const cssText = await response.text();
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [styleSheet];
    }
  };

/**
 * BaseComponent - A base class that sets up a shadow root
 * and provides an empty `render()` method to be overridden by subclasses.
 */
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  render() {} // To be implemented by subclasses
}

/**
 * LivixElement - The default entry point for users.
 * Combines BaseComponent with LifecycleMixin for convenience.
 */
export class LivixElement extends LifecycleMixin(BaseComponent) {}
