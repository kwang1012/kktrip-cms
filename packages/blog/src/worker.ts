import handler, { createScheduledHandler, PluginBridge } from '@emdash-cms/cloudflare/worker'

import { setupAccess } from './lib/setup-access'

export { PluginBridge }

export default {
  ...handler,
  fetch(request, env, ctx) {
    return setupAccess(request, (env as { KKTRIP_SETUP_KEY?: string }).KKTRIP_SETUP_KEY)
      ?? handler.fetch!(request, env, ctx)
  },
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler
