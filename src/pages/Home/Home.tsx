import { Card, Skeleton, Space, Tag } from "antd";
import React from "react";
import { useGetPostsQuery } from "../../generated/graphql";
import { EditOutlined, CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { TruncateText } from "../../components";

const Home: React.FC = () => {
  const { loading, error, data } = useGetPostsQuery();

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

  return (
    <div className="home-page">
      <div className="container">
        <Space direction="vertical" size="large">
          {data?.posts.map((post) => {
            return (
              <Card
                hoverable
                style={{ width: "100%" }}
                cover={<img alt={post.title} src={post.imageURL} />}
                actions={[
                  <Space>
                    <LikeOutlined key="like" />
                    <Tag color="blue">{post.totalLikes}</Tag>
                  </Space>,
                  <CommentOutlined key="comment" />,
                  <EditOutlined key="edit" />,
                ]}
              >
                <h2>{post.title}</h2>
                <h4>Created by {post.user.username}</h4>
                <TruncateText text={post.postText} />
              </Card>
            );
          })}
        </Space>
      </div>
    </div>
  );
};

export default Home;
