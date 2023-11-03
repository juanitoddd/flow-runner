import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeletePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
} from '../../services/posts'

const EditablePostName = ({
  name: initialName,
  onUpdate,
  onCancel,
  isLoading = false,
}: {
  name: string
  onUpdate: (name: string) => void
  onCancel: () => void
  isLoading?: boolean
}) => {
  const [name, setName] = useState(initialName)

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setName(value)

  const handleUpdate = () => onUpdate(name)
  const handleCancel = () => onCancel()

  return (
    <div className='flex'>
      <div>
        <input
          type="text"
          onChange={handleChange}
          value={name}
          disabled={isLoading}
        />
      </div>      
      <div>
        <div className='flex gap-1 flex-row justify-center'>
          <button onClick={handleUpdate}>
            {isLoading ? 'Updating...' : 'Update'}            
          </button>
          <button className="bg-red-700" onClick={handleCancel} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}

const PostJsonDetail = ({ id }: { id: string }) => {
  const { data: post } = useGetPostQuery(id)

  return (
    <div className='mt-1 bg-slate-500'>
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </div>
  )
}

export const PostDetail = () => {
  const { id } = useParams<{ id: any }>()
  const navigate = useNavigate()

//   const toast = useToast()

  const [isEditing, setIsEditing] = useState(false)

  const { data: post, isLoading } = useGetPostQuery(id)

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!post) {
    return (
      <div className=''>
        <h1>
          Post {id} is missing! Try reloading or selecting another post...
        </h1>
      </div>
    )
  }

  return (
    <div className="p-1">
      {isEditing ? (
        <EditablePostName
          name={post.name}
          onUpdate={async (name) => {
            try {
              await updatePost({ id, name }).unwrap()
            } catch {
                console.error('An error occurred')
                /*
                toast({
                    title: 'An error occurred',
                    description: "We couldn't save your changes, try again!",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
                */
            } finally {
              setIsEditing(false)
            }
          }}
          onCancel={() => setIsEditing(false)}
          isLoading={isUpdating}
        />
      ) : (
        <div className='flex'>
          <div>
            <h1>{post.name}</h1>
          </div>          
          <div>
            <div className='flex gap-1'>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isDeleting || isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Edit'}
              </button>
              <button
                onClick={() => deletePost(id).then(() => navigate('/posts'))}
                disabled={isDeleting}                
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      <PostJsonDetail id={post.id} />
    </div>
  )
}
