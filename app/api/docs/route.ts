import { ApiReference } from '@scalar/nextjs-api-reference';

export const GET = ApiReference({
  // @ts-expect-error: 'spec' is accepted at runtime but not included in HtmlRenderingConfiguration types
  spec: {
    url: '/openapi.json',
  },
  theme: 'fastify',
  showSidebar: true,
});
