from column_extractor import ColumnExtractor


def main():
    extractor = ColumnExtractor()
    extractor(column_name='follower_list', out_path='followers.json')


if __name__ == '__main__':
    main()
