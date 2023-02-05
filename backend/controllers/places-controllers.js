const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place');


const getPlacesById = async (req, res, next) => {
  
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find a place', 500))
  }
  
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    )
  }
  res.json({ place: place.toObject( { getters: true } ) })
}

const getPlacesByUserId = async (req, res, next) => {

  const userId = req.params.uid

  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find any places', 500))
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find any places for the provided user id.', 404)
    )
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }

  const {title, description, address, creator} = req.body
  let coordinates
  try {
    coordinates = await getCoordinatesForAddress(address)
  } catch (error) {
    return next(error) 
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  })

  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError('Creating Place Failed, please try again', 500)
    return next(error)
  }
  
  res.status(201).json({place: createdPlace})
}

const updatePlace = async (req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs given, please check your data', 422))
  }
  
  const {title, description} = req.body
  const placeId = req.params.pid

  let updatedPlace
  try {
    updatedPlace = await Place.findById(placeId)
  } catch (err) {
    return next( new HttpError('Something went wrong , could not update place', 500) )
  }
  
  updatedPlace.title = title
  updatedPlace.description = description

  try {
    await updatedPlace.save()
  } catch (err) {
    return next( new HttpError('Something went wrong , could not update place', 500) )
  }

  res.status(200).json({place: updatedPlace.toObject({ getters: true})})
}

const deletePlace = async (req, res, next) => {

  const placeId = req.params.pid

  let placeToBeDeleted;
  try {
    placeToBeDeleted = await Place.findById(placeId)
  } catch (err) {
    return next( new HttpError('Something went wrong. Could not delete place'), 500 )
  }

  try {
    await placeToBeDeleted.remove()
  } catch (err) {
    return next( new HttpError('Something went wrong. Could not delete place'), 500 )
  }

  res.status(200).json({message: 'Deleted place succesfully.'})
}

exports.getPlaceById = getPlacesById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace