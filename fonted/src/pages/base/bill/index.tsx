/*
 * @文件描述: 首页
 * @公司: 山东大学
 * @作者: 李洪文
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-09 15:40:17
 * @LastEditTime: 2021-06-21 17:36:31
 */
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import CustomTable from '@/components/CustomTable';
import FileAddOutlined from '@ant-design/icons/FileAddOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import GroupOutlined from '@ant-design/icons/GroupOutlined';
import SearchFilter from './SearchFilter';
import SearchFilterDate from './SearchTime';
import SearchFilterRange from './Range';
import { Divider, message, Modal,Tabs, } from 'antd';
import { TransactionOutlined, RadarChartOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { ButtonItem } from '@/data-type/common';
import { DEFAULT_SEARCH_PROPS, DEFAULT_PAGE_DATA,DEFAULT_Range_PROPS } from '@/constants';
import InputDialog from './InputDialog';
import styles from './index.less';
const { TabPane } = Tabs;


export default function BillPage() {
  const [data_value, setdata_value] = useState<Array<Record<string, any>>>([]);

  const [searchProps, changeSearchProps] = useState<defs.BillQueryDTO>({
    ...DEFAULT_SEARCH_PROPS,
  });
  const [pageData, setPageData] = useState<defs.Page<defs.BillVO>>(
    DEFAULT_PAGE_DATA,
  );
  const [searchPropsByTime,setSearchPropsByTime] = useState<defs.BillTimeQueryDTO>({
    ...DEFAULT_SEARCH_PROPS,
  })
  const [searchPropsByRange,setSearchPropsByRange] = useState<defs.BillRangeQueryDTO>({
    ...DEFAULT_Range_PROPS,
  })
  const [selectedRowKeys, selectRow] = useState<number[] | string[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<defs.BillDTO | undefined>(
    undefined,
  );

  const fetchList = useCallback((props) => {
    setLoading(true);
    API.bill.list.request({}, props).then((data) => {
      setLoading(false);
      data && setPageData(data);
    });
  }, []);

  const fetchListByTime = useCallback((props) => {
    setLoading(true);
    API.bill.listByTime.request({}, props).then((data) => {
      setLoading(false);
      data && setPageData(data);
    });
  }, []);

  const fetchListByRange = useCallback((props) => {
    setLoading(true);
    API.bill.listByRange.request({}, props).then((data) => {
      setLoading(false);
      console.log('===>',data);
      data && setdata_value(data);
    });
  }, []);

  useEffect(() => {
    if (!pageData.total) {
      fetchList(searchProps);
    }
    if (!data_value) {
      fetchListByRange(searchPropsByRange);
    }
  }, []);

  const columns = [
    {
      title: '财务用途',
      dataIndex: 'purpose',
      render: (v: string, record: defs.BillVO) => {
        return (
          <a
            onClick={() => {
              setBill({ ...record });
              setVisible(true);
            }}
          >
            <GroupOutlined />
            <span style={{ marginLeft: 5 }}>{v}</span>
          </a>
        );
      },
    },
    { title: '财务金额', width: 125, dataIndex: 'amount'},
    { title: '消费人员', width: 100, dataIndex: 'consumer'},  
    { title: '消费时间', width: 160, dataIndex: 'consumeTime'},
 
    { title: '描述', width: 150, dataIndex: 'note' },
    { title: '创建人员', width: 100, dataIndex: 'createdBy' },
    { title: '创建时间', width: 100, dataIndex: 'createdAt' },
    { title: '修改人员', width: 100, dataIndex: 'updatedBy' },
    { title: '修改时间', width: 100, dataIndex: 'updatedAt' },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: any) => (
        <>
          <a
            onClick={() => {
              console.log('===>', record);
              // record.consumeTime = Date.parse(record.consumeTime);
              // setBill({ ...record });
              const modifiedRecord = { ...record, consumeTime: moment(record.consumeTime) }
              setBill(modifiedRecord);
              setVisible(true);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleDelete([`${record.id}`]);
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  const handleDelete = async (ids: string[] | number[]) => {
    const modal = Modal.confirm({
      centered: true,
      title: `您确定要删除选定的${ids.length}个消费记录吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        modal.update({
          okButtonProps: {
            loading: true,
          },
        });
        const success = await API.bill.remove.request(
          {},
          ids as number[],
        );
        if (success) {
          message.success("删除成功！")
          fetchList({
            ...searchProps,
            page: 1,
          });
          selectRow([]);
        }
      },
    });
  };

  const handleSave = (values: defs.BillDTO) => {
    let result: Promise<number>;
    if (bill?.id) {
      result = API.bill.update.request(
        {},
        {
          id: bill.id,
          ...values,
        },
      );
    } else {
      result = API.bill.add.request({}, values);
    }
    result.then(() => {
      setVisible(false);
      message.success('保存成功！');
      fetchList({
        ...searchProps,
      });
    });
  };

  const buttons: ButtonItem[] = [
    {
      text: '新增',
      icon: <FileAddOutlined />,
      type: 'primary',
      onClick: () => {
        setBill(undefined);
        setVisible(true);
      },
    },
    {
      text: '删除',
      icon: <DeleteOutlined />,
      disabled: selectedRowKeys.length === 0,
      type: 'primary',
      onClick: () => handleDelete(selectedRowKeys),
    },
  ];

  // console.dir(data_value)

  const { list, page, total } = pageData;
  return (
    <div >
    <Tabs  defaultActiveKey="1" centered size={'small'}>
    <TabPane
      tab={
        <span><TransactionOutlined />
          账单管理
        </span>}
          key="1"
    >
      <CustomTable
        loading={loading}
        columns={columns}
        buttons={buttons}
        dataSource={list || []}
        current={page}
        size="middle"
        total={total}
        genRowKey={(record: defs.BillVO) => `${record.id}`}
        onPagination={(current: number) => {
          const newSearchProps = {
            ...searchProps,
            page: current,
          };
          changeSearchProps(newSearchProps);
          fetchList(newSearchProps);
        }}
        rowSelection={{
          columnTitle: '选择',
          columnWidth: 50,
          selectedRowKeys,
          onChange: (keys: string[]) => selectRow(keys),
        }}
      >
        <SearchFilter
          searchProps={searchProps}
          changeSearchProps={(props) => {
            changeSearchProps({
              ...searchProps,
              ...props,
            });
          }}
          onSearch={() => {
            fetchList(searchProps);
          }}
        />
        <div className={styles.time}>
          <SearchFilterDate
            searchProps={searchPropsByTime}
            changeSearchProps={(props) => {
              setSearchPropsByTime({
                ...searchPropsByTime,
                ...props,
              });
            }}
            onSearch={() => {
              fetchListByTime(searchPropsByTime);
            }}
          />
        </div>
        
      </CustomTable>

      <InputDialog
        visible={visible}
        detailData={bill}
        onClose={() => setVisible(false)}
        onSubmit={handleSave}
      />
      
    </TabPane>
    <TabPane
      tab={
        <span>
          <RadarChartOutlined />
          账单可视化
        </span>
      }
      key="2"
    >
          <SearchFilterRange
            searchProps={searchPropsByRange}
            changeSearchProps={(props) => {
              setSearchPropsByRange({
                ...searchPropsByRange,
                ...props,
              });
            }}
            onSearch={() => {
              fetchListByRange(searchPropsByRange);
            }}
          />
          <div className={styles.range}>
            <Column
              xField='type'
              yField='value'
              data={data_value}
              // meta={
              //   type:{
              //     alias:'类别'，
              //   }
              //   value:{
              //     alias:'销售额'，
              //   }
              // }
            /></div>
          
    </TabPane>  
    </Tabs>

    </div>
  );
}

