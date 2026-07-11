const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login', error: null });
};

exports.getSignup = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/signup', { title: 'Sign Up', error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.render('auth/login', { title: 'Login', error: 'All fields are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
    }
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  } catch (err) {
    console.error(err);
    res.render('auth/login', { title: 'Login', error: 'An error occurred. Please try again.' });
  }
};

exports.postSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.render('auth/signup', { title: 'Sign Up', error: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('auth/signup', { title: 'Sign Up', error: 'Email already registered.' });
    }

    const newUser = await User.create({ name, email, password, role: 'user' });
    req.session.user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/signup', { title: 'Sign Up', error: 'An error occurred. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};
