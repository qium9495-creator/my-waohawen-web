# WAO HAVEN 产品后台接入

后台入口：`/admin.html`。它使用 Supabase Auth、Postgres 和 Storage；图片不写入 Vercel 文件系统。

1. 在 Supabase 新建项目，在 SQL Editor 运行 `supabase-schema.sql`。
2. 在 Authentication > Users 创建管理员邮箱与密码。当前策略允许所有已认证用户管理产品，因此只创建可信管理员。
3. 在 Project Settings > API 复制 Project URL 和 anon public key。
4. 复制 `supabase-config.example.js` 为 `supabase-config.js`，填入上述两个值。
5. 重新提交到 GitHub；Vercel 自动部署后访问 `/admin.html` 登录。

`anon key` 可以存在浏览器代码中；真正的访问控制由 SQL 中的 RLS 策略完成。不要把 `service_role key` 放进任何前端文件。

当前版本完成后台登录、产品增删改、草稿/发布、系列筛选、最多 5 张图片上传。前台动态读取数据库的接入文件将在同一套数据结构上工作。
