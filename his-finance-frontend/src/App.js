import React from 'react'
import axios from 'axios'
import "./App.css"
import { Typography, Button, Form, InputNumber, Select, Spin, notification, Result } from 'antd';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const { Title } = Typography;

const VISIT_TYPES = [
  { value: 'opd', label: "OPD" },
  { value: 'ipd', label: "IPD" },
  { value: 'er', label: "ER" },
]

const INSURANCES = [
  { value: 'samsung_life', label: "Samsung Life (OPD)" },
  { value: 'aia_vitality', label: "AIA Vitality (IPD)" },
  { value: 'fwd', label: "FWD Delight Care (ER)" },
]

const URL_CALCULATE = '/api/calculate-total-fee/'

function App() {
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false)

  const onFinish = async (values) => {
    try {
      setResult(null)
      setLoading(true)
      const resp = await axios.post(URL_CALCULATE, { params: values })
      setResult(resp.data['total'])
    } catch(error) {
      console.log(error)
      notiApi.error({
        message: `HTTP Request Error!`,
        description: error.response ? error.response.data.details : error.message,
        placement: "bottomRight",
        duration: 10,
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-screen">
      {notiContextHolder}
      <Spin spinning={loading} tip='loading...'>
        {result == null && 
          <Form onFinish={onFinish} >
            <Form.Item>
              <Typography>
                <Title>HIS Financial Calculator</Title>
              </Typography>
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select Visit Type"

                options={VISIT_TYPES}
                allowClear
              >
              </Select>
            </Form.Item>
            <Form.Item
              name="insurance"
              label="Insurance">
              <Select
                placeholder="Select Insurance"
                options={INSURANCES}
                allowClear
              >
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                addonAfter="฿"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        }
      </Spin>

      {result != null &&
        <Result
          status="success"
          title={`${result} ฿`}
          subTitle="Successfully Calculate Reimbursement!"
          extra={[
            <Button type="primary" onClick={() => setResult(null)}>
              Back
            </Button>,
          ]}
        />
      }
    </div>
  );
}

export default App;
