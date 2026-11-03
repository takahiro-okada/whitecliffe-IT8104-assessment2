# IT8104 Assessment 2

## Run locally / ローカルで実行

Use Python 3.12 and install `requirements.txt`. Place the supplied `train.csv`, `test.csv` and `readme.txt` in `data/` yourself. Open `notebooks/01_eda_preprocessing.ipynb` with the project virtual environment and run all cells from the project root or notebooks folder.

配布データは各自でdata/に置いてください。Notebookは工程ごとのPRで段階的に完成します。公開版は出力を消したコード版です。実行後の出力はローカルに保存され、Gitには含めません。

The existing completed local notebook was reorganised into logical review stages. Commit timestamps do not represent the original development chronology. PRs are stacked: review and merge in order using merge commits to preserve ancestry. Later PRs target the preceding stage branch.

## Learning path / 学習順序

1. `docs/step-01.md`: initial inspection and raw EDA.
2. `docs/step-02.md`: preprocessing, multivariate relationships and critical findings.
3. `docs/step-03.md`: training-only pipelines, CV and holdout evaluation.
4. `docs/step-04.md`: statistical comparisons and final predictions.

後続工程の説明ファイルは対応するPRで追加されます。まずPR 1から順にFiles changedと説明を確認してください。PRは自動マージしません。

## Results and limits / 結果と限界

The completed local run executed 27 code cells without errors and embedded 16 figures. These are observed local results, not GitHub CI results. Supplied source data is intentionally absent, so GitHub cannot independently reproduce model scores.

Gradient Boosting: validation MAE 756.03, MSE 1,162,133.71, RMSE 1,078.02, R² 0.5963. Training/validation rows: 6,826/1,706, with no shared item-store groups. These scores use the documented provisional target eligibility rules. Full-data EDA informed choices, so validation is developmental.

Store-level Friedman statistic 3.8; approximate p=0.1496; within-store permutation p=0.1868. No Holm-adjusted pair comparison is significant at 0.05. The test file has no observed Sales labels. Its 5,681 predictions include 35 raw negative outputs, retained transparently. No test accuracy or operational nonnegative-sales constraint is established.

実測値は以前のチャットの概数を置き換えています。統計的有意差は確認できていません。負の予測や異常値ルールの限界はNotebookを参照してください。学校の正式な提出要項との最終照合は別途必要です。
