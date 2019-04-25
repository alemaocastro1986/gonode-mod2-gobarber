module.exports = (req, res, next) => {
  if (req.session && !req.session.user) {
    return next()
  }

  const { provider, id } = req.session.user

  return provider === false
    ? res.redirect('/app/dashboard')
    : res.redirect(`/app/appointments/schedule/${id}`)
}
