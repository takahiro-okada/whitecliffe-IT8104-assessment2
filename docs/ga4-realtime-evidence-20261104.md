# GA4 Realtime Evidence — 4 November 2026

## English

A controlled synthetic run against the Kiwi Outdoor demonstration site was checked in the dedicated GA4 property. The captured GA4 Realtime screen showed 8 active users in the last 30 minutes, 2 purchasers, 33 page views, and event rows including `view_item_list`, `view_item`, and `add_to_cart`. The controlled run was not a sample of human customers: each browser context was isolated and every interaction carried a simulation marker.

The browser-side audit also matched the 11 purchase identifiers and values to outbound Google Analytics collection payloads, with HTTP 204 collection responses. These checks establish Realtime visibility and transport for the controlled test, but they do not create evidence of real demand or a processed standard-report total. Standard reports may update later and are kept conceptually separate from Realtime evidence.

## 日本語要約

Kiwi Outdoorの模擬操作について、GA4のリアルタイム画面で30分以内のアクティブユーザー8、購入者2、ページビュー33、商品閲覧・カート追加などのイベント表示を確認しました。ブラウザ側でも購入ID・金額と送信内容を照合しました。ただし実在顧客のデータではなく、通常レポートの確定値とも扱いません。