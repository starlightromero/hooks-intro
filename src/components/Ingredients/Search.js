import React, { useState, useEffect, useRef } from 'react'
import api from '../../api'

import Card from '../UI/Card'
import './Search.css'

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [ filter, setFilter ] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value) {
        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`
        api.get(`ingredients.json${query}`).then(response => {
          const loadedIngredients = []
          for (const key in response.data) {
            loadedIngredients.push({
              id: key,
              title: response.data[key].title,
              amount: response.data[key].amount
            })
          }
          onLoadIngredients(loadedIngredients)
        }).catch(error => {
          console.log(error)
        })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [filter, onLoadIngredients, inputRef])

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type='text'
            value={filter}
            onChange={event => setFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  )
})

export default Search
