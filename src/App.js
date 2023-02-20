import logo from './logo.svg';
import {Button} from 'react-bootstrap';
import {Table, Input, Form, Card,Modal, DatePicker, Row, Col} from 'antd';
import React, {useState, useEffect} from 'react';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import './App.css';

const gridStyle = {
    width: '25%', textAlign: 'center',
};



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


function App() {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataPost, setDataPost] = useState([]);
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            await sendPost(values);

                setSubject("");
                setContent("");



        } catch (e) {

        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const getDataPost=()=>{
        fetch('http://localhost:3500/api/getAll').then((response) =>
            response.json()
        ).then(data =>
            setDataPost(data)
        )

    }
    useEffect(() => {
        getDataPost();
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
        fetch('http://localhost:3500/api/post', requestOptions)
            .then(response => {

                getDataPost()
                return response.json()
            })


    }

    const updateSelectedPost=(post)=>{
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        };
        fetch(`http://localhost:3500/api/update/${post._id}`, requestOptions)
            .then(response => response.json())



    };

    const deleteSelectedPost=(post)=>{
        console.log(post)
        fetch(`http://localhost:3500/api/delete/${post._id}`, {
            method: 'DELETE'}
        ) .then(response => console.log(response.json()) )

    };
    const onDeletePost = (record) => {

        Modal.confirm({
            title: "Are you sure, you want to delete this post ?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {

                setDataPost((pre) => {
                    // eslint-disable-next-line no-self-compare
                    deleteSelectedPost(record)
                    return pre.filter((post) => post._id !== record._id);
                });
            },
        });
    };
    const resetEditing = () => {
        setIsEditing(false);
        setEditingPost(null);
    };

    const onEditPost = (record) => {
        setIsEditing(true);
        setEditingPost({ ...record });
    };
    const columns = [
        {
            key: '1',

            title: 'Subject', dataIndex: 'subject',
        }, {
            key: "2",
            title: 'Content', dataIndex: 'content',
        },
        {
            key: '3',
            title: "Actions",
            render: (record) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {
                                onEditPost(record);
                            }}
                        />
                        <DeleteOutlined
                            onClick={() => {
                                onDeletePost(record);
                            }}
                            style={{ color: "red", marginLeft: 12 }}
                        />
                    </>
                );
            },
        }];
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
                                <Form
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
                                        <Button type="primary"   >
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


                                    <Table columns={columns}
                                           dataSource={dataPost}/>
                                    <Modal
                                        title="Edit Post"
                                        open={isEditing}
                                        okText="Save"
                                        onCancel={() => {
                                            resetEditing();
                                        }}
                                        onOk={() => {

                                            setDataPost((pre) => {
                                                return pre.map((post) => {
                                                    if (post._id === editingPost._id) {
                                                        updateSelectedPost(editingPost);
                                                        return editingPost;
                                                    } else {
                                                        return post;
                                                    }
                                                });
                                            });
                                            resetEditing();
                                        }}
                                    >

                                        <div
                                            style={{
                                                marginTop: 25,
                                            }}

                                        >
                                            <Input
                                                value={editingPost?.subject}
                                                onChange={(e) => {
                                                    setEditingPost((pre) => {
                                                        return { ...pre, subject: e.target.value };
                                                    });
                                                }}
                                            />


                                        </div>
                                        <div
                                            style={{
                                                marginTop: 15,
                                            }}
                                        >
                                            <Input.TextArea  value={editingPost?.content}
                                                             onChange={(e) => {
                                                                 setEditingPost((pre) => {
                                                                     return { ...pre, content: e.target.value };
                                                                 });
                                                             }}
                                                            autoSize={{
                                                                minRows: 3,
                                                                maxRows: 5,
                                                            }}/>


                                        </div>



                                    </Modal>
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
