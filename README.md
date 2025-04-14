# LivixJS

**LivixJS** is a lightweight Web Component base framework that provides lifecycle management, automatic rendering, and attribute-driven reactivity with zero dependencies.

---

## 🚀 Features

- ✅ **Standard Web Component base** using `HTMLElement`
- 🔁 **Reactive attributes** with auto-update via `attributeChangedCallback`
- ⚙️ **Lifecycle hooks**: `connect()`, `disconnect()`, `willupdate()`, `didrender()`
- 💡 **Mixin architecture** for composable behavior
- 🎯 **Auto-rendering** via `render()` and shadow DOM injection
- 🧩 Easy to use: just `extends LivixElement`

---

## 📦 Installation

You can clone or copy the library manually:

```bash
git clone https://github.com/your-username/livix.git
```
---

# 📄 Usage Example

```js
// my-component.js
import { LivixElement } from './livix-core.js';

class MyComponent extends LivixElement {
  static attrs = ['title'];

  constructor() {
    super();
    this.flag = 0;
    this.template = [
      `<p id="msg">Hello Web Component</p>`,
      `<p id="msg">Title Updated!</p>`
    ];
  }

  connect() {
    // Initialize attribute if not provided
    if (!this.hasAttribute('title')) {
      this.setAttribute('title', 'Hello');
    }
  }

  render() {
    return this.template[this.flag];
  }

  didrender() {
    this.shadowRoot.querySelector('#msg')?.addEventListener('click', () => {
      this.setAttribute('title', 'Clicked!');
    });
  }

  willupdate(name, oldValue, newValue) {
    if (name === 'title' && oldValue) {
      this.flag = 1;
    }
  }
}
customElements.define('my-component', MyComponent);

```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Livix Demo</title>
  </head>
  <body>
    <my-component></my-component>
    <script type="module" src="./my-component.js"></script>
  </body>
</html>
```