import {
  Card,
  Collapse,
  Skeleton,
  Space,
  Tag,
  Form,
  Button,
  Comment,
  List,
  Input,
} from "antd";
import React, { useContext, useState } from "react";
import {
  useCreateCommentMutation,
  useGetPostsQuery,
  useVotePostMutation,
} from "../../generated/graphql";
import { EditOutlined, CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { TruncateText } from "../../components";
import { AuthContext } from "../../context/auth";
import moment from "moment";

const { Panel } = Collapse;

const Home: React.FC = () => {
  const auth = useContext(AuthContext);
  const { loading, error, data, refetch } = useGetPostsQuery();
  const [votePost] = useVotePostMutation({
    onCompleted() {
      refetch();
    },
  });
  const [createComment] = useCreateCommentMutation({
    onCompleted() {
      refetch();
    },
  });

  const [isCommentActive, setIsCommentActive] = useState(false);

  if (loading) {
    return (
      <div>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  const onFinish = (values: any, postId: number) => {
    console.log("values");
    console.log(values);

    const { content } = values;

    createComment({
      variables: {
        input: {
          content,
        },
        postId,
      },
    });
  };

  return (
    <div className="home-page">
      <div className="container">
        <Space direction="vertical" size="large">
          {data?.posts.map((post) => {
            return (
              <React.Fragment key={post.id}>
                <Card
                  hoverable
                  style={{ width: "100%" }}
                  cover={<img alt={post.title} src={post.imageURL} />}
                  actions={[
                    <Space>
                      <LikeOutlined
                        key="like"
                        onClick={() =>
                          votePost({
                            variables: {
                              postId: post.id,
                            },
                          })
                        }
                      />
                      <Tag color="blue">{post.totalLikes}</Tag>
                    </Space>,
                    <CommentOutlined
                      key="comment"
                      onClick={() => {
                        setIsCommentActive(!isCommentActive);
                      }}
                    />,
                    <>
                      {auth.user && post.user.id === auth.user.id ? (
                        <EditOutlined key="edit" />
                      ) : (
                        <EditOutlined key="edit" className="disabled" />
                      )}
                    </>,
                  ]}
                >
                  <h2>{post.title}</h2>
                  <h4>Created by {post.user.username}</h4>
                  <TruncateText text={post.postText} />
                </Card>
                {isCommentActive && (
                  <Form
                    name="basic"
                    initialValues={{}}
                    onFinish={(values: any) => onFinish(values, post.id)}
                    autoComplete="off"
                    layout="vertical"
                  >
                    <Form.Item
                      name="content"
                      rules={[
                        {
                          required: true,
                          message: "Please input your comment!",
                        },
                      ]}
                    >
                      <Input.TextArea rows={3} placeholder="Write a comment" />
                    </Form.Item>
                    <Form.Item>
                      <Button htmlType="submit" type="primary">
                        Add Comment
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                <Collapse defaultActiveKey={["0"]}>
                  <Panel header="Comments Section" key="1">
                    <List
                      className="comment-list"
                      header={`${post.comments.length} replies`}
                      itemLayout="horizontal"
                      dataSource={post.comments}
                      renderItem={(item) => (
                        <li>
                          <Comment
                            author={item.user.username}
                            content={item.content}
                            datetime={
                              <span>
                                {moment(
                                  new Date(parseInt(item.createdAt)).toString()
                                ).format("LLL")}
                              </span>
                            }
                          />
                        </li>
                      )}
                    />
                  </Panel>
                </Collapse>
              </React.Fragment>
            );
          })}
        </Space>
      </div>
    </div>
  );
};

export default Home;
