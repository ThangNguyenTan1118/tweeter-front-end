import { Card, Skeleton, Space, Tag } from "antd";
import React, { useContext } from "react";
import { useGetPostsQuery, useVotePostMutation } from "../../generated/graphql";
import { EditOutlined, CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { TruncateText } from "../../components";
import { AuthContext } from "../../context/auth";

const Home: React.FC = () => {
  const auth = useContext(AuthContext);
  const { loading, error, data, refetch } = useGetPostsQuery();
  const [votePost] = useVotePostMutation({
    onCompleted() {
      refetch();
    },
  });

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
                  <CommentOutlined key="comment" />,
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
            );
          })}
        </Space>
      </div>
    </div>
  );
};

export default Home;
