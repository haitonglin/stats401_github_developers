from column_extractor import ColumnExtractor
import json
from typing import List
import os

DEV_ID = 50


class CommitExtractor(ColumnExtractor):
    def worker(self, *args):
        dev_id = 10030028
        file_path = os.path.join('cleaned', f'{dev_id}.json')
        data = json.load(open(file_path, encoding='utf-8'))
        commits = data['commit_list']

        self.res[dev_id] = [c['commit_at'] for c in commits]


def main():
    extractor = CommitExtractor()
    extractor(column_name='commit_list', out_path='commits.json')


if __name__ == '__main__':
    main()
