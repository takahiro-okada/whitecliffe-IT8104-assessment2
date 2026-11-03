# Evaluation methodology

The supplied train.csv contains observed Sales values. All 5,681 records in test.csv have missing Sales values, so supervised evaluation metrics cannot be calculated on that file.

Performance is evaluated using an internal holdout from the labelled training file. After the documented target-quality screening and duplicate removal, 8,532 eligible records are divided by unique item–store groups in an 80/20 ratio, producing 6,826 training records and 1,706 validation records. Repeated versions of an item–store pair remain within the same partition.

Preprocessing is fitted only on the training subset or the training fold during grouped cross-validation. Linear Regression, Random Forest and Gradient Boosting are compared using MAE, MSE, RMSE and R². Model selection uses training-side cross-validation; the internal holdout provides the reported validation scores.

After evaluation, the selected pipeline is refitted on all eligible labelled records and used to predict test.csv. These outputs are predictions with unknown test accuracy. Full-data exploratory analysis informed the preprocessing decisions, so internal validation is treated as a developmental performance estimate rather than an independent confirmatory test.

## 日本語要約

提供test.csvには正解Salesがないため、train.csvを商品×店舗の組ごとに分割して性能を評価します。補完・標準化・カテゴリ変換は学習側のみから求め、モデル選択後に全対象ラベルで再学習してtest.csvを予測します。内部検証の評価値と、正解のないtest.csvへの予測は区別します。
