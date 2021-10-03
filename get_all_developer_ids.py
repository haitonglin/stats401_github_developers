from pathlib import Path
import os
import json


def main():
    all_ids = []

    with os.scandir('cleaned') as it:
        for file in it:  # type: Path
            if file.is_file() and file.name.endswith('.json'):
                dev_id = int(file.name.split('.')[0])
                print(dev_id, end='\r')
                all_ids.append(dev_id)

    json.dump(all_ids, open('all_ids.json', 'w'))


if __name__ == '__main__':
    main()
