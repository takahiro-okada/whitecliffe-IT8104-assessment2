# Evaluation decision / 評価方法の決定

The existing assessment train.csv and test.csv remain the inputs. All 5,681 supplied-test Sales labels are missing. Use grouped internal validation from labelled train.csv for MAE/MSE/RMSE/R², then refit on all eligible labels and predict supplied test.csv. Do not claim supplied-test accuracy or lecturer approval. No additional SalesDataSet is used.

2026年11月3日：追加のSalesDataSetは対象外とし、配布test.csvがラベルなしであることを明示して執筆を進める。講師確認待ちで作業を止めない。内部validationの評価と、提供testへの予測を一貫して区別する。

The implemented pipeline already follows this design. This is a documentation decision; no data, model parameters or measured scores changed. The report draft is stored locally in report/02_evaluation_strategy.md.
