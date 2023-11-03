import React, { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import {
  Post,
  useAddPostMutation,
  useGetPostQuery,
  useGetPostsQuery,
} from '../../services/posts'
import { PostDetail } from './PostDetail'
import { v4 as uuid } from 'uuid'

const AddPost = () => {
  const initialValue: Post = { id: uuid(), name: '' }
  const [post, setPost] = useState(initialValue)
  const [addPost, { isLoading }] = useAddPostMutation()

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({
      ...prev,
      [target.name]: target.value,
    }))
  }

  const handleAddPost = () => addPost(post).then(() => setPost(initialValue))

  return (
    <div className='flex p-1'>
      <div className='flex'>        
          <label htmlFor="name">Post name</label>
          <input
            id="name"
            name="name"
            placeholder="Enter post name"
            value={post.name}
            onChange={handleChange}
          />        
      </div>      
      <div>
        <button          
            onClick={handleAddPost}>
            {isLoading ? 'Adding...' : 'Add Post'}          
        </button>
      </div>
    </div>
  )
}

const PostList = () => {
  const { data: posts, isLoading } = useGetPostsQuery()
  const navigate = useNavigate()

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!posts) {
    return <div>No posts :(</div>
  }

  return (
    <div>
      {posts.map(({ id, name }) => (
        <div key={id} onClick={() => navigate(`/posts/${id}`)}>
          {name}
        </div>
      ))}
    </div>
  )
}

const PostNameSubscribed = ({ id }: { id: string }) => {
  const { data, isFetching } = useGetPostQuery(id)
  const navigate = useNavigate()

  console.log('data', data, isFetching)

  if (!data) return null

  return (
    <div key={id} onClick={() => navigate(`/posts/${id}`)}>
      {data.name}
    </div>
  )
}
const PostListSubscribed = () => {
  const { data: posts, isLoading } = useGetPostsQuery()

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!posts) {
    return <div>No posts :(</div>
  }

  return (
    <div className="p-1">
      {posts.map(({ id }) => (
        <PostNameSubscribed id={id} key={id} />
      ))}
    </div>
  )
}

export const PostsCountStat = () => {
  const { data: posts } = useGetPostsQuery()

  if (!posts) return null

  return (
    <div>
      <span>Active Posts</span>
      <span>{posts?.length}</span>
    </div>
  )
}

export const PostsManager = () => {
  return (
    <div>
      <div className='flex p-1 bg-slate-600 text-white'>
        <div>
          <h1>Manage Posts</h1>
        </div>        
        <div>
          <PostsCountStat />
        </div>
      </div>      
      <AddPost />      
      <div className='flex flex-wrap'>
        <div className='flex'>
          <div className="p-1">
            <h1>Posts</h1>
          </div>
          <div className="p-1">
            <PostList />
          </div>
          <div className="p-1">
            <h1>Posts (subscribed)</h1>
          </div>
          <div className="p-1">
            <PostListSubscribed />
          </div>
        </div>
        <div className='flex'>
          <Routes>
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route
              path="*"
              element={
                <div className="flex items-center h-48">
                  <h1>Select a post to edit!</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default PostsManager
