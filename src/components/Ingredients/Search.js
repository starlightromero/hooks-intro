import React, { useState, useEffect, useRef } from 'react'
import Card from '../UI/Card'
import './Search.css'
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [ searchFilter, setSearchFilter ] = useState('')
  const inputRef = useRef()
  const { isLoading, data, error, sendRequest, clear } = useHttp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchFilter === inputRef.current.value) {
        const query = searchFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${searchFilter}"`
        sendRequest({
          url: `ingredients.json${query}`,
          method: 'get'
        })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [searchFilter, inputRef, sendRequest])

  useEffect(() => {
    if (!isLoading && !error & data) {
      const loadedIngredients = []
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, error, isLoading, onLoadIngredients])

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type='text'
            value={searchFilter}
            onChange={event => setSearchFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  )
})

export default Search
