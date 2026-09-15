"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";

const CHATBASE_ID = "EbGKmwn46Oc5zd54aPaAF";

/**
 * Chatbase chat assistant, gated behind marketing consent.
 *
 * Chatbase is absent from Cookiebot's tracker database, so auto-blocking
 * cannot gate it no matter how the tag is configured — the gate has to live
 * here. Rendering null (rather than loading and hiding) is what makes this a
 * gate: no script element, no network request, no cookie, until consent.
 */
export function ChatbaseWidget() {
  const { marketing } = useConsent();
  if (!marketing) return null;

  return (
    <Script id="chatbase-widget" strategy="afterInteractive">
      {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="${CHATBASE_ID}";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
    </Script>
  );
}
