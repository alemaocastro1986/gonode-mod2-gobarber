module.exports = (isProvider = true) => {
  return (req, res, next) => {
    const { provider, id } = req.session.user

    if (provider === isProvider) {
      return next()
    } else {
      if (provider === true) {
        return res.redirect(`/app/appointments/schedule/${id}`)
      } else {
        return res.redirect('/app/dashboard')
      }
    }
  }
}
