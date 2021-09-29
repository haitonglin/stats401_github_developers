import json
import os

output_dir = 'cleaned'


def main():
    os.makedirs(output_dir, exist_ok=True)

    file = open('data.json', encoding='utf-8')

    for line in file:
        data = json.loads(line)

        # ignore commits <= 100
        n_commits = data.get('commits', 0)
        if n_commits is None or n_commits <= 100:
            continue

        uid = data['id']
        with open(os.path.join(output_dir, f'{uid}.json'), 'w', encoding='utf-8') as of:
            json.dump(
                data,
                of,
                ensure_ascii=False,
            )

    file.close()


if __name__ == '__main__':
    main()
