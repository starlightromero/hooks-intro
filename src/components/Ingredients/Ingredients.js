import React, { useReducer, useCallback, useMemo } from 'react'
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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { loading: false, error: null }
    case 'ERROR':
      return { loading: false, error: action.error }
    case 'CLEAR':
      return { ...httpState, error: null }
    default:
      throw new Error('Reducer case was not found')
  }
}

const Ingredients = () => {
  const [ ingredients, dispatch ] = useReducer(ingredientReducer, [])
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, { loading: false, error: null })

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND' })
    api.post('ingredients.json', ingredient).then(response => {
      dispatch({ type: 'ADD', ingredient: { id: response.data.name, ...ingredient } })
      dispatchHttp({ type: 'RESPONSE' })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: 'Somthing went wrong!' })
    })
  }, [])

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({ type: 'SEND' })
    api.delete(`ingredients/${ingredientId}.json`).then(response => {
      dispatch({ type: 'DELETE', id: ingredientId})
      dispatchHttp({ type: 'RESPONSE' })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: 'Somthing went wrong!' })
    })
  }, [])

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' })
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler} />
    )
  }, [ingredients, removeIngredientHandler])

  return (
    <div className='App'>
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  )
}

export default Ingredients
