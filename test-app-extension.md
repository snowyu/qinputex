# Testing QInputEx App Extension

## Local Testing Steps

1. **Build the main library first:**
   ```bash
   cd /path/to/qinputex
   pnpm install
   pnpm build
   ```

2. **Link the main library locally:**
   ```bash
   cd /path/to/qinputex
   npm link
   ```

3. **Link the app extension locally:**
   ```bash
   cd /path/to/qinputex/app-extension-qinputex
   npm link
   ```

4. **Create a test Quasar project:**
   ```bash
   npm create quasar
   # Choose:
   # - App with Quasar CLI
   # - Quasar v2
   # - Vue 3
   # - Composition API
   # - Vite
   ```

5. **Install the extension in test project:**
   ```bash
   cd /path/to/test-project
   npm link qinputex
   npm link quasar-app-extension-qinputex
   quasar ext add qinputex
   ```

6. **Test the components:**
   - Check if boot file is created at `src/boot/qinputex.js`
   - Check if example page is created (if you chose to install examples)
   - Run `quasar dev` and test the components

## Production Installation

Once published to npm:

```bash
quasar ext add qinputex
```

## Verification Checklist

- [ ] Boot file is properly registered
- [ ] Components are globally available
- [ ] All input types work correctly
- [ ] Build process completes without errors
- [ ] TypeScript types are properly exported
- [ ] Examples page renders correctly (if installed)