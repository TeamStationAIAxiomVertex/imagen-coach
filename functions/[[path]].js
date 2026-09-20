import { handleWebBotAuthDirectory } from "./_web-bot-auth.js";

export async function onRequest(context) {
  const webBotAuthResponse = await handleWebBotAuthDirectory(context);
  if (webBotAuthResponse) return webBotAuthResponse;
  return context.next();
}
