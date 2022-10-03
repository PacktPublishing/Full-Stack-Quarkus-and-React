import {createApi} from '@reduxjs/toolkit/query/react';
import {authBaseQuery} from '../auth';

export const api = createApi({
  reducerPath: 'tasks',
  baseQuery: authBaseQuery({path: 'tasks'}),
  tagTypes: ['Task'],
  endpoints: builder => ({
    getTasks: builder.query({
      query: () => '/',
      providesTags: ['Task'],
    }),
    addTask: builder.mutation({
      query: task => ({
        url: '/',
        method: 'POST',
        body: task
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: task => ({
        url: `/${task.id}`,
        method: 'PUT',
        body: task
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: task => ({
        url: `/${task.id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Task']
    }),
    setComplete: builder.mutation({
      query: ({task, complete}) => ({
        url: `/${task.id}/complete`,
        method: 'PUT',
        body: JSON.stringify(complete)
      }),
      invalidatesTags: ['Task'],
    })
  })
});
