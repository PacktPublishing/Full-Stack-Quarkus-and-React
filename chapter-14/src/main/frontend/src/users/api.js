import {createApi} from '@reduxjs/toolkit/query/react';
import {authBaseQuery} from '../auth';

export const api = createApi({
  reducerPath: 'users',
  baseQuery: authBaseQuery({path: 'users'}),
  tagTypes: ['User'],
  endpoints: builder => ({
    getUser: builder.query({
      query: id => `/${id}`,
      providesTags: ['User']
    }),
    getUsers: builder.query({
      query: () => '/',
      providesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: user => ({
        url: `/${user.id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),
    getSelf: builder.query({
      query: () => '/self',
      providesTags: ['User']
    }),
    changePassword: builder.mutation({
      query: passwordChange => ({
        url: `/self/password`,
        method: 'PUT',
        body: passwordChange
      })
    })
  })
});
