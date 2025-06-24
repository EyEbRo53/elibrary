"use client";

import { useEffect } from "react";

export default function PDFViewer({ fileUrl }: { fileUrl: string | null }) {
  if (!fileUrl) return;
  const url = fileUrl;
  const fileName = url.split("/").pop() || "document.pdf";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
    script.onload = () => {
      if ((window as any).AdobeDC) {
        const adobeDCView = new (window as any).AdobeDC.View({
          clientId: "bc98ae9a60214677a47b0060014f72f9",
          divId: "adobe-dc-view",
        });

        adobeDCView.previewFile(
          {
            content: {
              location: {
                url: "https://acrobatservices.adobe.com/view-sdk-demo/PDFs/Bodea%20Brochure.pdf",
              },
            },
            metaData: { fileName: "Bodea Brochure.pdf" },
          },

          { embedMode: "SIZED_CONTAINER" }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.getElementById("adobe-dc-view")!.innerHTML = "";
    };
  }, [url, fileName]);

  return (
    <div className="pt-10 pb-5 space-y-2 w-fit">
      <h2 className="text-2xl font-bold text-primary">PDF Viewer</h2>
      <div id="adobe-dc-view"></div>
    </div>
  );
}
