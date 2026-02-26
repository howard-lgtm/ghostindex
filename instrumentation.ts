export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = async (
  err: Error,
  request: {
    method: string;
    url: string;
    headers: Headers;
  },
  context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
  }
) => {
  const Sentry = await import('@sentry/nextjs');
  
  Sentry.captureException(err, {
    contexts: {
      request: {
        method: request.method,
        url: request.url,
      },
      router: {
        kind: context.routerKind,
        path: context.routePath,
        type: context.routeType,
      },
    },
  });
};
