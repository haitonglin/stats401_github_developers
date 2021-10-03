"""
Get the ids of all developers that have more than 9 followers
"""
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List
import math
from pathlib import Path

all_ids = []
N_JOBS = 10


def filter_dev_ids(files: List[Path]):
    for file in files:
        data = json.load(open(file, encoding='utf-8'))

        if data['followers'] >= 10:
            all_ids.append(data['id'])


def main():
    all_files: List[Path] = []
    with os.scandir('cleaned') as it:
        for file in it:  # type: Path
            if file.is_file() and file.name.endswith('.json'):
                all_files.append(file)

    batch_size = 100
    n_batches = int(len(all_files) / batch_size)
    batches = [all_files[i * batch_size:(i + 1) * batch_size] for i in range(n_batches)]
    with ThreadPoolExecutor(max_workers=N_JOBS) as executor:
        for b in range(0, n_batches, N_JOBS):
            if len(all_ids) > 10000:
                break

            futures = [
                executor.submit(filter_dev_ids, batches[i]) for i in range(b, b + N_JOBS)
            ]

            # wait for threads to complete
            for _ in as_completed(futures):
                continue

    json.dump(all_ids, open('all_ids.json', 'w', encoding='utf-8'))


if __name__ == '__main__':
    main()
