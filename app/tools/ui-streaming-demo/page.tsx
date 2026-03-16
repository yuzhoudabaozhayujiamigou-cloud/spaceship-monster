import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import DemoClientV3 from "../ui-streaming-demo-v2/DemoClientV3";

export const metadata = buildMetadata({
  title: `UI Streaming Demo | ${SITE.name}`,
  description:
    "Interactive UI streaming demo (V3) with structured SSE events, real-time visual dashboard, replay, and raw event logs.",
  path: "/tools/ui-streaming-demo",
});

export default function UIStreamingDemoPage() {
  return <DemoClientV3 />;
}
