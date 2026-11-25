import { extractTestData } from '../lib/extract.js';

interface ExtractMessage {
  action: string;
}

interface ChromeLike {
  runtime: {
    onMessage: {
      addListener(
        listener: (
          request: ExtractMessage,
          sender: unknown,
          sendResponse: (response: unknown) => void,
        ) => boolean | void,
      ): void;
    };
  };
}

const chromeRuntime = (globalThis as { chrome?: ChromeLike }).chrome;

if (!(globalThis as { __nmoInjected?: boolean }).__nmoInjected) {
  (globalThis as { __nmoInjected?: boolean }).__nmoInjected = true;
  chromeRuntime?.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'extractTestData') {
      sendResponse(extractTestData(document));
    }
    return true;
  });
}
