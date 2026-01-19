const express = require('express')
const Event = require('../models/event')
const router = express.Router()

//----------/api/event/create
//post
router.post('/create', async (req, res) => {
  let { title, startDate, endDate, location, description, theme } = req.body

  try {
    let newevent = await Event.create({
      title,
      startDate,
      endDate,
      location,
      description,
      theme
    })

    res.json({
      message: "Event created successfully",
      newevent
    })
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})


//----------/api/event/getallevents
//get
router.get('/all', async (req, res) => {
  try {
    let events = await Event.find()

    res.json({
      message: "Events get successfully",
      events
    })
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})


//----------/api/event/geteventbyid
//get
router.get('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let event = await Event.findById(id)

    if (event) {
      res.json({
        message: "Event get successfully",
        event
      })
    } else {
      res.json({
        message: "Event not found"
      })
    }
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})


//----------/api/event/updateevent
//put
router.put('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let { title, startDate, endDate, location, description, theme } = req.body

    let event = await Event.findById(id)
    if (!event) {
      return res.json({ message: "Event not found" })
    }

    let updatedevent = await Event.findByIdAndUpdate(
      id,
      {
        title: title || event.title,
        startDate: startDate || event.startDate,
        endDate: endDate || event.endDate,
        location: location || event.location,
        description: description || event.description,
        theme: theme || event.theme
      },
      { new: true }
    )

    res.json({
      message: "Event updated successfully",
      updatedevent
    })
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})


//----------/api/event/deleteevent
//delete
router.delete('/:id', async (req, res) => {
  try {
    let { id } = req.params
    let deletedevent = await Event.findByIdAndDelete(id)

    if (deletedevent) {
      res.json({
        message: "Event deleted successfully",
        deletedevent
      })
    } else {
      res.json({
        message: "Event not found"
      })
    }
  } catch (error) {
    res.json({
      message: error.message
    })
  }
})

module.exports = router
