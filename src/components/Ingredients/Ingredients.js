import React, { useState, useCallback } from 'react'
import api from '../../api'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

const Ingredients = () => {
  const [ ingredients, setIngredients ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState()

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    api.post('ingredients.json', ingredient).then(response => {
      setIngredients(prevIngredients => [
        ...prevIngredients,
        { id: response.data.name, ...ingredient }
      ])
      setIsLoading(false)
    }).catch(error => {
      setIsLoading(false)
      setError('Something went wrong!')
    })
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true)
    api.delete(`ingredients/${ingredientId}.json`).then(response => {
      setIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      )
      setIsLoading(false)
    }).catch(error => {
      setIsLoading(false)
      setError('Something went wrong!')
    })
  }

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
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
