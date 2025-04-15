import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  try {
    const res = await fetch(fileUrl, { redirect: "follow" });

    if (!res.ok) {
      return new Response("Failed to fetch file", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "application/pdf";
    const contentLength = res.headers.get("content-length");

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": 'inline; filename="file.pdf"',
        ...(contentLength ? { "Content-Length": contentLength } : {}),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Error proxying PDF", { status: 500 });
  }
}
