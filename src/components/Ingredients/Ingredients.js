import React, { useState, useEffect } from 'react'
import api from '../../api'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
  const [ ingredients, setIngredients ] = useState([])

  useEffect(() => {
    api.get('ingredients.json').then(response => {
      const loadedIngredients = []
      for (const key in response.data) {
        loadedIngredients.push({
          id: key,
          title: response.data[key].title,
          amount: response.data[key].amount
        })
      }
      setIngredients(loadedIngredients)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const addIngredientHandler = ingredient => {
    api.post('ingredients.json', ingredient).then(response => {
      setIngredients(prevIngredients => [
        ...prevIngredients,
        { id: response.data.name, ...ingredient }
      ])
    }).catch(error => {
      console.log(error)
    })
  }

  const removeIngredientHandler = ingredientId => {
    setIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    )
  }

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  )
}

export default Ingredients
