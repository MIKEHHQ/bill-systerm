/*
 * @Author: HHQ
 * @Date: 2021-06-11 15:31:00
 * @LastEditTime: 2021-06-21 17:19:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fronted\src\pages\base\bill\RangePlot\index.tsx
 */
import { useState } from 'react';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import styles from './index.less';
type DateType = 'year' | 'quarter' | 'month' | 'week' | 'date';

interface SearchFilterPropsRange {
  type: DateType;
  onSearch: () => void;
  searchProps: defs.BillRangeQueryDTO;
  changeSearchProps: (searchProps: defs.BillRangeQueryDTO) => void;
}
const { RangePicker } = DatePicker;

const { Option } = Select;

function Picker(props: SearchFilterPropsRange) {
  return (
    <RangePicker
      picker={props.type}
      onChange={(e) => {
        props.changeSearchProps({
          startMon: moment(e?.[0]).format('YYYY-MM-DD 00:00:00'),
          endMon: moment(e?.[1]).format('YYYY-MM-DD 00:00:00'),
        });
      }}
      onBlur={props.onSearch}
    />
  );
}
export default function SearchFilterRange(props: SearchFilterPropsRange) {
  const [type, setType] = useState<DateType>('month');
  return (
    <Space className={styles.picker}>
      <div>
        <Select value={type} onChange={setType}>
          <Option value="date">Date</Option>
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
          <Option value="quarter">Quarter</Option>
          <Option value="year">Year</Option>
        </Select>
      </div>
      <div>
        <Picker {...props} type={type} />
      </div>
    </Space>
  );
}
