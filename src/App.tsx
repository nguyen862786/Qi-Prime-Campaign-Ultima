// File scaffold cũ — KHÔNG được import trong app (entry dùng TanStack Router:
// src/routes/__root.tsx + routeTree.gen.ts). Giữ một component hợp lệ để không
// phá typecheck/build. Có thể xoá an toàn nếu không dùng tới.
export default function App() {
  return null;
}
