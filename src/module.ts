import {
  defineNuxtModule,
  addPlugin,
  addTypeTemplate,
  createResolver
} from '@nuxt/kit'
import type { ModuleOptions } from './types'

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'purrrify',
    configKey: 'purrrify'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.profiles) {
      nuxt.options.runtimeConfig.public.purrrify = {
        profiles: options.profiles
      }
    }

    // Transpile for Vite SSR to avoid CJS interop issues.
    nuxt.options.build.transpile ||= []
    if (!nuxt.options.build.transpile.includes('sanitize-html')) {
      nuxt.options.build.transpile.push('sanitize-html')
    }

    // Inline sanitize-html in Nitro's production server bundle. Externalizing
    // it can leave its transitive dependencies (such as escape-string-regexp)
    // out of .output, causing SSR requests to fail at runtime.
    nuxt.options.nitro.externals ||= {}
    nuxt.options.nitro.externals.inline ||= []
    if (!nuxt.options.nitro.externals.inline.includes('sanitize-html')) {
      nuxt.options.nitro.externals.inline.push('sanitize-html')
    }

    addTypeTemplate({
      filename: 'types/purrrify.d.ts',
      getContents() {
        return `import type { ObjectDirective } from 'vue'
declare module 'vue' {
  interface GlobalDirectives {
    vSanitizeHtml: ObjectDirective<HTMLElement, string>
  }
}
export {}`
      }
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
