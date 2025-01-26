import React, { useEffect, useState } from "react";
import { fetchPosts } from "../../services/post";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    getPosts();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
