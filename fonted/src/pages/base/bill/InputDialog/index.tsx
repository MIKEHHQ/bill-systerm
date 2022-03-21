/*
 * @文件描述: 首页
 * @公司: 山东大学
 * @作者: 李洪文
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-09 15:40:17
 * @LastEditTime: 2021-06-15 17:14:37
 */
import { useEffect } from 'react';
import styles from './index.less';
import { Input, Form, Modal, DatePicker} from 'antd';
import { useForm } from 'antd/lib/form/Form';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const { TextArea } = Input;
export interface HomepageProps {
  visible: boolean;
  detailData?: defs.BillDTO;
  onClose: () => void;
  onSubmit: (data: defs.BillDTO) => void;
}

// const dateFormat = 'yyyy-MM-dd HH:mm:ss';

export default function InputForm(props: HomepageProps) {
  const [form] = useForm();
  console.log('===>', props)
  useEffect(() => {
    if (props.detailData) {
      form.setFieldsValue(props.detailData);
    } else {
      form.resetFields();
    }
  }, [props.detailData, props.visible]);

  const onFinish = (values: any) => {
    // datepicker 转时间戳
    values.consumeTime=Date.parse(values.consumeTime!)
    props.onSubmit(values);
  };
  return (
    <Modal
      title={!!props.detailData ? '修改账单' : '新增账单'}
      visible={props.visible}
      // getContainer={false}
      width={500}
      okText="确定"
      centered
      getContainer={false}
      onCancel={() => {
        props.onClose();
      }}
      onOk={form.submit}
    >
      <Form
        {...layout}
        name="basic"
        form={form}
        className={styles.form}
        onFinish={onFinish}
      >
        <Form.Item
          label="财务用途："
          name="purpose"
          rules={[{ required: true, message: '请输入财务用途' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="财务金额："
          name="amount"
          rules={[{ required: true, message: '请输入财务金额' }]}
        >
          <Input />
        </Form.Item>


        <Form.Item
          label="消费时间："
          name="consumeTime"
          rules={[{ required: true, message: '请输入消费时间' }]}
        >
          <DatePicker 
            showTime 
            size={"large"} 
          />
        </Form.Item>

        <Form.Item
          label="消费人员："
          name="consumer"
          rules={[{ required: true, message: '请输入消费人员' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="描述：" name="note">
          <TextArea
            rows={2}
            placeholder="备注信息"
            allowClear={true}
            onChange={() => {}}
          />
        </Form.Item>

      </Form>
    </Modal>
    
  );
}
