// This route is superseded by /api/upload/extract and /api/upload/save
export async function POST() {
  return new Response(JSON.stringify({ error: "Use /api/upload/extract and /api/upload/save instead." }), { status: 410 });
}
