# Universal Configurable Announcement Bar

A lightweight, zero-dependency JavaScript utility that creates a customizable announcement bar. Configure it entirely through HTML data attributes with no JavaScript required.

## ✨ Features

- 🚀 **Zero Dependencies** - Pure vanilla JavaScript
- ⚡ **Tiny Footprint** - Under 5KB minified
- 🎨 **Fully Customizable** - Control every aspect via data attributes
- ⏱️ **Countdown Timer** - Built-in timer with custom formatting
- 📱 **Responsive** - Works on all screen sizes
- 🌐 **Cross-browser** - Works in all modern browsers
- 🛠️ **Easy Integration** - Just add a script tag

## 🚀 Quick Start

### 1. Installation

#### Via CDN (Recommended)
```html
<script 
  src="https://cdn.jsdelivr.net/gh/yourusername/topbar@latest/utility.min.js"
  id="utility-bar-script"
  data-utility-text="🎉 Free shipping on orders over $50!"
  data-utility-link="/free-shipping"
  async
  defer
></script>
```

#### Via NPM
```bash
npm install topbar-announcement
```

### 2. Basic Usage

```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="🎉 Free shipping on orders over $50!"
  data-utility-link="/free-shipping"
  data-utility-bg-color="#ff4757"
  data-utility-text-color="#ffffff"
  data-utility-height="40px"
  data-utility-placement="top-fixed"
  async
  defer
></script>
```

### 3. With Countdown Timer

```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="⏰ Flash Sale: [TIMER] remaining!"
  data-utility-link="/flash-sale"
  data-utility-timer-end="2025-12-31T23:59:59"
  data-utility-timer-format="d 'days' hh:mm:ss"
  data-utility-bg-color="#0066cc"
  data-utility-text-color="#ffffff"
></script>
```

## Configuration Options

| Data Attribute              | Required | Default     | Description                                           |
| --------------------------- | -------- | ----------- | ----------------------------------------------------- |
| `data-utility-text`         | ✅       | -           | The main text content. Supports `[TIMER]` placeholder |
| `data-utility-link`         | ❌       | -           | Full URL for the entire bar to link to                |
| `data-utility-timer-end`    | ❌       | -           | ISO 8601 date string (e.g., `2025-12-31T23:59:59`)   |
| `data-utility-timer-format` | ❌       | `hh:mm:ss`  | Format: `d` (days), `h` (hours), `m` (minutes), `s` (seconds) |
| `data-utility-bg-color`     | ❌       | `#ff4757`   | Background color (any valid CSS color)                |
| `data-utility-text-color`   | ❌       | `#ffffff`   | Text color (any valid CSS color)                      |
| `data-utility-height`       | ❌       | `40px`      | Height of the bar (any valid CSS size)                |
| `data-utility-placement`    | ❌       | `top-fixed` | `top-fixed` or `bottom-fixed`                         |
| `data-utility-font-size`    | ❌       | `14px`      | Font size (any valid CSS size)                        |
| `data-utility-font-weight`  | ❌       | `500`       | Font weight (e.g., `400`, `500`, `600`)               |
| `data-utility-padding`      | ❌       | `0 20px`    | Inner spacing (any valid CSS padding)                 |
| `data-utility-border-radius`| ❌       | `0`         | Border radius (any valid CSS border-radius)           |
| `data-utility-box-shadow`   | ❌       | `none`      | Box shadow (any valid CSS box-shadow)                 |
| `data-utility-z-index`      | ❌       | `9999`      | Z-index of the bar                                    |

## 🛠 Development

### Building from Source

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the minified version:
   ```bash
   npm run build
   ```
4. For development with auto-rebuild:
   ```bash
   npm run watch
   ```

### File Structure

- `utility.js` - Source code
- `utility.min.js` - Minified production build
- `test-simple.html` - Example usage
- `rollup.config.js` - Build configuration

