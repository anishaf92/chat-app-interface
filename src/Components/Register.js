import {useState} from 'react'
import {auth} from '../firebase'
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, EmailAuthProvider} from 'firebase/auth'
import { setUser } from '../features/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'

function Register() {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOnline,setIsOnline] = useState(0)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch();
 
 
  const validatePassword = () => {
    let isValid = true
    if (password !== '' && confirmPassword !== ''){
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
    }
    return isValid
  }

  const register = e => {
    e.preventDefault()
    setError('')
    if(validatePassword()) {
      // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
            // The signed-in user info.
    const user = result.user;
    console.log(user.email)
    
    localStorage.setItem("user", JSON.stringify({
        email:user.email,
        uid:user.uid,

        
    }))
    
    dispatch(setUser(localStorage.getItem("user")))
    setIsOnline(1);
    const object = {
        "userName":userName,
        "email":JSON.parse(localStorage.getItem("user")).email,
        "uid":JSON.parse(localStorage.getItem("user")).uid,
        "isOnline":isOnline

    }
    axios.post('http://localhost:5000/add', object)
    .then(
            navigate('/profile')
    )
    })
        .catch(err => setError(err.message))
    }
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className='center'>
      <div className='auth'>
        <h1>Register</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='registration_form'>
        <input 
            type='name' 
            value={userName}
            placeholder="Enter your username"
            required
            onChange={e => setUserName(e.target.value)}/>
          <input 
            type='email' 
            value={email}
            placeholder="Enter your email"
            required
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password} 
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

            <input 
            type='password'
            value={confirmPassword} 
            required
            placeholder='Confirm password'
            onChange={e => setConfirmPassword(e.target.value)}/>

          <button type='submit'>Register</button>
        </form>
        <span>
          Already have an account?  
          <Link to='/login'>login</Link>
        </span>
      </div>
    </div>
  )
}

export default Register