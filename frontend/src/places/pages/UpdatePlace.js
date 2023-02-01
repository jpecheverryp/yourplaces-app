import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import './PlaceForm.css'

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrappers in the world',
    imageUrl: 'https://newyorkyimby.com/wp-content/uploads/2020/09/DSCN0762.jpg',
    address: '20 W 34th St., New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Emp. State Building',
    description: 'One of the most famous skyscrappers in the world',
    imageUrl: 'https://newyorkyimby.com/wp-content/uploads/2020/09/DSCN0762.jpg',
    address: '20 W 34th St., New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  }
]

const UpdatePlace = () => {
  const placeId = useParams().placeId

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
  }, false)

  const identifiedPlace = DUMMY_PLACES.find(place => place.id === placeId)

  useEffect(() => {
    if (identifiedPlace) {
      setFormData({
        title: {
          value: identifiedPlace.title,
          isValid: true
        },
        description: {
          value: identifiedPlace.description,
          isValid: true
        }
      }, true)
    }
  }, [setFormData, identifiedPlace])


  const placeUpdateSubmitHandler = event => {
    event.preventDefault()
    console.log(formState.inputs);
  }

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
        <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  if (!formState.inputs.title.value) {
    return (
      <div className='center'>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
      <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input 
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title.'
          onInput={inputHandler}
          value={formState.inputs.title.value}
          valid={formState.inputs.title.isValid}
        />
        <Input 
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description ( Min 5 characters ).'
          onInput={inputHandler}
          value={formState.inputs.description.value}
          valid={formState.inputs.description.isValid}
        />
        <Button type='submit' disabled={!formState.isValid}>Update Place</Button>
      </form>
  )
}

export default UpdatePlace