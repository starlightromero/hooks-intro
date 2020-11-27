import React, { useState } from 'react'
import api from '../../api'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
  const [ ingredients, setIngredients ] = useState([])

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
