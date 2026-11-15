
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/products") {
      if (!env.DB) {
        return Response.json(
          { error: "D1 데이터베이스 연결이 필요합니다." },
          { status: 503 }
        );
      }

      try {
        const { results } = await env.DB.prepare(
          `SELECT id, name, category, specification,
                  price, stock, description, image_url, status
           FROM products
           WHERE status = '판매중'
           ORDER BY id DESC`
        ).all();

      return new Response(
  JSON.stringify({ products: results }),
  {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
);
      } catch (error) {
        console.error("상품 조회 오류", error);
        return Response.json(
          { error: "상품을 불러오지 못했습니다." },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
