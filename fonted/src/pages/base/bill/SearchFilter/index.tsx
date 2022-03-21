/*
 * @Author: your name
 * @Date: 2021-06-05 21:34:45
 * @LastEditTime: 2021-06-11 16:34:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fronted\src\pages\base\bill\SearchFilter\index.tsx
 */
import { Input } from 'antd';
import styles from '@/styles/search-filter.less';
interface SearchFilterProps {
  onSearch: () => void;
  searchProps: defs.BillQueryDTO;
  changeSearchProps: (searchProps: defs.BillQueryDTO) => void;
}

export default function SearchFilter(props: SearchFilterProps) {
  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterItem}>
        <span className={styles.label}>关键词：</span>
        <Input.Search
          allowClear={true}
          value={props.searchProps.consumer}
          onSearch={props.onSearch}
          onChange={(e) =>
            props.changeSearchProps({
              consumer: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}