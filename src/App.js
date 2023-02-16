import logo from './logo.svg';
import {Button} from 'react-bootstrap';
import {Table, Input, Form, Card, DatePicker, Row, Col} from 'antd';
import React, {useState, useEffect} from 'react';
import './App.css';

const gridStyle = {
    width: '25%', textAlign: 'center',
};

const columns = [{
    title: 'Subject', dataIndex: 'subject',
}, {
    title: 'Content', dataIndex: 'content',
}];
const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i, name: `Edward King ${i}`, age: 32, address: `London, Park Lane no. ${i}`,
    });
}
const getColumns = () => {

    return [{
        title: 'Subject', dataIndex: 'subject',
    }, {
        title: 'Content', dataIndex: 'content',
    },];

}

const getRowData = (dataPost) => {
    const data = [];
    console.log(dataPost)
    for (const post in dataPost) {
        data.push({subject: post.subject, content: post.content})
    }
    console.log(data)
    return data;

}
function refreshPage() {
    window.location.reload(false);
}

function App() {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataPost, setDataPost] = useState([]);
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            await sendPost(values);
            alert('Your registration was successfully submitted!');
            setSubject("");
            setContent("");
        } catch (e) {
            alert(`Registration failed! ${e.message}`);
        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {

        fetch('http://localhost:3000/api/getAll').then((response) =>
            response.json()
        ).then(data =>
            setDataPost(data)
        )


// empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    const sendPost=  async (values)=>{

       let  {subject,content}=values;


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject:subject,content:content })
        };
        fetch('http://localhost:3000/api/post', requestOptions)
            .then(response => response.json())
            .then(data => alert(data))

    }

    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default submission
        try {
            await sendPost();
            alert('Your registration was successfully submitted!');
            setSubject("");
            setContent("");
        } catch (e) {
            alert(`Registration failed! ${e.message}`);
        }
    }
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys, onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (<div className="App">

            <main>
                <Card title="Form Post"
                      style={{
                          flex: "auto", alignContent: "center", justifyContent: "center"
                      }}>
                    <Row>
                        <Col span={12} offset={6}>
                            <Card

                                type="inner" title="Add new Post">
                                <Form onSubmit={onSubmit}
                                    name="basic"
                                    labelCol={{
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    style={{
                                        maxWidth: 600
                                    }}
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Subject"
                                        name="subject"
                                        rules={[{
                                            required: true, message: 'Please input your subject!',
                                        },]}
                                    >
                                        <Input onChange={(e) => setSubject(e.target.value)}
                                               placeholder="tapez sujet" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Content"
                                        name="content"
                                        rules={[{
                                            required: true, message: 'Please input your content!',
                                        },]}
                                    >
                                        <Input.TextArea onChange={(e) => setContent(e.target.value)}
                                                                placeholder="tapez contennu"
                                                                autoSize={{
                                                                    minRows: 3,
                                                                    maxRows: 5,
                                                                }}/>
                                    </Form.Item>


                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8, span: 16,
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit"  >
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} offset={6}>
                            <Card
                                style={{
                                    marginTop: 25,
                                }}
                                type="inner"
                                title="Posted Content"

                            >
                                <div>
                                    <div
                                        style={{
                                            marginBottom: 16,
                                        }}
                                    >
                                        <Button type="primary" onClick={start} disabled={!hasSelected}
                                                loading={loading}>
                                            Reload
                                        </Button>
                                        <span
                                            style={{
                                                marginLeft: 8,
                                            }}
                                        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
                                    </div>
                                    <Table rowSelection={rowSelection} columns={getColumns()}
                                           dataSource={dataPost}/>
                                </div>
                            </Card>
                        </Col>
                    </Row>


                </Card>

            </main>
            <div>

            </div>
        </div>);
}

export default App;
