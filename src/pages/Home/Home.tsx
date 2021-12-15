import { Card, Skeleton, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import React from "react";
import { Link } from "react-router-dom";
import { useGetPostsQuery } from "../../generated/graphql";

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
              <Link key={post.id} to={`/posts/details/${post.id}`}>
                <Card
                  hoverable
                  style={{ width: "100%" }}
                  cover={<img alt={post.title} src={post.imageURL} />}
                >
                  <Meta
                    title={`${post.title} created by ${post.user.username}`}
                    description={post.postText}
                  />
                </Card>
              </Link>
            );
          })}
        </Space>
      </div>
    </div>
  );
};

export default Home;
