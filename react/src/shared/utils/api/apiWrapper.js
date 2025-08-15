import { unwrapApiResponse } from './apiUtils'
import api from './client'

export const postAndUnwrap = async (url, body) => {
  const res = await api.post(url, body)
  return unwrapApiResponse(res.data)
}

export const getAndUnwrap = async (url) => {
  const res = await api.get(url)
  console.log('getAndUnWrap/res : ', res)
  return unwrapApiResponse(res.data)
}

export const putAndUnwrap = async (url, body) => {
  const res = await api.put(url, body)
  return unwrapApiResponse(res.data)
}

export const deleteAndUnwrap = async (url) => {
  const res = await api.delete(url)
  return unwrapApiResponse(res)
}

export const methodAndUnwrap = async (method, url, body) => {
  const res = await api[method](url, body)
  return unwrapApiResponse(res.data)
}