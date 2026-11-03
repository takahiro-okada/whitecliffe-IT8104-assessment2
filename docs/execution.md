# Re-execution

From the project root: `.venv/bin/python scripts/execute_notebook.py`. The script backs up the existing notebook and outputs before executing. All raw data, backups and outputs remain ignored by Git. Source hashes are checked after execution.

課題フォルダで上記を実行すると、既存結果をバックアップしたうえで全セルを実行します。配布データは事前にdata/へ配置してください。
