# Step 3: Regression and validation

## Purpose

Split item-store groups 80/20, fit preprocessing only inside training folds, select via training CV, then compare holdout MAE/MSE/RMSE/R².

## 日本語要約

同じ商品と店舗の組を学習側・検証側に分離し、補完などは学習側だけで求めます。指標が何を測るか読み比べてください。

## Review exercise / 確認ポイント

Read the added cells, run the notebook locally with the supplied CSVs, and explain the rationale in your own words. The local completed run is the validation evidence; no GitHub CI run is claimed.

追加セルを読み、実行した表やグラフと文章の対応を確かめてください。これは既存成果物を学習しやすい差分に整理した工程です。
