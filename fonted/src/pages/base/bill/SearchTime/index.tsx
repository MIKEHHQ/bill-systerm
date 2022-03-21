/*
 * @Author: HHQ
 * @Date: 2021-06-11 15:31:00
 * @LastEditTime: 2021-06-21 17:19:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fronted\src\pages\base\bill\SearchFilter\indexTime.tsx
 */
import { DatePicker, Space } from 'antd';
import styles from '@/styles/search-filter.less';
import moment from 'moment';
interface SearchFilterPropsTime {
  onSearch: () => void;
  searchProps: defs.BillTimeQueryDTO;
  changeSearchProps: (searchProps: defs.BillTimeQueryDTO) => void;
}
const { RangePicker } = DatePicker;
export default function SearchFilterDate(props: SearchFilterPropsTime) {
  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterItem}>
        <span className={styles.label}>时间段：</span>
        {
        <Space direction="vertical" size={12} >
          <RangePicker
          showTime
          onChange = {
            (e)=>{
              props.changeSearchProps({
                startDate: moment(e?.[0]).format("YYYY-MM-DD HH:mm:ss"),
                endDate: moment(e?.[1]).format("YYYY-MM-DD HH:mm:ss"),
              })
            }
          }
          onBlur = {props.onSearch}
          />
        </Space>
        }   
      </div>
    </div>
  );
}

  
