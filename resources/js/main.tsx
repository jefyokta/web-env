/// <reference types="vite/client" />

import "./../css/app.css"
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
// import { WebSocketProvider } from "./Context/WebsocketContext";


declare global {
  interface Window {
    $RefreshReg$?: (type: any, id?: string) => void;
    $RefreshSig$?: () => (type: any) => any;
  }
}


if (import.meta.hot) {
  import('react-refresh/runtime').then((runtime) => {
    runtime.injectIntoGlobalHook(window)
    if (typeof window !== 'undefined') {
      window.$RefreshReg$ ||= () => { }
      window.$RefreshSig$ ||= () => (type: unknown) => type
    }
  })
}


const wshost = window.location.hostname;
const isSecure = window.location.protocol === "https:";
const port = window.location.port || (isSecure ? 443 : 80);
const protocol = isSecure ? "wss" : "ws";
const url = `${protocol}://${wshost}:${port}`;
createInertiaApp({
  resolve: name => import(`./Pages/${name}.tsx`),
  setup({ el, App, props }) {
    (async () => {
      const { WebSocketProvider } = await import("@/Context/WebsocketContext");
      const { Toaster } = await import("@/Components/ui/sonner");

      createRoot(el).render(
        <WebSocketProvider url={url}>
          <App {...props} />
          <Toaster />
        </WebSocketProvider>
      );
    })();
  },
})


