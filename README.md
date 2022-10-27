## 介紹

這是一個可以拿來練習前端 jwt refresh token 的後端專案。


## 下載與啟動專案

```bash
$ git clone https://github.com/JiaHongL/jwt-refresh-token-mock-backend.git
$ cd jwt-refresh-token-mock-backend
$ npm install
$ npm run start:dev
```

## Swagger 快速介紹

1. 網址列輸入 http://localhost:3000/api ，即可看到 API 文件。
![](https://i.imgur.com/kMEavx7.png)

2. 鎖頭的意思。
![](https://i.imgur.com/WUCYTqa.png)

3. 展開其中一支 API，上半部為測試 API，下半部則是相關 http status code 代表的意思 與 response 的格式 (也可點擊 schema 看格式)。
![](https://i.imgur.com/qduX1kd.png)

4. 按下 [Tru it out]，再按下 [Execute]，就可以測試API，底部也會顯示回應結果。
![](https://i.imgur.com/mRIyMwQ.png)

5. 複製回傳的 accessToken，點擊右上角的 [Authorize]，貼上 Token。
![](https://i.imgur.com/ZdsXQ6s.png)

6. 即可完成登入(token設定)。
![](https://i.imgur.com/8aUCcRe.png)

7. 可去嘗試其他有 accessToken 保護的 API。
![](https://i.imgur.com/sytNmms.png)

8. 另外要特別注意，前端實作時，要記得加上 Bearer ${token} (Bearer後有空格!!)。
![](https://i.imgur.com/zOt56tw.png)

9. 如果手腳太慢或是超過30秒，則會收到 401 error，就是沒有權限存取的 API。
![](https://i.imgur.com/Ppi8L0q.png)

10. 如果想調整 accessToken 過期時間，可到 src/auth/auth.service.ts，調整上面有寫註解的變數即可([參數](https://github.com/vercel/ms))，如下圖調整為60秒過期。
![](https://i.imgur.com/VW9Fdt7.png)

11. 若想測試 403，可以在重新登入，趁 accessToken 還未過期時，打刪除帳號API，然後再立即去打其他受保護的API，即可收到 403 error。

![](https://i.imgur.com/PhtrLqm.png)

![](https://i.imgur.com/E5LszOf.png)

> PS：401 與 403 的區別，401:沒有權限存取，403:拒絕任何存取，而這專案的 API 會先驗 token 是否有效，才會再驗是否可以存取。


## 推薦文章與參考範例

| 框架 | 推薦文章 | 相關範例/實作練習 |
| -------- | -------- | -------- |
| Angular     | [Angular 12 Refresh Token with Interceptor and JWT example](https://www.bezkoder.com/angular-12-refresh-token/)  | [JiaHongL/ng-refresh-token-demo](https://github.com/JiaHongL/ng-refresh-token-demo)     |
| 等待有緣人 | 等待有緣人 | 等待有緣人 |
| 等待有緣人 | 等待有緣人 | 等待有緣人 |

> 歡迎實作其他版本，可發 PR 或是 issue 都可:")

## API 介紹（請容我都用截圖XD）

![](https://i.imgur.com/T6eZvCq.jpg)

