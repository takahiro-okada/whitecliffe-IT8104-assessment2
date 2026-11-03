"""Execute the combined assessment notebook with this Python interpreter.

Run from the project root: .venv/bin/python scripts/execute_notebook.py
Prior notebook/results are copied to backups before each run. Source data is read-only.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import shutil
import sys
import time

root = Path(__file__).resolve().parents[1]
runtime = root / '.runtime'
for key, suffix in [('JUPYTER_DATA_DIR', 'jupyter'), ('JUPYTER_RUNTIME_DIR', 'runtime'),
                    ('IPYTHONDIR', 'ipython'), ('MPLCONFIGDIR', 'matplotlib')]:
    folder = runtime / suffix
    folder.mkdir(parents=True, exist_ok=True)
    os.environ[key] = str(folder)
os.environ['MPLBACKEND'] = 'Agg'
os.environ['JUPYTER_PATH'] = str(runtime / 'jupyter')
os.environ['PYTHONHASHSEED'] = '0'
kernel_name = 'it8104-local'
kernel_dir = runtime / 'jupyter' / 'kernels' / kernel_name
kernel_dir.mkdir(parents=True, exist_ok=True)
(kernel_dir / 'kernel.json').write_text(json.dumps({
    'argv': [sys.executable, '-m', 'ipykernel_launcher', '-f', '{connection_file}'],
    'display_name': 'Python (IT8104 .venv)', 'language': 'python',
}), encoding='utf-8')

import nbformat
from nbclient import NotebookClient

path = root / 'notebooks/01_eda_preprocessing.ipynb'
stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
backup = root / 'backups' / ('before_execution_' + stamp)
backup.mkdir(parents=True)
shutil.copy2(path, backup / path.name)
if (root / 'outputs').exists():
    shutil.copytree(root / 'outputs', backup / 'outputs')
sources = {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
           for p in (root / 'data').rglob('*') if p.is_file()}
nb = nbformat.read(path, as_version=4)
nbformat.validate(nb)
started = time.monotonic()
report = {'started_utc': datetime.now(timezone.utc).isoformat(), 'notebook': str(path),
          'python_executable': sys.executable, 'backup': str(backup), 'success': False}

def progress(cell, cell_index, **kwargs):
    if cell.cell_type == 'code':
        print(f'Executed cell {cell_index + 1}/{len(nb.cells)}', flush=True)

try:
    client = NotebookClient(nb, kernel_name=kernel_name, timeout=600,
                            resources={'metadata': {'path': str(path.parent)}},
                            allow_errors=False, record_timing=True,
                            on_cell_executed=progress)
    client.execute()
    errors = [{'cell': i + 1, 'name': out.get('ename'), 'value': out.get('evalue')}
              for i, cell in enumerate(nb.cells) for out in cell.get('outputs', [])
              if out.get('output_type') == 'error']
    assert not errors, errors
    code_cells = [cell for cell in nb.cells if cell.cell_type == 'code']
    assert all(cell.execution_count is not None for cell in code_cells)
    assert all(hashlib.sha256((root / name).read_bytes()).hexdigest() == digest
               for name, digest in sources.items())
    report.update(success=True, total_cells=len(nb.cells), executed_code_cells=len(code_cells),
                  errors=errors, data_files_sha256=sources, source_files_unchanged=True,
                  embedded_png_outputs=sum('image/png' in out.get('data', {})
                                           for cell in nb.cells for out in cell.get('outputs', [])))
except Exception as exc:
    report['error'] = f'{type(exc).__name__}: {exc}'
    raise
finally:
    # Keep completed outputs available for diagnosis even when execution fails.
    nb.metadata.kernelspec = {'display_name': 'Python (IT8104 .venv)', 'language': 'python', 'name': 'python3'}
    nbformat.validate(nb)
    nbformat.write(nb, path)
    report['elapsed_seconds'] = round(time.monotonic() - started, 2)
    out_dir = root / 'outputs'
    out_dir.mkdir(exist_ok=True)
    (out_dir / 'execution_report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({k: report.get(k) for k in ['success', 'executed_code_cells', 'elapsed_seconds', 'error']}), flush=True)
