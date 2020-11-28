import { useReducer, useCallback } from 'react'
import api from '../api'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const httpReducer = (httpState, action) => {
  const { type, error, data, extra, identifier } = action
  switch (type) {
    case 'SEND':
      return { ...httpState, loading: true, error: null, data: null, extra: null, identifier }
    case 'RESPONSE':
      return { ...httpState, loading: false, data, extra }
    case 'ERROR':
      return { ...httpState, loading: false, error }
    case 'CLEAR':
      return initialState
    default:
      throw new Error('Reducer case was not found')
  }
}

const useHttp = () => {
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, initialState)

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), [])

  const sendRequest = useCallback(({ url, method, body, extra, identifier }) => {
    dispatchHttp({ type: 'SEND', identifier })
    api({
      method,
      url,
      data: body
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE', data: response.data, extra })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: 'Somthing went wrong!' })
    })
  }, [])

  const { loading, error, data, extra, identifier } = httpState

  return {
    isLoading: loading,
    error,
    data,
    extra,
    identifier,
    sendRequest: sendRequest,
    clear
  }
}

export default useHttp
