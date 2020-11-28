import React, { useState, useReducer, useCallback } from 'react'
import api from '../../api'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ingredient => ingredient.id !== action.id)
    default:
      throw new Error('Reducer case was not found')
  }
}

const Ingredients = () => {
  const [ ingredients, dispatch ] = useReducer(ingredientReducer, [])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState()

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    api.post('ingredients.json', ingredient).then(response => {
      dispatch({ type: 'ADD', ingredient: { id: response.data.name, ...ingredient } })
      setIsLoading(false)
    }).catch(error => {
      setIsLoading(false)
      setError('Something went wrong!')
    })
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true)
    api.delete(`ingredients/${ingredientId}.json`).then(response => {
      dispatch({ type: 'DELETE', id: ingredientId})
      setIsLoading(false)
    }).catch(error => {
      setIsLoading(false)
      setError('Something went wrong!')
    })
  }

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const clearError = () => {
    setError(null)
  }

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  )
}

export default Ingredients
