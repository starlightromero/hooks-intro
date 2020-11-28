import React, { useReducer, useCallback, useMemo, useEffect } from 'react'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http'

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
  const {
    isLoading,
    error,
    data,
    sendRequest,
    extra,
    identifier,
    clear
  } = useHttp()

  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: extra})
    } else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...extra } })
    }
  }, [data, error, extra, identifier, isLoading])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest({
      url: 'ingredients.json',
      method: 'post',
      body: ingredient,
      extra: ingredient,
      identifier: 'ADD_INGREDIENT'
    })
  }, [sendRequest])

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest({
      url: `ingredients/${ingredientId}.json`,
      method: 'delete',
      extra: ingredientId,
      identifier: 'REMOVE_INGREDIENT'
    })
  }, [sendRequest])

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
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
      {error && <ErrorModal onClose={clear()}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  )
}

export default Ingredients
