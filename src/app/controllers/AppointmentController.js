const { User, Appointment } = require('../models')

const moment = require('moment')
const { Op } = require('sequelize')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)

    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date: date
    })
    return res.redirect('/app/dashboard')
  }

  async show (req, res) {
    const date = moment()
    const appointments = await Appointment.findAll({
      attributes: ['date', 'user_id'],
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [date.startOf('D').format(), date.endOf('D').format()]
        }
      },
      include: [
        {
          model: User,
          as: 'client'
        },
        {
          model: User,
          as: 'profesional'
        }
      ]
    })

    const newAppointments = appointments.map(a => {
      return {
        ...a,
        date: moment(a.date).format('DD/MM/YYYY'),
        hour: moment(a.date).format('HH:mm')
      }
    })

    return res.render('appointments/schedule', {
      appointments: newAppointments
    })
  }
}

module.exports = new AppointmentController()