## 📝 Advanced Usage

### Multiple Messages

Use the `data-utility-message1`, `data-utility-message2`, etc. attributes to cycle through multiple messages:

```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-message1="🚚 Free shipping on all orders!"
  data-utility-message2="🎁 Special offer: 20% off today only!"
  data-utility-interval="5000"
  data-utility-bg-color="#4a90e2"
  data-utility-text-color="#ffffff"
  async
  defer
></script>
```

## 🌟 Examples

### Basic Announcement
```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="🌟 New collection just dropped!"
  data-utility-link="/new-arrivals"
  data-utility-bg-color="#6c5ce7"
  data-utility-text-color="#ffffff"
  async
  defer
></script>
```

### Sale Countdown
```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="⏰ Black Friday Sale! [TIMER] left!"
  data-utility-link="/black-friday"
  data-utility-timer-end="2025-11-30T23:59:59"
  data-utility-timer-format="d 'days' hh 'hrs' mm 'min'"
  data-utility-bg-color="#000000"
  data-utility-text-color="#ffffff"
  data-utility-font-size="16px"
  async
  defer
></script>
```

## 📜 License

MIT © [Your Name]

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
## Timer Format Options

The timer format supports the following placeholders:

- `d` - Days
- `h` - Hours (0-23)
- `hh` - Hours with leading zero (00-23)
- `m` - Minutes (0-59)
- `mm` - Minutes with leading zero (00-59)
- `s` - Seconds (0-59)
- `ss` - Seconds with leading zero (00-59)

## 📜 License

MIT © [Your Name]

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
- `d` - Days (no padding)
- `dd` - Days with padding (e.g., 01, 02)
- `h` - Hours (no padding)
- `hh` - Hours with padding (e.g., 01, 02)
- `m` - Minutes (no padding)
- `mm` - Minutes with padding (e.g., 01, 02)
- `s` - Seconds (no padding)
- `ss` - Seconds with padding (e.g., 01, 02)

### Timer Format Examples

- `hh:mm:ss` → `23:45:30`
- `d:hh:mm` → `5:23:45`
- `dd:hh:mm:ss` → `05:23:45:30`
- `h:mm` → `23:45`

## Examples

### Sale Announcement (Top)

```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="🔥 50% OFF Everything - Limited Time!"
  data-utility-link="https://yourstore.com/sale"
  data-utility-bg-color="#e74c3c"
  data-utility-text-color="#ffffff"
  data-utility-height="45px"
  data-utility-placement="top-fixed"
  async
  defer
></script>
```

### Countdown Sale (Bottom)

```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="⏰ Black Friday: [TIMER] left!"
  data-utility-link="https://yourstore.com/black-friday"
  data-utility-timer-end="2025-11-30T23:59:59Z"
  data-utility-timer-format="d:hh:mm:ss"
  data-utility-bg-color="#2c3e50"
  data-utility-text-color="#ecf0f1"
  data-utility-height="50px"
  data-utility-placement="bottom-fixed"
  async
  defer
></script>
```

### Simple Notice (No Link)

```html
<script
  src="utility.min.js"
  id="utility-bar-script"
  data-utility-text="📢 New products just arrived!"
  data-utility-bg-color="#27ae60"
  data-utility-text-color="#ffffff"
  data-utility-height="35px"
  data-utility-placement="top-fixed"
  async
  defer
></script>
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Internet Explorer 11+ (with polyfills)

## File Sizes

- `utility.js` (development): ~4.2KB
- `utility.min.js` (production): ~1.8KB

## Testing

Open `test.html` or `test-bottom.html` in your browser to see the utility in action with different configurations.

## Deployment

1. Host the `utility.min.js` file on your CDN or static hosting service
2. Update the `src` attribute in your script tag to point to your hosted file
3. Configure the data attributes as needed
4. Add the script tag to your website

## License

MIT License - Feel free to use in commercial and personal projects.
