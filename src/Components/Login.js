import {useState} from 'react'
import { Link } from 'react-router-dom'
import './forms.css'
import {signInWithEmailAndPassword,EmailAuthProvider} from 'firebase/auth'
import {auth} from '../firebase'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/userSlice'


function Login(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const login = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
                // The signed-in user info.
        const user = result.user;
        console.log(user.email)
        localStorage.setItem("user", JSON.stringify({name:user.displayName,
            email:user.email,
            uid:user.uid,
            
        }))
        dispatch(setUser(localStorage.getItem("user")))
      navigate('/Profile')
    }
    )
    .catch(err => setError(err.message))
  }

  return(
    <div className='center'>
      <div className='auth'>
        <h1>Log in</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={login} name='login_form'>
          <input 
            type='email' 
            value={email}
            required
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password}
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

          <button type='submit'>Login</button>
        </form>
        <p>
          Don't have and account? 
          <Link to='/register'>Create one here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
